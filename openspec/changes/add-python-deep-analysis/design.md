# Design

## Context

动机见 proposal.md。依据用户最新两份材料，本次完整替换旧 change 的模型工具循环、追加审批会话及双路 AI 实验；首版为不依赖 LLM 的静态分析，模型解释后续另立变更。

2026-10-18 核验基线：HEAD c359a57，分支 codex/ai-assisted-analysis，当前无 backend/ai/。ScanResponse 无 deep_analysis；CryptoAsset 按 source_id/算法聚合。local_work / remote_work 采集及扫描后组装响应并收尾，新阶段须在来源释放前接入。StoredContent 通过连续文件 offset/size 读取，StoredDocument 提供内容读取，不能把内部存储路径当仓库路径。normalize_filename 丢弃上传目录，旧平铺上传不能恢复包结构。

共享2运行/4排队、CPU2、HTTP8、临时存储2GiB；普通600秒、热门1200秒；终态900秒/8份/512MiB，详见 docs/architecture.md。新功能、依赖试验和验收均未实现。名称及登记V1.0.0/发布V1.1.1不变。

## Goals / Non-Goals

**Goals:** 按调用上下文识别静态密码操作、算法来源及可重放路径；模块级复用成熟分析能力；独立掌握密码规则和核验契约；未知为合法结果。

**Non-Goals:** 不执行输入、不安装其依赖、不导入被扫模块、不运行 setup.py；不承诺任意Python、全程序符号执行、运行时可达性、复杂堆别名、反射、任意装饰器或namespace package；首版不做LLM provider/Agent工具链、全仓知识图谱、多语言、自动修复、PQC全库覆盖或CycloneDX导出。

## Decisions

### D1 独立核心与发现入口

新增根目录 deep_analysis/：models、snapshot、symbol_index、import_resolver、call_resolver、dataflow、crypto_rules、evidence、engine；adapters/仅实现选型通过的模块。backend负责HTTP、调度、序列化，核心不依赖模型/FastAPI。复用scanner的可信API映射、位置和检查点，不将单文件临时绑定当跨文件证明。

独立遍历预算内Python模块，定位支持的API、包装及方法调用；旧findings只是额外种子，避免旧扫描漏报时零分析。首版不承诺识别无库线索的手写密码。重写旧scanner会破坏Finding/评分，放进AI目录会强迫静态依赖模型，完整Agent/Sonar成本过高，因此均不采用。

### D2 验证先于正式实现

顺序：契约/共同夹具 → 最小快照接口与隔离实验 → 选型记录 → 正式快照/索引/数据流。实验只建必要薄转换，不先自研完整CFG/SSA。

| 候选 | 待验证用途 | 启用条件 |
|---|---|---|
| Scalpel | CFG、SSA、use-def、常量传播 | 目标语法稳定、精确span可映射、资源可控且许可/打包可接受 |
| CodeGraph | 符号/模块/调用索引 | 映射source_id/span，不承担算法值证明 |
| 标准ast薄层 | 受限解析及传播回退 | 候选不适用时采用，不扩成通用分析框架 |
| CodeQL | 独立数据流/路径对照 | 核对使用条件，不内嵌/分发，不可用不阻塞 |
| CBOMkit/Hyperion | 密码规则和结果对照 | 核对具体版本/API/许可/署名，不假定跨文件能力 |

Cryptoscope、CryptoGuard、CrySL提供切片/语义/误报控制参考；Pysa/PyCG/JARVIS为后续研究线索。用户材料的维护状态、禁用测试、兼容性、许可与精度必须核对实际源码/官方资料，记录日期、commit、版本和许可证；论文数字不是本项目成绩，无公开可用引擎的论文不当依赖。

adapter输出统一模块/符号/调用、值依赖和源位置，附engine/support版本，全部经过本系统verifier。无精确映射、上下文错误或无法受控退出则禁用对应模块；按模块复用，正确性过关后才比较性能。

### D3 安全快照与路径上传

快照记录source_id、相对路径、内容SHA-256、输入类型、路径保真、包根、覆盖及采集版本。摘要针对现有解码文本重新UTF-8编码，保留BOM规则，不规范化换行/空格；snapshot_id为排序后身份/路径/摘要及范围元数据的规范摘要，缺Git commit明确未知。

四输入仍为snippet/manual_upload/github_repository/pypi_package。片段仅局部；旧平铺上传FLAT_BASENAME关闭跨模块证明；GitHub/PyPI须验证实际路径和唯一包根，多根/缺模块/截断显式诊断。

新增 POST /api/tasks/files-with-paths：重复files和单个manifest，schema_version=upload-paths-1，entries[index,relative_path,sha256]逐文件恰好覆盖一次，extra=forbid，最多4MiB/5000项且计110MiB总请求；analysis_mode表单字段默认basic。沿用单文件2MiB/源码100MiB。路径NFC后casefold判冲突，拒绝绝对/驱动器/UNC、反斜杠、控制字符、空段/点段、首尾斜杠，最多20段/512 UTF-8字节；拒绝设备名、冒号及文件/目录前缀冲突。非法结构/路径422、摘要/幂等冲突409、超限413，失败整批清理。source_id算法不变，路径另存，幂等指纹包含manifest和模式。

