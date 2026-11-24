"""Independent repository snapshots; one shared AI round for the whole batch."""
from __future__ import annotations

import json
from collections import deque, OrderedDict
from fastapi import HTTPException
from backend.ai.config import BUDGETS, digest
from backend.ai.context import catalog, packets
from backend.integration import integrate
from backend.repository_inventory import algorithm_inventory
from backend.repository_library import batch_records, library_save_outcome


def repository_analysis_summary(base):
    deep = base['deep_analysis']
    integrated = base['integrated_analysis']
    coverage = deep.get('coverage', {})
    gaps = set(coverage.get('gaps', ()))
    gaps.update(item['code'] for item in deep.get('diagnostics', ())
                if item['code'] in {'deep_failure', 'deep_interrupted', 'evidence_slice_limit',
                                    'evidence_structure_limit', 'operation_limit', 'replay_limit'})
    return {**integrated['changes'], 'deep_status': deep['status'], 'deep_work_completed': deep.get('work_completed'),
            'deep_python': coverage.get('parsed'), 'deep_gaps': sorted(gaps),
            'migration_score': integrated['summary']['migration_score']['score']}


def keep_snapshot(repo, base, budget):
    from backend.deep_scanning import run_deep
    child, parent = budget.control, budget.control.parent
    base = run_deep(base, budget)
    base['integrated_analysis'] = integrate(base)
    identity = digest(repo.full_name)[:24]
    path = child.storage.write_json(child.folder, base)
    with parent.lock:
        if not hasattr(parent, 'popular_snapshots'):
            parent.popular_snapshots = {}
            parent.source_paths = {}
        parent.popular_snapshots[identity] = {'path':path, 'control':child, 'name':repo.full_name}
        parent.source_paths.update(getattr(child, 'source_paths', {}))
    return identity, repository_analysis_summary(base), algorithm_inventory(
        base['integrated_analysis']['findings'], deep_status=base['deep_analysis']['status'])


