"""Property-based tests for popular-repo-batch-scan feature.

Uses hypothesis library to verify correctness properties across many inputs.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

# Ensure project root is importable
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from hypothesis import given, settings
from hypothesis import strategies as st

from scan_quantum_vuln import build_migration_score


# ---------------------------------------------------------------------------
# Equivalent Python implementation of formatStarCount from web/src/App.vue
# JS logic:
#   if (count >= 1000) return (count / 1000).toFixed(1) + 'k';
#   return String(count);
# ---------------------------------------------------------------------------

def format_star_count(count: int) -> str:
    """Format star count for display.

    >= 1000: display as "X.Xk" (e.g. 52300 -> "52.3k", 1000 -> "1.0k")
    < 1000: display as the integer string (e.g. 999 -> "999")
    """
    if count >= 1000:
        return f"{count / 1000:.1f}k"
    return str(count)


# Feature: popular-repo-batch-scan, Property 8: Star count abbreviation
class TestStarCountAbbreviation:
    """Property 8: Star count abbreviation

    For any non-negative integer star count:
    - if count >= 1000, display as "X.Xk" (value / 1000 with one decimal)
    - if count < 1000, display as the integer itself

    **Validates: Requirements 6.6**
    """

    @settings(max_examples=200)
    @given(count=st.integers(min_value=0, max_value=999))
    def test_below_1000_displays_as_integer(self, count: int) -> None:
        """For count < 1000, result equals str(count)."""
        result = format_star_count(count)
        assert result == str(count), (
            f"Expected '{count}' for count={count}, got '{result}'"
        )

    @settings(max_examples=200)
    @given(count=st.integers(min_value=1000, max_value=10_000_000))
    def test_gte_1000_displays_with_k_suffix(self, count: int) -> None:
        """For count >= 1000, result ends with 'k' and represents count/1000
        with one decimal place."""
        result = format_star_count(count)

        # Must end with 'k'
        assert result.endswith("k"), (
            f"Expected result to end with 'k' for count={count}, got '{result}'"
        )

        # Remove 'k' suffix and parse as float
        numeric_part = result[:-1]
        parsed = float(numeric_part)

        # The numeric part should equal count/1000 rounded to 1 decimal
        expected_value = round(count / 1000, 1)
        assert parsed == expected_value, (
            f"Expected numeric part {expected_value} for count={count}, "
            f"got {parsed} (full result: '{result}')"
        )

    @settings(max_examples=200)
    @given(count=st.integers(min_value=0, max_value=10_000_000))
    def test_format_matches_pattern(self, count: int) -> None:
        """For any non-negative integer, the result matches expected pattern."""
        result = format_star_count(count)

        if count >= 1000:
            # Should match pattern like "1.0k", "52.3k", "10000.0k"
            assert re.fullmatch(r"\d+\.\dk", result), (
                f"Result '{result}' doesn't match X.Xk pattern for count={count}"
            )
        else:
            # Should be a plain integer string
            assert re.fullmatch(r"\d+", result), (
                f"Result '{result}' doesn't match integer pattern for count={count}"
            )
            assert int(result) == count


# ---------------------------------------------------------------------------
# Equivalent Python implementation of front-end sorting logic from web/src/App.vue
# JS logic:
#   [...popularData.value.repos].sort((a, b) => b.star_count - a.star_count)
# ---------------------------------------------------------------------------


def sort_repos_by_star_count_descending(repos: list[dict]) -> list[dict]:
    """Sort repository list by star_count in descending order.

    This is the Python equivalent of the front-end sorting logic:
        [...repos].sort((a, b) => b.star_count - a.star_count)
    """
    return sorted(repos, key=lambda r: r["star_count"], reverse=True)


# Strategy: generate lists of repo-like dicts with random star_count values
_repo_strategy = st.fixed_dictionaries({
    "full_name": st.text(min_size=1, max_size=50),
    "star_count": st.integers(min_value=0, max_value=500000),
    "url": st.text(min_size=1, max_size=100),
    "migration_score": st.integers(min_value=0, max_value=100),
    "finding_count": st.integers(min_value=0, max_value=100),
    "algorithms": st.lists(st.text(min_size=1, max_size=20), max_size=5),
})

_repo_list_strategy = st.lists(_repo_strategy, min_size=0, max_size=50)


# Feature: popular-repo-batch-scan, Property 9: Repository list sorted by star count descending
class TestRepoListSortedByStarCount:
    """Property 9: Repository list sorted by star count descending

    For any list of repository results, the displayed order SHALL be sorted
    by star_count in descending order (highest stars first).

    **Validates: Requirements 6.2**
    """

    @settings(max_examples=100)
    @given(repos=_repo_list_strategy)
    def test_sorted_repos_are_non_increasing_by_star_count(self, repos: list[dict]) -> None:
        """After sorting by star_count descending, each element's star_count
        >= next element's star_count (strictly non-increasing)."""
        sorted_repos = sort_repos_by_star_count_descending(repos)

        # Verify length is preserved (sorting doesn't add/remove elements)
        assert len(sorted_repos) == len(repos)

        # Verify star_count is strictly non-increasing (each >= next)
        for i in range(len(sorted_repos) - 1):
            assert sorted_repos[i]["star_count"] >= sorted_repos[i + 1]["star_count"], (
                f"Repos not sorted descending at index {i}: "
                f"{sorted_repos[i]['star_count']} < {sorted_repos[i + 1]['star_count']}"
            )

    @settings(max_examples=100)
    @given(repos=_repo_list_strategy)
    def test_sorted_repos_preserve_all_elements(self, repos: list[dict]) -> None:
        """Sorting preserves all original elements (no data loss or duplication)."""
        sorted_repos = sort_repos_by_star_count_descending(repos)

        # All original star_counts should be present in sorted result
        original_stars = sorted([r["star_count"] for r in repos])
        sorted_stars = sorted([r["star_count"] for r in sorted_repos])
        assert original_stars == sorted_stars, (
            "Sorting changed the multiset of star_count values"
        )


