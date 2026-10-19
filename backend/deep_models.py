"""Optional background-only contracts; synchronous request schemas stay unchanged."""
from __future__ import annotations

from typing import Literal
from pydantic import BaseModel, ConfigDict, Field
from backend.models import GitHubScanRequest, PyPIScanRequest, SnippetScanRequest


class DeepGitHubRequest(GitHubScanRequest):
    analysis_mode: Literal['basic', 'deep'] = 'basic'


class DeepPyPIRequest(PyPIScanRequest):
    analysis_mode: Literal['basic', 'deep'] = 'basic'


class DeepSnippetRequest(SnippetScanRequest):
    analysis_mode: Literal['basic', 'deep'] = 'basic'


class ExistingDeepRequest(BaseModel):
    model_config = ConfigDict(extra='forbid')
    source_task_id: str = Field(min_length=1, max_length=64, pattern=r'^[A-Za-z0-9_-]+$')
