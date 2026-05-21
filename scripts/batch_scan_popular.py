from __future__ import annotations

"""热门 Python 仓库批量量子脆弱性扫描脚本。

从 GitHub Search API 获取 star 数最高的 Python 仓库，逐一执行量子脆弱性扫描，
将结果写入静态 JSON 文件供前端展示。

用法：
    python3 scripts/batch_scan_popular.py [--top N]
"""

import argparse
import json
import logging
import os
import sys
import tempfile
from pathlib import Path

from backend.popular import (
    BatchResult,
    FetchError,
    fetch_popular_repos,
    run_batch_scan,
)

logger = logging.getLogger(__name__)


def write_results(result: BatchResult, output_path: Path) -> None:
    """将批量扫描结果原子写入 JSON 文件。"""
    output_path = Path(output_path)
    output_dir = output_path.parent
    output_dir.mkdir(parents=True, exist_ok=True)

    data = {
        "scanned_at": result.scanned_at,
        "repos": result.repos,
        "meta": result.meta,
    }

    json_content = json.dumps(data, indent=2, ensure_ascii=False)

    tmp_fd = None
    tmp_path = None
    try:
        tmp_fd, tmp_path = tempfile.mkstemp(
            dir=str(output_dir), suffix=".tmp", prefix=".popular_"
        )
        with os.fdopen(tmp_fd, "w", encoding="utf-8") as f:
            tmp_fd = None
            f.write(json_content)

        os.replace(tmp_path, str(output_path))
        tmp_path = None
    except Exception as exc:
        print(f"写入结果文件失败：{exc}", file=sys.stderr)
        if tmp_path is not None:
            try:
                os.unlink(tmp_path)
            except OSError:
                pass
        if tmp_fd is not None:
            try:
                os.close(tmp_fd)
            except OSError:
                pass
        sys.exit(1)


def main() -> int:
    """CLI 入口：解析参数、执行批量扫描、输出结果。"""
    logging.basicConfig(level=logging.INFO)

    parser = argparse.ArgumentParser(
        description="热门 Python 仓库批量量子脆弱性扫描"
    )
    parser.add_argument(
        "--top",
        type=int,
        default=20,
        help="获取仓库数量，默认 20",
    )
    args = parser.parse_args()

    try:
        repos = fetch_popular_repos(top=args.top)
    except FetchError as exc:
        logger.error("%s", exc)
        return 1

    batch_result = run_batch_scan(repos)

    output_path = Path(__file__).resolve().parents[1] / "web" / "data" / "popular.json"
    write_results(batch_result, output_path)

    total_findings = sum(r.get("finding_count", 0) for r in batch_result.repos)
    print(
        f"扫描完成：共 {batch_result.meta['total_repos']} 个仓库，"
        f"发现 {total_findings} 项风险，结果已写入 {output_path}"
    )

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
