# main 产品流程接入原版 A 静态引擎

接入实现阶段在本地完成测试和记录，未提交、推送、创建 PR、合并或发布。实施日期为 2026-10-27（太平洋时间）。随后用户授权提交、推送并创建目标为 main 的 PR；该授权不包含合并或发布。本文件取代历史融合方案对本分支的实现指导；历史方案及融合分支没有作为实现来源。

## 基线与工作区

|对象|完整提交或位置|
|---|---|
|原版 A|`d8e07c903d5cd15e19142613491bb7dbae69699d`|
|实施前 fetch 后采用的 origin/main|`56fc462e6ea0712aad9c8c0239f79342d1fd921c`|
|本地分支|`codex/main-with-original-a-engine`|
|独立 worktree|`/Users/mac/.codex/worktrees/main-with-original-a-engine/抗量子密码识别`|
|原工作区|`/Users/mac/Documents/ChatGPT/抗量子密码识别`，仍在 `codex/merge-analysis-accuracy`|

fetch 后 main 未前进。先完整读取原工作区的 AGENTS、`docs/代码融合与准确率提升计划.md`、`docs/merge-analysis-accuracy.md`，然后从 main 创建独立 worktree。未复制旧脏工作区、旧 AI、旧调度器或用户材料。原工作区前后 `git status --porcelain=v1 -z` 的摘要均为 `34829c3256ad4560d40045e3ebe3661f3ca5bb6792cadcf5fc2ff73cc5e9998a`；这是文件状态清单一致的证据，不冒充逐字节内容校验。本线程未向原工作区写入实现文件。

## 实现边界

|层|实现与边界|
|---|---|
|基础扫描|`scanner/engine.py` 委托 `original_a.scanner.engine`；仅桥接 main 的取消 checkpoint。CLI 公开的 visitor、AST 和文本入口也指向 A。main 的汇总、评分与采集保持原实现。|
|深度生产器与 verifier|`original_a/deep_analysis/`，二者成套来自 A；不存在通过 main 引擎补齐的运行分支。|
|模块隔离|A 的 32 个原始文件位于 `original_a/`。唯一源码变换是 `from scanner`、`from deep_analysis` 的绝对包名前缀。manifest 记录原始及迁移后 SHA256；契约测试逐文件与 Git 对象比较。不使用 `sys.modules` 别名替换。|
|薄适配|`backend/original_a.py` 提供磁盘文档、A 快照入口、展示范围字段与独立 AI 只读摘要；`backend/deep_scanning.py` 继续使用 main 的 CPU 槽、截止、进度、取消和暂存。|
|main 参考代码|保留 `deep_analysis/` 与扫描规则参考模块，供传输模型、既有基线测试及 AI 语法解析使用；它们的生产器、密码判断和 verifier 不参与生产扫描。main API 目录继续用于 AI 检索，不宣称为 A 的支持矩阵。|
|main 产品|新版前端、明细、资产、图、待办、多模型、安全凭据桥、单一任务调度器、补做/继续/停止/恢复、四类采集、热门命名空间、源码定位与报告均沿用 main。|

`scripts/vendor_original_a.py` 可从固定提交重新生成 A 包。不得在包内修复旧算法后仍称其为原版 A；如未来改变逻辑，必须另立引擎身份、版本及评测基线。

## 范围、预算与内存

基础扫描仍通过 main 管道处理最多 5000 文件、100MiB 来源，单文件 2MiB，结果使用原基础 coverage。深度只选择 A 原来支持的 `.py` 文件，不扩大到 `.pyw`。选择顺序、包根、路径、Unknown 与跳过诊断直接来自 A 的 `build_snapshot`，没有按块模拟整仓语义。

A 深度上限保持 **200 文件 / 8MiB / 120 秒**，未放宽模型字段、调用深度、结构或证据预算。main 的深度子截止从 180 秒收紧为 120 秒，以匹配 A 的声明。基础 600 秒、普通自动任务 1500 秒、AI 900 秒及热门整体预算保持 main 契约。

