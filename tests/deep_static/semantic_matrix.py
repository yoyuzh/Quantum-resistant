"""Observe frozen source semantics; deliberately do not score domain gold labels."""
from __future__ import annotations

import hashlib
import json
import platform
from pathlib import Path

from deep_analysis.engine import analyze
from tests.deep_static.corpus import ROOT, load_catalog
from tests.deep_static.test_snapshot_index import snapshot


def run_matrix() -> dict:
    rows = []
    for case in load_catalog():
        source = snapshot(case['files'])
        before = source.identity.snapshot_id
        result = analyze(source)
        candidates = []
        for candidate in result.candidates:
            arguments = {}
            for name, fact in candidate.arguments:
                # Only synthetic algorithm observations are included, never key/payload literals.
                arguments[name] = {
                    'value': fact.value.model_dump(mode='json') if name in ('algorithm', 'algorithms') else {'kind': type(fact.value).__name__},
                    'items': [f.value.model_dump(mode='json') for f in fact.items] if name == 'algorithms' and fact.items is not None else None,
                    'edges': sorted({s.kind for s in fact.steps}),
                }
            candidates.append({'id': candidate.operation_id, 'template': candidate.template_id,
                               'api': candidate.api, 'sink': candidate.sink.model_dump(mode='json'),
                               'context': candidate.context.model_dump(mode='json'),
                               'reason': candidate.reason, 'arguments': arguments})
        if source.identity.snapshot_id != before or snapshot(case['files']).identity != source.identity:
            raise AssertionError('immutable source changed')
        rows.append({'case': case['id'], 'split': case['split'], 'snapshot': before,
                     'candidates': candidates, 'coverage': result.coverage.model_dump(mode='json'),
                     'diagnostics': [d.model_dump(mode='json') for d in result.diagnostics],
                     'cache_entries': result.cache_entries, 'cache_hits': result.cache_hits})
    return {'scope': 'unverified candidate and parameter observations only',
            'python': platform.python_version(), 'cases': len(rows),
            'manifest_sha256': hashlib.sha256((ROOT / 'manifest.json').read_bytes()).hexdigest(),
            'rows': rows}


def main() -> None:
    destination = Path('output/deep-semantics-20261018')
    destination.mkdir(parents=True, exist_ok=True)
    report = run_matrix()
    (destination / 'semantic-matrix.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'cases': report['cases'], 'candidates': sum(len(r['candidates']) for r in report['rows'])}))


if __name__ == '__main__':
    main()
