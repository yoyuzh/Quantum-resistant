from __future__ import annotations

import threading
import asyncio
import unittest
from concurrent.futures import ThreadPoolExecutor
from unittest.mock import patch

from fastapi import HTTPException
from fastapi.testclient import TestClient
from backend import task_routes
from backend.main import app
from backend.task_store import TaskStore
from backend.temp_storage import TemporaryStorage
from starlette.requests import ClientDisconnect


class FaultyWriter:
    def __init__(self, stream, *, rollback_fails=False):
        self.stream = stream
        self.fail = True
        self.rollback_fails = rollback_fails

    def __getattr__(self, name):
        return getattr(self.stream, name)

    def write(self, data):
        if self.fail:
            self.fail = False
            return self.stream.write(data[:2])
        return self.stream.write(data)

    def truncate(self, size):
        if self.rollback_fails:
            raise OSError('fixture rollback failure')
        return self.stream.truncate(size)


class StorageTransactionTests(unittest.TestCase):
    def setUp(self):
        self.storage = TemporaryStorage(max_bytes=100)
        self.addCleanup(self.storage.close)
        self.folder = self.storage.folder()

    def test_short_write_rolls_back_offsets_bytes_and_previous_content(self):
        first = self.storage.write_source(self.folder, b'old')
        path, stream = self.storage.source_streams[self.folder]
        self.storage.source_streams[self.folder] = path, FaultyWriter(stream)
        with self.assertRaises(OSError):
            self.storage.write_source(self.folder, b'broken')
        self.assertEqual(first.read_text(), 'old')
        self.assertEqual(path.stat().st_size, 3)
        self.assertEqual(self.storage.bytes, 3)
        second = self.storage.write_source(self.folder, b'new')
        self.assertEqual(second.offset, 3)
        self.assertEqual(second.read_text(), 'new')
        self.assertEqual(self.storage.bytes, 6)

    def test_failed_rollback_charges_residue_and_disables_reuse(self):
        self.storage.write_source(self.folder, b'old')
        path, stream = self.storage.source_streams[self.folder]
        self.storage.source_streams[self.folder] = path, FaultyWriter(stream, rollback_fails=True)
        with self.assertRaises(OSError):
            self.storage.write_source(self.folder, b'broken')
        self.assertGreaterEqual(self.storage.bytes, path.stat().st_size)
        with self.assertRaises(OSError):
            self.storage.write_source(self.folder, b'next')
        self.storage.remove_folder(self.folder)
        self.assertEqual(self.storage.bytes, 0)


class SchedulerBoundaryTests(unittest.TestCase):
    def setUp(self):
        self.store = TaskStore(workers=1, queue=1)
        self.addCleanup(self.store.close)

    def test_sync_background_and_ingestion_share_capacity(self):
        entered, release = threading.Event(), threading.Event()
        self.addCleanup(release.set)
        def work():
            entered.set()
            release.wait(2)
            return 'ok'
        with ThreadPoolExecutor(max_workers=1) as caller:
            future = caller.submit(self.store.run_sync, work)
            self.assertTrue(entered.wait(1))
            waiting = self.store.submit('snippet', {}, 'waiting', lambda budget: {'sources': []})
            self.assertEqual(waiting['state'], 'queued')
            with self.assertRaises(HTTPException) as error:
                self.store.reserve()
            self.assertEqual(error.exception.status_code, 429)
            self.store.cancel(waiting['id'])
            ticket = self.store.reserve()
            ticket.release()
            release.set()
            self.assertEqual(future.result(2), 'ok')
        self.assertEqual(self.store.scheduler.used, 0)

    def test_upload_rejected_before_body_or_disk_and_failed_upload_releases(self):
        first, second = self.store.reserve(), self.store.reserve()
        try:
            with patch.object(task_routes, 'store', self.store), patch('backend.task_routes.read_upload') as read:
                response = TestClient(app).post('/api/tasks/files', files={'files': ('a.py', b'x=1')},
                                                headers={'X-Request-ID': 'security-upload-0001'})
                self.assertEqual(response.status_code, 429)
                read.assert_not_called()
        finally:
            first.release()
            second.release()
        with patch.object(task_routes, 'store', self.store):
            response = TestClient(app).post('/api/tasks/files', content=b'incomplete',
                                           headers={'X-Request-ID': 'security-upload-0001',
                                                    'Content-Type': 'multipart/form-data; boundary=fixture'})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(self.store.scheduler.used, 0)
        self.assertEqual(list(self.store.storage.root.glob('*')), [self.store.storage.root / '.lease'])

    def test_executor_submission_failure_cleans_folder_and_reservation(self):
        ticket = self.store.reserve()
        folder = self.store.storage.folder()
        self.store.storage.write_source(folder, b'fixture')
        lock = threading.Lock()
        with patch.object(self.store.executor, 'submit', side_effect=RuntimeError('closed')):
            with self.assertRaises(HTTPException) as error:
                self.store.submit('files', {}, 'failed', lambda budget: {}, lock, folder=folder, admission=ticket)
        self.assertEqual(error.exception.status_code, 503)
        self.assertFalse(folder.exists())
        self.assertEqual(self.store.storage.bytes, 0)
        self.assertEqual(self.store.scheduler.used, 0)
        self.assertTrue(lock.acquire(blocking=False))
        lock.release()

    def test_disconnected_upload_removes_completed_spool_and_releases_capacity(self):
        class Request:
            headers = {'content-type': 'multipart/form-data; boundary=fixture'}

            async def stream(self):
                yield (b'--fixture\r\nContent-Disposition: form-data; name="files"; filename="a.py"\r\n'
                       b'\r\nx=1\r\n--fixture\r\n')
                raise ClientDisconnect()

        with patch.object(task_routes, 'store', self.store):
            with self.assertRaises(ClientDisconnect):
                asyncio.run(task_routes.files(Request(), 'disconnected-upload'))
        self.assertEqual(self.store.scheduler.used, 0)
        self.assertEqual(self.store.storage.bytes, 0)
        self.assertEqual(list(self.store.storage.root.glob('*')), [self.store.storage.root / '.lease'])

    def test_shutdown_keeps_ingestion_storage_until_reservation_released(self):
        ticket = self.store.reserve()
        folder = self.store.storage.folder()
        self.store.close()
        self.assertTrue(folder.exists())
        self.store.storage.remove_folder(folder)
        ticket.release()
        self.assertFalse(self.store.storage.root.exists())

    def test_shutdown_waits_for_result_reader(self):
        original = self.store.submit('files', {}, 'read', lambda budget: {'sources': []})
        self.store.jobs[original['id']].future.result(2)
        with self.store.read_job(original['id']):
            self.store.close()
            self.assertTrue(self.store.storage.root.exists())
        self.assertFalse(self.store.storage.root.exists())

    def test_duplicate_submission_removes_new_folder_atomically(self):
        original = self.store.submit('files', {'digest': 'same'}, 'repeat', lambda budget: {'sources': []})
        self.store.jobs[original['id']].future.result(2)
        ticket = self.store.reserve()
        folder = self.store.storage.folder()
        self.store.storage.write_source(folder, b'duplicate')
        repeated = self.store.submit('files', {'digest': 'same'}, 'repeat', lambda budget: self.fail('duplicate'),
                                     folder=folder, admission=ticket)
        self.assertEqual(repeated['id'], original['id'])
        self.assertFalse(folder.exists())
        self.assertEqual(self.store.scheduler.used, 0)