A 保留原有两个独立索引：生产器和 verifier 各自可持有所选文件的有界 AST，并受原共享结构预算限制；不能再声称生产路径使用 main 的“两文件惰性 AST 缓存”。它不会把 5000 文件灌入 AST。独立 AI 摘要在 A 返回后逐文件解析，同时只持有一个摘要用 AST；语法解析受 50000 节点/64 深度限制，摘要总序列化预算 32MiB，写入 main 分片暂存，受原全局容量与清理机制约束。

AI 摘要保存 source_id、SHA256、导入目标、定义及调用位置。唯一包根下保留 `src/` 等源码根映射；摘要只用于检索，不传给 A 的生产器或 verifier。摘要与源码不一致会被拒绝；摘要缺失也不能绕过 A 快照摘要校验。预算中断及不可读摘要有明确诊断。超过 A 选择范围但仍在 main 来源内的文件可以生成 AI 摘要，不能因此成为静态证明。

页面分别展示基础范围、深度选中/可用数、跳过数及原因。201 文件且总量刚超过 8MiB 的资源案例实际选择 199 个，是字节预算先耗尽，不能假写成 200。取消后结果 coverage 标为 partial，保留完整操作。

## 结果、证明与缓存

适配只增加 `operations[].evidence_scope`：

|值|含义|
|---|---|
|`static_call`|静态解析的调用位置，不证明运行或部署。|
|`definition_template`|未实例化定义；保留空调用链、`call_site=None` 及原 context。|
|`algorithm_policy`|`jwt.decode` 的允许算法策略，不证明令牌实际算法；若在定义内，context 仍同时标为模板。|

operation_id、template_id、算法、用途、Unknown 原因/备选、条件、位置、上下文、claims 和 evidence_paths 不被改写。四报告与关系图保留定义、调用和策略区别；整合结果增加独立的 context_counts 与 evidence_scope_counts。AI 意见仍按 main 规则进入 AI研判/待确认，不能升级 E3，也不进入静态评分。

A 的真实版本保留为：`crypto-subset-1`、`bounded-backward-1+keys-1`、`deep-ast-1`、`ast-witness-1`。运输元数据另记 `engine_identity=original-a:d8e07c903d5cd15e19142613491bb7dbae69699d` 和 `adapter_version=original-a-transport-1`，不伪造规则或 verifier 版本。基础 A 本来没有 main 新增的 rule_id/rule_version，不补填为 main 的 rules-3。

额外运输差异还包括顶层引擎身份、摘要统计，以及中断/适配失败时的 partial coverage 和诊断；不会重新核验或重标历史证据。A 的 `revalidate` 在无源码时标为 unavailable，源码变更时保留历史快照/版本并拒绝当前重放，专项已验证。

AI 的快照与候选身份绑定完整已读取来源、A 引擎身份、适配版本、真实静态版本及 AI 参考目录版本。候选绑定完整快照，避免三级依赖变化仍复用旧意见；同名来源额外绑定 source_id，代价是同名文件跨任务缓存命中减少。旧缓存目录缺少引擎/适配/静态版本时重建。main 原有提示、策略、模型配置缓存键和跨模型显式继续流程继续生效。

## 三版本同口径结果

使用未改标签的原 36 例语料与 manifest。语料 SHA256 为 `f1b1b88e1d77fd6067ed69c6e717f0b7a77c1e543425363a4382839f93e2f5f9`，manifest 为 `50749e5866589a645ecab59354cfad2d6e2d855817985373522ce434ba8a0cc9`。A、未修改 main 在临时目录从各自 Git 对象提取并由独立进程运行；第三版运行本分支。没有执行输入字符串或安装目标依赖。

|30 例 locked|原 A|未修改 main|接入版|
|---|---|---|---|
|原 A 匹配器，预先定义支持范围，TP/FP/FN|30/1/1|29/2/2|30/1/1|
|对应 Precision / Recall|96.77% / 96.77%|93.55% / 93.55%|96.77% / 96.77%|
|严格标注字段，TP/FP/FN|27/6/6|27/6/6|27/6/6|
|对应 Precision / Recall|81.82% / 81.82%|81.82% / 81.82%|81.82% / 81.82%|
|已知算法操作子集 TP/FP/FN|19/0/0|19/0/0|19/0/0|

