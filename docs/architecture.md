# 架构与能力边界

## 数据流

输入 → 请求模型/上传边界 → 采集文档（可附带范围和诊断）→ 扫描服务 → 扫描器 → 结果与报告。

扫描器分四层：规则资料、Python AST、文本回退、结果汇总。公共 facade 保留原调用方式。AST 记录完整导入路径并处理常见绑定遮蔽；它不是跨模块/跨函数数据流分析器，不保证动态导入、反射或复杂控制流的识别。解析失败会给出诊断，再用保守文本回退。

后端各模块不依赖 CLI 输出。网页和批量脚本共享 `popular.py` 的检索、采集上限、并发编排和结果结构，避免实现分叉。HTTP 下载检查解码后的响应字节数、截止时间和有限 socket 超时；归档路径拒绝绝对路径和父目录跳转。协作式截止无法强制杀死正在执行的线程，网络操作自行有界退出。

前端组件通过 props/emits 连接，composable 管理每种模式的结果与进行中请求。请求标识与 AbortController 防止卸载或过时响应覆盖状态；finally 清理计时器。失败不清空已有结果。分页和筛选使用纯函数，源码查找使用 source_id。

## 响应约定

原 `sources`、`findings`、`summary`（含 `migration_score`）等字段保留。新增：

- `coverage`：scanned_files、file_limit、candidate_files（未知为 null）、skipped_files、partial。
- `diagnostics`：code、message、可选 source_id；例如 syntax_fallback、unknown_pem_algorithm、partial_collection。以实现中的 code 常量/字面量为准。

热门响应保留 repos/meta/scanned_at，增加 failures 及每仓库 coverage/diagnostics/details_truncated。每仓库详情最多20项，总发现数量单独保留。历史结果缺少 coverage 时不可推算完整覆盖率。报告同步展示范围与诊断。

## 运行边界

当前无任务队列、数据库、分布式锁或历史记录。热门 JSON 是最近一次有效快照，单进程锁防止同一 API 进程重复刷新；独立 CLI 或多个 API worker 不共享锁。上传内容只在请求及前端会话中使用；热门结果持久化到本地 JSON。

静态规则适合作为人工复核的起点，不能判断完整协议上下文、实际执行路径、密钥用途或部署环境。其他语言仅有文本规则。研究报告提出的依赖网络构建、量子风险传播、交互图分析及实验评估均属于后续研究，不在当前成果中宣称完成。

## 验证策略

unittest 覆盖实际共享服务、API、上传边界、并发截止、存储失败、模拟 HTTP 和本地归档；Hypothesis 检查批量结果性质。Node 原生测试直接验证文件去重/边界、筛选/分页和 API 错误处理。浏览器使用本地 fixture 验证四类来源、部分成功、失败保留、榜单、源码、导出、响应式及键盘操作，不依赖真实远程服务。
