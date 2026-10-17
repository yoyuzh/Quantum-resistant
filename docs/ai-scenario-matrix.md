# AI OpenSpec 场景与验证映射

变更：add-evidence-grounded-ai-analysis。全部自动模型测试为 mock；页面和 HTTP 验收只使用本地回环固定模型，不代表真实供应商效果。

## ai-provider-configuration

| Scenario | 自动测试（tests/ 下） | 补充证据 |
| --- | --- | --- |
| 未配置模型 | test_ai_config_models.AiConfigTests.test_default_disabled_and_no_network | 读取配置不联网，默认关闭 |
| 读取已配置状态 | test_public_version_and_internal_credential_binding、test_route_is_read_only_and_boundary_is_shared | 公开 origin/模型/预算，不公开 API key |
| 只查看预览 | test_ai_workflow.AiWorkflowTests.test_preview_has_no_calls_and_task_independent_export | 本地页面预览后 /fixture/ai calls=0 |
| 预览发生变化 | test_config_consent_boundary_and_capacity_no_calls、test_idempotency_consumption_expiration_and_conflict | 配置凭据变化、过期与摘要冲突均拒绝 |
| 模型返回重定向 | test_ai_provider.AiProviderTests.test_statuses_redirect_format_size_and_no_retry | 302 只请求一次，不跟随 Location |
| 上下文包含私钥 | test_ai_context.AiContextTests.test_redaction_and_original_line_mapping、test_multiline_secret_blocks_and_pem_public_body_are_masked | test_protocol_message_and_no_secret_in_messages 对比发送候选与预览对象 |
| 响应或总预算超限 | test_statuses_redirect_format_size_and_no_retry、test_timeout_connection_and_wall_clock、test_ai_workflow.AiWorkflowTests.test_partial_static_scope_and_timeout_retain_diagnostics | 响应字节、墙钟超时、任务超时；test_calls_budget_and_cancel_first_late_response 验证调用预算 |

## evidence-grounded-ai-analysis

| Scenario | 自动测试 | 补充证据 |
| --- | --- | --- |
| 静态零发现但存在独立候选 | test_ai_context.AiContextTests.test_zero_static_unknown_calls_wrappers_math_negative | 不执行源码，数学 pow 负例不产生候选 |
| 不支持或超过候选上限 | test_bounded_search_preview_and_long_line、test_structured_config_and_parse_failure | 检索/预览/候选/字节/长行边界分别计数 |
| 同名文件证据定位 | test_same_name_stable_order_and_ids | 独立 source_id/指纹，前端引用直接按 source_id 请求 |
| 模型捏造行号 | test_ai_provider.AiValidationTests.test_valid_abstention_and_fake_citations | 伪造来源、越界、未发送行、伪造 quote 均 invalid |
| 模型无法确定算法 | test_ai_config_models.AiModelTests.test_unknowns_abstention_and_enums、test_valid_abstention_and_fake_citations | unknown/abstain 保留，不自动解释为安全 |
| AI 质疑静态发现 | test_ai_workflow.AiWorkflowTests.test_preview_has_no_calls_and_task_independent_export | 页面固定模型显示质疑，原风险发现仍为1、迁移评分45；原扫描结果逐项不变 |
| 源码包含指令 | test_ai_provider.AiProviderTests.test_protocol_message_and_no_secret_in_messages | 源码注释留在不可信 user 数据，system 固定协议，不提供工具/秘密 |
| 使用固定响应评估 | test_ai_evaluation.AiEvaluationTests.test_reproducible_and_known_baseline | docs/ai-baseline-v1.json；人工保存预测，不是真实模型输出 |
| 无法计算指标 | test_unknown_labels_zero_denominator_and_split_leak、test_duplicate_matching_and_abstention_recall_denominator | 零分母 null，弃答保留召回分母，未知类别拒绝 |

## ai-analysis-workflow

| Scenario | 自动测试 | 补充证据 |
| --- | --- | --- |
| 已有结果未启用 AI | test_ai_config_models.AiConfigTests.test_default_disabled_and_no_network、test_ai_workflow.AiWorkflowTests.test_preview_has_no_calls_and_task_independent_export | 原四报告与 CLI 完整回归；普通扫描零模型调用 |
| 来源不满足分析条件 | test_source_rejections_and_preview_ttl、test_zero_candidates_all_abstention_error_diagnostics_and_source_expiry | 运行中409、不支持409、来源过期404、无源码提示 |
| 提交响应丢失后重试 | test_idempotency_consumption_expiration_and_conflict | 同请求标识返回原任务，预览已消费仍可重试；前端测试提交连接失败重用标识 |
| 重复标识冲突 | test_idempotency_consumption_expiration_and_conflict | 同标识不同摘要409，另标识消费同预览409 |
| 部分完成后取消 | test_cancel_discards_late_batch_and_keeps_complete_items | 第一批5项保留，第二批迟到丢弃，partial |
| 取消前无有效结果 | test_calls_budget_and_cancel_first_late_response | 首批迟到无意见，cancelled，停止后续批次 |
| 排队期间来源过期 | test_submit_storage_failure_rolls_back_and_queue_snapshot_survives | 两个执行槽被占，AI 排队，删除来源后仍使用独立快照 |
| 切换来源后收到旧响应 | web/tests/aiAnalysis.test.js“切换来源丢弃迟到响应；切回恢复所属结果” | 前端 generation + AbortController，不将旧意见显示到新来源 |
| 导出包含质疑和新候选 | test_preview_has_no_calls_and_task_independent_export、前端意见筛选测试 | 浏览器下载 output/playwright/ai-20261016/ai-analysis.json，含质疑/新候选，独立白名单，无完整源码或凭据 |

## 诊断、资源与人工复核

- 外层/单项/重复/未知/遗漏 JSON：test_outer_json_item_errors_duplicates_unknown_missing、test_partial_response_retains_valid_item_and_redacted_quote。
- 供应商鉴权/限流/异常状态/重定向/压缩/响应超限/协议错误：test_statuses_redirect_format_size_and_no_retry；超时/连接/墙钟：test_timeout_connection_and_wall_clock；全局并发1：test_global_model_concurrency_is_one。
- 调用预算/取消：test_calls_budget_and_cancel_first_late_response；任务时限：test_partial_static_scope_and_timeout_retain_diagnostics；单候选输入预算：test_single_candidate_request_bytes_budget_never_calls_model，零模型调用，不重发同一候选。
- 临时容量/预览清理/来源读者释放/失败回滚：test_preview_limits_cleanup_and_storage_failure、test_submit_storage_failure_rolls_back_and_queue_snapshot_survives；TaskStore 原有 TTL/结果数量/存储读者保护继续由 test_tasks_and_reports.py、test_storage_scheduler.py 覆盖。
- 主线程复核：凭据只入 Authorization；受信端点固定且不重定向；HTTP 并发仍共用8槽；模型并发1；请求标识查询先于预览检查；提交和消费在同锁内；快照与来源读者分离；存储回收与任务终态沿用同一 TaskStore。
- 页面已检查预览零调用、确认后发送、独立意见、风险计数不变、刷新恢复、390px无横向溢出、源码过期显示快照、专用下载。真实供应商连通、效果、成本与安装包 GUI 尚未验收。
