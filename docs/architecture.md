# 架构与能力边界

## 数据流

输入 → 请求模型/上传边界 → 采集文档（可附带范围和诊断）→ 扫描服务 → 扫描器 → 结果与报告。

扫描器分四层：规则资料、Python AST、文本回退、结果汇总。公共 facade 保留原调用方式。AST 记录完整导入路径并处理常见绑定遮蔽；它不是跨模块/跨函数数据流分析器，不保证动态导入、反射或复杂控制流的识别。解析失败会给出诊断，再用保守文本回退。

后端各模块不依赖 CLI 输出。网页和批量脚本共享 `popular.py` 的检索、采集上限、并发编排和结果结构，避免实现分叉。HTTP 下载检查解码后的响应字节数、截止时间和有限 socket 超时；归档路径拒绝绝对路径和父目录跳转。协作式截止无法强制杀死正在执行的线程，网络操作自行有界退出。

前端组件通过 props/emits 连接，composable 管理每种模式的结果与进行中请求。请求标识与 AbortController 防止卸载或过时响应覆盖状态；finally 清理计时器。失败不清空已有结果。分页和筛选使用纯函数，源码查找使用 source_id。

分析输出由 `backend/analysis.py` 的纯函数集中生成：按 source_id 与算法聚合资产，按受影响文件数、发现数、算法名稳定排序迁移待办。页面与 HTML/Markdown/JSON 报告复用该结果；导出接口依据提交的原始 findings 重新汇总，不信任客户端预计算的 analysis。CSV 每条发现一行，保留 source_id，处理引号、换行和表格公式前缀。四种导出默认不包含完整源码。

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

当前使用单进程、有容量限制的任务队列，无数据库、分布式锁或持久化任务历史。热门JSON是最近一次完整结束的有效快照，单进程锁覆盖旧同步API与新后台任务；独立CLI或多个worker不共享锁。源码、归档、结果暂存在系统临时目录 `quantum-resistant-scans/`，源码使用连续文件与偏移定位，避免创建数千个小文件。进程租约防止清理其他运行实例；服务重启清理已退出实例的孤立目录。任务对象保存元数据和文件引用，前端源码缓存10文件。

## 后台任务接口与生命周期

- `POST /api/tasks/github`、`/pypi`、`/popular`、`/snippet` 使用对应原请求模型，`/files`使用multipart。要求 `X-Request-ID`（16–64位字母、数字、短横线或下划线；网页生成UUID）。返回202和状态快照。同标识与同输入在保留期内返回同一任务；输入冲突409，队列满429。上传指纹包括文件顺序、规范化名称和内容摘要；片段任务只保存名称与摘要。
- `GET /api/tasks/{id}` 保留原状态字段，增加candidate_files、processed_files、skipped_files、analysis_total、totals_final、download_bytes、download_total和repositories。并发仓库按scope独立记录阶段，不能覆盖全局阶段。阶段与计数来自实际回调，总数未知时不显示百分比；候选处理数包括已确认跳过项，分析数只计完整完成文件。
- `GET /api/tasks/{id}/result` 默认返回原完整ScanResponse或热门响应；网页使用 `include_content=false`，sources.content为空字符串、content_available标记是否可读。`GET /api/tasks/{id}/sources/{source_id}` 按需返回source_id/content。未结束或无结果409，过期/重启404。读取时临时固定任务，文件读取和JSON解码不持有状态锁；报告提交只带文件元数据，不回传源码。
- `POST /api/tasks/{id}/cancel` 幂等取消。状态为 queued/running/succeeded/partial/failed/cancelled；取消时有完整分析过的文件可进入 partial，没有则 cancelled。终态不被迟到回调修改。
- `TaskStore` 最多2个执行线程、4个排队任务；终态保留15分钟、最多8份、序列化结果512MiB。终态定时到期，并在访问/提交/完成时补充清理；临时存储全局2GiB，空间不足优先清理旧终态任务，不删除正在运行或读取的任务。分析已完成但暂存不足时先释放本次原始源码，记录source_storage_evicted诊断及content_available=false，尝试保留完整分析结果；单份结果超过缓存容量显示失败原因，不返回一个已经被自动淘汰的任务ID。上述限制不代表进程内存硬上限。
- 普通扫描600秒、热门网页/同步/CLI批次1200秒。共享生产者/消费者管线边采集边分析；队列最多16文件/8MiB待分析文本，分析全局并发2路。每来源5000文件/100MiB文本、单文件2MiB、上传请求110MiB、归档200MiB；热门512MiB按仓库均分且每仓库不超过100MiB。取消在网络、归档、排队和文件分析边界生效，最多2秒整理并发采集成果，不能强制中断正在进行的单文件AST分析。
- 网页按1秒串行查询，每个状态请求10秒、结果请求60秒；断线退避最高5秒。上传使用XHR真实传输事件与600秒传输超时，上传完成后切换后台进度；卸载清理请求/定时器，后台任务继续运行，sessionStorage仅保存任务ID以便刷新恢复。提交响应丢失按同请求标识最多重试两次，不创建重复扫描。1500ms最短展示和慢任务不追加等待保持不变。
- 热门未完整结束时不写快照；原子保存失败仍返回本次结果和 save_error。保存前的取消检查与进入保存阶段互斥；一旦开始保存已完成结果，取消不再改变该次结果。

