"""Finite abstract values and shared, metered provenance for backward slices."""
from __future__ import annotations

import json
from typing import Iterable

from pydantic import ValidationError

from deep_analysis.identity import stable_id
from deep_analysis.models import Alternative, Ambiguous, AbstractValue, Budgets, Known, Span, Unknown
from deep_analysis.semantic_models import Fact, FlowStep


class SemanticLimit(Exception):
    """Stop the current slice; previously completed candidates remain available."""


class FactStore:
    def __init__(self, budgets: Budgets):
        self.budgets = budgets
        self.facts: dict[str, Fact] = {}
        self.steps: dict[str, FlowStep] = {}
        self.structure_bytes = 0
        self.nodes_used = 0
        self.edges_used = 0

    def charge(self, payload: object, *, node: bool = False, edge: bool = False) -> None:
        size = len(json.dumps(payload, ensure_ascii=False, sort_keys=True).encode('utf-8'))
        if (self.structure_bytes + size > self.budgets.structure_bytes
                or node and self.nodes_used >= self.budgets.index_nodes
                or edge and self.edges_used >= self.budgets.index_edges):
            raise SemanticLimit('semantic_structure_limit')
        self.structure_bytes += size
        self.nodes_used += int(node)
        self.edges_used += int(edge)

    def fact(self, value: AbstractValue, steps: Iterable[FlowStep] = (), conditions: tuple[str, ...] = (),
             items: tuple[Fact, ...] | None = None, key_type: str | None = None,
             key_origin: Span | None = None) -> Fact:
        steps = tuple(dict.fromkeys(steps))
        if len(steps) > self.budgets.slice_nodes:
            value, steps, items = Unknown(reason='slice_limit'), steps[:self.budgets.slice_nodes], None
            key_type = key_origin = None
        conditions = tuple(dict.fromkeys(conditions))
        if len(conditions) > 16:
            value, conditions, items = Unknown(reason='condition_limit'), conditions[:16], None
            key_type = key_origin = None
        data = [value.model_dump(mode='json'), [s.step_id for s in steps], conditions,
                [f.fact_id for f in items] if items is not None else None, key_type,
                key_origin.model_dump(mode='json') if key_origin else None]
        identity = stable_id('fact', data)
        if identity not in self.facts:
            self.charge(data, node=True)
            self.facts[identity] = Fact(identity, value, steps, conditions, items, key_type, key_origin)
        return self.facts[identity]

    def unknown(self, reason: str, steps: Iterable[FlowStep] = (), conditions: tuple[str, ...] = ()) -> Fact:
        return self.fact(Unknown(reason=reason), steps, conditions)

    def literal(self, value: object, conditions: tuple[str, ...] = ()) -> Fact:
        if self.budgets.value_candidates == 0:
            return self.unknown('value_limit', conditions=conditions)
        if type(value) not in (str, int, float, bool, type(None)):
            return self.unknown('unsupported_literal', conditions=conditions)
        try:
            return self.fact(Known(value=value), conditions=conditions)
        except ValidationError:
            return self.unknown('literal_limit', conditions=conditions)

    def flow(self, fact: Fact, kind: str, source: Span, destination: Span, context_id: str,
             parameter: str | None = None) -> Fact:
        data = [kind, source.model_dump(mode='json'), destination.model_dump(mode='json'), context_id, parameter]
        identity = stable_id('flow', data)
        if identity not in self.steps:
            self.charge(data, edge=True)
            self.steps[identity] = FlowStep(identity, kind, source, destination, context_id, parameter)
        return self.fact(fact.value, (*fact.steps, self.steps[identity]), fact.conditions, fact.items,
                         fact.key_type, fact.key_origin)

    def conditioned(self, fact: Fact, conditions: tuple[str, ...]) -> Fact:
        return self.fact(fact.value, fact.steps, (*fact.conditions, *conditions), fact.items,
                         fact.key_type, fact.key_origin)

    def merge(self, facts: Iterable[Fact]) -> Fact:
        facts = tuple(facts)
        if not facts:
            return self.unknown('missing_value')
        alternatives: dict[str, Alternative] = {}
        unknown = False
        reasons = []
        for fact in facts:
            value = fact.value
            if isinstance(value, Known):
                values = (Alternative(value=value.value, conditions=fact.conditions),)
            else:
                values = value.alternatives
            if isinstance(value, Unknown):
                unknown = True
                reasons.append(value.reason)
            for alternative in values:
                key = stable_id('scalar', [type(alternative.value).__name__, alternative.value])
                previous = alternatives.get(key)
                conditions = tuple(dict.fromkeys((*previous.conditions, *alternative.conditions))) if previous else alternative.conditions
                alternatives[key] = Alternative(value=alternative.value, conditions=conditions[:16])
        steps = tuple(s for f in facts for s in f.steps)
        if len(alternatives) > self.budgets.value_candidates:
            return self.unknown('value_limit', steps)
        values = tuple(alternatives.values())
        if unknown:
            reason = reasons[0] if len(set(reasons)) == 1 else 'unknown_branch'
            value = Unknown(reason=reason, alternatives=values)
        elif len(values) == 1:
            value = Known(value=values[0].value)
        elif values:
            value = Ambiguous(alternatives=values)
        else:
            value = Unknown(reason='missing_value')
        provenance = {(f.key_type, f.key_origin) for f in facts}
        key_type, key_origin = next(iter(provenance)) if len(provenance) == 1 else (None, None)
        return self.fact(value, steps, key_type=key_type, key_origin=key_origin)