# ---------------------------------------------------------------------------
# Feature: popular-repo-batch-scan, Property 3: Findings are capped and sorted
# ---------------------------------------------------------------------------

from unittest.mock import patch


# Strategy: generate a list of finding dicts with random line numbers
_finding_strategy = st.fixed_dictionaries({
    "line": st.integers(min_value=1, max_value=100000),
    "file_name": st.text(
        alphabet=st.characters(whitelist_categories=("L", "N"), whitelist_characters="/_.-"),
        min_size=3,
        max_size=30,
    ),
    "algorithm": st.sampled_from(["RSA", "DSA", "ECDSA", "DH", "ECDH", "ECC", "X25519"]),
    "risk_level": st.sampled_from(["高风险", "中风险"]),
    "evidence": st.text(min_size=1, max_size=50),
})

_findings_list_strategy = st.lists(_finding_strategy, min_size=0, max_size=60)


class TestFindingsCappedAndSorted:
    """Property 3: Findings are capped and sorted.

    对任意 N 条 findings，输出最多 20 条且按 line 升序。

    **Validates: Requirements 2.5, 7.2**
    """

    @settings(max_examples=200)
    @given(findings=_findings_list_strategy)
    def test_findings_capped_at_20_and_sorted_by_line(self, findings: list[dict]) -> None:
        """For any list of findings, applying the cap-and-sort logic produces
        at most 20 items sorted by line number ascending."""
        # Apply the same capping and sorting logic as scan_single_repo
        sorted_findings = sorted(findings, key=lambda f: int(f.get("line", 0)))
        top_findings = sorted_findings[:20]

        # Property: output length is min(len(input), 20)
        expected_length = min(len(findings), 20)
        assert len(top_findings) == expected_length, (
            f"Expected {expected_length} findings, got {len(top_findings)}"
        )

        # Property: output findings are sorted by line ascending
        for i in range(len(top_findings) - 1):
            assert top_findings[i]["line"] <= top_findings[i + 1]["line"], (
                f"Findings not sorted by line: {top_findings[i]['line']} > "
                f"{top_findings[i + 1]['line']}"
            )

    @settings(max_examples=200)
    @given(findings=_findings_list_strategy)
    def test_scan_single_repo_caps_and_sorts_findings(self, findings: list[dict]) -> None:
        """Integration: scan_single_repo produces capped and sorted findings
        when given arbitrary findings from the scanner.

        **Validates: Requirements 2.5, 7.2**
        """
        from scripts.batch_scan_popular import RepoInfo, scan_single_repo

        repo = RepoInfo(
            full_name="test/repo",
            html_url="https://github.com/test/repo",
            star_count=1000,
        )

        # Mock collect_github_sources to return a single dummy source
        mock_sources = [("github", "test.py", "# dummy source")]

        # Mock scan_source_for_crypto to return our generated findings
        def mock_scan(source, filename, source_type, source_id):
            return findings

        # Mock build_migration_score to return a dummy score
        mock_score = {"score": 50, "level": "高风险"}

        with patch("scripts.batch_scan_popular.collect_github_sources", return_value=mock_sources), \
             patch("scripts.batch_scan_popular.scan_source_for_crypto", side_effect=mock_scan), \
             patch("scripts.batch_scan_popular.build_migration_score", return_value=mock_score):
            result = scan_single_repo(repo)

        if not findings:
            # Zero findings → finding_count=0
            assert result.finding_count == 0
            assert result.findings == []
        else:
            # Findings are capped at 20
            assert len(result.findings) <= 20
            expected_length = min(len(findings), 20)
            assert len(result.findings) == expected_length, (
                f"Expected {expected_length} findings, got {len(result.findings)}"
            )

            # Findings are sorted by line ascending
            for i in range(len(result.findings) - 1):
                line_a = int(result.findings[i].get("line", 0))
                line_b = int(result.findings[i + 1].get("line", 0))
                assert line_a <= line_b, (
                    f"Findings not sorted: line {line_a} > {line_b}"
                )


