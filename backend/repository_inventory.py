"""Compact counts and representative repository-relative locations for batch results."""
from __future__ import annotations

from backend.migration_directions import effective_purpose
from backend.archives import safe_archive_member_name


def algorithm_inventory(findings: list[dict], *, deep_status: str | None = None,
                        ai_status: str | None = None) -> dict:
    groups: dict[tuple[str, ...], dict] = {}
    stages = {'confirmed': 'completed'}
    if deep_status and deep_status != 'skipped':
        stages['confirmed'] = 'partial' if deep_status in {'failed', 'cancelled'} else deep_status
        stages['pending'] = deep_status
    if ai_status and ai_status != 'skipped':
        stages['ai_assessed'] = ai_status
    for row in findings:
        algorithm = row['algorithm']
        status = row.get('verification_status', 'confirmed')
        purpose = effective_purpose(row)
        origin = row.get('purpose_origin', 'unknown')
        key = (algorithm, purpose, origin, status)
        if key not in groups:
            groups[key] = dict(algorithm=algorithm, purpose=purpose, origin=origin,
                               status=status, count=0, example=None)
        group = groups[key]
        group['count'] += 1
        path = safe_archive_member_name(row['file_name'])
        if not path or not path.isprintable() or row['line'] < 1:
            continue
        position = (path, row['line'], row['source_id'], row.get('finding_id', ''))
        previous = group['example']
        if previous is None or position < tuple(previous[k] for k in ('path', 'line', 'source_id', 'finding_id')):
            group['example'] = dict(zip(('path', 'line', 'source_id', 'finding_id'), position))
    return {'basis': 'integrated' if deep_status else 'base', 'stages': stages,
            'groups': [groups[key] for key in sorted(groups)]}
