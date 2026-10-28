"""Isolated trusted harness: only parse fixture strings; never import targets."""
from __future__ import annotations

import argparse
import json
from pathlib import Path
import sys
from types import SimpleNamespace


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--root', required=True)
    parser.add_argument('--adapted', action='store_true')
    parser.add_argument('--support')
    args = parser.parse_args()
    sys.path.insert(0, args.root)
    from tests.deep_static.corpus import load_catalog, as_experiment
    from scanner.engine import analyze_source
    if args.adapted:
        from backend.original_a import build_snapshot, analyze_crypto, adapt_result
    else:
        from deep_analysis.snapshot import build_snapshot
        from deep_analysis.pipeline import analyze_crypto
    rows = []
    if args.support:
        import hashlib
        for catalog in json.loads(Path(args.support).read_text())['cases']:
            docs = [SimpleNamespace(file_name=name, source_id=hashlib.sha256((catalog['id'] + name).encode()).hexdigest(),
                                    content=text, content_available=True) for name, text in catalog['files'].items()]
            snapshot = build_snapshot(docs, 'github_repository', collection_version='support-fixture-1')
            result = analyze_crypto(snapshot).model_dump(mode='json')
            if args.adapted:
                result = adapt_result(result)
            rows.append({'case': catalog['id'], 'source_names': {d.source_id:d.file_name for d in docs},
                         'basic': {d.file_name: analyze_source(d.content, d.file_name, 'github_repository', d.source_id, include_metadata=True) for d in docs},
                         'result': result, 'labels': {k:v for k,v in catalog.items() if k.endswith('_gold')}})
        print(json.dumps(rows, ensure_ascii=False))
        return
    for catalog in load_catalog():
        case = as_experiment(catalog)
        docs = [SimpleNamespace(file_name=s.identity.relative_path, source_id=s.identity.source_id,
                                relative_path=s.identity.relative_path, content=s.content, content_available=True)
                for s in case.inputs.sources]
        snapshot = build_snapshot(docs, 'github_repository', collection_version='frozen-fixture-1')
        result = analyze_crypto(snapshot).model_dump(mode='json')
        if args.adapted:
            result = adapt_result(result)
        gold = case.expected.model_dump(mode='json')
        for operation in gold['operations']:
            operation['snapshot_id'] = snapshot.identity.snapshot_id
        for edge in gold['edges']:
            edge['snapshot_id'] = snapshot.identity.snapshot_id
        basic = {d.source_id: analyze_source(d.content, d.file_name, 'github_repository', d.source_id, include_metadata=True)
                 for d in docs}
        rows.append({'case': catalog['id'], 'split': catalog['split'], 'gold': gold,
                     'result': result, 'basic': basic})
    print(json.dumps(rows, ensure_ascii=False))


if __name__ == '__main__':
    main()
