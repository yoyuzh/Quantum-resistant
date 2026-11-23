"""Portable, local repository inventory. Seed data is read-only."""
from __future__ import annotations

import json
from collections import Counter
from pathlib import Path
from threading import Lock
from typing import Annotated, Literal

from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from pydantic import AwareDatetime, BaseModel, ConfigDict, Field, field_validator, model_validator

from backend.archives import safe_archive_member_name
from backend.collectors import validate_github_repository_url
from backend.storage import write_json

router = APIRouter(prefix='/api/repository-library')
LOCK = Lock()
MAX_LIBRARY_BYTES = 16 * 1024 * 1024
MAX_LIBRARY_REPOS = 5000
Count = Annotated[int, Field(strict=True, ge=0, le=2**31-1)]
Short = Annotated[str, Field(min_length=1, max_length=160)]
Status = Literal['confirmed', 'ai_assessed', 'pending']


def repository_name(value: str) -> str:
    value = value.strip()
    if '://' not in value:
        value = 'https://github.com/' + value
    return validate_github_repository_url(value).removeprefix('https://github.com/')


class Record(BaseModel):
    model_config = ConfigDict(extra='forbid')


class Example(Record):
    path: Annotated[str, Field(min_length=1, max_length=4096)]
    line: Annotated[int, Field(strict=True, gt=0, le=2**31-1)]
    source_id: Short
    finding_id: Annotated[str, Field(max_length=160)] = ''

    @field_validator('path')
    @classmethod
    def relative_path(cls, value: str) -> str:
        if safe_archive_member_name(value) != value or not value.isprintable():
            raise ValueError('证据位置须为仓库相对路径')
        return value


class InventoryGroup(Record):
    algorithm: Short
    purpose: Short
    origin: Literal['unknown', 'static', 'ai']
    status: Status
    count: Annotated[int, Field(strict=True, gt=0, le=2**31-1)]
    example: Example | None


class Inventory(Record):
    basis: Literal['base', 'integrated']
    stages: dict[Status, Literal['completed', 'partial', 'failed', 'cancelled', 'skipped']]
    groups: Annotated[list[InventoryGroup], Field(max_length=5000)]

    @model_validator(mode='after')
    def distinct_groups(self):
        keys = {(g.algorithm, g.purpose, g.origin, g.status) for g in self.groups}
        if len(keys) != len(self.groups) or 'confirmed' not in self.stages:
            raise ValueError('无效的算法分组或阶段')
        return self


class Scope(Record):
    scanned_files: Count
    candidate_files: Count | None
    file_limit: Count | None
    skipped_files: Count
    partial: Annotated[bool, Field(strict=True)]
    skip_reasons: dict[Short, Count] = Field(default_factory=dict, max_length=32)


class Repository(Record):
    full_name: Annotated[str, Field(min_length=3, max_length=240)]
    scanned_at: AwareDatetime
    revision: Annotated[str, Field(pattern=r'^[a-f0-9]{40}$')] | None = None
    rules_version: Short
    coverage: Scope
    migration_score: Annotated[int, Field(strict=True, ge=0, le=100)]
    algorithm_inventory: Inventory

    @field_validator('full_name')
    @classmethod
    def valid_name(cls, value: str) -> str:
        if repository_name(value) != value:
            raise ValueError('需要 owner/repo')
        return value


class RepositorySelection(Record):
    repositories: Annotated[list[Annotated[str, Field(max_length=500)]], Field(min_length=1, max_length=30)]

    @field_validator('repositories')
    @classmethod
    def normalize(cls, values: list[str]) -> list[str]:
        unique = {}
        for value in values:
            name = repository_name(value)
            unique.setdefault(name.casefold(), name)
        return list(unique.values())


class AppendRequest(RepositorySelection):
    refresh_existing: Annotated[bool, Field(strict=True)] = False


class PurposeReview(Record):
    ai_assisted: Annotated[bool, Field(strict=True)] = False
    ai_profile_id: Annotated[str, Field(max_length=64)] = ''
    ai_profile_version: Annotated[str, Field(min_length=1, max_length=64)] | None = None


class RecheckRequest(RepositorySelection, PurposeReview):
    repositories: Annotated[list[Annotated[str, Field(max_length=500)]], Field(min_length=1, max_length=MAX_LIBRARY_REPOS)]


class PurposeRefreshRequest(PurposeReview):
    max_repositories: Annotated[int, Field(strict=True, ge=1, le=100)] | None = None


class DiscoveryRequest(PurposeRefreshRequest):
    ai_profile_version: Annotated[str, Field(min_length=1, max_length=64)]


class Library(Record):
    schema_version: Literal[1]
    repos: Annotated[list[Repository], Field(max_length=MAX_LIBRARY_REPOS)]


def paths() -> tuple[Path, Path]:
    from backend.main import PROJECT_ROOT, popular_results_path
    return PROJECT_ROOT / 'web/repository-seed.json', popular_results_path().with_name('repository-library.json')