def fair_allocations(counts: dict[str,int], limit: int) -> dict[str,int]:
    allocation={key:0 for key in counts}
    active=[key for key,count in counts.items() if count>0]
    while active and limit>0:
        share=max(1,limit//len(active))
        for key in active:
            added=min(share,counts[key]-allocation[key],limit)
            allocation[key]+=added;limit-=added
        active=[key for key in active if allocation[key]<counts[key]]
    return allocation


def prepare(service, job, budget):
    queues, snapshots, count, byte_count, partial, total = [], [], 0, 0, False, 0
    for identity, record in getattr(job.control, 'popular_snapshots', {}).items():
        budget.remaining()
        base = json.loads(record['path'].read_text(encoding='utf-8'))
        value = catalog(base, record['control'], budget.remaining)
        for candidate in value['candidates']:
            candidate['candidate_id'] = digest([identity,candidate['candidate_id']])[:32]
        if any(job.payload.get(kind) for kind in ('library_discovery', 'library_refresh', 'library_recheck')):
            unknown = [row for row in base['integrated_analysis']['findings']
                       if row['verification_status'] == 'confirmed' and row['effective_purpose_code'] == 'unknown'
                       and row['detection_method'] != 'pem_header']
            unclassified = {row['finding_id'] for row in unknown}
            references = {digest(row) for row in base['findings'] if 'rule-' + digest(row)[:24] in unclassified}
            references.update(identity for row in unknown for identity in row['operation_ids'])
            value['candidates'] = [c for c in value['candidates'] if references.intersection(c['refs'])]
        else:
            # Fully proven operations use local explanations, including definitions.
            local = {(o['sink_location']['source_id'],o['sink_location']['start_line'])
                     for o in base.get('deep_analysis',{}).get('operations',[])
                     if all(c['level']=='E3' for c in o['claims'][:2])}
            value['candidates'] = [c for c in value['candidates'] if (c['source_id'],c['line']) not in local or 'unresolved' in c['lanes']]
        record['catalogue'] = job.control.storage.write_json(job.folder,value)
        record['candidate_count']=len(value['candidates'])
        record['source_ids']={s['source_id'] for s in base['sources']}
        snapshots.append([identity,value['snapshot']])
        count+=value['searched_files']; byte_count+=value['searched_bytes']; total+=len(value['candidates'])
        partial |= value['partial']
    records=getattr(job.control,'popular_snapshots',{})
    allocation=fair_allocations({identity:r['candidate_count'] for identity,r in records.items()},20000)
    for identity,record in records.items():
        budget.remaining()
        if not allocation[identity]:
            continue
        value=json.loads(record['catalogue'].read_text(encoding='utf-8'))
        queues.append(deque({**c,'_repository_id':identity,'repository':record['name']} for c in value['candidates'][:allocation[identity]]))
    selected=[]
    while any(queues) and len(selected)<20000:
        for queue in queues:
            if queue and len(selected)<20000:
                selected.append(queue.popleft())
    partial |= len(selected)<total
    catalogue={'candidates':selected,'snapshot':digest(snapshots)}
    return {'catalogue':catalogue,'descriptors':selected[:BUDGETS['groups']], 'snapshot':catalogue['snapshot'],
            'total':total,'searched_files':count,'searched_bytes':byte_count,'partial':partial,
            'diagnostics':['batch_candidate_limit'] if len(selected)<total else []}


def materialize(job, selected, check):
    output=[];cache=OrderedDict()
    for candidate in selected:
        if 'evidence' in candidate:
            output.append(candidate)
            continue
        record=job.control.popular_snapshots[candidate['_repository_id']]
        identity=candidate['_repository_id']
        if identity not in cache:
            while len(cache)>=2:
                cache.popitem(last=False)
            cache[identity]=json.loads(record['catalogue'].read_text(encoding='utf-8'))
        cache.move_to_end(identity)
        catalogue=cache[identity]
        values=packets(catalogue,[candidate],record['control'].source_paths,check)
        for value in values:
            def namespaced(e):
                return {**e,'evidence_id':digest([candidate['_repository_id'],e['evidence_id']])[:24]}
            value['evidence']=[namespaced(e) for e in value['evidence']]
            value['expansions']={name:[namespaced(e) for e in evidence] for name,evidence in value['expansions'].items()}
        output.extend(values)
    return output


def project(store, job, value):
    result={**value,'repos':[dict(r) for r in value.get('repos',[])]}
    ai=value.get('ai_analysis')
    for repo in result['repos']:
        record=getattr(job.control,'popular_snapshots',{}).get(repo.get('repository_id'))
        if not record:
            continue
        previous=json.loads(record['path'].read_text(encoding='utf-8'))
        if ai:
            total=record.get('candidate_count',0)
            opinions=[o for o in ai['opinions'] if o.get('candidate_location',{}).get('source_id') in record.get('source_ids',set())]
            marker=digest([opinions,ai['status'],ai.get('stop_reason')])
            if record.get('ai_marker')!=marker:
                metadata={k:v for k,v in ai.items() if k not in ('opinions','coverage')}
                previous={**previous,'ai_analysis':{**metadata,'opinions':opinions,'shared_budget':True,
                    'status':'completed' if ai['status'] != 'skipped' and len(opinions)==total else ai['status'],
                    'coverage':{'discovered':total,'completed':len(opinions),'remaining':max(0,total-len(opinions))}}}
                previous['integrated_analysis']=integrate(previous)
                path=store.storage.write_json(job.folder,previous)
                with store.lock:
                    old=record['path']; record.update(path=path,ai_marker=marker)
                    store.storage.remove(old)
        repo['algorithm_inventory'] = algorithm_inventory(previous['integrated_analysis']['findings'],
            deep_status=previous['deep_analysis']['status'], ai_status=previous.get('ai_analysis', {}).get('status'))
        repo['analysis_summary'] = repository_analysis_summary(previous)
    return result


def commit(store,job,value):
    result=project(store,job,value)
    callback=getattr(job.control,'popular_commit',None)
    incomplete=bool(result.get('meta',{}).get('incomplete') or job.control.cancelled.is_set()
                    or result.get('ai_analysis',{}).get('status') in ('partial','failed','cancelled')
                    or any(r.get('analysis_summary',{}).get('deep_status') in ('partial','failed','cancelled') for r in result.get('repos',[])))
    if incomplete:
        result['meta']={**result.get('meta',{}),'incomplete':True,'saved_snapshot':False}
    library_commit = getattr(job.control, 'library_commit', None)
    if library_commit:
        records = batch_records(result)
        if records and job.control.begin_commit():
            job.control.emit(stage='保存仓库资料库')
            try:
                library = library_commit(records, protect_complete=True)
            except HTTPException as exc:
                result['meta'].update(save_error=exc.detail, incomplete=True)
            else:
                result['meta'].update(library_save_outcome(library, records), library_saved=True)
    if callback and not incomplete and job.control.begin_commit():
        from backend.popular import BatchResult
        result['meta']={**result.get('meta',{}),'saved_snapshot':True}
        try:
            callback[0](BatchResult(result['scanned_at'],result['repos'],result['meta'],result.get('failures',[])),callback[1])
        except OSError:
            result['meta'].update(saved_snapshot=False,incomplete=True,save_error='榜单保存失败，本次可用结果已保留')
    return result
