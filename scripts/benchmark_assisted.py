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


def run():
    store = TaskStore()
    folder = store.storage.folder()
    count, total = 5000, 100 * 1024 * 1024
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
            return local_work(documents, 'manual_upload', budget)
        task = store.submit('files', {'_cross_file': True, 'ai_assisted': False, 'file_count': count}, 'offline-scale-acceptance', work, folder=folder)
        store.jobs[task['id']].future.result(timeout=600)
        result = store.result(task['id'], include_content=False)
        deep = result['deep_analysis']
        report = {'files': count, 'text_bytes': total, 'elapsed_seconds': round(time.monotonic() - before, 3),
                  'peak_rss_bytes': peak_rss(), 'temporary_bytes': store.storage.bytes,
                  'source_count': result['summary']['source_count'], 'findings': result['summary']['finding_count'],
                  'deep_status': deep['status'], 'parsed_files': deep.get('coverage', {}).get('parsed', {}).get('count'),
                  'ast_cache': deep.get('cache'), 'model_calls': 0,
                  'scope': 'synthetic text corpus; not a real-repository precision/recall benchmark'}
        assert report['source_count'] == count and report['parsed_files'] == count, report
        assert report['ast_cache']['peak_ast_files'] <= 2, report
        assert report['deep_status'] == 'completed', report
        target = ROOT / 'tmp' / 'assisted-validation'
        target.mkdir(parents=True, exist_ok=True)
        (target / 'scale.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
        print(json.dumps(report, ensure_ascii=False))
    finally:
        store.close()


if __name__ == '__main__':
    run()
