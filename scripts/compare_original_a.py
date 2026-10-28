"""Three-version comparison with the pinned historical and strict matchers."""
from __future__ import annotations

import argparse
from collections import Counter
from copy import deepcopy
import hashlib
import io
import json
from pathlib import Path
import subprocess
import sys
import tarfile
import tempfile

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from original_a.deep_analysis.evaluation import Prediction, OperationLabel, evaluate

A = 'd8e07c903d5cd15e19142613491bb7dbae69699d'
MAIN = '56fc462e6ea0712aad9c8c0239f79342d1fd921c'


def key(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':'))


def counts(gold, predicted):
    g, p = Counter(map(key, gold)), Counter(map(key, predicted))
    tp = sum((g & p).values())
    fp, fn = sum((p - g).values()), sum((g - p).values())
    return {'tp': tp, 'fp': fp, 'fn': fn, 'precision': tp / (tp + fp) if tp + fp else None,
            'recall': tp / (tp + fn) if tp + fn else None,
            'false_positives': list((p - g).elements()), 'false_negatives': list((g - p).elements())}


def labels(row):
    return [{'snapshot_id': row['result']['snapshot']['snapshot_id'], 'sink': o['sink_location'],
             'operation_type': o['operation_type'], 'context_kind': o['context']['kind'],
             'context': o['context']['call_chain'], 'algorithm': o['algorithm'], 'supported': True}
            for o in row['result']['operations']]


def strict(value):
    # These are the fields independently labelled by the frozen corpus. No reason,
    # condition, alternative or location normalization is allowed here.
    return {k: v for k, v in value.items() if k != 'supported'}


def measure(rows):
    gold = [o for row in rows for o in row['gold']['operations']]
    pred = [o for row in rows for o in labels(row)]
    historical = evaluate(Prediction(operations=tuple(OperationLabel.model_validate(o) for o in gold)),
                          Prediction(operations=tuple(OperationLabel.model_validate(o) for o in pred)))
    by_scope = Counter()
    for row in rows:
        for o in row['result']['operations']:
            scope = ('algorithm_policy' if o['api'] == 'jwt.decode' else
                     'definition_template' if o['context']['kind'] == 'uninstantiated_template' else 'static_call')
            by_scope[(o['context']['kind'], scope)] += 1
    known_gold = [strict(o) for o in gold if o['algorithm']['kind'] == 'known']
    known_pred = [strict(o) for o in pred if o['algorithm']['kind'] == 'known']
    return {'historical': historical, 'strict_labelled_fields': counts(list(map(strict, gold)), list(map(strict, pred))),
            'known_algorithms': counts(known_gold, known_pred),
            'context_and_scope_counts': {':'.join(k): v for k, v in sorted(by_scope.items())}}


def archive(ref, folder):
    data = subprocess.check_output(['git', 'archive', ref, 'deep_analysis', 'scanner', 'tests/deep_static'], cwd=ROOT)
    with tarfile.open(fileobj=io.BytesIO(data)) as tar:
        tar.extractall(folder, filter='data')


def run(root, adapted=False, support=False):
    command = [sys.executable, '-B', str(ROOT / 'scripts/original_a_eval_worker.py'), '--root', str(root)]
    if adapted:
        command.append('--adapted')
    if support:
        command.extend(['--support', str(ROOT / 'tests/deep_static/fixtures/original_a_support.json')])
    return json.loads(subprocess.check_output(command, cwd=root))


def validate_product(rows):
    from deep_analysis.models import DeepAnalysisResult
    from backend.integration import integrate
    for row in rows:
        result = row['result']
        DeepAnalysisResult.model_validate(result)
        names = row.get('source_names') or {s['source_id']: s['relative_path'] for s in result['snapshot']['sources']}
        sources = [dict(source_id=identity, file_name=name, source_type='github_repository',
                        content='', line_count=1, content_available=False) for identity, name in names.items()]
        findings = [finding for pair in row['basic'].values() for finding in pair[0]]
        assert integrate({'sources': sources, 'findings': findings, 'deep_analysis': result})['version'] == 3
    return len(rows)