AST直接读逻辑快照。第三方需要时在私有任务根物化，只创建普通文件/目录，拒绝链接、冲突及越界，核验父目录/真实路径并受控创建，写后核对摘要。输入视图只读，索引写独立scratch，结束复验输入；只读权限不等同安全沙箱。无法限制外部读写、插件发现、扫描路径或网络的工具不接入。副本与scratch计全局2GiB，结束/取消/失败清理，不写用户源码。

### D4 模型与身份

DeepAnalysisResult使用schema_version=deep-static-1，含status/snapshot/operations/evidence_paths/coverage/diagnostics/budgets/versions，不重定义旧Finding/CryptoAsset。

CryptoOperation表示一个静态调用上下文，字段为operation_id/template_id/api/library/operation_type/algorithm/algorithm_family/resolution_status/call_site/sink_location/context/evidence_ids/claims/risk_category。template_id绑定底层sink，operation_id再绑定调用链、关键实参来源及条件；同sink的RS256/HS256是两条操作。无调用者的模板保留未解析上下文，单列计数，不捏造运行次数。ID由快照、精确span、上下文及规则版本规范生成。

EvidencePath含源摘要、起止位置/表达式、上下文、节点/类型化边、条件、核验状态/缺口及版本。位置为1基行/0基UTF-8字节列，前端转换后定位；文件关联只用source_id。保存有界必要片段，遮蔽口令/密钥、保留算法与必要语法；摘要不替代原文核验，历史核验状态与当前可重放性分开。

值域Known(value)、Ambiguous(values,conditions)、Unknown(reason)，派生不等于相等。未知分支不可丢弃后合成Known；全部支持分支同值才收敛，集合均有限额。

### D5 有限语义与定向值流

