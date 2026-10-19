from __future__ import annotations

import ast
import json
import unittest

from pydantic import TypeAdapter, ValidationError

from deep_analysis.evaluation import OperationLabel, Prediction, evaluate, run_cases
from deep_analysis.identity import content_digest, extract_span, operation_id, snapshot_id, template_id
from deep_analysis.inputs import LogicalInput, LogicalSource
from deep_analysis.models import (AbstractValue, Ambiguous, ArgumentFact, Budgets, CallContext, Claim,
                                  Coverage, CoverageCount, CryptoOperation, DeepAnalysisResult, EvidencePath,
                                  Known, SnapshotIdentity, SourceIdentity, Span, Unknown, Versions)
from tests.deep_static.baseline import BASELINE, collect_baseline
from tests.deep_static.corpus import load_cases, load_catalog


def location(source_id="file-a", start_col=0, end_col=4):
    return Span(source_id=source_id, start_line=1, start_col=start_col, end_line=1, end_col=end_col)


def coverage():
    return Coverage(**{name: CoverageCount(count=1, total=None) for name in
                       ("collected", "available", "selected", "parsed", "analyzed")})


def snapshot():
    return SnapshotIdentity(snapshot_id="pending", source_type="manual_upload", path_fidelity="relative_paths",
                            collection_version="test-1", coverage=coverage(), sources=(
                                SourceIdentity(source_id="file-a", relative_path="a/code.py",
                                               sha256=content_digest("pass"), size_bytes=4),))


def versions():
    return Versions(rules="rules-1", semantics="semantics-1", engine="contract-only",
                    verifier="not-implemented", host_python="3.14.7", target_python="3.10+")


def unknown_claim(kind):
    return Claim(claim_type=kind, value=Unknown(reason="not_analyzed"), resolution_status="unknown", level="E0")


