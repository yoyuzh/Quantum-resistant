"""Two-file AST cache. Indexes and witnesses retain spans, never whole trees."""
from __future__ import annotations

import ast
from collections import OrderedDict
from collections.abc import Mapping


class AstCache:
    def __init__(self, sources, checkpoint=lambda: None):
        self.sources = {s.identity.source_id: s for s in sources}
        self.checkpoint = checkpoint
        self.entries = OrderedDict()
        self.peak = 0
        self.parses = 0

    def get(self, identity):
        self.checkpoint()
        if identity not in self.entries:
            source = self.sources[identity]
            from scanner.parsing import parse_python
            tree = parse_python(source.content, source.identity.relative_path, self.checkpoint)
            nodes = {(n.lineno, n.col_offset, n.end_lineno, n.end_col_offset): n for n in ast.walk(tree)
                     if getattr(n, 'end_lineno', None) is not None}
            while len(self.entries) >= 2:
                self.entries.popitem(last=False)
            self.entries[identity] = (tree, nodes)
            self.parses += 1
            self.peak = max(self.peak, len(self.entries))
        self.entries.move_to_end(identity)
        return self.entries[identity]

    def node(self, span):
        return self.get(span.source_id)[1][(span.start_line, span.start_col, span.end_line, span.end_col)]


class SpanNodes:
    def __init__(self, modules):
        self.modules = {m.source_id: m for m in modules}

    def __getitem__(self, span):
        return self.modules[span.source_id].node_at(span)

    def get(self, span, default=None):
        try:
            return self[span]
        except KeyError:
            return default


class Functions(Mapping):
    def __init__(self, modules):
        self.entries = {m.source_id + ':' + s.target: (m, s.location, s.target)
                        for m in modules for s in m.symbols if s.kind == 'function' and s.target}

    def __getitem__(self, key):
        module, span, scope = self.entries[key]
        return module, module.node_at(span), scope

    def __iter__(self):
        return iter(self.entries)

    def __len__(self):
        return len(self.entries)
