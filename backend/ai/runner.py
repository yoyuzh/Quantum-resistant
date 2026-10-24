from __future__ import annotations

from datetime import datetime, timedelta, timezone
import time

from backend.ai.config import AiConfig
from backend.ai.models import AiAnalysisResult, AiCoverage, AiDiagnostic, Preview, Usage
from backend.ai.provider import ProviderError, complete, request_body
from backend.ai.validation import parse_opinions
from backend.collection_common import CollectionCancelled, CollectionTimeout, Deadline


def _estimate_output_bytes(candidate) -> int:
    """保守估算结构化意见余量；不把估算结果写成供应商 usage。"""
    context = sum(len(line.text.encode("utf-8")) for line in candidate.lines)
    return max(512, min(16 * 1024, context // 2 + 512))


def analyze(preview: Preview, config: AiConfig, budget: Deadline) -> dict:
    started = time.monotonic()
    deadline = budget.child(config.budgets["task_seconds"])
    result = AiAnalysisResult(source_task_id=preview.source_task_id, input_digest=preview.digest,
                              created_at=datetime.now(timezone(timedelta(hours=8))).isoformat(),
                              provider=preview.target_origin, model=preview.model,
                              candidate_coverage=preview.candidate_coverage,
                              candidates=preview.candidates,
                              ai_coverage=AiCoverage(planned=len(preview.candidates)))
    pending = list(preview.candidates)
    usage_values = []
    output_budget = min(config.budgets["response_bytes"], config.budgets["output_tokens"] * 4)
    try:
        while pending:
            deadline.remaining()
            if result.ai_coverage.calls >= config.budgets["max_calls"]:
                result.diagnostics.append(AiDiagnostic(code="call_budget", message="模型调用次数已达预算，剩余候选未处理",
                                                       scope="task"))
                result.ai_coverage.stop_reason = "call_budget"
                break
            # 只在几乎没有队列/响应余量时停止；单请求墙钟仍由 provider 的 Deadline 强制。
            remaining = max(0.0, deadline.end - time.monotonic())
            queue_reserve = min(0.25, max(0.05, config.budgets["request_seconds"] * 0.05))
            retry_reserve = min(1.0, 2.0 if config.budgets["max_calls"] > 1 else 0.0)
            if remaining <= queue_reserve + retry_reserve * 0.05:
                result.diagnostics.append(AiDiagnostic(code="time_budget", message="剩余任务时间不足以安全发送下一批",
                                                       scope="task"))
                result.ai_coverage.stop_reason = "time_budget"
                break
            batch = []
            batch_input_bytes = 0
            batch_output_bytes = 0
            while pending and len(batch) < config.budgets["batch_candidates"]:
                candidate = pending[0]
                candidate_body = request_body(config, [*batch, candidate])
                candidate_input_bytes = len(candidate_body) - batch_input_bytes
                candidate_output_bytes = _estimate_output_bytes(candidate)
                if batch and (len(candidate_body) > config.budgets["request_bytes"] or
                              batch_output_bytes + candidate_output_bytes > output_budget):
                    break
                if not batch and len(candidate_body) > config.budgets["request_bytes"]:
                    pending.pop(0)
                    result.diagnostics.append(AiDiagnostic(code="request_budget", message="单候选超过模型输入字节预算，未发送",
                                                           candidate_id=candidate.candidate_id, scope="batch"))
                    continue
                if not batch and candidate_output_bytes > output_budget:
                    pending.pop(0)
                    result.diagnostics.append(AiDiagnostic(code="output_budget", message="单候选超过结构化输出余量，未发送",
                                                           candidate_id=candidate.candidate_id, scope="batch"))
                    continue
                batch.append(candidate)
                batch_input_bytes = len(candidate_body)
                batch_output_bytes += candidate_output_bytes
                pending.pop(0)
            if not batch:
                result.ai_coverage.unfinished = len(pending)
                if result.ai_coverage.stop_reason is None:
                    result.ai_coverage.stop_reason = "batch_budget"
                break
            budget.control.emit(stage="模型分析", ai_progress=result.ai_coverage.model_dump())

            def sent():
                deadline.remaining()
                if result.ai_coverage.calls >= config.budgets["max_calls"]:
                    raise ProviderError("call_budget", "模型调用次数已达预算，停止重试及后续请求")
                result.ai_coverage.calls += 1
                budget.control.emit(stage="模型分析", ai_progress=result.ai_coverage.model_dump())

            def retried():
                result.ai_coverage.retries += 1

            content, usage = complete(config, batch, deadline, on_send=sent, on_retry=retried)
            # 取消/截止后到达的整批响应也不接纳。
            deadline.remaining()
            budget.control.emit(stage="核验引用")
            opinions, diagnostics = parse_opinions(content, batch)
            deadline.remaining()
            result.opinions.extend(opinions)
            result.diagnostics.extend(AiDiagnostic(**item.model_dump(exclude={"scope"}), scope="batch") for item in diagnostics)
            if not all(type(getattr(usage, key)) is int and getattr(usage, key) >= 0 for key in Usage.model_fields):
                result.diagnostics.append(AiDiagnostic(code="usage_unavailable",
                                                       message="供应商未返回完整可验证 usage，用量保持未知",
                                                       scope="batch"))
            result.ai_coverage.completed += len(opinions)
            usage_values.append(usage)
    except ProviderError as exc:
        scope = "global" if exc.code in {"provider_auth", "provider_rate_limit", "provider_connection",
                                         "provider_http", "response_encoding"} else "batch"
        result.diagnostics.append(AiDiagnostic(code=exc.code, message=exc.message, scope=scope))
        result.ai_coverage.stop_reason = exc.code
    except CollectionCancelled:
        result.diagnostics.append(AiDiagnostic(code="cancelled", message="已取消；已发送数据无法撤回，停止后续模型请求",
                                               scope="task"))
        result.ai_coverage.stop_reason = "cancelled"
    except CollectionTimeout:
        result.diagnostics.append(AiDiagnostic(code="task_timeout", message="AI 分析达到截止时间，已停止后续请求",
                                               scope="task"))
        result.ai_coverage.stop_reason = "task_timeout"
    result.ai_coverage.unfinished = max(0, result.ai_coverage.planned - result.ai_coverage.completed)
    result.ai_coverage.partial = result.ai_coverage.completed != result.ai_coverage.planned
    result.ai_coverage.elapsed_seconds = round(time.monotonic() - started, 6)
    result.candidate_coverage.analyzed_candidates = result.ai_coverage.completed
    # 任一已发送请求无 usage、失败或重试未形成可完整归因的 usage 时，
    # 不将局部和误称为任务真实用量。
    usage_complete = bool(usage_values) and len(usage_values) == result.ai_coverage.calls and all(
        type(getattr(item, key)) is int and getattr(item, key) >= 0
        for item in usage_values for key in Usage.model_fields
    )
    if usage_complete:
        result.usage = Usage(**{key: sum(values) for key in Usage.model_fields
                               for values in [[getattr(item, key) for item in usage_values]]})
    elif result.ai_coverage.calls and not any(item.code == "usage_unavailable" for item in result.diagnostics):
        result.diagnostics.append(AiDiagnostic(code="usage_unavailable",
                                               message="供应商 usage 无法覆盖全部实际请求，用量保持未知",
                                               scope="task"))
    budget.control.emit(ai_progress=result.ai_coverage.model_dump())
    return result.model_dump()
