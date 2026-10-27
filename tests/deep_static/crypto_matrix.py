"""Frozen corpus evaluation; this module never executes fixture source."""
from __future__ import annotations

import hashlib
import json
from pathlib import Path
import platform
from types import SimpleNamespace

from deep_analysis.evaluation import EdgeLabel, OperationLabel, Prediction, evaluate
from deep_analysis.evidence import proof_edges
from deep_analysis.models import Known
from deep_analysis.pipeline import analyze_crypto
from deep_analysis.snapshot import build_snapshot
from tests.deep_static.corpus import ROOT, as_experiment, load_catalog


def run_matrix() -> dict:
    rows, gold_all, predicted_all, gold_edges, predicted_edges = [], [], [], [], []
    gold_locked, predicted_locked, locked_gold_edges, locked_predicted_edges = [], [], [], []
    errors_e3 = []
    for catalog in load_catalog():
        case = as_experiment(catalog)
        before = case.inputs.model_dump_json()
        documents = tuple(SimpleNamespace(file_name=s.identity.relative_path, relative_path=s.identity.relative_path,
                                          source_id=s.identity.source_id, content=s.content, content_available=True)
                          for s in case.inputs.sources)
        source = build_snapshot(documents, 'github_repository', collection_version='frozen-fixture-1')
        identity = source.identity.snapshot_id
        gold = Prediction(operations=tuple(o.model_copy(update={'snapshot_id': identity}) for o in case.expected.operations),
                          edges=tuple(e.model_copy(update={'snapshot_id': identity}) for e in case.expected.edges))
        result = analyze_crypto(source)
        operations = tuple(OperationLabel(snapshot_id=identity, sink=o.sink_location, operation_type=o.operation_type,
                                           context_kind=o.context.kind, context=o.context.call_chain, algorithm=o.algorithm)
                           for o in result.operations)
        # A repeated path referenced by two claims is one prediction, not two edges.
        edge_set = {(p.context.call_chain, e) for p in result.evidence_paths if p.verification_status == 'valid' for e in proof_edges(p)}
        edges = tuple(EdgeLabel(snapshot_id=identity, context=context, edge_type=e[0], source=e[1], target=e[2])
                      for context, e in sorted(edge_set, key=str))
        predicted = Prediction(operations=operations, edges=edges)
        for operation in result.operations:
            claim = next(c for c in operation.claims if c.claim_type == 'ALGORITHM')
            if claim.level != 'E3':
                continue
            matches = [o for o in gold.operations if o.sink == operation.sink_location and o.context == operation.context.call_chain
                       and o.context_kind == operation.context.kind and o.operation_type == operation.operation_type]
            if not any(isinstance(o.algorithm, Known) and o.algorithm == operation.algorithm for o in matches):
                errors_e3.append({'case': case.case_id, 'operation_id': operation.operation_id, 'claim': 'ALGORITHM'})
        if before != case.inputs.model_dump_json():
            raise AssertionError('source changed')
        rows.append({'case': case.case_id, 'split': catalog['split'], 'metrics': evaluate(gold, predicted),
                     'gold': gold.model_dump(mode='json'), 'prediction': predicted.model_dump(mode='json'),
                     'result': result.model_dump(mode='json')})
        gold_all.extend(gold.operations)
        predicted_all.extend(operations)
        gold_edges.extend(gold.edges)
        predicted_edges.extend(edges)
        if catalog['split'] == 'locked':
            gold_locked.extend(gold.operations)
            predicted_locked.extend(operations)
            locked_gold_edges.extend(gold.edges)
            locked_predicted_edges.extend(edges)
    return {'schema': 'deep-crypto-evaluation-1', 'python': platform.python_version(),
            'label_review': 'authored_review_pending_independent_human',
            'manifest_sha256': hashlib.sha256((ROOT / 'manifest.json').read_bytes()).hexdigest(),
            'metrics_all': evaluate(Prediction(operations=tuple(gold_all), edges=tuple(gold_edges)), Prediction(operations=tuple(predicted_all), edges=tuple(predicted_edges))),
            'metrics_locked': evaluate(Prediction(operations=tuple(gold_locked), edges=tuple(locked_gold_edges)), Prediction(operations=tuple(predicted_locked), edges=tuple(locked_predicted_edges))),
            'algorithm_errors_e3_against_labels': errors_e3,
            'other_claim_error_e3': 'covered_by_directed_adversarial_tests_not_independently_human_labelled',
            'source_modifications': 0, 'rows': rows}


def main() -> None:
    output = Path('output/deep-crypto-20261018')
    output.mkdir(parents=True, exist_ok=True)
    report = run_matrix()
    (output / 'crypto-matrix.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    lines = ['# 冻结密码操作矩阵', '', '标签未经独立人工裁决；完整Unknown原因/条件严格匹配，不按引擎改标签。', '',
             '| 案例 | split | 操作 TP/FP/FN | 端到端 TP/FP/FN |', '|---|---|---|---|']
    for row in report['rows']:
        metrics = row['metrics']
        format_counts = lambda name: '/'.join(str(metrics[name][key]) for key in ('tp', 'fp', 'fn'))
        lines.append(f'| {row["case"]} | {row["split"]} | {format_counts("operations")} | {format_counts("end_to_end")} |')
    lines.extend(['', '## 锁定集', '', '```json', json.dumps(report['metrics_locked'], ensure_ascii=False, indent=2), '```', '',
                  '必要边标注并非完整负边金标准；严格边计数中的额外预测须审查，不能直接当作错误边率。',
                  '算法错误E3（仅相对现有标签）：' + str(len(report['algorithm_errors_e3_against_labels'])),
                  '未运行人工审查、真实仓库试点、HTTP新阶段或性能排名。'])
    (output / 'crypto-matrix.md').write_text('\n'.join(lines) + '\n', encoding='utf-8')
    print(json.dumps({'cases': len(report['rows']), 'locked': report['metrics_locked']['end_to_end'],
                      'errors_e3': len(report['algorithm_errors_e3_against_labels'])}, ensure_ascii=False))


if __name__ == '__main__':
    main()
