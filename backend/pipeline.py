"""Bounded producer/consumer analysis shared by remote and local scans."""
from __future__ import annotations

from collections import Counter
from queue import Empty, Queue
from threading import BoundedSemaphore, Condition, Thread

from backend.collection_common import CollectionTimeout
from backend.temp_storage import StoredDocument
from scan_quantum_vuln import analyze_source, make_source_id

ANALYSIS_SLOTS = BoundedSemaphore(2)


def closed_publish(document):
    raise CollectionTimeout('采集已结束')


class ScanPipeline:
    def __init__(self, budget, source_type, *, analyzer=None, namespace=None):
        self.budget, self.source_type = budget, source_type
        self.analyzer = analyzer or analyze_source
        self.namespace = namespace or budget.control.scope
        self.queue = Queue(maxsize=16)
        self.condition = Condition()
        self.queued_bytes = 0
        self.closed = False
        self.records = []
        self.findings = []
        self.diagnostics = []
        self.skip_reasons = Counter()
        self.sequence = 0
        self.documents = []
        self.published_ids = set()
        self.published_objects = set()
        budget.control.publisher = self.publish
        budget.control.pipeline = self
        self.thread = Thread(target=self.consume, name="scan-analysis", daemon=True)
        self.thread.start()

    def publish(self, document):
        self.budget.remaining()
        if isinstance(document, StoredDocument) and document.source_id in self.published_ids:
            return document
        if id(document) in self.published_objects:
            return document
        origin, name, content = document if len(document) == 3 else (None, *document)
        data = content.encode('utf-8')
        with self.condition:
            while self.queued_bytes + len(data) > 8 * 1024 * 1024 or self.queue.full():
                self.budget.remaining()
                self.condition.wait(.1)
            if self.closed:
                raise CollectionTimeout("采集已结束")
            prefix = f'{self.namespace}:' if self.namespace else ''
            source_id = make_source_id(f"{prefix}{self.sequence}:{name}", content)
            control = self.budget.control
            stored = document
            if isinstance(document, StoredDocument):
                source_id = document.source_id
            elif control.storage:
                path = control.storage.write_source(control.folder, data)
                stored = StoredDocument(origin, name, path, source_id)
            self.documents.append(stored)
            self.published_ids.add(source_id)
            if not control.storage:
                self.published_objects.add(id(document))
            self.sequence += 1
            self.queued_bytes += len(data)
            self.queue.put_nowait((stored, source_id, len(data)))
            self.condition.notify_all()
        return stored

    def consume(self):
        while True:
            try:
                document, identity, size = self.queue.get(timeout=.1)
            except Empty:
                if self.closed:
                    return
                continue
            with self.condition:
                self.queued_bytes -= size
                self.condition.notify_all()
            acquired = False
            try:
                self.budget.remaining()
                while not acquired:
                    acquired = ANALYSIS_SLOTS.acquire(timeout=.1)
                    self.budget.remaining()
                origin, name, content = document if len(document) == 3 else (None, *document)
                findings, notes = self.analyzer(content, name, self.source_type, identity, include_metadata=True)
                findings = [dict(item, source_id=identity, file_name=name, source_type=self.source_type,
                                 risk_level=item.get('risk_level', '高风险'), reason=item.get('reason', ''),
                                 recommendation=item.get('recommendation', ''), evidence=item.get('evidence', '')) for item in findings]
                record = dict(source_id=identity, file_name=name, source_type=self.source_type,
                              content='' if isinstance(document, StoredDocument) else content,
                              line_count=len(content.splitlines()), char_count=len(content), origin=origin)
                if isinstance(document, StoredDocument):
                    record['content_available'] = True
                    paths = getattr(self.budget.control, 'source_paths', None)
                    if paths is None:
                        paths = self.budget.control.source_paths = {}
                    paths[identity] = document.path
                self.records.append(record)
                self.findings.extend(findings)
                self.diagnostics.extend(notes)
                self.budget.control.emit(analyzed_delta=1)
            except CollectionTimeout:
                reason = 'cancelled' if self.budget.control.cancelled.is_set() else 'timeout'
                self.skip_reasons[reason] += 1
            except Exception as exc:
                self.skip_reasons['analysis_failure'] += 1
                self.diagnostics.append(dict(code='analysis_failure', source_id=identity,
                                             message=f"文件分析失败，已跳过该文件（{type(exc).__name__}）"))
            finally:
                if acquired:
                    ANALYSIS_SLOTS.release()
                self.queue.task_done()

    def finish(self):
        with self.condition:
            self.closed = True
            self.condition.notify_all()
        self.thread.join()
        self.budget.control.emit(analysis_total=len(self.documents), totals_final=True)
        if getattr(self.budget.control, 'pipeline', None) is self:
            self.budget.control.pipeline = None
            self.budget.control.publisher = closed_publish
        return self
