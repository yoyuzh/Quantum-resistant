"""AI 吞吐与证据指标；只接受显式测量值，不估算供应商用量。"""
from __future__ import annotations

from typing import Any


def ratio(numerator: int, denominator: int) -> float | None:
    return numerator / denominator if denominator else None


def throughput_metrics(*, discovered: int, aggregated: int, positions: int,
                        retained_positions: int, semantic_errors: int,
                        valid_opinions: int, opinions: int, elapsed_seconds: float,
                        completed: int, requests: int, timed_out: bool = False) -> dict[str, Any]:
    """计算固定实验使用的指标；位置和错误语义均按输入显式计数。"""
    return {
        "discovered_candidates": discovered,
        "aggregated_candidates": aggregated,
        "aggregation_compression_rate": ratio(max(discovered - aggregated, 0), discovered),
        "position_retention_rate": ratio(retained_positions, positions),
        "semantic_error_merges": semantic_errors,
        "valid_opinion_coverage": ratio(valid_opinions, opinions),
        "completed": completed,
        "requests": requests,
        "elapsed_seconds": elapsed_seconds,
        "timeout_rate": 1.0 if timed_out else 0.0,
    }
