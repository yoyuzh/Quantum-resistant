"""Metered, sharded module summaries reused by secondary AI analysis."""
from __future__ import annotations

import json
from backend.temp_storage import StoredContent


class SummaryStore:
    def __init__(self, control, identities):
        self.control = control
        self.identities = {s.source_id: s for s in identities}
        self.path = None
        self.size = 0
        control.source_facts = {}

    def write(self, module):
        if module.source_id in self.control.source_facts:
            return  # The verifier still reparses independently; summaries are retrieval only.
        value = {'sha256': self.identities[module.source_id].sha256, 'module': module.name,
                 'imports': [{'line': s.location.start_line, 'target': s.target} for s in module.symbols if s.kind == 'import'],
                 'functions': [{'name': s.name, 'line': s.location.start_line, 'end': s.location.end_line, 'scope': s.scope}
                               for s in module.symbols if s.kind == 'function'],
                 'calls': [{'name': c.expression, 'line': c.location.start_line, 'end': c.location.end_line,
                            'col': c.location.start_col, 'end_col': c.location.end_col}
                           for c in module.calls]}
        encoded = json.dumps(value, ensure_ascii=False, separators=(',', ':')).encode('utf-8')
        if self.path is None or self.size + len(encoded) > 1024 * 1024:
            self.path = self.control.storage.write(self.control.folder, b'', '.index')
            self.size = 0
        offset = self.size
        self.control.storage.append(self.path, encoded)
        self.size += len(encoded)
        self.control.source_facts[module.source_id] = StoredContent(self.path, offset, len(encoded))
