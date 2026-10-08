from __future__ import annotations

import json
import subprocess
import sys
import unittest


class ScannerResourceTests(unittest.TestCase):
    def child(self, source: str) -> dict:
        result = subprocess.run([sys.executable, '-B', '-c', source], capture_output=True,
                                text=True, timeout=8)
        self.assertEqual(result.returncode, 0, result.stderr)
        return json.loads(result.stdout)

    def test_long_python_statement_falls_back_without_native_crash(self):
        result = self.child("""
import json
from scan_quantum_vuln import analyze_source
findings, notes = analyze_source('a.' * 300000 + 'a', 'chain.py')
print(json.dumps({'findings': findings, 'codes': [n['code'] for n in notes]}))
""")
        self.assertEqual(result['findings'], [])
        self.assertIn('syntax_fallback', result['codes'])

    def test_real_analyzer_budget_and_slot_release(self):
        result = self.child('''
import json,time,threading
from backend.collection_common import Deadline
from backend.task_execution import local_work
from backend.pipeline import ANALYSIS_SLOTS
start=time.perf_counter()
result=local_work([('probe.txt','a.'*1000000+'a')], 'snippet', Deadline.after(.05))
elapsed=time.perf_counter()-start
acquired=[]
try:
    for _ in range(2): acquired.append(ANALYSIS_SLOTS.acquire(blocking=False))
finally:
    for value in acquired:
        if value: ANALYSIS_SLOTS.release()
print(json.dumps({'elapsed':elapsed,'sources':len(result['sources']),
    'coverage':result['coverage'],'notes':result['diagnostics'],'slots':acquired,
    'threads':[t.name for t in threading.enumerate() if t.name=='scan-analysis']}))
''')
        self.assertLess(result['elapsed'], 2)
        self.assertEqual(result['sources'], 0)
        self.assertEqual(result['threads'], [])
        self.assertEqual(result['slots'], [True, True])
        self.assertTrue(result['coverage']['partial'])
        self.assertEqual(result['coverage']['skip_reasons']['timeout'], 1)
        self.assertIn('analysis_interrupted', [note['code'] for note in result['notes']])

    def test_cancel_partial_results_terminal_freeze_and_storage_release(self):
        result = self.child('''
import json,threading,time
from unittest.mock import patch
from scanner.control import checkpoint as real_checkpoint
from backend.collection_common import Deadline
from backend.pipeline import ScanPipeline,ANALYSIS_SLOTS
from backend.task_store import TaskStore
from backend.task_execution import local_work
armed,entered,release=threading.Event(),threading.Event(),threading.Event()
pipelines=[]
def checkpoint():
    if armed.is_set() and not entered.is_set():
        entered.set()
        if not release.wait(2): raise RuntimeError('test gate not released')
    real_checkpoint()
def work(budget):
    original=budget.control.emit
    def emit(**values):
        original(**values)
        if values.get('analyzed_delta'): armed.set()
    budget.control.emit=emit
    return local_work([('same.py','from Crypto.PublicKey import RSA\\nRSA.import_key(data)'),
                       ('same.py','a.'*300000+'a'),('last.py','pass')], 'manual_upload',budget)
store=TaskStore()
root=store.storage.root
try:
    with patch('scanner.text_analysis.checkpoint',checkpoint):
        job=store.submit('files',{},'repair-cancel',work)
        if not entered.wait(3): raise RuntimeError('analyzer did not enter')
        pipeline=store.jobs[job['id']].control.pipeline
        store.cancel(job['id'])
        release.set()
        end=time.monotonic()+3
        while store.get(job['id'])['state'] not in {'partial','cancelled','failed','succeeded'}:
            if time.monotonic()>end: raise RuntimeError('terminal timeout')
            time.sleep(.01)
        status=store.get(job['id'])
        data=store.result(job['id'])
        paths=store.jobs[job['id']].control.source_paths
        source=store.source(job['id'], data['sources'][0]['source_id'])
        before=(status['state'],status['analyzed_files'],len(data['findings']))
        store.jobs[job['id']].control.emit(analyzed_delta=99)
        after=store.get(job['id'])
        slots=[]
        try:
            for _ in range(2): slots.append(ANALYSIS_SLOTS.acquire(blocking=False))
        finally:
            for value in slots:
                if value: ANALYSIS_SLOTS.release()
        print_data={'before':before,'after':[after['state'],after['analyzed_files'],len(store.result(job['id'])['findings'])],
            'threads':pipeline.thread.is_alive(),'queued_bytes':pipeline.queued_bytes,
            'pending':pipeline.queue.unfinished_tasks,'paths':len(paths),'source':source,
            'coverage':data['coverage'],'slots':slots,'pipeline_cleared':pipeline.budget.control.pipeline is None}
finally:
    release.set()
    store.close()
print_data['storage_removed']=not root.exists()
print(json.dumps(print_data))
''')
        self.assertEqual(result['before'], result['after'])
        self.assertEqual(result['before'], ['partial', 1, 1])
        self.assertFalse(result['threads'])
        self.assertEqual(result['queued_bytes'], 0)
        self.assertEqual(result['pending'], 0)
        self.assertEqual(result['paths'], 1)
        self.assertTrue(result['pipeline_cleared'])
        self.assertTrue(result['storage_removed'])
        self.assertEqual(result['slots'], [True, True])
        self.assertTrue(result['coverage']['partial'])


if __name__ == '__main__':
    unittest.main()
