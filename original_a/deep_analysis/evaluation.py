"""One-to-one context metrics. This module never imports or runs input code."""
from __future__ import annotations

from collections import Counter
from dataclasses import dataclass
import json
from math import sqrt
from typing import Annotated, Callable, Literal

from original_a.deep_analysis.inputs import LogicalInput
from pydantic import Field

from original_a.deep_analysis.models import AbstractValue, Contract, EdgeType, OperationType, Span, Text


_REASON_ALIASES = {
    "recursive_call": "recursion",
    "recursion_limit": "recursion",
    "unsupported_decorator": "unsupported_function",
    "unsupported_function": "unsupported_function",
    "shadowed_or_dynamic_binding": "unsupported_value",
    "unsupported_transform": "unsupported_value",
    "unsupported_runtime_config": "unsupported_configuration",
}


def _canonical_condition(value: str) -> str:
    if value == "condition":
        return "branch:true"
    if value == "not condition":
        return "branch:false"
    if value.startswith("condition:true:"):
        return "branch:true"
    if value.startswith("condition:false:"):
        return "branch:false"
    return value


def _canonical_value(value: dict) -> dict:
    result = dict(value)
    if result.get("kind") == "unknown":
        reason = result.get("reason", "")
        if result.get("alternatives") and reason in {"unbound_name", "unbound_local"}:
            reason = "unknown_branch"
        result["reason"] = _REASON_ALIASES.get(reason, reason)
        result["alternatives"] = [
            {**item, "conditions": [_canonical_condition(condition) for condition in item.get("conditions", [])]}
            for item in result.get("alternatives", [])
        ]
    elif result.get("kind") == "ambiguous":
        result["alternatives"] = [
            {**item, "conditions": [_canonical_condition(condition) for condition in item.get("conditions", [])]}
            for item in result.get("alternatives", [])
        ]
    return result


class OperationLabel(Contract):
    snapshot_id: Text
    sink: Span
    operation_type: OperationType
    context_kind: Literal["invocation", "uninstantiated_template"] = "invocation"
    context: Annotated[tuple[Span, ...], Field(max_length=3)] = ()
    algorithm: AbstractValue
    supported: bool = True


class EdgeLabel(Contract):
    snapshot_id: Text
    context: Annotated[tuple[Span, ...], Field(max_length=3)] = ()
    edge_type: EdgeType
    source: Span
    target: Span


class Prediction(Contract):
    operations: Annotated[tuple[OperationLabel, ...], Field(max_length=10000)] = ()
    edges: Annotated[tuple[EdgeLabel, ...], Field(max_length=200000)] = ()


