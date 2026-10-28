from __future__ import annotations

from scanner.control import checkpoint


def analyze_source(source: str, filename: str = "snippet.py", source_type: str = "snippet", source_id: str | None = None, *, include_metadata: bool = False) -> tuple[list[dict], list[dict]]:
    """Delegate static decisions to A; forward main cancellation checkpoints."""
    from original_a.scanner.control import analysis_control
    from original_a.scanner.engine import analyze_source as original
    with analysis_control(checkpoint):
        return original(source, filename, source_type, source_id, include_metadata=include_metadata)


def scan_source_for_crypto(source: str, filename: str = "snippet.py", source_type: str = "snippet", source_id: str | None = None, *, include_metadata: bool = False) -> list[dict]:
    return analyze_source(source, filename, source_type, source_id, include_metadata=include_metadata)[0]