def support_inventory():
    from deep_analysis.crypto_rules import RULES as main_rules, method_rule as main_method
    from original_a.deep_analysis.crypto_rules import RULES as a_rules, method_rule as a_method
    direct = [{'api': api, 'main_declared': True, 'A_declared': api in a_rules,
               'operation': rule.operation, 'algorithm': rule.algorithm} for api, rule in sorted(main_rules.items())]
    receivers = []
    for family in ('RSA', 'EC', 'ECDSA', 'Ed25519', 'X25519'):
        for role in ('private', 'public', 'either'):
            for method in ('sign', 'verify', 'encrypt', 'decrypt', 'exchange'):
                key_type = family + ':' + role
                before, after = main_method(key_type, method), a_method(key_type, method)
                if before is not None or after is not None:
                    receivers.append({'key_type': key_type, 'method': method, 'main': before, 'A': after})
    return {'scope': 'declared direct rules and receiver methods; does not prove arbitrary programs are supported',
            'direct_rules': direct, 'receiver_methods': receivers}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--output', type=Path, default=ROOT / 'output/original-a/comparison')
    args = parser.parse_args()
    args.output.mkdir(parents=True, exist_ok=True)
    latest = subprocess.check_output(['git', 'rev-parse', 'origin/main'], cwd=ROOT).decode().strip()
    if latest != MAIN:
        raise SystemExit('main moved; recheck contracts and update the explicit baseline first')
    with tempfile.TemporaryDirectory(prefix='original-a-evaluation-') as temp:
        versions = {}
        support = {}
        for name, ref in [('A', A), ('main', latest)]:
            path = Path(temp) / name
            path.mkdir()
            archive(ref, path)
            versions[name] = run(path)
            support[name] = run(path, support=True)
        versions['adapted'] = run(ROOT, True)
        support['adapted'] = run(ROOT, True, support=True)
    differences = []
    for a, current in zip(versions['A'], versions['adapted'], strict=True):
        raw = deepcopy(current)
        for operation in raw['result']['operations']:
            operation.pop('evidence_scope')
        if raw != a:
            differences.append(a['case'])
    support_differences = []
    for a, current in zip(support['A'], support['adapted'], strict=True):
        raw = deepcopy(current)
        for operation in raw['result']['operations']:
            operation.pop('evidence_scope')
        if raw != a:
            support_differences.append(a['case'])
    report = {'baselines': {'A': A, 'main': latest}, 'corpus_sha256': hashlib.sha256((ROOT / 'tests/deep_static/fixtures/corpus.json').read_bytes()).hexdigest(),
              'manifest_sha256': hashlib.sha256((ROOT / 'tests/deep_static/fixtures/manifest.json').read_bytes()).hexdigest(),
              'exact_A_differences': differences, 'support_exact_A_differences': support_differences,
              'allowed_transport_difference': 'operations[].evidence_scope only',
              'strict_scope': 'complete labelled algorithm value, sink span, operation type, context kind and call chain; raw A equivalence additionally checks ALL result and basic fields',
              'metrics': {}, 'independent_holdout': 'not_available', 'real_model': 'not_run'}
    report['main_model_and_projection_validated_results'] = validate_product(versions['adapted'] + support['adapted'])
    report['support_inventory'] = support_inventory()
    for name, rows in versions.items():
        (args.output / f'{name}.json').write_text(json.dumps(rows, ensure_ascii=False, indent=2) + '\n')
        report['metrics'][name] = {'all': measure(rows), 'locked': measure([r for r in rows if r['split'] == 'locked'])}
        for row in rows:
            row['strict'] = counts(list(map(strict, row['gold']['operations'])), list(map(strict, labels(row))))
        (args.output / f'{name}-per-case.json').write_text(json.dumps(rows, ensure_ascii=False, indent=2) + '\n')
    support_report = {'fixture_sha256': hashlib.sha256((ROOT / 'tests/deep_static/fixtures/original_a_support.json').read_bytes()).hexdigest(),
                      'scope': '15 authored development cases; missing layer gold is not measured; EC/ECC lexical label difference is retained, not relabelled', 'versions': {}}
    for name, rows in support.items():
        totals = {layer: [[], []] for layer in ('basic', 'deep')}
        for row in rows:
            row['metrics'] = {}
            for layer in ('basic', 'deep'):
                if layer + '_gold' not in row['labels']:
                    continue
                gold = row['labels'][layer + '_gold']
                if layer == 'basic':
                    predicted = [[file, r['line'], r['algorithm']] for file, pair in row['basic'].items() for r in pair[0]]
                else:
                    predicted = [[row['source_names'][o['sink_location']['source_id']], o['sink_location']['start_line'],
                                  o['operation_type'], o['algorithm']['value'], o['context']['kind']]
                                 for o in row['result']['operations'] if o['algorithm']['kind'] == 'known'
                                 and next(c for c in o['claims'] if c['claim_type'] == 'ALGORITHM')['level'] == 'E3']
                row['metrics'][layer] = counts(gold, predicted)
                totals[layer][0].extend([[row['case'], *r] for r in gold])
                totals[layer][1].extend([[row['case'], *r] for r in predicted])
        support_report['versions'][name] = {layer: counts(*values) for layer, values in totals.items()}
        (args.output / f'{name}-support.json').write_text(json.dumps(rows, ensure_ascii=False, indent=2) + '\n')
    (args.output / 'support-comparison.json').write_text(json.dumps(support_report, ensure_ascii=False, indent=2) + '\n')
    (args.output / 'comparison.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'exact_A_differences': differences, 'metrics': {name: {part: {'historical_supported': values['historical']['supported_end_to_end'], 'strict': {k:v for k,v in values['strict_labelled_fields'].items() if k not in ('false_positives','false_negatives')}} for part, values in groups.items()} for name, groups in report['metrics'].items()}}, ensure_ascii=False, indent=2))
    if differences or support_differences:
        raise SystemExit('A equivalence failed')


if __name__ == '__main__':
    main()
