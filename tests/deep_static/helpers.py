from __future__ import annotations

from backend.models import SourceRecord
from deep_analysis.snapshot import build_snapshot


def records(files, source_type='github_repository'):
    return [SourceRecord(source_id=f'source-{i}', file_name=p, source_type=source_type, content=t,
                         line_count=len(t.splitlines()), char_count=len(t)) for i, (p, t) in enumerate(files.items())]


def snapshot(files, **kwargs):
    return build_snapshot(records(files), 'github_repository', **kwargs)