# ---------------------------------------------------------------------------
# Additional imports for Property 4
# ---------------------------------------------------------------------------
import json
import tempfile
from pathlib import Path

from scripts.batch_scan_popular import BatchResult, write_results


# --- Strategies for Property 4 ---

# Chinese character text generation
_chinese_chars = st.text(
    alphabet=st.characters(
        whitelist_categories=("Lo",),
        whitelist_characters="中文测试仓库扫描风险算法高低量子脆弱性迁移评分",
    ),
    min_size=1,
    max_size=10,
)

_mixed_text_with_chinese = st.builds(
    lambda prefix, cn: prefix + cn,
    st.from_regex(r"[a-z_]{1,5}", fullmatch=True),
    _chinese_chars,
)


def _finding_strategy():
    """Generate a single finding dict with Chinese in risk_level/evidence."""
    return st.fixed_dictionaries({
        "line": st.integers(min_value=1, max_value=10000),
        "file_name": st.builds(
            lambda name: f"src/{name}.py",
            st.from_regex(r"[a-z_]{1,10}", fullmatch=True),
        ),
        "algorithm": st.sampled_from(["RSA", "DSA", "ECDSA", "DH", "ECDH", "ECC"]),
        "risk_level": st.sampled_from(["高风险", "中风险", "低风险"]),
        "evidence": _mixed_text_with_chinese,
    })


def _repo_strategy():
    """Generate a single repo dict with Chinese characters."""
    return st.fixed_dictionaries({
        "full_name": st.builds(
            lambda o, r: f"{o}/{r}",
            st.from_regex(r"[a-z]{2,8}", fullmatch=True),
            st.from_regex(r"[a-z]{2,8}", fullmatch=True),
        ),
        "star_count": st.integers(min_value=0, max_value=200000),
        "url": st.builds(
            lambda name: f"https://github.com/{name}",
            st.from_regex(r"[a-z]{2,8}/[a-z]{2,8}", fullmatch=True),
        ),
        "migration_score": st.integers(min_value=0, max_value=100),
        "finding_count": st.integers(min_value=0, max_value=100),
        "algorithms": st.lists(
            st.sampled_from(["RSA", "DSA", "ECDSA", "DH", "ECDH"]), max_size=5
        ),
        "findings": st.lists(_finding_strategy(), min_size=1, max_size=5),
    })