## 丰富输出与离线报告

`analysis.insights` 是新增可选统计：算法、受影响文件Top8及其余汇总、识别方式、互斥用途分组、中文结论；全部来自原始发现，unknown方法归为未记录。共享纯函数供页面和报告使用，无额外源码扫描或LLM推断。

`POST /api/report/html` 同样使用 ReportRequest。离线报告只包含内联CSS/SVG和转义后的文本，无脚本或外部资源加载；保留NIST参考链接，支持A4打印样式。Markdown将发现明细拆成独立条目，JSON追加相同统计，CSV列顺序和一发现一行不变。四种导出默认不包含完整源码。

HTTP采集复用仓库级客户端，全局并发8；重试最多两次并遵循Retry-After，等待超过预算停止。连接/读取/池等待有独立超时；解码后的响应移除Content-Encoding，避免二次解压。归档字节进度仅在Content-Length与解码计量一致时给出总数。GitHub大于32候选或文件树截断时优先固定版本归档，失败回退逐文件并发4路；PyPI最多尝试3个有效发行包。文本预算按来源独立计量；coverage.skip_reasons区分数量/大小/文本预算/编码/路径/读取/下载/分析异常/取消/超时等，零发现和未扫描部分不可推定安全。

静态规则适合作为人工复核的起点，不能判断完整协议上下文、实际执行路径、密钥用途或部署环境。其他语言仅有文本规则。研究报告提出的依赖网络构建、量子风险传播、交互图分析及实验评估均属于后续研究，不在当前成果中宣称完成。

## 安全边界与模块补充（2026-10）

`request_boundary.py` 在模型解析前统一校验Host、写请求Origin与实际JSON字节；`http_safety.py` 统一远程逐跳校验及有界解压；`archive_limits.py` 负责ZIP预检和累计展开预算。可信内网主机与显式开发Origin通过README所列环境变量配置，不读取不可信转发头。

`scheduler.py` 的容量同时覆盖同步扫描、后台任务和上传预留，共2执行/4等待。`task_execution.py` 管理扫描管线及资源收尾；`scan_routes.py` 保留同步兼容接口，`task_routes.py` 为后台适配器，`report_routes.py` 只转换报告输入/输出。任务目录和读者归属通过TaskStore有锁接口访问，服务关闭等待占用释放后清理临时存储。

multipart兼容与流式入口共用`multipart.py`；上传600秒总限时、30秒空闲限时。JSON限制12MiB+64KiB/110MiB/64KiB分别用于片段/报告/其他提交。归档成员10万、元数据64MiB、累计展开1GiB，包含跳过成员与重复读取，详情见[检查记录](security-review.md)。

## 验证策略

unittest 覆盖实际共享服务、API、上传边界、并发截止、存储失败、模拟 HTTP 和本地归档；Hypothesis 检查批量结果性质。Node 原生测试直接验证文件去重/边界、筛选/分页和 API 错误处理。浏览器使用本地 fixture 验证四类来源、部分成功、失败保留、榜单、源码、导出、响应式及键盘操作，不依赖真实远程服务。

## 正文优先的呈现约定（2026-10）