class ContractTests(unittest.TestCase):
    def test_independent_result_round_trip(self):
        result = DeepAnalysisResult(status="skipped", snapshot=snapshot(), coverage=coverage(), versions=versions())
        self.assertEqual(DeepAnalysisResult.model_validate_json(result.model_dump_json()), result)
        self.assertEqual(result.schema_version, "deep-static-1")
        self.assertIsNone(result.coverage.analyzed.total)
        self.assertNotIn("backend", DeepAnalysisResult.__module__)

    def test_values_round_trip_and_unknown_retains_alternatives(self):
        adapter = TypeAdapter(AbstractValue)
        samples = ({"kind": "known", "value": "RS256"},
                   {"kind": "ambiguous", "alternatives": [{"value": "RS256"}, {"value": "HS256"}]},
                   {"kind": "unknown", "reason": "unknown_branch", "alternatives": [{"value": "RS256"}]})
        for sample in samples:
            with self.subTest(sample=sample):
                value = adapter.validate_python(sample)
                self.assertEqual(adapter.validate_json(adapter.dump_json(value)), value)
        self.assertEqual(adapter.validate_python(samples[-1]).kind, "unknown")

    def test_bad_enum_extras_nonfinite_and_unbounded_values_rejected(self):
        invalid = [lambda: Unknown(reason="dynamic", extra=True),
                   lambda: TypeAdapter(AbstractValue).validate_python({"kind": "certain", "value": "RSA"}),
                   lambda: Known(value=float("nan")),
                   lambda: Known(value={"unbounded": []}),
                   lambda: Known(value="a" * 2049),
                   lambda: Ambiguous(alternatives=tuple({"value": n} for n in range(5))),
                   lambda: Budgets(call_depth=4), lambda: Budgets(python_files=201),
                   lambda: Budgets(seconds=121), lambda: Budgets(source_bytes=8 * 1024 * 1024 + 1),
                   lambda: CallContext(kind="invocation", call_chain=(location(),) * 4),
                   lambda: CoverageCount(count=2, total=1)]
        for create in invalid:
            with self.assertRaises(ValidationError):
                create()

    def test_four_claims_and_no_automatic_promotion(self):
        context = CallContext(kind="invocation")
        operation = CryptoOperation(operation_id="op", template_id="template", api="jwt.encode", library="PyJWT",
                                    operation_type="sign", algorithm=Unknown(reason="not_analyzed"),
                                    resolution_status="unknown", call_site=location(), sink_location=location(),
                                    context=context, claims=tuple(unknown_claim(kind) for kind in
                                    ("ALGORITHM", "OPERATION_TYPE", "KEY_SOURCE", "QUANTUM_CLASS")),
                                    risk_category="unknown")
        self.assertEqual(operation.claims[0].level, "E0")
        raw = operation.model_dump(mode="json")
        raw["claims"][1] = raw["claims"][0]
        with self.assertRaises(ValidationError):
            CryptoOperation.model_validate(raw)
        with self.assertRaises(ValidationError):
            Claim(claim_type="ALGORITHM", value=Known(value="RS256"), resolution_status="resolved", level="E3")
        with self.assertRaises(ValidationError):
            Claim(claim_type="ALGORITHM", value=Unknown(reason="dynamic"), resolution_status="resolved", level="E2")

    def test_evidence_references_and_snapshot_version_boundary(self):
        base = dict(evidence_id="path", snapshot_id="pending", context=CallContext(kind="invocation"),
                    nodes=({"node_id": "node", "location": location(), "source_sha256": content_digest("pass")},),
                    versions=versions())
        with self.assertRaises(ValidationError):
            EvidencePath(**base, edges=({"edge_id": "edge", "edge_type": "CALLS",
                                        "source_node": "node", "target_node": "missing"},))
        path = EvidencePath(**(base | {"snapshot_id": "different-snapshot"}))
        with self.assertRaises(ValidationError):
            DeepAnalysisResult(status="partial", snapshot=snapshot(), coverage=coverage(), versions=versions(), evidence_paths=(path,))

    def test_result_rejects_node_digest_and_source_tampering(self):
        node = {"node_id": "node", "location": location(), "source_sha256": content_digest("evil")}
        path = EvidencePath(evidence_id="path", snapshot_id="pending", context=CallContext(kind="invocation"),
                            nodes=(node,), versions=versions())
        with self.assertRaises(ValidationError):
            DeepAnalysisResult(status="partial", snapshot=snapshot(), coverage=coverage(),
                               versions=versions(), evidence_paths=(path,))
        node["location"] = location("outside-source")
        node["source_sha256"] = content_digest("pass")
        path = EvidencePath(evidence_id="path", snapshot_id="pending", context=CallContext(kind="invocation"),
                            nodes=(node,), versions=versions())
        with self.assertRaises(ValidationError):
            DeepAnalysisResult(status="partial", snapshot=snapshot(), coverage=coverage(),
                               versions=versions(), evidence_paths=(path,))