全部 36 例严格结果三版均为 32/6/6，Precision/Recall 均 84.21%；已知算法子集均为 24/0/0。六个严格不匹配案例为 derived_return、branches_multiple、branch_unknown、recursion、decorated、unsupported_config。不能把已知子集的零误报漏报替换全语义分母。

历史匹配器来自固定 A，包含其既有原因/条件归一化；严格匹配器不归一化算法、Unknown 原因、备选、条件、sink 全 span、操作类型、context kind 和调用链。固定金标准没有独立标注所有 context arguments、claims 和证明边，不能伪称这些字段都有准确率金标准；但接入一致性另逐字段比较完整结果。

**36 例完整 A 输出及基础输出的接入差异为零**，仅剥离明确记录的 evidence_scope 运输字段。另 15 例开发兼容集也进行完整输出比较，差异为零。完整比较覆盖了 operation 身份、上下文、条件、Unknown、claims、证明及版本，不通过归一化隐藏差异。

共 51 份接入结果另通过 main 的 `DeepAnalysisResult` 模型及 `integrate` v3 投影校验。`comparison.json` 中的 support_inventory 逐项列出 main 声明式 API 和接收者方法在 A 中的支持状态；声明表成员关系不等于任意程序均可解析。

36 例三版原始上下文统计相同：35 个普通静态调用上下文、2 个 JWT 算法策略调用上下文、1 个未实例化定义。这里统计的是静态上下文，不是运行次数；策略与模板不合并进“已证明实际算法调用”的口径。

已纳入版本控制的汇总、逐例指标、资源和 HTTP 证据见 [validation/original-a](validation/original-a/README.md)。逐例完整原始输出、金标准、严格 FP/FN 在本地 `output/original-a/comparison/`，可运行比较脚本重新生成；历史原件另存本地 history 子目录。没有新增 200例/5来源独立留出集，也没有真实模型准确率成绩。接入保真不等于算法提升或任意项目准确率 96.77%。

## 相对 main 的静态减少与既知安全边界

|能力/测试入口|原 A 模式的预期状态|
|---|---|
|`test_rsa_encrypt_decrypt_and_ec_exchange_preserve_receiver_roles`|A 仍识别 RSA 生成/部分签名，但不提供这些 RSA encrypt/decrypt 及 EC exchange 深度操作；X25519 exchange 保留。|
|`test_ecdsa_default_curve_cross_file_sign_verify_and_unknown_custom_curve`|main 的 python-ecdsa 深度生成/签名/验签不进入 A；A 基础规则仍可能报告 ECDSA，且缺少 main 的曲线约束。|
|`test_every_declared_non_jwt_api_has_an_individual_case`|main 声明式深度规则中仅 `ecdsa.SigningKey.generate` 不在 A 规则表，其余声明相同；接收者方法减少如上。该既有测试保留作 main 参考测试，不宣称生产 A 也支持新增规则。|
|`test_shared_api_algorithm_identity_and_rule_version`|参考目录仍校验 main；生产 A 基础输出不伪造 main rule_version。|
|`test_rule_boundaries_and_imported_node_api`|A 缺少 Node 导入 API 识别；`monkey="RS256"`、配置描述文本及 JS 未导入 `RSA.generate` 保留已知误报。|
|`test_template_literals_and_interpolations`|普通模板文本负例仍检查；JS 插值内未导入 RSA/DSA 的 A 文本误报明确保留。|
|main 的 `.NET` 文件后缀限制及严格配置词边界|A 保留旧文本规则，不迁入 main 的语言后缀 gating、配置整值匹配等限制；不可将跨语言同名文本命中视为实际库调用。|
|类命名空间与显式 globals 修改反例|A 的类命名空间捕获和 `globals()["jwt"]` 修改场景会产生错误 E3 结论；不因 verifier 返回 valid 就宣称符合 Python 真实语义。|
|大来源、`.pyw`|基础采集可达 main 上限；深度选取为 A 的 200/8MiB、仅 `.py`，超过部分明确未分析。|

