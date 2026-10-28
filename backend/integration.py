"""One evidence-based result projection; model opinions never establish a fact."""
from __future__ import annotations

from collections import defaultdict
from copy import deepcopy

from backend.ai.config import digest
from backend.analysis import build_analysis, STANDARD_URL
from backend.reporting import build_summary
from scanner.rules import VULNERABLE_ALGOS
from backend.ai.assessment import assess, scope_check
from backend.migration_directions import PURPOSES, direction, effective_purpose

ALIASES = {'EC': 'ECC', 'RS256': 'RSA', 'RS384': 'RSA', 'RS512': 'RSA',
           'PS256': 'RSA', 'PS384': 'RSA', 'PS512': 'RSA', 'ES256': 'ECDSA',
           'ES256K': 'ECDSA', 'ES384': 'ECDSA', 'ES512': 'ECDSA'}


def canonical(value: str) -> str:
    return ALIASES.get(value, value)


def integrate(base: dict) -> dict:
    """Keep legacy fields unchanged, and build an independent, reproducible view."""
    sources = {s['source_id']: s for s in base.get('sources', [])}
    confirmed, pending, refs, positions, operations = [], [], {}, defaultdict(list), {}
    for raw in base.get('findings', []):
        row = deepcopy(raw)
        row.update(finding_id='rule-' + digest(raw)[:24], verification_status='confirmed',
                   origins=['rule'], purpose_code='unknown', opinions=[], operation_ids=[])
        confirmed.append(row)
        refs[digest(raw)] = row
        positions[(row['source_id'], row['line'], canonical(row['algorithm']))].append(row)
    added, purposes, neutral_refs = 0, set(), set()
    for operation in base.get('deep_analysis', {}).get('operations', []):
        identity = operation['operation_id']
        operations[identity] = operation
        span = operation['sink_location']
        source = sources.get(span['source_id'])
        if source is None:
            continue
        claims = {c['claim_type']: c for c in operation['claims']}
        proven = all(claims.get(k, {}).get('level') == 'E3' for k in ('ALGORITHM', 'OPERATION_TYPE', 'QUANTUM_CLASS'))
        # Symmetric and unsupported algorithms are not confirmed public-key risks.
        if proven and operation.get('risk_category') != 'quantum_vulnerable':
            neutral_refs.add(identity)
            continue
        algorithm = canonical(operation['algorithm'].get('value', 'unknown'))
        profile = VULNERABLE_ALGOS.get(algorithm.lower())
        if proven and profile is None:
            continue
        key = (span['source_id'], span['start_line'], algorithm)
        matches = positions.get(key, [])
        compatible = [r for r in matches if not r['operation_ids']]
        if not compatible and operation['context']['kind'] == 'uninstantiated_template':
            compatible = [r for r in confirmed if r['source_id'] == span['source_id']
                          and r['line'] == span['start_line'] and not r['operation_ids']
                          and r.get('resolved_api') == operation['api']]
        if len(compatible) == 1 and (proven or operation['context']['kind'] == 'uninstantiated_template'):
            row = compatible[0]
            row['origins'].append('cross_file')
        else:
            row = dict(source_id=span['source_id'], file_name=source['file_name'], source_type=source['source_type'],
                       line=span['start_line'], algorithm=algorithm if algorithm != 'unknown' else '算法待确认',
                       risk_level=profile.risk_level if proven else '待复核',
                       reason=profile.reason if proven else '静态证据尚不足以确认此密码用法。',
                       recommendation=profile.recommendation if proven else '补充算法、用途与实际库实现后复核。',
                       evidence=operation['api'], resolved_api=operation['api'], library=operation['library'],
                       detection_method='cross_file', finding_id='operation-' + digest(identity)[:24],
                       verification_status='confirmed' if proven else 'pending', origins=['cross_file'],
                       opinions=[], operation_ids=[])
            (confirmed if proven else pending).append(row)
            if proven:
                added += 1
        row['operation_ids'].append(identity)
        row['purpose_code'] = operation['operation_type'] if claims.get('OPERATION_TYPE', {}).get('level') == 'E3' else 'unknown'
        if operation.get('evidence_scope') == 'algorithm_policy':
            row['purpose_code'] = 'configuration'
            row['evidence'] = '验签允许算法策略：' + operation['api']
        if proven:
            targets = direction(algorithm, row['purpose_code'])['targets']
            row['recommendation'] = ('按已确认用途评估 ' + ' / '.join(targets) + '；核对格式、参与方、密钥生命周期及互操作。') if targets else '先确认密钥和配置的实际用途，再选择迁移方案；不能直接替换任意 API。'
        row['call_chain'] = operation['context']['call_chain']
        row['context_kind'] = operation['context']['kind']
        row['context_id'] = digest(operation['context'])
        row['location'] = span
        if row['purpose_code'] != 'unknown' and proven:
            purposes.add(row['finding_id'])
        refs[identity] = row
    abstained, non_risks, scope_excluded = 0, 0, 0
    for opinion in base.get('ai_analysis', {}).get('opinions', []):
        if opinion['opinion_kind'] == 'abstain':
            abstained += 1
            continue
        scoped, scope_reason = scope_check(opinion)
        if not scoped and not opinion.get('static_refs'):
            scope_excluded += 1
            continue  # Retain raw opinion, but do not create an ungrounded risk row.
        if opinion['opinion_kind'] == 'new_candidate' and opinion['algorithm'] != 'unknown' and canonical(opinion['algorithm']).lower() not in VULNERABLE_ALGOS:
            non_risks += 1
            continue
        if opinion['opinion_kind'] == 'supports_static' and opinion.get('static_refs') and all(r in neutral_refs for r in opinion['static_refs']):
            continue
        linked = {refs[r]['finding_id']: refs[r] for r in opinion.get('static_refs', []) if r in refs}
        if not linked:
            location = opinion.get('candidate_location', {})
            source = sources.get(location.get('source_id'))
            if source is None:
                continue
            # Match only a unique location; never collapse distinct call contexts.
            at_location = [r for r in pending if r['source_id'] == location['source_id'] and r['line'] == location['line']
                           and (not location.get('context_id') or r.get('context_id') == location['context_id'])]
            row = at_location[0] if len(at_location) == 1 else None
            if row is None:
                row = dict(source_id=source['source_id'], file_name=source['file_name'], source_type=source['source_type'],
                           line=location['line'], algorithm=canonical(opinion['algorithm']) if opinion['algorithm'] != 'unknown' else '算法待确认',
                           risk_level='待复核', reason=opinion['rationale'], recommendation='核对完整实现与协议约束后，再安排迁移。',
                           evidence='代码线索待核验', detection_method='ai_candidate', resolved_api=None, library=None,
                           finding_id='candidate-' + opinion['candidate_id'], verification_status='pending', origins=['ai'],
                           purpose_code='unknown', opinions=[], operation_ids=[], context_id=location.get('context_id'))
                pending.append(row)
            linked[row['finding_id']] = row
        for row in linked.values():
            row['opinions'].append(deepcopy(opinion))
            if 'ai' not in row['origins']:
                row['origins'].append('ai')
            row['review_required'] = opinion['opinion_kind'] == 'questions_static' or row.get('review_required', False)
            row['suggested_purpose'] = PURPOSES.get(opinion['purpose'], '用途待确认')
            accepted, reason = assess(opinion, row)
            row['adoption_reason'] = reason
            row['review_required'] |= reason == 'conflicting_evidence'
            if accepted:
                row['ai_purpose_code'] = opinion['purpose']
                if row['verification_status'] != 'confirmed':
                    row.update(verification_status='ai_assessed', algorithm=canonical(opinion['algorithm']),
                               purpose_code=opinion['purpose'], risk_level='AI研判', reason=opinion['rationale'])
                    if row['detection_method']=='ai_candidate':
                        row['evidence']='源码实现研判'
            elif row['verification_status'] == 'pending':
                row['unresolved_reason'] = reason
    assessed = [r for r in pending if r['verification_status'] == 'ai_assessed']
    pending = [r for r in pending if r['verification_status'] == 'pending']
    all_rows = confirmed + assessed + pending
    for row in all_rows:
        static = row.get('purpose_code', 'unknown')
        inferred = row.get('ai_purpose_code', 'unknown')
        row['effective_purpose_code'] = inferred if static == 'unknown' else static
        row['purpose_origin'] = 'ai' if inferred != 'unknown' and (static == 'unknown' or row['verification_status']=='ai_assessed') else 'static' if static != 'unknown' else 'unknown'
        row['purpose'] = PURPOSES.get(effective_purpose(row), PURPOSES['unknown'])
    confirmed_analysis = build_analysis(confirmed)
    assets, migrations = [], []
    for status, rows in (('confirmed', confirmed), ('ai_assessed', assessed), ('pending', pending)):
        analysis = confirmed_analysis if status == 'confirmed' else build_analysis(rows)
        by_asset = defaultdict(list)
        for row in rows:
            by_asset[(row['source_id'], row['algorithm'])].append(row)
        for asset in analysis['assets']:
            members = by_asset[(asset['source_id'], asset['algorithm'])]
            codes = {effective_purpose(r) for r in members} - {'unknown'}
            code = next(iter(codes)) if len(codes) == 1 else 'unknown'
            asset.update(verification_status=status, **direction(asset['algorithm'], code))
            asset['purpose_codes'] = sorted({effective_purpose(r) for r in members})
            asset['purpose_origin'] = 'ai' if any(r['purpose_origin']=='ai' for r in members) else 'static'
            asset['finding_ids'] = [r['finding_id'] for r in members]
            if status == 'pending':
                asset['targets'] = []
                asset['migration_references'] = []
            else:
                # Preserve all proven uses of the same file/algorithm asset.
                asset['targets'] = sorted({target for row in members for target in direction(asset['algorithm'], effective_purpose(row))['targets']})
                asset['migration_references'] = list({r['label']:r for row in members for r in direction(asset['algorithm'],effective_purpose(row))['migration_references']}.values())
                if len(codes) > 1:
                    asset['purpose'] = ' / '.join(sorted({PURPOSES.get(effective_purpose(r),'用途待确认') for r in members}))
            assets.append(asset)
        if status in ('confirmed', 'ai_assessed'):
            groups = defaultdict(list)
            for row in rows:
                groups[(row['algorithm'], effective_purpose(row))].append(row)
            for (algorithm, code), members in groups.items():
                files = list(dict.fromkeys(r['source_id'] for r in members))
                item = dict(algorithm=algorithm, source_ids=files, finding_count=len(members), affected_files=len(files),
                            verification_status=status,
                            purpose_origin='ai' if any(r['purpose_origin']=='ai' for r in members) else 'static',
                            finding_ids=[r['finding_id'] for r in members],
                            **direction(algorithm, code))
                item['actions'] = [
                    {'title': '核对用途与协议', 'description': '核对调用证据、数据保密周期、参与方和协议约束。'},
                    {'title': '选择迁移方向', 'description': '评估 ' + ' / '.join(item['targets']) + ' 的实现、互操作和回退。' if item['targets'] else '先确认实际用途；密钥生成、导入或算法配置不能直接决定迁移方案。'},
                    {'title': '测试验证', 'description': '补充兼容、性能、密钥生命周期和回退测试；不据此认定迁移完成。'},
                ]
                migrations.append(item)
    confirmed_analysis.update(assets=assets, migrations=migrations)
    calls = []
    for identity, operation in operations.items():
        row = refs.get(identity)
        calls.append({'id': identity, 'operation_id': identity, 'source_id': operation['sink_location']['source_id'],
                      'line': operation['sink_location']['start_line'], 'algorithm': row['algorithm'] if row else operation['algorithm'].get('value', '算法待确认'),
                      'purpose': PURPOSES.get(effective_purpose(row) if row else operation['operation_type'], '用途待确认'),
                      'purpose_code':effective_purpose(row) if row else operation['operation_type'],
                      'purpose_origin':row.get('purpose_origin','unknown') if row else 'static',
                      'verification_status': row['verification_status'] if row else 'confirmed' if all(c['level'] == 'E3' for c in operation['claims'][:2]) else 'pending',
                      'api':operation['api'], 'context_kind':operation['context']['kind'],
                      'evidence_ids':operation['evidence_ids'],'context_id':row.get('context_id') if row else None,'origins':row.get('origins',['cross_file']) if row else ['cross_file'],
                      'finding_id': row['finding_id'] if row else None, 'call_chain': operation['context']['call_chain']})
    for row in assessed + pending:
        if row['operation_ids']:
            continue
        calls.append({'id': row['finding_id'], 'finding_id': row['finding_id'], 'source_id': row['source_id'],
                      'line': row['line'], 'algorithm': row['algorithm'], 'purpose': row.get('suggested_purpose', '用途待确认'),
                      'purpose_code':effective_purpose(row),
                      'verification_status': row['verification_status'], 'api':row.get('resolved_api'),
                      'context_kind':'ai_evidence','origins':row.get('origins',['ai']),'context_id':row.get('context_id'), 'call_chain': row['opinions'][0].get('related_locations', [])[:5] if row['opinions'] else []})
    return {'version': 3, 'findings': all_rows, 'summary': build_summary(list(sources.values()), confirmed),
            'analysis': confirmed_analysis, 'calls': calls,
            'changes': {'baseline': len(base.get('findings', [])), 'new_confirmed': added, 'purpose_completed': len(purposes),
                        'pending': len(pending), 'ai_assessed':len(assessed),
                        'review_required': sum(bool(r.get('review_required')) for r in all_rows),
                        'abstained': abstained, 'non_risks':non_risks, 'scope_excluded':scope_excluded, 'confirmed': len(confirmed)}}


def project(base: dict) -> dict:
    view = base.get('integrated_analysis')
    return {**base, **({k: view[k] for k in ('findings', 'summary', 'analysis')} if view else {})}