首遍建Module/Function/Class/Import/Call索引，次遍以支持API的算法/密钥参数为终点反向切片，按需展开调用，不全仓全变量求解。支持唯一包根下绝对/相对导入、别名、模块常量、直接函数调用、位置/关键字/仅位置/仅关键字/静态默认参数、透明赋值/返回。字面量*args/**kwargs校验签名/缺参/重复，否则Unknown。

缓存键含snapshot/callee/callsite链/参数事实/条件/语义版本，共享模板不共享调用值。赋值按顺序和作用域，分支保留条件/多值；接收者方法限已证密钥构造/类型和白名单API。动态继承/装饰器、monkey patch、getattr、动态导入及global/nonlocal动态写入等降级，不能按sign名称猜RSA。递归到界停止。

首版配置仅支持Python模块常量导入。JSON/YAML保留旧扫描线索，不证明运行时读取、环境覆盖或cwd；后续须补路径/加载器/键访问/传参链契约。

### D6 领域规则与独立核验

版本化声明式规则记录可信完整API、操作、参数/默认语义、接收者/返回密钥类型、算法映射及必要证据。首批为PyJWT、pyca/cryptography、PyCryptodome的明确子集：JWT encode/decode，显式RSA/EC/Ed25519密钥操作、X25519 exchange，PyCryptodome RSA/ECC/DSA导入/生成及典型签验API；逐API测试后列支持，不承诺全库。

RS256为RSA签名，HS256为HMAC-SHA256，不套同一非对称迁移规则；生成不等于签名；通用PEM/load_pem_private_key不证明RSA，ECC不证明曲线，未来ML-KEM属于KEM。算法/操作/密钥来源/量子分类分开。

verifier独立复核摘要/span/AST、导入/遮蔽、实参形参、赋值/返回、上下文、条件及规则。边类型CALLS/IMPORT_BINDING/ASSIGN_FLOW/ARGUMENT_FLOW/RETURN_FLOW/KEY_TYPE_FLOW；仅CALLS不足以证明值。缺边、不支持语义或版本/摘要不匹配则降级受影响结论。第三方路径、quote和LLM意见不直接授E3。

claims为ALGORITHM/OPERATION_TYPE/KEY_SOURCE/QUANTUM_CLASS。E0无依据，E1线索，E2局部有效但必要链缺失，E3支持语义和快照内必要链完整。算法E3需唯一可信值/类型；操作E3只证明静态API角色，不证明必然运行；密钥来源E3只证静态来源；量子分类E3需算法E3与版本化映射。不做部署/业务优先级E3。不同上下文不同值非冲突，深度不回写旧统计/评分。

### D7 模式、生命周期与预算

四类后台请求增加可选analysis_mode=basic|deep，JSON/表单默认basic，非法422。deep先保存基础结果后执行，普通仍共享600秒，深度最多120秒且不超总剩余；热门/同步旧扫描/CLI首版不扩展deep，热门1200秒不变。

已有结果可显式 POST /api/tasks/deep-analysis，输入source_task_id及X-Request-ID，共享2/4调度，不重采集/重跑基础，返回基础ScanResponse+deep_analysis。新任务最多120秒且受来源可用期约束；无任务404/已知源码清理409，开始前重验。仅实际读取固定来源，不无限延长旧TTL；本任务副本计配额并按新任务正常清理。

basic不输出deep_analysis、不新增必需字段。显式deep内层status为completed/partial/failed/cancelled/skipped，外层沿用旧枚举；深度失败/取消已有基础结果则外层partial。completed只表示范围处理完成，不等于无Unknown/代码安全；无Python为skipped。

保守上限：200 Python文件/8MiB源码、单文件2MiB、AST50000节点/深度64；索引100000节点/200000边/32MiB序列化等价体积；单切片200节点、调用深度3、每函数64上下文、每值4候选。证据集合共享节点/边/结果配额，重复对象引用，不无限复制路径。配置只下调，记录去重及物理读量；adapter仅扫受限快照。32MiB不是RSS保证，峰值内存另测。

共享CPU2/HTTP8/存储2GiB，无不受控池。循环边界检查取消/deadline；第三方不可合作退出则受限子进程，终止并等待回收后清理，做不到不启用。基础结果/完整核验路径原子提交，写失败保留旧检查点，不返回半条证明。finally回收读者/目录/scratch/进程/票据，不以超时遗留线程。终态共享900秒/8份/512MiB，迟到回调不改终态，重启不自动续跑。

### D8 页面、导出和后续范围

同级“深度分析”入口：当前无AI页签则新增，实施时若已有可复用AI页签则更名/调整，不硬编码第六页或重复增加入口。打开只查看，不自动启动；静态启动无需模型，四来源/快速结果/评分兼容。

展示操作/算法/用途/分类、解析状态/等级、call_site/sink/context、必要/缺失边及source_id跳转；采集/可用/选择/解析/分析覆盖分列，未知分母null，截断可见。刷新只恢复task/source ID，迟到响应不覆盖其他来源。沿用props/emits/composable与统一client，App<=250行/组件原则<=350行，键盘/窄屏/双主题/长路径可用。

GET /api/tasks/{id}/deep-analysis/export导出服务端deep-static-1白名单JSON：快照/版本/操作/有限片段与边/覆盖/诊断/预算，不含完整源码/密钥/宿主绝对路径；不接受客户端自报核验覆盖服务端。旧四报告结构保持，专用HTML/Markdown和CycloneDX为后续适配，格式合法不等于识别正确。

LLM未来只解释事实/未知/迁移方向，不覆盖Unknown或升等级；另需配置、脱敏预览与明确授权，选择deep不授权外发。本change不开发provider/工具链；AI漏报探索如要加入须单独定义候选与评测。

### D9 共同基准与门槛

先至少30个手工标注多文件夹具，含路径/source_id/源码、模板/上下文、算法/类型/未知原因、必要路径及支持版本；覆盖导入、别名、关键字、默认、返回、重赋值、分支、双调用、同名模块、密钥接收者及动态/递归/缺导入反例。只解析不执行，远程回归mock。

主指标按操作上下文一对一稳定匹配：快照、sink精确span、操作类型及上下文；重复预测FP，模板定位另报，算法/逐边正确率单列，错误算法不算端到端正确。Unknown/截断漏报保留FN，支持范围内外分列并公开全部范围，零分母null。

人工锁定基准要求：错误E3=0、跨调用串值=0、原源码改写=0、未授权外发=0；支持范围内端到端Precision>=95%/Recall>=90%。报告样本量/TP/FP/FN/区间，30例不能外推全生态。至少一个许可允许、内容固定的真实仓库只读试点，先冻结人工审查范围，非全仓不报全仓召回，人工不足保持未完成。

候选引擎和AST同夹具/等预算，记录安装、版本、许可、源映射、错边/Unknown、耗时/RSS/磁盘/失败；正确性先于性能。CodeQL缺失标未测，不伪造通过。

## Risks / Trade-offs

- [框架版本/源位置不足] → 前置试验、模块复用和AST受限回退。
- [动态Python误报] → 支持矩阵、上下文负例、Unknown传播和独立verifier。
- [路径/采集不完整] → 公开保真/缺口，不按同名文件猜导入。
- [副本/工具失控] → 按需物化、配额/摘要/链接防护和受控退出；只读不是沙箱。
- [120秒/200文件降低召回] → 截断计FN，实测资源曲线，不隐式扩限。
- [源码过期] → 历史核验与当前可复验性分开，摘要不替代原文。

## Migration Plan

1. PR-01：契约、标注夹具和共同运行器，不接生产。
2. PR-02：最小快照实验/选型先完成，再做正式安全快照、路径上传和索引。
3. PR-03：有界值流及上下文隔离，按选型复用模块。
4. PR-04：密码语义、独立核验和评测。
5. PR-05：模式、任务、导出、页面及真实本地FastAPI集成验收。
6. 默认basic；回退关闭deep并回收其资源，旧扫描/CLI/报告继续。版本和发布另行授权，本次不创建PR/commit或部署。

材料中5–8周/首轮5–7工作日只是粗估，选型实测后再估。首个闭环为同一封装两次调用分别得到RS256/HS256及可核验路径，无需模型。