def enrich_seed_copy(saved: Repository, bundled: Repository | None) -> Repository:
    if (bundled is None or saved.full_name != bundled.full_name or not saved.revision
            or saved.revision != bundled.revision or saved.scanned_at != bundled.scanned_at
            or saved.coverage != bundled.coverage or saved.migration_score != bundled.migration_score
            or saved.algorithm_inventory.basis != 'base' or bundled.algorithm_inventory.basis != 'base'
            or saved.algorithm_inventory.stages != bundled.algorithm_inventory.stages
            or not any(group.purpose == 'unknown' for group in saved.algorithm_inventory.groups)):
        return saved

    def totals(record):
        counts = Counter()
        for group in record.algorithm_inventory.groups:
            counts[group.algorithm, group.status] += group.count
        return counts

    def known_groups(record):
        return {(group.algorithm, group.status, group.purpose, group.origin): group.count
                for group in record.algorithm_inventory.groups if group.purpose != 'unknown'}

    old_known, new_known = known_groups(saved), known_groups(bundled)
    if (sum(new_known.values()) > sum(old_known.values()) and totals(saved) == totals(bundled)
            and all(new_known.get(key, 0) >= count for key, count in old_known.items())):
        return bundled
    return saved


def read_library() -> Library:
    seed, local = paths()
    try:
        bundled = Library.model_validate_json(seed.read_bytes())
        if not local.exists():
            return bundled
        saved = Library.model_validate_json(local.read_bytes())
    except (OSError, ValueError) as exc:
        raise HTTPException(500, '仓库资料库读取失败，已保留原文件') from exc
    seed_by_name = {repo.full_name.casefold(): repo for repo in bundled.repos}
    known = {repo.full_name.casefold() for repo in saved.repos}
    enriched = [enrich_seed_copy(repo, seed_by_name.get(repo.full_name.casefold())) for repo in saved.repos]
    additions = [repo for repo in bundled.repos if repo.full_name.casefold() not in known]
    available = MAX_LIBRARY_REPOS - len(enriched)
    return Library(schema_version=1, repos=sorted(
        enriched + additions[:available], key=lambda repo: repo.full_name.casefold(),
    ))


def complete_coverage(coverage: Scope) -> bool:
    return (not coverage.partial and not coverage.skipped_files
            and coverage.candidate_files == coverage.scanned_files)


def merge_library(incoming: list[Repository], *, protect_complete: bool = False) -> Library:
    with LOCK:
        current = read_library()
        records = {r.full_name.casefold(): r for r in current.repos}
        changed = False
        for repo in incoming:
            key = repo.full_name.casefold()
            previous = records.get(key)
            if (protect_complete and previous and not complete_coverage(repo.coverage)
                    and (complete_coverage(previous.coverage) or previous.coverage.scanned_files > repo.coverage.scanned_files)):
                continue
            if previous is None or repo.scanned_at > previous.scanned_at:
                records[key] = repo
                changed = True
        if not changed:
            return current
        if len(records) > MAX_LIBRARY_REPOS:
            raise HTTPException(413, '仓库资料库最多容纳 5000 个仓库')
        if len({g.algorithm for r in records.values() for g in r.algorithm_inventory.groups}) > 128:
            raise HTTPException(413, '资料库内算法种类超过 128 种')
        merged = Library(schema_version=1, repos=sorted(records.values(), key=lambda r: r.full_name.casefold()))
        data = merged.model_dump(mode='json')
        if len(json.dumps(data, ensure_ascii=False, indent=2).encode()) > MAX_LIBRARY_BYTES:
            raise HTTPException(413, '仓库资料库超过 16 MiB')
        try:
            write_json(data, paths()[1])
        except OSError as exc:
            raise HTTPException(500, '保存资料库失败，原数据已保留') from exc
        return merged


def batch_records(batch: dict) -> list[Repository]:
    from scanner.api_catalog import RULES_VERSION
    records = []
    for repo in batch.get('repos', []):
        if not repo.get('algorithm_inventory') or not repo.get('coverage'):
            continue
        records.append(Repository(full_name=repo['full_name'], scanned_at=batch['scanned_at'],
            revision=repo.get('revision'), rules_version=RULES_VERSION, coverage=repo['coverage'],
            migration_score=(repo.get('analysis_summary') or {}).get('migration_score', repo['migration_score']),
            algorithm_inventory=repo['algorithm_inventory']))
    return records


def library_save_outcome(library: Library, records: list[Repository]) -> dict[str, list[str]]:
    current = {repo.full_name.casefold(): repo for repo in library.repos}
    saved, retained = [], []
    for repo in records:
        outcome = saved if current.get(repo.full_name.casefold()) == repo else retained
        outcome.append(repo.full_name)
    return {'library_saved_repositories': saved, 'library_retained_repositories': retained}


@router.post('/batches/{task_id}')
def add_batch(task_id: str):
    from backend import task_routes
    batch = task_routes.store.result(task_id, include_content=False)
    records = batch_records(batch)
    if not records:
        raise HTTPException(422, '此任务没有可收录的仓库摘要')
    library = merge_library(records, protect_complete=True)
    return {'total': len(library.repos), **library_save_outcome(library, records)}


@router.get('')
def get_library():
    return JSONResponse(read_library().model_dump(mode='json'), headers={'Cache-Control': 'no-store'})


@router.post('/import')
def import_library(payload: Library) -> Library:
    return merge_library(payload.repos)