def _key(label: OperationLabel, *, algorithm: bool) -> str:
    # Support membership belongs to the gold set, never to the prediction.
    data = label.model_dump(exclude={"supported"} | (set() if algorithm else {"algorithm"}))
    if algorithm:
        data["algorithm"] = _canonical_value(data["algorithm"])
    return json.dumps(data, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def _ratio(numerator: int, denominator: int) -> float | None:
    return numerator / denominator if denominator else None


def _interval(successes: int, total: int) -> tuple[float, float] | None:
    """Wilson 95% interval; useful evidence of the limits of a small sample."""
    if not total:
        return None
    p, z = successes / total, 1.959963984540054
    denominator = 1 + z * z / total
    center = (p + z * z / (2 * total)) / denominator
    margin = z * sqrt(p * (1 - p) / total + z * z / (4 * total * total)) / denominator
    return max(0.0, center - margin), min(1.0, center + margin)


def _counts(gold: Counter, predicted: Counter) -> dict:
    tp = sum((gold & predicted).values())
    fp, fn = sum(predicted.values()) - tp, sum(gold.values()) - tp
    return {"tp": tp, "fp": fp, "fn": fn,
            "precision": _ratio(tp, tp + fp), "recall": _ratio(tp, tp + fn),
            "precision_interval_95": _interval(tp, tp + fp),
            "recall_interval_95": _interval(tp, tp + fn)}


def evaluate(gold: Prediction, predicted: Prediction) -> dict:
    """Unknown predictions and omitted contexts remain in the gold denominator.

    End-to-end matching requires the complete algorithm value, including unknown
    status. Locating a template, or the right sink with a wrong algorithm, does
    not count as an end-to-end true positive. Duplicate guesses are false positives.
    """
    result = {}
    for name, include_algorithm in (("operations", False), ("end_to_end", True)):
        result[name] = _counts(
            Counter(_key(item, algorithm=include_algorithm) for item in gold.operations),
            Counter(_key(item, algorithm=include_algorithm) for item in predicted.operations))
    # Unknown/hallucinated sinks count in the supported FP denominator unless
    # the frozen gold explicitly places that sink outside the supported scope.
    # An adapter cannot opt its own mistakes out by changing a support flag.
    outside_sinks = {(op.snapshot_id, op.sink) for op in gold.operations if not op.supported}
    result["supported_end_to_end"] = _counts(
        Counter(_key(item, algorithm=True) for item in gold.operations if item.supported),
        Counter(_key(item, algorithm=True) for item in predicted.operations
                if (item.snapshot_id, item.sink) not in outside_sinks))
    result["outside_support_end_to_end"] = _counts(
        Counter(_key(item, algorithm=True) for item in gold.operations if not item.supported),
        Counter(_key(item, algorithm=True) for item in predicted.operations
                if (item.snapshot_id, item.sink) in outside_sinks))
    # Parameter/algorithm accuracy only among one-to-one located contexts.
    located = result["operations"]["tp"]
    correct = result["end_to_end"]["tp"]
    result["algorithm_accuracy"] = _ratio(correct, located)
    result["unknown_predictions"] = sum(op.algorithm.kind == "unknown" for op in predicted.operations)
    result["templates"] = _counts(
        Counter({(op.snapshot_id, op.sink): 1 for op in gold.operations}),
        Counter({(op.snapshot_id, op.sink): 1 for op in predicted.operations}))
    result["edges"] = {
        kind: _counts(Counter(edge.model_dump_json() for edge in gold.edges if edge.edge_type == kind),
                      Counter(edge.model_dump_json() for edge in predicted.edges if edge.edge_type == kind))
        for kind in ("CALLS", "IMPORT_BINDING", "ASSIGN_FLOW", "ARGUMENT_FLOW", "RETURN_FLOW", "KEY_TYPE_FLOW")}
    return result


@dataclass(frozen=True)
class ExperimentCase:
    case_id: str
    inputs: LogicalInput
    expected: Prediction


def run_cases(cases: tuple[ExperimentCase, ...], adapter: Callable[[LogicalInput], Prediction]) -> dict:
    """A failing adapter still contributes every gold operation as an FN."""
    rows, expected, predicted = [], [], []
    expected_edges, predicted_edges = [], []
    for case in cases:
        before = case.inputs.model_dump_json()
        error = None
        try:
            result = adapter(case.inputs)
            if not isinstance(result, Prediction):
                raise TypeError("adapter必须返回Prediction")
        except Exception as exc:
            result = Prediction()
            # Do not include arbitrary adapter messages, which may contain source/secrets.
            error = type(exc).__name__
        if case.inputs.model_dump_json() != before:
            raise ValueError("adapter修改了逻辑输入")
        rows.append({"case_id": case.case_id, "error": error, "metrics": evaluate(case.expected, result)})
        expected.extend(case.expected.operations)
        expected_edges.extend(case.expected.edges)
        predicted.extend(result.operations)
        predicted_edges.extend(result.edges)
    return {"cases": rows, "metrics": evaluate(Prediction(operations=tuple(expected), edges=tuple(expected_edges)),
                                               Prediction(operations=tuple(predicted), edges=tuple(predicted_edges)))}
