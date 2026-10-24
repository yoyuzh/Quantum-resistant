# Proposal

## Why

真实模型接入验证表明，当前 AI 分析在候选重复、请求延迟和上下文不足时容易在任务截止前只完成少量候选，结果被标记为 partial。模型能够识别 RSA 及部分用途，但尚未稳定产出面向迁移决策的具体建议，且本地代理未返回用量，难以评估成本和吞吐。现在需要在保持静态扫描结果兼容、证据边界和用户主动确认的前提下，提升候选效率、任务完成率和意见可操作性。

## What Changes

- 对同一文件中语义等价的密码 API 调用进行保守聚合，保留每个原始位置和成员映射，减少重复候选和重复模型请求。
- 为候选构造补充有限的调用方、赋值目标、后续使用和局部配置上下文，并明确上下文不足时的弃答理由。
- 调整 AI 批处理、超时和任务预算策略，使更多候选在截止时间内完成；保留部分完成和未分析范围的准确诊断。
- 扩展结构化 AI 意见，要求在证据充分时给出迁移方向、适用条件和下一步人工核查项；迁移建议接受独立的用途/算法兼容性校验，证据不足时保持 unknown/abstain，不得强行推断。
- 记录供应商返回的 usage；未返回 usage 时继续使用 null，并在结果中明确未知。
- 增加固定基线、反例和四组消融实验，验证聚合压缩率、位置保留率、用途判断和迁移建议证据率；自动化测试仍使用 mock，不调用真实供应商。
- 保持原始静态 findings、扫描评分、既有 API 字段和四种输入兼容。

## Capabilities

### New Capabilities

无。

### Modified Capabilities

- `ai-analysis-workflow`: 改变候选处理效率、任务完成范围和部分结果诊断要求。
- `evidence-grounded-ai-analysis`: 改变候选聚合、上下文证据和可操作迁移意见的结构化要求。
- `ai-provider-configuration`: 改变批处理/预算可观测性及供应商 usage 记录要求。

## Impact

- 后端：`backend/ai/candidates.py`、`backend/ai/context.py`、`backend/ai/runner.py`、`backend/ai/provider.py`、`backend/ai/models.py`、`backend/ai/config.py` 及相关路由和报告。
- 测试：AI 配置、候选、上下文、provider、workflow、评估和前端 AI 状态测试；增加重复候选、慢模型、usage 缺失和迁移建议契约测试。
- 文档：AI 分析契约、验证矩阵和运行说明。
- 运行行为：默认仍不自动调用模型；用户确认预览后才发送脱敏候选。不会新增生产依赖或改变静态扫描评分。