15 例开发集按人工编写的逐层标签，A/接入版基础层为 0/6/1、深度严格已知层为 5/3/8；main 为 1/0/0、9/1/4（均为 TP/FP/FN）。其中 EC 生成金标准写作 ECC，三版实际返回 EC，造成各一组严格 FP/FN；保留该标注差异，没有按预测改标签。该别名差异单独列出，不当作真实算法家族错误。除此之外，A 的开发反例复现 6 条基础误报、1 条 Node 漏报、2 条错误深度证明及 7 条深度能力漏报。main 也未识别该开发集中的链式 `k.public_key().encrypt`，不能把所有差异都说成 A 独有缺陷。

这是有意选取差异和高风险反例的开发集，不代表总体误报率。保留这些缺陷是本次纯 A 约束，不是安全修复完成；后续若要修复，应另行命名引擎及评测。

## 测试契约调整

先建立 A 来源、生产路径、字段保真与取消契约，跑出缺少 A 入口的失败，再实施接入。首轮全量 368 项有 4 失败、2 错误，原日志保留。

没有删除失败测试或关闭检查。上述新增能力测试改为明确断言原 A 的已知行为：JS/配置误报、Node 漏报、基础 ecdsa 曲线限制与缺少 main 版本字段；相应的 main 行为同时由三版本对照保留。取消资源测试的补丁目标从 main 文本扫描器迁到 A 文本扫描器；AST 缓存断言改为 A 深度选取上限与独立摘要的单 AST 边界。这些契约变化代表表中明确的产品支持减少，不能解释为原缺陷已经修复。

最终 Python **375 项通过**，其中保留的 main 参考引擎测试不作为 A 新能力证明。另有 A 来源/边界/缓存/重放专项，以及完整输出差分。Web **98 项**、Desktop **17 项**通过；前端构建通过，产物只由构建命令生成。最后安全补强相关契约与 AI 流程专项 61 项通过，包含在全量中，不相加计数。

## HTTP、浏览器、桌面与生命周期

- `verify_original_a_http.py` 启动最终代码的隔离生产服务：健康与构建页面 200，允许开发 Origin 提交 202，不可信 Origin 403，源码按 source_id 往返一致；模板无 invocation；四报告 200，包含定义及策略信息；模型与远程采集调用为零。
- 历史 `/api/tasks/deep-analysis` 实测 405（被 main 的动态状态路径匹配），`/api/ai/previews` 为 404；没有迁入旧融合分支的 410 路由，也没有假恢复旧协议。main 现存 HTTP 路由保持；该缺失是已核对的 main 基线状态。
- 浏览器在 8018 离线 fixture 上操作真实页面，完成片段、真实文件选择上传、mock GitHub、mock PyPI、8 仓库热门批次、资产、待办、图与模型设置。图内方法显示“定义”，decode 显示“算法配置”。热门结果按仓库隔离并保留证据不足。
- 使用最终构建与重启后的最终适配代码复测片段；浏览器展示旧任务因重启失效，并可重新扫描。早期四来源/图证据与末次片段证据分开保存，不声称早期截图自动覆盖后续代码。
- 浏览器控制台初次仅 favicon404 与 autofocus 提示；重启恢复测试出现预期的旧任务404及连接失败记录，无观察到应用 JS 异常。原始控制台和请求记录均保留，不隐藏这些错误。
- Desktop 17 项验证 main 的 safeStorage mock、多模型配置、IPC 和启动桥；另真实运行源码 backend_entry 的私有 stdio/token 握手、认证页面、合成上传/片段、四报告、关闭与缓存回收。未运行原生 Electron GUI 的系统钥匙串实机验收，也未声称冻结可执行包已构建。
- 任务恢复、继续、停止、模型切换、热门隔离、过期、容量、重启清理与取消采用 main 原有真实组件和 mock 网络测试；未改成第二套任务调度器。所有验收配置目录独立，模型调用只使用 mock，不配置生产密钥。