网页常驻信息分为标题（约20px）、正文（14px）、时间与单位等元信息（12px）；概览数字24–28px。沿用主题、图标、分页与筛选。`DisclosurePanel` 统一原生 `details/summary` 说明入口，`ScanHelp` 集中输入限制与任务生命周期，`ResultHelp` 集中评分及能力边界，`CoverageNotice` 负责可见范围状态与折叠诊断。部分扫描、候选未知、扫描异常、断线、取消和源码不可用不可收进通用说明。

`TaskProgress` 只负责目标、连接和取消；`ScanStatus` 负责整数等待时间及保留旧结果，`ScanLoading/ProgressDetails` 在右侧展示真实阶段、采集与分析计数和仓库列表。任务调度、轮询、1500ms最短展示均不变。

`utils/presentation.js` 根据现有统计生成最多三条短结论；文件同名才显示身份后缀，后缀冲突时显示完整身份。后端规范统计、扫描规则及评分没有变化。发现默认显示算法、风险、路径、行号和证据，详情保留身份、识别方法、密码库、API、原因、建议与源码入口；资产详情按同样方式折叠。热门截断入口仅切换到预填的GitHub表单，不自动开始扫描。

HTML、Markdown 共用 `report_presentation.py` 的短结论与边界文案；阅读报告不折叠证据，不截断发现或诊断。附录保存评分、识别依据、范围字段、文件元信息与完整诊断。Markdown证据使用可容纳原始反引号的代码围栏；表格换行显示为“↵”，不依赖HTML标签。HTML使用转义文本、内联CSS/SVG和A4打印规则；正文不被打印隐藏。规范JSON和CSV导出未修改。

## 扫描器第一轮修复（2026-10-08）

调用文本按完整名称消费一次，避免无括号点号链的后缀反复回溯。分析器通过线程内 ContextVar 接收共享 Deadline 检查；文本、词法、AST 遍历、配置事件和结果转换设检查点。管线仍在 finish 中等待分析线程真正退出，再冻结终态和释放引用，没有以 join 超时遗留线程。直接 build_scan_response 的分析也使用同一控制入口。第三方解析器的单次操作仍不可抢占，协作式预算不是通用硬 CPU 超时。

AST 函数体延后到所属块处理完后解析，已知直接调用保存当时绑定快照；顶层调用保持顺序。明确常量 if 分支按真值选择；未知分支绑定冲突只给 binding_unresolved 诊断。global/nonlocal 不作为词法局部变量预先遮蔽，参数、真实局部重绑定、类方法和推导式边界保留。没有在 AST 成功后补跑文本调用或配置规则。

JSON 使用标准库验证语法，JSON/YAML 使用 PyYAML 6.0.3 SafeLoader 仅组合节点以保存标量行号，不构造 Python 对象。算法配置键下支持嵌套映射及列表，说明文字不作为算法值。YAML 锚点、别名、自定义标签、复杂键与多文档未纳入支持范围，显式诊断；深度上限64、配置事件/AST节点上限50000、Python绑定上限4096、直接函数调用绑定上下文上限64。超限会给 analysis_limit，畸形配置给 config_parse_error，不自动文本补猜。单文件2MiB以及任务、队列、HTTP、来源和临时存储容量均保持原值。范围中此类文件仍可查看元信息和诊断，不代表完整语义覆盖。

新增已知完整导入目标：PyCryptodome RSA/DSA/ECC import_key、construct（importKey 仅 RSA/DSA）；cryptography Ed25519/Ed448/X25519/X448 的私钥/公钥 bytes API，RSA/DSA/DH/EC 数字构造器及 EC 点导入/derive_private_key。通用序列化加载器和未知 key.sign 不推断 RSA。ECC 家族导入不推断具体曲线。EdDSA 单独保留家族画像及数字签名迁移用途，具体 Ed25519/Ed448 仅由明确证据识别。

C风格词法过滤识别 JS/TS 模板文字并保留插值表达式；保留行列和 .NET 已有文字屏蔽边界，不宣称完整多语言解析。PEM 从明确文件头或承载完整块的源码/配置字面量识别，排除注释和独立文档字符串；头信息仍不验证密钥正文，通用头只给未知算法诊断。TOML 等其他配置仍为有限文本规则。本轮验收、实测和未验收项见 [修复验证记录](scanner-repair-validation-2026-10-08.md)。
