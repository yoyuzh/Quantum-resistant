from __future__ import annotations

import asyncio
import time
from contextlib import aclosing

from backend.ai.config import BUDGETS, POLICY, digest
from backend.ai.provider import PROMPT_VERSION, ProviderError, body, complete, parse, reusable, continuable
from backend.ai.context import select


async def completed_batches(service, config, batches, check, refill=None):
    async def exchange(batch, data):
        try:
            return batch, await complete(service.client, config, data, check)
        except Exception as exc:
            return batch, exc
    tasks = {asyncio.create_task(exchange(batch, data)): index for index, (batch, data) in enumerate(batches)}
    try:
        while tasks:
            done, _ = await asyncio.wait(tasks, return_when=asyncio.FIRST_COMPLETED)
            for task in sorted(done, key=tasks.get):
                tasks.pop(task)
                yield task.result()
                if refill:
                    next_batch = refill()
                    if next_batch:
                        batch, data = next_batch
                        tasks[asyncio.create_task(exchange(batch, data))] = max(tasks.values(), default=0)+1
    finally:
        for task in tasks:
            task.cancel()
        await asyncio.gather(*tasks, return_exceptions=True)


async def analyze(service, job, base, prepared, config, end):
    started = time.monotonic()
    previous = base.get('ai_analysis', {})
    old = previous.get('opinions', []) if continuable(previous,prepared['snapshot']) else []
    old=[{**o,'model_origin':o.get('model_origin') or {k:previous.get(k) for k in ('profile_id','profile_name','model','provider','config_version')}} for o in old]
    selected = prepared.get('descriptors', prepared.get('packets', []))
    result = {'schema_version': 'ai-assisted-5', 'status': 'partial', 'source_task_id': job.payload.get('source_task_id', job.id),
              'profile_id':config.profile_id, 'profile_name':config.profile_name, 'protocol':config.protocol,
              'config_version': config.version, 'model': config.model, 'provider': config.base_url,
              'policy_version': POLICY, 'prompt_version': PROMPT_VERSION, 'input_digest': prepared['snapshot'],
              'opinions': list(old), 'diagnostics': [], 'calls': 0, 'request_bytes': 0, 'usage': None,
              'automatic_recovery': {'scheduled':0, 'completed':0}, 'stop_reason':None,
              'coverage': {'searched_files': prepared['searched_files'], 'searched_bytes': prepared['searched_bytes'],
                           'discovered': prepared['total'], 'selected': len(selected), 'completed': len(old),
                           'remaining': max(0, prepared['total'] - len(old)), 'partial': False,
                           'search_partial': bool(prepared['partial']),
                           'locally_resolved': prepared.get('locally_resolved', 0)}}
    result['diagnostics'].extend({'code': code, 'message': '候选检索存在未覆盖范围'} for code in prepared.get('diagnostics', []))
    usage, failures, expanded, recovered, attempted = [], 0, set(), set(), set()
    transmissions, errors = {}, {}
    last_failure = None
    def check():
        if job.control.cancelled.is_set() or job.stop_ai.is_set():
            raise ProviderError('cancelled', 'AI已停止；完整结果已保留')
        if not service.profiles.valid(config):
            raise ProviderError('config_changed', '模型配置已变化，后续批次停止')
        if time.monotonic() >= end:
            raise ProviderError('ai_timeout', 'AI阶段达到15分钟截止时间，完整结果已保留')
    def coverage():
        result['coverage']['completed'] = len(result['opinions'])
        result['coverage']['remaining'] = max(0, prepared['total'] - len(result['opinions']))
    def progress(action, candidates=(), waiting_since=None):
        coverage()
        files = list(dict.fromkeys(e['file_name'] for c in candidates for e in c.get('evidence', [])))[:3]
        job.control.emit(stage='模型复核', ai_progress={**result['coverage'], 'calls': result['calls'],
            'recovery_groups':result['automatic_recovery']['scheduled']}, activity={'action':action,'files':files,
            'completed':result['coverage']['completed'],'total':prepared['total'],'batch':result['calls'], 'waiting_since':waiting_since,
            'repository':next((c.get('repository') for c in candidates if c.get('repository')),None)})
    async def save(candidates=()):
        progress('校验返回意见、关联证据并保存完整结果', candidates)
        await asyncio.get_running_loop().run_in_executor(service.store.executor, service.store._save, job, {**base, 'ai_analysis': result})
    done = {o['candidate_id'] for o in old}
    pending = [c for c in selected if c['candidate_id'] not in done]
    def recover(candidates):
        ready = []
        for candidate in candidates:
            identity = candidate['candidate_id']
            if transmissions.get(identity,0) < 3:
                ready.append({**candidate, '_recovery':True, '_repair_errors': errors.get(identity, [])})
                if identity not in recovered:
                    recovered.add(identity)
                    result['automatic_recovery']['scheduled'] += 1
        # Repair before another large selection window can consume the budget.
        pending[0:0] = ready
    try:
        while True:
            check()
            if not pending:
                pending = select(prepared['catalogue'], attempted | {o['candidate_id'] for o in result['opinions']}) if 'catalogue' in prepared else []
                if not pending:
                    break
                result['coverage']['selected'] += len(pending)
                progress('自动接续下一组待复核问题')
            window, pending = pending[:BUDGETS['batch'] * 4], pending[BUDGETS['batch'] * 4:]
            attempted.update(c['candidate_id'] for c in window)
            progress('准备调用方、封装定义及算法配置证据')
            if 'catalogue' in prepared:
                window = await asyncio.get_running_loop().run_in_executor(service.store.executor, service.materialize, job, prepared, window, check)
            working = []
            for candidate in window:
                cached = service.cached(digest([candidate['candidate_id'], config.version, PROMPT_VERSION, POLICY]))
                if cached:
                    evidence = [*candidate['evidence'], *(e for snippets in candidate.get('expansions', {}).values() for e in snippets)]
                    rebound = {**candidate, 'evidence': list({e['evidence_id']: e for e in evidence}.values())}
                    values, _ = parse(__import__('json').dumps({'opinions': [cached]}), [rebound])
                    if values:
                        for item in values:
                            item['model_origin']={'profile_id':config.profile_id,'profile_name':config.profile_name,'model':config.model,'provider':config.base_url,'config_version':config.version}
                        result['opinions'].extend(values)
                        continue
                working.append(candidate)
            while working:
                check()
                if result['calls'] >= BUDGETS['calls']:
                    raise ProviderError('call_budget', '模型调用达到本次预算，可继续未完成项')
                outstanding = {}
                def next_batch():
                    check()
                    if not working or result['calls'] >= BUDGETS['calls']:
                        return None
                    batch = []
                    batch_limit = (1 if transmissions.get(working[0]['candidate_id'],0)>=2 else BUDGETS['repair_batch']) if working[0].get('_recovery') else BUDGETS['batch']
                    while working and len(batch) < batch_limit:
                        data = body(config, [*batch, working[0]])
                        if len(data) > BUDGETS['request_bytes']:
                            if batch:
                                break
                            working.pop(0)
                            result['diagnostics'].append({'code':'request_limit','message':'单问题上下文超过请求上限，未发送'})
                            continue
                        if result['request_bytes'] + len(data) > BUDGETS['total_request_bytes']:
                            break
                        batch.append(working.pop(0))
                    if not batch:
                        return None
                    data = body(config, batch)
                    result['request_bytes'] += len(data)
                    result['calls'] += 1
                    for candidate in batch:
                        identity = candidate['candidate_id']
                        transmissions[identity] = transmissions.get(identity,0) + 1
                    outstanding[id(batch)] = batch
                    return batch, data
                batches = [item for _ in range(2) if (item := next_batch())]
                if not batches:
                    if not working:
                        break
                    raise ProviderError('input_budget', '累计输入达到本次预算，可继续未完成项')
                waiting_since = max(0, time.monotonic() - job.started)
                progress('模型正在核对算法、用途与跨文件证据', [c for batch,_ in batches for c in batch], waiting_since)
                async with aclosing(completed_batches(service, config, batches, check, next_batch)) as responses:
                    async for batch, response in responses:
                        check()
                        outstanding.pop(id(batch),None)
                        if isinstance(response, BaseException):
                            if not isinstance(response, ProviderError):
                                raise ProviderError('provider_failure', '模型请求异常，静态结果已保留')
                            service.profiles.report(config,response.code)
                            if response.code in ('provider_auth','provider_balance','provider_parameters'):
                                raise response
                            result['diagnostics'].append({'code': response.code, 'message': response.message})
                            last_failure = response.code
                            if response.code in ('provider_timeout','provider_connection','provider_rate_limit','provider_server'):
                                retry = [c for c in batch if transmissions[c['candidate_id']] < 3]
                                if retry:
                                    delay = response.retry_after if response.retry_after is not None else (1 if max(transmissions[c['candidate_id']] for c in retry)==1 else 3)
                                    if delay >= end-time.monotonic():
                                        raise ProviderError('retry_after_deadline','服务要求的等待时间超过本次剩余预算，已保存完成部分')
                                    job.control.emit(recovery={'reason':response.code,'attempt':max(transmissions[c['candidate_id']] for c in retry),
                                        'retry_at_elapsed':time.monotonic()-job.started+delay})
                                    progress('请求暂未完成，等待后自动恢复',retry)
                                    until=time.monotonic()+delay
                                    while time.monotonic()<until:
                                        check()
                                        await asyncio.sleep(min(.1,until-time.monotonic()))
                                    recover(retry)
                                continue
                            if response.code in ('output_truncated','provider_format'):
                                recover(batch)
                                failures += bool(any(c.get('_recovery') for c in batch))
                            continue
                        content, values = response
                        job.control.emit(recovery=None)
                        service.profiles.report(config,'success')
                        usage.append(values)
                        opinions, notes = parse(content, batch)
                        result['diagnostics'].extend(notes)
                        failures = 0 if opinions else failures + bool(any(c.get('_recovery') for c in batch))
                        for note in notes:
                            if note.get('candidate_id'):
                                errors.setdefault(note['candidate_id'], []).append({k:note[k] for k in ('code','fields') if k in note})
                        for opinion in opinions:
                            candidate = next(c for c in batch if c['candidate_id'] == opinion['candidate_id'])
                            symbols = opinion.get('missing_symbols', [])
                            if symbols and opinion['candidate_id'] not in expanded and transmissions[opinion['candidate_id']] < 3:
                                expanded.add(opinion['candidate_id'])
                                additions = [e for symbol in symbols for e in candidate['expansions'][symbol]]
                                if additions:
                                    candidate = {**candidate, 'evidence': list({e['evidence_id']: e for e in [*candidate['evidence'], *additions]}.values())}
                                    pending.insert(0, candidate)
                                    continue
                            result['opinions'] = [o for o in result['opinions'] if o['candidate_id'] != opinion['candidate_id']]
                            opinion['model_origin']={'profile_id':config.profile_id,'profile_name':config.profile_name,'model':config.model,'provider':config.base_url,'config_version':config.version}
                            result['opinions'].append(opinion)
                            if candidate.get('_recovery'):
                                result['automatic_recovery']['completed'] += 1
                            minimal = {k: opinion[k] for k in ('candidate_id', 'algorithm', 'purpose', 'opinion_kind', 'rationale', 'missing_information', 'evidence_ids', 'missing_symbols','basis','blocking_gaps','decision')}
                            service.cache_opinion(job, digest([opinion['candidate_id'], config.version, PROMPT_VERSION, POLICY]), minimal)
                        returned = {o['candidate_id'] for o in opinions}
                        recover([c for c in batch if c['candidate_id'] not in returned])
                        await save(batch)
                        if outstanding:
                            progress('模型正在核对其余并行问题的证据', [c for group in outstanding.values() for c in group], waiting_since)
                if failures >= 3:
                    raise ProviderError('protocol_failures', '连续三次结构补救无有效输出，已保留完成部分')
            await save()
    except ProviderError as exc:
        result['stop_reason'] = exc.code
        result['diagnostics'].append({'code': exc.code, 'message': exc.message})
        if exc.code in ('cancelled','config_changed'):
            result['status'] = 'cancelled'
    coverage()
    result['coverage']['partial'] |= result['coverage']['remaining'] > 0
    completed_ids = {o['candidate_id'] for o in result['opinions']}
    exhausted = sum(n >= 3 and identity not in completed_ids for identity,n in transmissions.items())
    result['execution'] = {'completed': len(completed_ids), 'remaining': result['coverage']['remaining'],
                           'exhausted': exhausted, 'retryable': max(0, result['coverage']['remaining'] - exhausted),
                           'failure_counts': dict(__import__('collections').Counter(d['code'] for d in result['diagnostics']
                               if d['code'] not in prepared.get('diagnostics', [])))}
    if not result['coverage']['partial'] and result['status'] != 'cancelled':
        result['status'] = 'completed'
    elif result['coverage']['remaining'] and result['stop_reason'] is None:
        result['stop_reason'] = last_failure or 'unresolved_responses'
        message = '部分问题自动补救后仍缺少有效意见' if result['automatic_recovery']['scheduled'] else '部分问题缺少可发送证据或有效响应'
        result['diagnostics'].append({'code':'unresolved_responses','message':message+'；已保留完整部分'})
    result['opinions'].sort(key=lambda o: o['candidate_id'])
    from collections import Counter
    result['outcomes'] = dict(Counter(o.get('decision','insufficient') for o in result['opinions']))
    if len(usage) == result['calls'] and usage:
        result['usage'] = {k: sum(row[k] for row in usage) if all(row[k] is not None for row in usage) else None for k in usage[0]}
    result['runs']=[*(previous.get('runs') or ([{k:previous.get(k) for k in ('profile_id','profile_name','model','provider','config_version','protocol','calls','usage','request_bytes')}] if old else [])),{k:result.get(k) for k in ('profile_id','profile_name','model','provider','config_version','protocol','calls','usage','request_bytes')}]
    result['elapsed_seconds'] = round(time.monotonic() - started, 3)
    return {**base, 'ai_analysis': result}
