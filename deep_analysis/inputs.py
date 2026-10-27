"""Minimal logical input for common experiments; not a storage/path adapter."""
from __future__ import annotations

from typing import Annotated

from pydantic import Field, model_validator

from deep_analysis.identity import content_digest
from deep_analysis.models import Contract, SourceIdentity


class LogicalSource(Contract):
    identity: SourceIdentity
    content: Annotated[str, Field(repr=False)]

    @model_validator(mode="after")
    def intact(self) -> LogicalSource:
        if content_digest(self.content) != self.identity.sha256:
            raise ValueError("逻辑输入摘要不匹配")
        if len(self.content.encode("utf-8")) != self.identity.size_bytes:
            raise ValueError("逻辑输入字节数不匹配")
        return self


class LogicalInput(Contract):
    sources: Annotated[tuple[LogicalSource, ...], Field(max_length=5000)]

    @model_validator(mode="after")
    def bounded(self) -> LogicalInput:
        identities = [source.identity.source_id for source in self.sources]
        if len(identities) != len(set(identities)):
            raise ValueError("逻辑输入source_id重复")
        if sum(source.identity.size_bytes for source in self.sources) > 100 * 1024 * 1024:
            raise ValueError("逻辑输入超过100MiB")
        return self