class IdentityTests(unittest.TestCase):
    def test_span_coordinates_multiline_chinese_and_invalid_boundaries(self):
        text = '说明 = "中"; jwt.encode()\r\npass\n'
        start = len('说明 = "中"; '.encode())
        span = location(start_col=start, end_col=start + len('jwt.encode()'))
        self.assertEqual(extract_span(text, span), "jwt.encode()")
        multi = Span(source_id="a", start_line=1, start_col=start, end_line=2, end_col=4)
        self.assertEqual(extract_span(text, multi), "jwt.encode()\r\npass")
        for span in (location(start_col=1), location(end_col=999),
                     Span(source_id="a", start_line=9, start_col=0, end_line=9, end_col=1)):
            with self.assertRaises((ValueError, UnicodeError)):
                extract_span(text, span)
        with self.assertRaises(ValidationError):
            location(end_col=0)
        with self.assertRaises(ValidationError):
            Span(source_id="a", start_line=0, start_col=0, end_line=1, end_col=2)

    def test_same_basename_context_and_versions_never_merge(self):
        sink = location()
        first = CallContext(kind="invocation", call_chain=(location("caller-a"),),
                            arguments=(ArgumentFact(parameter="algorithm", fact_id="rs-value-origin"),))
        second = CallContext(kind="invocation", call_chain=(location("caller-b"),),
                             arguments=(ArgumentFact(parameter="algorithm", fact_id="hs-value-origin"),))
        identity = operation_id("snapshot-a", sink, first, "rules-1", "semantics-1")
        self.assertEqual(identity, operation_id("snapshot-a", sink, first, "rules-1", "semantics-1"))
        for args in (("snapshot-a", sink, second, "rules-1", "semantics-1"),
                     ("snapshot-b", sink, first, "rules-1", "semantics-1"),
                     ("snapshot-a", location("file-b"), first, "rules-1", "semantics-1"),
                     ("snapshot-a", sink, first, "rules-2", "semantics-1"),
                     ("snapshot-a", sink, first, "rules-1", "semantics-2")):
            self.assertNotEqual(identity, operation_id(*args))
        self.assertEqual(template_id("snapshot-a", sink, "rules-1"), template_id("snapshot-a", sink, "rules-1"))

    def test_snapshot_order_and_metadata_identity(self):
        base = snapshot().model_dump(mode="json")
        base["sources"].append(dict(source_id="file-b", relative_path="b/code.py", sha256=content_digest("pass"), size_bytes=4))
        first = SnapshotIdentity.model_validate(base)
        second = SnapshotIdentity.model_validate(base | {"sources": list(reversed(base["sources"]))})
        self.assertEqual(snapshot_id(first), snapshot_id(second))
        third = SnapshotIdentity.model_validate(base | {"path_fidelity": "flat_basename"})
        self.assertNotEqual(snapshot_id(first), snapshot_id(third))
        self.assertIsNone(first.commit)
        self.assertNotEqual(content_digest("\ufeffa\r\n"), content_digest("a\n"))

    def test_logical_input_validates_digests_sizes_and_uniqueness(self):
        source = LogicalSource(identity=snapshot().sources[0], content="pass")
        self.assertEqual(source.content, "pass")
        with self.assertRaises(ValidationError):
            LogicalSource(identity=source.identity, content="evil")
        with self.assertRaises(ValidationError):
            LogicalInput(sources=(source, source))
        with self.assertRaises(ValidationError):
            source.content = "evil"


class CorpusTests(unittest.TestCase):
    def test_frozen_multifile_cases_and_annotations(self):
        catalog = load_catalog()
        self.assertGreaterEqual(len(catalog), 30)
        self.assertEqual(len(catalog), len({case["id"] for case in catalog}))
        for case in catalog:
            with self.subTest(case=case["id"]):
                self.assertGreaterEqual(len(case["files"]), 2)
                self.assertTrue(case["review_basis"])
                self.assertTrue(case["target_python"])
                experiment = next(item for item in load_cases() if item.case_id == case["id"])
                texts = {source.identity.source_id: source.content for source in experiment.inputs.sources}
                for path, content in case["files"].items():
                    if path.endswith(".py"):
                        ast.parse(content, filename=path, feature_version=(3, 10))
                for operation in experiment.expected.operations:
                    self.assertTrue(extract_span(texts[operation.sink.source_id], operation.sink))
                for edge in experiment.expected.edges:
                    self.assertTrue(extract_span(texts[edge.source.source_id], edge.source))
                    self.assertTrue(extract_span(texts[edge.target.source_id], edge.target))

    def test_no_development_copies_in_locked_set(self):
        families = {split: {case["family"] for case in load_catalog() if case["split"] == split}
                    for split in ("development", "locked")}
        self.assertFalse(families["development"] & families["locked"])
        # Strip constants, names and locations to detect renamed/literal-only copies
        # of an entire case. Shared small helper modules are allowed.
        shapes = {"development": set(), "locked": set()}
        class Normalize(ast.NodeTransformer):
            def visit_Name(self, node):
                return ast.copy_location(ast.Name(id="_", ctx=node.ctx), node)
            def visit_Constant(self, node):
                return ast.copy_location(ast.Constant(value="_"), node)
        for case in load_catalog():
            shape = tuple(sorted(ast.dump(Normalize().visit(ast.parse(text)), include_attributes=False)
                                 for path, text in case["files"].items() if path.endswith(".py") and text.strip()))
            shapes[case["split"]].add(shape)
        self.assertFalse(shapes["development"] & shapes["locked"])


