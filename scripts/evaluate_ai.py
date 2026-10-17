"""固定清单与保存预测的离线评分；不调用模型、不执行样例。"""
from __future__ import annotations

import argparse
import hashlib
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

GROUPS = ("static", "model_only", "static_review", "hybrid")
CATEGORIES = {"quantum_vulnerable", "pqc_asset", "crypto_misuse", "non_crypto"}


def unit(sample_id: str, row: dict) -> tuple:
    if row.get("category") not in CATEGORIES:
        raise ValueError("未知标签类别")
    if type(row.get("line")) is not int or row["line"] < 1:
        raise ValueError("标签行号无效")
    return sample_id, row["line"], row["algorithm"], row["purpose"], row["category"]


def ratio(numerator: int, denominator: int) -> float | None:
    return numerator / denominator if denominator else None


def evaluate(manifest: dict, predictions: dict, split="test", category="quantum_vulnerable") -> dict:
    if category not in CATEGORIES:
        raise ValueError("未知评分标签范围")
    family_splits = {}
    ids = set()
    for sample in manifest["samples"]:
        if sample["id"] in ids:
            raise ValueError("重复样本标识")
        ids.add(sample["id"])
        family = sample["project_family"]
        family_splits.setdefault(family, set()).add(sample["split"])
        for label in sample["labels"]:
            unit(sample["id"], label)
    if any(len(values) > 1 for values in family_splits.values()):
        raise ValueError("同源项目不能跨开发/测试集合")
    samples = [sample for sample in manifest["samples"] if sample["split"] == split]
    selected_ids = {sample["id"] for sample in samples}
    truth = {unit(sample["id"], label) for sample in samples for label in sample["labels"] if label["category"] == category}
    output = {"dataset_version": manifest["version"], "split": split, "category": category,
              "sample_count": len(samples), "positive_count": len(truth),
              "versions": predictions.get("versions", {}), "evidence": predictions.get("evidence", "unknown"), "groups": {}}
    for name in GROUPS:
        records = predictions.get("groups", {}).get(name, [])
        if len({record["sample_id"] for record in records}) != len(records):
            raise ValueError("同一预测组不能重复样本记录")
        if any(record["sample_id"] not in ids for record in records):
            raise ValueError("预测引用未知样本")
        rows = [record for record in records if record["sample_id"] in selected_ids]
        predicted, candidate_hits = set(), set()
        abstentions, opinion_count, cited, valid = 0, 0, 0, 0
        for record in rows:
            sample_id = record["sample_id"]
            for candidate in record.get("candidates", []):
                candidate_hits.update(item for item in truth if item[0] == sample_id and candidate["start_line"] <= item[1] <= candidate["end_line"])
            for opinion in record.get("opinions", []):
                matched_unit = unit(sample_id, opinion)
                opinion_count += 1
                if opinion.get("opinion_kind") == "abstain":
                    abstentions += 1
                elif opinion["category"] == category:
                    predicted.add(matched_unit)
                if opinion.get("citation_status") in {"valid", "invalid", "absent"}:
                    cited += 1
                    valid += opinion["citation_status"] == "valid"
        matched = predicted & truth
        precision, recall = ratio(len(matched), len(predicted)), ratio(len(matched), len(truth))
        f1 = (2 * precision * recall / (precision + recall) if precision is not None and recall is not None and precision + recall
              else 0.0 if precision is not None and recall is not None else None)
        # 任一记录未知则不把局部和报告为真实任务用量。
        usages = [record.get("total_tokens") for record in rows]
        elapsed = [record.get("elapsed_seconds") for record in rows]
        output["groups"][name] = {"sample_count": len(rows), "truth_count": len(truth),
            "prediction_count": len(predicted), "true_positive": len(matched),
            "false_positive": len(predicted - truth), "false_negative": len(truth - predicted),
            "precision": precision, "recall": recall if rows else None, "f1": f1,
            "candidate_recall": ratio(len(candidate_hits), len(truth)) if rows else None,
            "abstention_rate": ratio(abstentions, opinion_count), "citation_valid_rate": ratio(valid, cited),
            "total_tokens": sum(usages) if usages and all(type(value) is int and value >= 0 for value in usages) else None,
            "elapsed_seconds": sum(elapsed) if elapsed and all(type(value) in {int, float} and value >= 0 for value in elapsed) else None,
            "not_computable": not bool(rows) or precision is None or recall is None}
    return output


def load_dataset(path: Path) -> dict:
    data = json.loads(path.read_text(encoding="utf-8"))
    for sample in data["samples"]:
        # 清单不能借路径读取项目外文件。
        source = (path.parent / sample["path"]).resolve()
        if not source.is_relative_to(path.parent.resolve()):
            raise ValueError("样本路径越界")
        if hashlib.sha256(source.read_bytes()).hexdigest() != sample["sha256"]:
            raise ValueError("样本内容摘要不符")
    return data


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--manifest", type=Path, default=ROOT / "tests/fixtures/ai/manifest.json")
    parser.add_argument("--predictions", type=Path, default=ROOT / "tests/fixtures/ai/saved_predictions.json")
    parser.add_argument("--split", choices=["dev", "test"], default="test")
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    report = evaluate(load_dataset(args.manifest), json.loads(args.predictions.read_text(encoding="utf-8")), args.split)
    text = json.dumps(report, ensure_ascii=False, indent=2) + "\n"
    if args.output:
        args.output.write_text(text, encoding="utf-8")
    else:
        print(text, end="")


if __name__ == "__main__":
    main()
