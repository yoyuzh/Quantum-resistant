"""Offline 5000-file/100MiB acceptance; creates text, never executes it."""
from __future__ import annotations

import json
from pathlib import Path
import sys
import time

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from backend.task_store import TaskStore
from backend.task_execution import local_work
from backend.temp_storage import StoredDocument


def peak_rss():
    if sys.platform == 'win32':
        import ctypes
        from ctypes import wintypes
        class Counters(ctypes.Structure):
            _fields_ = [('cb', wintypes.DWORD), ('faults', wintypes.DWORD)] + [(n, ctypes.c_size_t) for n in
                ('peak', 'working', 'paged_peak', 'paged', 'nonpaged_peak', 'nonpaged', 'pagefile', 'peak_pagefile')]
        value = Counters()
        value.cb = ctypes.sizeof(value)
        ctypes.windll.psapi.GetProcessMemoryInfo(ctypes.c_void_p(-1), ctypes.byref(value), value.cb)
        return value.peak
    import resource
    return resource.getrusage(resource.RUSAGE_SELF).ru_maxrss * (1 if sys.platform == 'darwin' else 1024)


def run(count=5000, total=100 * 1024 * 1024, output=None, cancel_deep=False):
    store = TaskStore()
    folder = store.storage.folder()
    documents = []
    before = time.monotonic()
    try:
        for index in range(count):
            size = total // count + (index < total % count)
            prefix = 'import jwt\njwt.encode({},key,algorithm="RS256")\n' if index < 25 else ''
            text = prefix + '#' + 'x' * (size - len(prefix) - 2) + '\n'
            path = store.storage.write_source(folder, text.encode())
            documents.append(StoredDocument(None, f'module_{index:04d}.py', path, f'benchmark-{index}'))
        def work(budget):
            budget.control.path_fidelity = True
            if cancel_deep:
                report = budget.control.report
                def cancel_on_proof(**values):
                    if report:
                        report(**values)
                    if values.get('activity', {}).get('action') == '核验参数传播、算法与调用用途':
                        budget.control.cancel_requested_at = time.monotonic()
                        budget.control.request_cancel()
                budget.control.report = cancel_on_proof
            return local_work(documents, 'manual_upload', budget)
        task = store.submit('files', {'_cross_file': True, 'ai_assisted': False, 'file_count': count}, 'offline-scale-acceptance', work, folder=folder)
        store.jobs[task['id']].future.result(timeout=600)
        result = store.result(task['id'], include_content=False)
        deep = result['deep_analysis']
        report = {'files': count, 'text_bytes': total, 'elapsed_seconds': round(time.monotonic() - before, 3),
                  'peak_rss_bytes': peak_rss(), 'temporary_bytes': store.storage.bytes,
                  'source_count': result['summary']['source_count'], 'findings': result['summary']['finding_count'],
                  'deep_status': deep['status'], 'parsed_files': deep.get('coverage', {}).get('parsed', {}).get('count'),
                  'deep_coverage': deep.get('coverage'), 'retrieval_index': deep.get('retrieval_index'),
                  'engine_identity': deep.get('engine_identity'), 'model_calls': 0,
                  'scope': 'synthetic text corpus; not a real-repository precision/recall benchmark'}
        assert report['source_count'] == count, report
        assert deep['coverage']['selected']['count'] <= 200, report
        assert sum(s['size_bytes'] for s in deep['snapshot']['sources']) <= 8 * 1024 * 1024, report
        if cancel_deep:
            report['cancel_response_seconds'] = time.monotonic() - store.jobs[task['id']].control.cancel_requested_at
            report['retained_operations'] = len(deep['operations'])
            assert report['deep_status'] == 'cancelled' and report['retained_operations'] >= 1, report
        else:
            assert report['retrieval_index']['max_ast_files'] == 1, report
            if count > 200 or total > 8 * 1024 * 1024:
                assert report['deep_status'] == 'partial', report
        target = Path(output).parent if output else ROOT / 'tmp' / 'assisted-validation'
        target.mkdir(parents=True, exist_ok=True)
        (Path(output) if output else target / 'scale.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
        print(json.dumps(report, ensure_ascii=False))
    finally:
        store.close()


if __name__ == '__main__':
    run()
