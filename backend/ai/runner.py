from __future__ import annotations

from datetime import datetime, timedelta, timezone

from backend.ai.config import AiConfig
from backend.ai.models import AiAnalysisResult, AiCoverage, AiDiagnostic, Preview, Usage
from backend.ai.provider import ProviderError, complete, request_body
from backend.ai.validation import parse_opinions
from backend.collection_common import CollectionCancelled, CollectionTimeout, Deadline


def analyze(preview: Preview, config: AiConfig, budget: Deadline) -> dict:
    deadline = budget.child(config.budgets["task_seconds"])
    result = AiAnalysisResult(source_task_id=preview.source_task_id, input_digest=preview.digest,
                              created_at=datetime.now(timezone(timedelta(hours=8))).isoformat(),
                              provider=preview.target_origin, model=preview.model,
                              candidate_coverage=preview.candidate_coverage,
                              candidates=preview.candidates, ai_coverage=AiCoverage(planned=len(preview.candidates)))
    pending = list(preview.candidates)
    usage_values = []
    try:
        while pending:
            deadline.remaining()
            if result.ai_coverage.calls >= config.budgets["max_calls"]:
                result.diagnostics.append(AiDiagnostic(code="call_budget", message="模型调用次数已达预算，剩余候选未处理"))
                break
            batch = []
            while pending and len(batch) < config.budgets["batch_candidates"]:
                candidate = pending[0]
                if len(request_body(config, [*batch, candidate])) > config.budgets["request_bytes"]:
                    if batch:
                        break
                    pending.pop(0)
                    result.diagnostics.append(AiDiagnostic(code="request_budget", message="单候选超过模型输入字节预算，未发送", candidate_id=candidate.candidate_id))
                    continue
                batch.append(pending.pop(0))
            if not batch:
                continue
            budget.control.emit(stage="模型分析", ai_progress=result.ai_coverage.model_dump())

            def sent():
                result.ai_coverage.calls += 1
                budget.control.emit(ai_progress=result.ai_coverage.model_dump())

            content, usage = complete(config, batch, deadline, on_send=sent)
            # 取消/截止后到达的整批响应也不接纳。
            deadline.remaining()
            budget.control.emit(stage="核验引用")
            opinions, diagnostics = parse_opinions(content, batch)
            deadline.remaining()
            result.opinions.extend(opinions)
            result.diagnostics.extend(diagnostics)
            result.ai_coverage.completed += len(opinions)
            usage_values.append(usage)
    except ProviderError as exc:
        result.diagnostics.append(AiDiagnostic(code=exc.code, message=exc.message))
    except CollectionCancelled:
        result.diagnostics.append(AiDiagnostic(code="cancelled", message="已取消；已发送数据无法撤回，停止后续模型请求"))
    except CollectionTimeout:
        result.diagnostics.append(AiDiagnostic(code="task_timeout", message="AI 分析达到截止时间，已停止后续请求"))
    result.ai_coverage.partial = result.ai_coverage.completed != result.ai_coverage.planned
    # 任一已发送请求无 usage 时，不将局部和误称为任务真实用量。
    if len(usage_values) == result.ai_coverage.calls and usage_values:
        result.usage = Usage(**{key: sum(values) if all(value is not None for value in values) else None
                               for key in Usage.model_fields
                               for values in [[getattr(item, key) for item in usage_values]]})
    budget.control.emit(ai_progress=result.ai_coverage.model_dump())
    return result.model_dump()