class EvaluationTests(unittest.TestCase):
    def setUp(self):
        self.case = next(item for item in load_cases() if item.case_id == "two_contexts")

    def test_missing_context_is_fn_not_template_recall(self):
        metrics = evaluate(self.case.expected, Prediction(operations=self.case.expected.operations[:1]))
        self.assertEqual((metrics["end_to_end"]["tp"], metrics["end_to_end"]["fn"]), (1, 1))
        self.assertEqual(metrics["templates"]["recall"], 1)
        self.assertEqual(metrics["end_to_end"]["recall"], .5)

    def test_wrong_algorithm_duplicate_and_unknown_stay_in_denominator(self):
        first, second = self.case.expected.operations
        wrong = OperationLabel.model_validate(second.model_dump() | {"algorithm": Known(value="RS256")})
        metrics = evaluate(self.case.expected, Prediction(operations=(first, first, wrong)))
        self.assertEqual((metrics["operations"]["tp"], metrics["operations"]["fp"]), (2, 1))
        self.assertEqual((metrics["end_to_end"]["tp"], metrics["end_to_end"]["fp"], metrics["end_to_end"]["fn"]), (1, 2, 1))
        unknown = OperationLabel.model_validate(second.model_dump() | {"algorithm": Unknown(reason="budget_limit")})
        metrics = evaluate(self.case.expected, Prediction(operations=(unknown,)))
        self.assertEqual(metrics["end_to_end"]["fn"], 2)
        self.assertEqual(metrics["unknown_predictions"], 1)

    def test_uninstantiated_template_does_not_match_invocation(self):
        first = self.case.expected.operations[0]
        template = OperationLabel.model_validate(first.model_dump() | {
            "context_kind": "uninstantiated_template", "context": ()})
        invoked = OperationLabel.model_validate(first.model_dump() | {"context": ()})
        metrics = evaluate(Prediction(operations=(template,)), Prediction(operations=(invoked,)))
        self.assertEqual(metrics["operations"]["tp"], 0)
        self.assertEqual(metrics["templates"]["tp"], 1)

    def test_zero_denominator_and_edge_types_are_separate(self):
        metrics = evaluate(Prediction(), Prediction())
        self.assertIsNone(metrics["end_to_end"]["precision"])
        self.assertIsNone(metrics["algorithm_accuracy"])
        metrics = evaluate(self.case.expected, Prediction(operations=self.case.expected.operations))
        self.assertEqual(metrics["end_to_end"]["recall"], 1)
        self.assertEqual(metrics["edges"]["ARGUMENT_FLOW"]["tp"], 0)
        self.assertGreater(metrics["edges"]["ARGUMENT_FLOW"]["fn"], 0)

    def test_adapter_failure_does_not_drop_gold(self):
        def failing(_):
            raise RuntimeError("source text must never be copied into report")
        result = run_cases((self.case,), failing)
        self.assertEqual(result["metrics"]["end_to_end"]["fn"], 2)
        self.assertEqual(result["cases"][0]["error"], "RuntimeError")
        self.assertNotIn("source text", json.dumps(result))

    def test_adapter_cannot_exclude_hallucinations_from_supported_scope(self):
        first = self.case.expected.operations[0]
        invented = OperationLabel.model_validate(first.model_dump() | {
            "sink": location("invented-source"), "supported": False})
        metrics = evaluate(self.case.expected, Prediction(operations=(invented,)))
        self.assertEqual(metrics["supported_end_to_end"]["fp"], 1)
        self.assertEqual(metrics["supported_end_to_end"]["fn"], 2)
        self.assertEqual(metrics["outside_support_end_to_end"]["fp"], 0)


class LegacyBaselineTests(unittest.TestCase):
    def test_four_inputs_sync_tasks_cli_reports_and_old_schemas(self):
        expected = json.loads(BASELINE.read_text(encoding="utf-8"))
        self.assertEqual(collect_baseline(), expected)
        self.assertEqual(len(expected["scans"]), 8)
        self.assertEqual(set(expected["reports"]), {"json", "csv", "markdown", "html"})
        for sample in expected["scans"].values():
            self.assertNotIn("deep_analysis", sample)


if __name__ == "__main__":
    unittest.main()
