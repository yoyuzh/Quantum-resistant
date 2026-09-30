# 架构与能力边界

## 数据流

输入 → 请求模型/上传边界 → 采集文档（可附带范围和诊断）→ 扫描服务 → 扫描器 → 结果与报告。

扫描器分四层：规则资料、Python AST、文本回退、结果汇总。公共 facade 保留原调用方式。AST 记录完整导入路径并处理常见绑定遮蔽；它不是跨模块/跨函数数据流分析器，不保证动态导入、反射或复杂控制流的识别。解析失败会给出诊断，再用保守文本回退。

后端各模块不依赖 CLI 输出。网页和批量脚本共享 `popular.py` 的检索、采集上限、并发编排和结果结构，避免实现分叉。HTTP 下载检查解码后的响应字节数、截止时间和有限 socket 超时；归档路径拒绝绝对路径和父目录跳转。协作式截止无法强制杀死正在执行的线程，网络操作自行有界退出。

前端组件通过 props/emits 连接，composable 管理每种模式的结果与进行中请求。请求标识与 AbortController 防止卸载或过时响应覆盖状态；finally 清理计时器。失败不清空已有结果。分页和筛选使用纯函数，源码查找使用 source_id。

分析输出由 `backend/analysis.py` 的纯函数集中生成：按 source_id 与算法聚合资产，按受影响文件数、发现数、算法名稳定排序迁移待办。页面与 Markdown/JSON 报告复用该结果；导出接口依据提交的原始 findings 重新汇总，不信任客户端预计算的 analysis。CSV 每条发现一行，保留 source_id，处理引号、换行和表格公式前缀。三种导出默认不包含完整源码。

前端右侧包含分析概览、资产清单、发现明细、迁移待办。证据关系图中，文件—算法实线来自本次扫描，算法—迁移方向虚线为静态建议，不是依赖或传播关系。图每页最多12个文件，图内搜索不改变全量摘要；节点与边联动发现筛选，资产位置可自动展开对应源码。历史响应没有 analysis 时保留原始发现，不推测完整资产；热门详情截断时不构造完整清单。

`useTaskRunner` 负责 Vue 渲染后的展示起点与卸载清理，`utils/tasks.js` 管理各来源独立的请求、最短展示和取消。扫描请求立即发出，四类扫描与主动热门刷新至少呈现1500ms加载视图；慢请求不追加延时，缓存读取和导出无强制等待。失败恢复旧结果。减少动画偏好关闭视觉运动但保留状态反馈和稳定展示时间。

## 响应约定

原 `sources`、`findings`、`summary`（含 `migration_score`）等字段保留。新增：

- `coverage`：scanned_files、file_limit、candidate_files（未知为 null）、skipped_files、partial。
- `diagnostics`：code、message、可选 source_id；例如 syntax_fallback、unknown_pem_algorithm、partial_collection。以实现中的 code 常量/字面量为准。
- findings 的可选 `detection_method`：ast_call、ast_config、text_call、text_config、pem_header。可选 `library` / `resolved_api` 只用于已确认的 AST 密码 API 调用，缺失显示未记录。元数据随原识别过程产生，不重复扫描全文。
- 可选 `analysis`：version=1、assets、migrations；仅描述当前输入的证据资产，不是完整或 CycloneDX 格式的 CBOM。

公共 `analyze_source` / `scan_source_for_crypto` 通过 keyword-only 的 `include_metadata=True` 返回增强字段，默认关闭，CLI JSON 保持原字段。网页扫描与热门采集显式启用；原发现数量、去重规则和评分公式保持一致。

保留 `POST /api/report/markdown`，新增 `POST /api/report/json` 和 `POST /api/report/csv`，均复用 ReportRequest，兼容缺少元数据的旧请求。JSON 导出含文件元信息、范围、诊断、原始发现、摘要和重新生成的分析，不输出 sources.content；CSV 为发现明细，不是完整扫描范围报告。

热门响应保留 repos/meta/scanned_at，增加 failures 及每仓库 coverage/diagnostics/details_truncated。每仓库详情最多20项，总发现数量单独保留。历史结果缺少 coverage 时不可推算完整覆盖率。报告同步展示范围与诊断。

## 运行边界

当前无任务队列、数据库、分布式锁或历史记录。热门 JSON 是最近一次有效快照，单进程锁防止同一 API 进程重复刷新；独立 CLI 或多个 API worker 不共享锁。上传内容只在请求及前端会话中使用；热门结果持久化到本地 JSON。

静态规则适合作为人工复核的起点，不能判断完整协议上下文、实际执行路径、密钥用途或部署环境。其他语言仅有文本规则。研究报告提出的依赖网络构建、量子风险传播、交互图分析及实验评估均属于后续研究，不在当前成果中宣称完成。

## 验证策略

unittest 覆盖实际共享服务、API、上传边界、并发截止、存储失败、模拟 HTTP 和本地归档；Hypothesis 检查批量结果性质。Node 原生测试直接验证文件去重/边界、筛选/分页和 API 错误处理。浏览器使用本地 fixture 验证四类来源、部分成功、失败保留、榜单、源码、导出、响应式及键盘操作，不依赖真实远程服务。