浏览器证据位于 `output/playwright/original-a-*`；生产 HTTP 证据位于 `output/original-a/http/`，测试日志位于 logs 子目录。

## 资源实测

macOS、本机 Python 3.14.7，串行独立子进程；前 25 个文件含 JWT 调用，其余主要为注释填充。数据是合成来源，不是结构密集仓库或真实项目吞吐承诺。

|场景|耗时秒|峰值 RSS 字节|暂存字节|A 选择/可用|深度状态|
|---|---:|---:|---:|---|---|
|1 文件 / 2KiB|0.135|63225856|29963|1/1|completed|
|200 文件 / 8MiB|0.571|77856768|9057739|200/200|completed|
|201 文件 / 8430608 字节|0.558|77922304|9100266|199/201|partial：source_limit|
|5000 文件 / 100MiB|3.054|89178112|108688185|200/5000|partial：file_limit|
|20 文件，首个完整证明后取消|0.148|64126976|130042|20/20，证明仅保留1项|cancelled + partial coverage|

取消请求至终态约 **0.0100 秒**。这是该合成场景的协作 checkpoint 响应，不保证单次 AST parse 的最坏响应上界。5000 来源的 AI 摘要生成 5000 份，A 静态仍只有 200 文件覆盖。原始 JSON 含基础统计、深度 coverage 与摘要范围。

## 尚未验收

1. 新增 200例/5来源独立留出集及独立人审：未具备；不能宣布全项目准确率或新引擎效果提升。
2. 真实模型准确率、实网补充定义效果、真实 token/费用：未运行。mock 仅证明协议、隔离和采纳边界。
3. Windows、Linux Python3.10/3.13、原生 Electron safeStorage/钥匙串及跨平台实机：未执行。当前证据为 macOS Python3.14.7、桌面 Node 测试与源码 stdio。
4. 冻结桌面发行包、远端 CI、发布及合并后 SHA：本记录的接入测试阶段未执行。用户后续授权提交、推送及创建 PR；远端 CI 状态以 PR 当前提交为准，未授权合并或发布。
5. 结构密集真实仓库的内存/时延、独立安全扫描、A 既知误报修复：没有用注释填充资源用例替代验收。

## 复现与交付入口

在本 worktree 使用项目依赖环境。设置独立配置目录，并保持网络为 mock；浏览器 fixture 只用于 localhost:8018。

```sh
export QUANTUM_AI_CONFIG_DIR="$(mktemp -d /tmp/original-a-config.XXXXXX)"
export QUANTUM_AI_ENABLED=0
rtk proxy python -B -m unittest discover -s tests -v
rtk proxy npm --prefix web test
rtk proxy npm --prefix desktop test
rtk proxy npm --prefix web run build
rtk proxy python -B scripts/compare_original_a.py
rtk proxy python -B scripts/verify_original_a_http.py
rtk proxy python -B scripts/benchmark_original_a.py
rtk proxy python -B scripts/ci_smoke.py
rtk proxy python -B desktop/scripts/smoke_backend.py python "$PWD/desktop/backend_entry.py"
rtk proxy python -B -m tests.assisted_browser_fixture
```

比较脚本发现 origin/main 与已核对基线不同会停止并提示重新核对，不默默换基线。A 的源码再生用 `scripts/vendor_original_a.py`，再生后必须跑来源完整性及比较测试。

本地可审查差异：工作区 `git diff` 加上 `original_a/`、薄适配、契约测试、对照/资源/HTTP脚本及本说明。`output/original-a/review.patch` 包含本轮代码、文档、测试与实际构建产物，不包含旧脏工作区及用户材料；`files.json` 列出相关新增与修改文件，`acceptance.json` 汇总验收边界，证据目录保存逐例与原始日志。