def _batch_result_strategy():
    """Generate a BatchResult with Chinese characters and valid structure."""
    return st.builds(
        BatchResult,
        scanned_at=st.builds(
            lambda y, mo, d, h, mi, s: f"{y:04d}-{mo:02d}-{d:02d}T{h:02d}:{mi:02d}:{s:02d}+08:00",
            st.integers(min_value=2020, max_value=2030),
            st.integers(min_value=1, max_value=12),
            st.integers(min_value=1, max_value=28),
            st.integers(min_value=0, max_value=23),
            st.integers(min_value=0, max_value=59),
            st.integers(min_value=0, max_value=59),
        ),
        repos=st.lists(_repo_strategy(), min_size=1, max_size=5),
        meta=st.fixed_dictionaries({
            "total_repos": st.integers(min_value=0, max_value=20),
            "requested_count": st.integers(min_value=1, max_value=50),
            "query": st.just("language:python sort:stars"),
        }),
    )


# Feature: popular-repo-batch-scan, Property 4: JSON serialization produces valid structure with Chinese preserved
class TestJsonSerializationStructure:
    """Property 4: JSON serialization produces valid structure with Chinese preserved.

    对任意含中文的 batch result，序列化后 round-trip 一致，含 scanned_at/repos/meta 字段，
    中文字面保留。

    **Validates: Requirements 3.2, 3.4**
    """

    @settings(max_examples=100)
    @given(batch_result=_batch_result_strategy())
    def test_json_roundtrip_and_structure_with_chinese(self, batch_result: BatchResult):
        """Serialized JSON round-trips correctly, contains required fields,
        and preserves Chinese characters literally."""
        with tempfile.TemporaryDirectory() as tmp_dir:
            output_path = Path(tmp_dir) / "test_popular.json"
            write_results(batch_result, output_path)

            # Read back the raw bytes
            raw_bytes = output_path.read_bytes()
            raw_text = raw_bytes.decode("utf-8")

            # (a) JSON parses back to equivalent data structure (round-trip)
            parsed = json.loads(raw_text)
            expected_data = {
                "scanned_at": batch_result.scanned_at,
                "repos": batch_result.repos,
                "meta": batch_result.meta,
            }
            assert parsed == expected_data, (
                "Round-trip failed: parsed JSON does not match original data"
            )

            # (b) Contains scanned_at as ISO string ending with +08:00
            assert "scanned_at" in parsed
            assert parsed["scanned_at"].endswith("+08:00"), (
                f"scanned_at should end with +08:00, got: {parsed['scanned_at']}"
            )

            # (c) Contains a repos array
            assert "repos" in parsed
            assert isinstance(parsed["repos"], list), "repos should be a list"

            # (d) Contains a meta object with total_repos, requested_count, query
            assert "meta" in parsed
            meta = parsed["meta"]
            assert isinstance(meta, dict), "meta should be a dict"
            assert "total_repos" in meta, "meta missing total_repos"
            assert "requested_count" in meta, "meta missing requested_count"
            assert "query" in meta, "meta missing query"

            # (e) Chinese characters appear literally (not as \uXXXX escapes)
            # CJK Unified Ideographs range: U+4E00 to U+9FFF
            unicode_escape_pattern = re.compile(r"\\u[4-9][0-9a-fA-F]{3}")
            assert not unicode_escape_pattern.search(raw_text), (
                "Found unicode escape sequences for CJK characters in JSON output. "
                "ensure_ascii=False should preserve Chinese characters literally."
            )

            # Verify Chinese characters from the data appear literally in the file
            chinese_pattern = re.compile(r"[\u4e00-\u9fff]")
            expected_str = json.dumps(expected_data, ensure_ascii=False)
            chinese_in_data = chinese_pattern.findall(expected_str)
            for ch in chinese_in_data:
                assert ch in raw_text, (
                    f"Chinese character '{ch}' should appear literally in output"
                )


