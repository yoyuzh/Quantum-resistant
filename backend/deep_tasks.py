"""Source reuse and server-owned export for deep background jobs."""
from __future__ import annotations

import json

from fastapi import HTTPException
from backend.deep_work import DEEP_BUDGETS, SourceUnavailable, empty_result, run_deep
from backend.task_store import TERMINAL
from deep_analysis.models import DeepAnalysisResult
from deep_analysis.identity import content_digest
from deep_analysis.snapshot import build_snapshot


def readable(path):
    return path is not None and getattr(path, 'path', path).is_file()


def submit_existing(store, source_id, request_id):
    payload = {'source_task_id': source_id, 'analysis_mode': 'deep'}
    replay = store.replay('deep-analysis', payload, request_id)
    if replay:
        return replay
    admission = store.reserve()
    folder = None
    try:
        with store.read_job(source_id) as source:
            if source.state not in TERMINAL or not source.result or source.kind == 'popular':
                raise HTTPException(409, '仅支持复用已结束且有结果的四类扫描来源')
            base = json.loads(source.result.read_text(encoding='utf-8'))
            paths = getattr(source.control, 'source_paths', {})
            if not any(readable(paths.get(s['source_id'])) for s in base.get('sources', [])):
                raise HTTPException(409, '来源源码已不可读取，无法启动深度分析')
            base.pop('deep_analysis', None)
            for record in base['sources']:
                record['content'], record['content_available'] = '', False
            base['deep_analysis'] = empty_result(base['source_type'], 'partial', 'deep_queued', DEEP_BUDGETS).model_dump(mode='json')
            folder = store.storage.folder()
            initial = store.storage.write_json(folder, base)
            if initial.stat().st_size > store.max_bytes:
                raise HTTPException(413, '基础结果超过共享结果容量')
        # Nothing pins the old source while the new job waits in the queue.
        return store.submit('deep-analysis', payload, request_id, lambda budget: existing_work(store, source_id, budget),
                            folder=folder, admission=admission, initial_result=initial)
    except BaseException:
        admission.release()
        if folder:
            store.storage.remove_folder(folder)
        raise


def existing_work(store, source_id, budget):
    base = budget.control.read_checkpoint()
    base.pop('deep_analysis', None)
    def prepare_sources(deadline, limits):
        # The lease begins only for actual snapshot reads, and is released before analysis.
        with store.read_job(source_id) as source:
            metadata = getattr(source.control, 'source_metadata', {})
            paths = getattr(source.control, 'source_paths', {})
            fidelity = getattr(source.control, 'path_fidelity', base['source_type'] in ('github_repository', 'pypi_package'))
            docs = []
            for record in base['sources']:
                identity = record['source_id']
                info = metadata.get(identity, {})
                name = info.get('relative_path', record['file_name'])
                path = paths.get(identity)
                # Lazy reads let build_snapshot enforce 200 files / 8 MiB before copying.
                class CopySource:
                    file_name = name
                    relative_path = name
                    source_id = identity
                    size_bytes = getattr(path, 'size', None)
                    expected_sha256 = info.get('sha256')
                    content_available = readable(path)

                    def __init__(self, path, identity, name):
                        self.path, self.identity, self.name = path, identity, name

                    @property
                    def content(self):
                        deadline.remaining()
                        text = self.path.read_text(encoding='utf-8')
                        if self.expected_sha256 is not None and content_digest(text) != self.expected_sha256:
                            raise SourceUnavailable()
                        new_path = store.storage.write_source(budget.control.folder, text.encode('utf-8'))
                        budget.control.source_paths[self.identity] = new_path
                        budget.control.source_metadata[self.identity] = {'relative_path': self.name, 'name': self.name, 'sha256': content_digest(text)}
                        return text
                docs.append(CopySource(path, identity, name))
            budget.control.source_paths = {}
            budget.control.source_metadata = {}
            budget.control.path_fidelity = fidelity
            snapshot = build_snapshot(docs, base['source_type'], relative_paths=fidelity,
                                      coverage=base.get('coverage'), budgets=limits, checkpoint=deadline.remaining)
            if not snapshot.logical.sources and any(d.code in ('source_unavailable', 'source_digest_mismatch') for d in snapshot.diagnostics):
                store.storage.discard_sources(budget.control.folder)
                budget.control.source_paths = {}
                budget.control.source_metadata = {}
                raise SourceUnavailable()
            return snapshot
    def prepare(deadline, limits):
        try:
            return prepare_sources(deadline, limits)
        except BaseException:
            store.storage.discard_sources(budget.control.folder)
            budget.control.source_paths = {}
            budget.control.source_metadata = {}
            raise
    return run_deep(base, budget, prepare)


def export_result(store, identity):
    with store.read_job(identity) as job:
        if job.state not in TERMINAL or not job.result:
            raise HTTPException(409, '任务尚未结束或没有可用结果')
        body = json.loads(job.result.read_text(encoding='utf-8'))
        if 'deep_analysis' not in body:
            raise HTTPException(409, '此任务没有深度分析结果')
        deep = DeepAnalysisResult.model_validate(body['deep_analysis'])
        paths = getattr(job.control, 'source_paths', {})
        # Redacted syntax snippets do not constitute complete replay input.
        current = {}
        for source in deep.snapshot.sources:
            path = paths.get(source.source_id)
            try:
                current[source.source_id] = ('available' if readable(path) and content_digest(path.read_text(encoding='utf-8')) == source.sha256
                                             else 'requires_revalidation' if readable(path) else 'unavailable')
            except (OSError, UnicodeError):
                current[source.source_id] = 'unavailable'
        evidence = []
        for path in deep.evidence_paths:
            states = {current.get(node.location.source_id, 'unavailable') for node in path.nodes}
            status = 'unavailable' if 'unavailable' in states else 'requires_revalidation' if 'requires_revalidation' in states else path.replay_status
            evidence.append(path.model_copy(update={'replay_status': status}))
        deep = deep.model_copy(update={'evidence_paths': tuple(evidence)})
        allowed = {'schema_version', 'status', 'snapshot', 'operations', 'evidence_paths', 'coverage', 'diagnostics', 'budgets', 'versions'}
        return deep.model_dump(mode='json', include=allowed)
