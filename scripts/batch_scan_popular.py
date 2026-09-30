from __future__ import annotations

import argparse
import logging
import sys
from pathlib import Path

if __package__ in {None, ""}:
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from backend.popular import BatchResult, FetchError, RepoInfo, RepoScanResult, fetch_popular_repos, run_batch_scan, scan_single_repo, scan_popular, batch_incomplete
from backend.collection_common import CollectionError
from backend.storage import write_results
from backend.collection_config import MAX_COLLECTED_FILES


def main() -> int:
    parser = argparse.ArgumentParser(description="热门密码学 Python 仓库批量扫描")
    parser.add_argument("--top", type=int, default=20)
    parser.add_argument("--max-files", type=int, default=MAX_COLLECTED_FILES)
    args = parser.parse_args()
    if not 1 <= args.top <= 30 or not 1 <= args.max_files <= MAX_COLLECTED_FILES:
        parser.error("--top 必须为 1–30，--max-files 必须为 1–5000")
    logging.basicConfig(level=logging.INFO)
    try:
        result = scan_popular(top=args.top, max_files=args.max_files)
        if batch_incomplete(result):
            print('批量扫描未完整结束，上次结果已保留；请重试。', file=sys.stderr)
            return 1
        output = Path(__file__).resolve().parents[1] / "web/data/popular.json"
        write_results(result, output)
    except (CollectionError, OSError) as exc:
        print(f"批量扫描失败：{exc}", file=sys.stderr)
        return 1
    for failure in result.failures:
        print(f"{failure['full_name']}：{failure['error']}", file=sys.stderr)
    print(f"扫描完成：{len(result.repos)} 个仓库，结果已写入 {output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