# ---------------------------------------------------------------------------
# Strategies for migration score property test
# ---------------------------------------------------------------------------

_RISK_LEVELS = st.sampled_from(["高风险", "中风险", "低风险", "高", "中", "低"])
_ALGORITHMS = st.sampled_from(["RSA", "DSA", "DH", "ECDH", "ECDSA", "ECC", "X25519", "Ed25519"])
_FILE_NAMES = st.sampled_from([
    "crypto.py", "auth.py", "keys.py", "utils.py", "main.py",
    "server.py", "client.py", "tls.py", "sign.py", "encrypt.py",
])

_finding_strategy = st.fixed_dictionaries({
    "line": st.integers(min_value=1, max_value=10000),
    "file_name": _FILE_NAMES,
    "algorithm": _ALGORITHMS,
    "risk_level": _RISK_LEVELS,
    "evidence": st.text(min_size=1, max_size=50),
})

_findings_list_strategy = st.lists(_finding_strategy, min_size=0, max_size=50)


# Feature: popular-repo-batch-scan, Property 2: Migration score computation is correct
class TestMigrationScoreComputation:
    """Property 2: Migration score computation is correct

    For any set of scan findings, the computed migration score SHALL equal
    min(100, high_risk_count × 25 + affected_file_count × 10 + algorithm_variety × 10),
    where high_risk_count is the number of findings with risk_level containing "高",
    affected_file_count is the number of distinct file names with findings,
    and algorithm_variety is the number of distinct algorithm names.

    **Validates: Requirements 2.4**
    """

    @settings(max_examples=200)
    @given(findings=_findings_list_strategy)
    def test_score_matches_formula(self, findings: list[dict]) -> None:
        """The computed score equals min(100, high_risk×25 + files×10 + algos×10)."""
        # Compute expected values from the formula
        high_risk_count = sum(
            1 for f in findings if "高" in str(f.get("risk_level", ""))
        )
        affected_file_count = len({
            str(f.get("file_name", ""))
            for f in findings
            if f.get("file_name")
        })
        algorithm_variety = len({
            str(f.get("algorithm", ""))
            for f in findings
            if f.get("algorithm")
        })
        expected_score = min(
            100,
            high_risk_count * 25 + affected_file_count * 10 + algorithm_variety * 10,
        )

        # Call the function under test
        result = build_migration_score([], findings)

        assert result["score"] == expected_score, (
            f"Expected score={expected_score} but got {result['score']}. "
            f"high_risk={high_risk_count}, files={affected_file_count}, "
            f"algos={algorithm_variety}"
        )

    @settings(max_examples=200)
    @given(findings=_findings_list_strategy)
    def test_component_counts_are_correct(self, findings: list[dict]) -> None:
        """The returned component counts match independent computation."""
        high_risk_count = sum(
            1 for f in findings if "高" in str(f.get("risk_level", ""))
        )
        affected_file_count = len({
            str(f.get("file_name", ""))
            for f in findings
            if f.get("file_name")
        })
        algorithm_variety = len({
            str(f.get("algorithm", ""))
            for f in findings
            if f.get("algorithm")
        })

        result = build_migration_score([], findings)

        assert result["high_risk_findings"] == high_risk_count
        assert result["affected_files"] == affected_file_count
        assert result["algorithm_variety"] == algorithm_variety

    @settings(max_examples=200)
    @given(findings=_findings_list_strategy)
    def test_score_is_capped_at_100(self, findings: list[dict]) -> None:
        """The migration score never exceeds 100."""
        result = build_migration_score([], findings)
        assert 0 <= result["score"] <= 100
