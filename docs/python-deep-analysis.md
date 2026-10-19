# Python 静态深度分析实施记录

对应变更：`openspec/changes/add-python-deep-analysis/`，schema `spec-driven`。2026-10-18 开始实施。本文区分契约测试、引擎正确性、集成与发布，不把阶段通过写成整个功能可用。

## 当前交付边界

第一组提供独立 `deep_analysis/` 契约、稳定身份、最小逻辑输入及共同评测函数。第二组完成候选源码/许可核对、144次共同输入隔离实验和受限AST回退选型，详见[选型记录](python-deep-selection.md)。第三组提供正式存储快照适配、路径上传及有界AST结构索引，见[来源与索引说明](python-deep-inputs.md)。第四组已实现独立候选发现、按上下文隔离的有界参数/赋值/返回传播，见[参数语义说明](python-deep-semantics.md)。独立密码规则/verifier、HTTP deep 执行阶段和网页入口尚未实现。默认扫描保持原行为。没有新增生产依赖；候选源码和3个纯wheel依赖仅安装于独立实验目录，没有使用模型或外发输入源码。

第二组选定标准库AST受限路线，不复用第三方生产模块。Scalpel在当前Python3.14有兼容失败；CodeGraph经只读IO适配可产依赖图，但无精确调用span及上下文值证明。CBOMkit/Hyperion只做官方源码和许可审查，未运行；CodeQL不可用、未测。已测范围、未知项、逐模块理由和依赖冻结见选型记录，不把子进程正常返回当作语义正确。

## 真实兼容基线（1.1 / W-01 / V-05）

- 实施起点 HEAD：`c359a57b6daa4cb16b3b3af6c4b56e58a535ae31`，分支 `codex/ai-assisted-analysis`。实际没有 `backend/ai/`，也没有可复用 AI 页签。分支名称不证明 AI 功能存在。
- 本机 Python `3.14.7`，Pydantic `2.13.5`；使用项目 `.venv/bin/python`。此环境没有名为 `python` 的系统命令，文档通用命令在本机需替换解释器路径。
- 发布版本仍为 `1.1.1`，登记版本 `V1.0.0`，未修改版本。
- `tests/deep_static/fixtures/legacy_baseline.json` 保存四输入各自的同步/后台完整响应、CLI JSON/stderr、HTML/Markdown/JSON/CSV 输出和旧 `FindingRecord` / `CryptoAsset` / `ScanResponse` JSON Schema。
- 基线只扫描临时文本 `from Crypto.PublicKey import RSA` 和 `RSA.generate(2048)`，不执行文本、也不访问 `sample_inputs/`。GitHub/PyPI 的同步和后台采集均 mock；本地上传/扫描/排队/序列化/报告使用真实代码。
- 八份响应均为1文件/1条RSA发现，评分45、等级“高”；CLI不含新增字段。只将 `scanned_at` 归一化，报告使用固定北京时间。source_id、资产、评分、内容及字段均完整比较。
- 已对照 `docs/architecture.md`：四输入、旧报告、任务容量、600/1200秒、源码 offset 存储与无跨模块证明的描述一致。`docs/validation.md` 的 Windows/旧版本成绩属于历史，不作为本次通过数。

重现兼容测试：

```sh
.venv/bin/python -B -m unittest tests.deep_static.test_contracts.LegacyBaselineTests -v
```

只有需要审查基线变化时，才显式运行 `.venv/bin/python -B -m tests.deep_static.baseline` 重新采集；普通测试不会改写它。禁止通过重新录制基线掩盖兼容回归。

## 契约与位置（1.2–1.3 / F-01 / F-04 / E-01）

`deep_analysis/models.py` 使用独立的冻结模型，拒绝额外字段；核心不导入 backend/FastAPI/scanner，也不重定义旧 Finding/CryptoAsset。结果 schema 为 `deep-static-1`。版本字段独立记录 rules/semantics/engine/verifier/host_python/target_python，当前测试使用 `contract-only` / `not-implemented`，不是已交付引擎版本。

值域为 Known / Ambiguous（至多4候选及条件）/ Unknown（原因及可选已知候选）。Unknown混合不能被直接标成resolved。每操作必须分别记录 ALGORITHM、OPERATION_TYPE、KEY_SOURCE、QUANTUM_CLASS；E3需要唯一值、非空证据引用、无缺边以及有效路径引用。**模型结构验证不代替独立verifier**：本阶段不会自行产生任何E3结论。

操作包含模板、调用点、底层sink、调用链、参数事实身份与条件；未实例化模板单独表示，不当作运行次数。证据路径记录有界节点/类型化边、完整源码摘要、历史核验与当前 replay 状态。结果拒绝重复操作/路径、悬空节点、跨快照/版本/上下文引用，以及快照外来源/摘要不符。必要片段的遮蔽与独立核验属于第5组，不能直接把未经处理的模型序列化当生产导出。

`identity.py` 用排序键的规范JSON和SHA-256生成ID：

- 内容摘要针对已解码文本重新UTF-8编码，不再修改BOM/CRLF/空格。
- 快照绑定 source_id/相对路径/摘要、输入种类、路径保真、包根、覆盖、commit（未知为null）及采集版本；文件与包根排序不改变身份。
- template_id绑定快照、完整sink span及规则版本；operation_id进一步绑定上下文、参数事实、条件及语义版本。相同底层调用的RS256与HS256不共享操作身份。
- 所有 span 是**1基行、0基UTF-8字节列、结束不包含**。`extract_span` 保留换行，拒绝越界与切断中文码点；只能读取传入文本，不自行打开路径。

`inputs.py` 只定义来源身份和只读内容的最小实验接口，核验摘要/字节数/唯一source_id，限制200文件和8MiB。它不是第3组正式快照：不从宿主路径读文件，不建模块索引，也不处理生产 StoredDocument。`Budgets` 固定了规范最大值且只能下调；实际共享计量、截止及受控退出留在后续任务，不以结构模型冒充RSS或CPU硬保证。

## 共同夹具与评测（1.4–1.5 / V-01 / V-03）

`tests/deep_static/fixtures/corpus.json` 有36个逐例编写的多文件案例，开发6例、锁定30例。每例包含字面源码、相对路径、适用语法、调用/sink精确锚点、操作/算法或Unknown、必要边、claim期望及审查依据。`manifest.json` 冻结整份标注和逐文件摘要；不得从被测引擎输出生成期望结果。加载器绑定独立source_id/快照及精确UTF-8 span。

标签由本次代理阅读源码直接编写，**尚非独立人工裁决的金标准**。`locked`表示内容冻结且不用于调参，不表示已通过人工审查或达到发布精度；最终人工锁定与真实仓库审查仍是8.3/8.4的必要门槛。发现标注错误时须显式审查标签与必要边再更新摘要，不能按预测结果改标签。

已覆盖：跨文件两上下文、相对/别名/同名包、关键字/默认/仅位置/仅关键字/静态展开、动态/重复/缺参、透明返回/派生、顺序赋值、同值/多值/未知分支、遮蔽、缺模块、递归、getattr、装饰器、global写入、通用PEM、两密钥接收者、ECC家族、DSA/DSS、JWT decode及禁用验证、未指定算法、中文列和运行时JSON边界。导入和手写算法有零操作负例。工作流/网络/页面故障不是源码夹具能证明的，仍须后续跨层测试。

测试目录采用 `tests/deep_static/`，避免 `unittest discover -s tests` 把原拟名 `tests/deep_analysis/` 当成顶层 `deep_analysis` 并遮蔽核心包。没有通过改动规定的验证命令来回避导入问题。

共同入口：

```python
from deep_analysis.evaluation import run_cases
from tests.deep_static.corpus import load_cases

# adapter是可信分析工具的薄转换，只读LogicalInput并返回Prediction。
# 不得将输入模块import/exec或执行其依赖安装脚本。
report = run_cases(load_cases("locked"), adapter)
```

匹配键为同快照、source_id与sink完整span、操作类型、上下文类型与调用链；端到端还需算法值/未知状态完全匹配。Counter一对一匹配保证重复预测为FP，缺上下文为FN，错误算法为FP+FN。模板定位、算法准确率、Unknown数、六类边分别计量；范围内外分别报告，预测不能自报unsupported逃避FP。零分母为null，Precision/Recall提供Wilson 95%区间。adapter异常仍保留全部gold分母，仅记录异常类型，避免异常消息泄露源码。

本阶段仅用固定预测验证评测器的计数，不报告任何实际引擎Precision/Recall，也没有运行性能对比。错误E3、串值、源码改写、外发次数须由真实引擎及隔离/集成测试收集，不能从模型测试推为0。

## 场景验证台账（1.6）

| 规格场景 | 本次证据 | 仍待执行 |
|---|---|---|
| I-01 部分采集 | missing_module标签、coverage未知分母契约 | 四来源截断/正式快照 |
| I-02 平铺同名 | source_id/同名包身份测试 | 平铺跨模块关闭及实际来源适配 |
| I-03 摘要与路径攻击 | 逻辑输入摘要拒绝 | 上传协议、Unicode/平台路径、409/413/422 |
| I-04 文件视图/回收 | 实验只读物化、前后摘要、链接拒绝及取消清理 | 生产快照/共享配额/原文回收 |
| S-01 同名与遮蔽 | relative_alias/shadowing/same_names标签 | 正式解析器与索引 |
| S-02 两次调用 | two_contexts等参数标签、身份与计数回归 | 候选与正式值流实测 |
| S-03 分支/返回 | branch/return标签、Unknown契约 | 赋值/返回逐边证明 |
| S-04 未知方法 | two_receivers/getattr/generic_pem标签 | 接收者传播及动态降级 |
| S-05 递归/限额 | 递归标签、模型限额拒绝 | 协作截止/节点与上下文计量 |
| F-01 一模板两上下文 | 稳定ID、模板/调用身份与FN测试 | 引擎独立生成操作 |
| F-02 旧扫描空 | import_only/handwritten负例标签 | 不以旧findings为唯一条件的发现入口 |
| F-03 三库子集 | 规则正反例标签 | 版本化规则及逐API测试 |
| F-04 算法/密钥分离 | 四claim结构；旧评分基线 | 独立等级和领域核验 |
| E-01 中文/同名 | UTF-8多行精确切片、摘要/身份测试 | 与引擎AST位置映射 |
| E-02 调用不等于值 | ARGUMENT/RETURN金标、缺边计数 | 篡改逐边核验 |
| E-03 静态/运行边界 | 等级契约与文案 | verifier与条件证明 |
| E-04 过期/篡改 | replay字段、版本/摘要引用校验 | 原文过期重验/历史状态 |
| E-05 外发边界 | 核心无provider依赖；实验沙箱实际拒绝联网和外部文件内容读写 | 完整生产分析链零外发测试 |
| W-01 默认/无Python | 四输入八响应与旧Schema完整比较 | deep可选模式/skipped |
| W-02 排队源回收 | 未执行 | 来源后任务/幂等/TTL重验 |
| W-03 共享预算 | 最大限额契约 | 真实计量/线程退出/adapter资源 |
| W-04 取消/写失败 | 未执行新阶段 | 基础检查点/半路径/迟到注入 |
| W-05 重启/存储满 | 未执行新阶段 | 统一清理与读者保护 |
| U-01 只看不启动 | 未执行 | 页面/模式显式启动 |
| U-02 两上下文呈现 | 未执行 | 列表/筛选/证据/源码跳转 |
| U-03 刷新/取消 | 未执行 | task/source恢复与迟到防护 |
| U-04 服务端导出 | 旧四报告逐字比较 | 新白名单导出与过期标识 |
| U-05 窄屏/键盘 | 未执行 | 三尺寸双主题/焦点/减少动画 |
| V-01 两上下文计数 | 固定预测为1TP/1FN；模板定位另计 | 引擎运行冻结集 |
| V-02 前置选型 | 官方源码/许可/版本、36例四路线等预算实验、模块矩阵与AST决定 | 正式实现后语义正确性与性能门槛 |
| V-03 错算法/截断 | 错算法FP+FN；Unknown/失败保留分母 | 引擎真实截断 |
| V-04 人工/真实试点 | 未执行 | 独立人工审查与固定真实仓库 |
| V-05 当前证据 | 旧兼容基线与本次回归日志 | 新功能全链验收 |

## 选型实验与后续验收模板

每个工具/模块单独填写，不因一个模块通过宣布全工具支持：

```text
工具/用途：
官方URL / 检索日期 / release / commit：
许可证路径 / SPDX / 署名 / 修改与分发条件：
依赖 / 安装隔离目录 / Python版本 / 平台 / 打包大小：
支持语法与API子集 / 不支持语义：
夹具manifest摘要 / split / 预算 / adapter版本 / 完整命令：
source_id/span映射 / 调用边 / 参数与返回边 / Unknown原因：
逐例TP/FP/FN / 算法 / 六类边 / 错E3 / 串值：
只读前后摘要 / 网络与外部文件限制 / 取消回收证据：
正确性门槛通过？否则不测性能：
耗时 / 峰值RSS / 输入与scratch磁盘 / 超时失败：
复用模块 / 不复用原因 / 受限AST回退决定：
证据文件 / 审查人 / 未执行项：
```

每个scenario另记录：版本/HEAD、输入摘要与路径资格、命令、预期/观察、日志/截图、状态（通过/失败/未执行）、限制及清理结果。CodeQL不可用标“未测”，不阻塞可复用模块或AST回退。没有独立人工裁决/真实试点时，8.4保持未完成。

## 2026-10-18 第一组验证结果

- `.venv/bin/python -B -m unittest discover -s tests -v`：244项通过，含19项新增契约/夹具/评测/完整旧兼容测试。日志：[python-unittest.log](../output/deep-static-20261018/python-unittest.log)。
- `npm --prefix web test`：52项通过。日志：[web-test.log](../output/deep-static-20261018/web-test.log)。
- `openspec validate add-python-deep-analysis --strict`：通过。
- [validation.json](../output/deep-static-20261018/validation.json)记录命令、环境、计数与夹具/基线/日志摘要。36例共38个操作标签、58条必要边；这些是测试期望数量，不是引擎检出成绩。
- 没有更改生产Python/网页/桌面代码或构建产物。本组未运行新deep功能浏览器验收、候选引擎性能或真实仓库试点，未执行前端构建（后续7.6/8.1仍需执行）。未创建commit、push、PR或部署。

## 2026-10-18 第二组验证结果

- 2.1–2.6完成，累计12/51项。官方资料、隔离边界、能力/失败、许可条件、依赖冻结和复现命令见[选型记录](python-deep-selection.md)。
- 全量Python255项通过（新增11项边界回归），[日志](../output/deep-selection-20261018/python-unittest.log)；严格OpenSpec校验通过。
- 36例×4路线共144次只读结构实验，全部子进程回收、输入摘要不变；原版CodeGraph36次失败、Scalpel29例有模块错误，不能据此声称端到端功能完成。[原始记录](../output/deep-selection-20261018/common-fixtures.json)。
- [隔离记录](../output/deep-selection-20261018/isolation.json)保存真实OS拒绝、取消前/运行中取消及超时结果。生产共享预算和退出机制仍由6.3/6.5交付。
- 没有操作级正确性门槛通过证据，未做性能排名、真实仓库试点或新功能页面验收；前端未改，未重复构建。第3组正式快照/索引与后续组仍待实施。

## 2026-10-18 第三组验证结果

- 3.1–3.7完成，累计19/51项。正式快照、覆盖与包根、路径manifest、私有物化及有界AST索引见[来源与索引说明](python-deep-inputs.md)。
- 新增24项定向测试；全量Python279项、Node52项通过，日志位于 `output/deep-input-index-20261018/`。OpenSpec严格校验通过。
- 真实本地FastAPI页面200、新上传202并成功、同请求重放、非法路径422/错误摘要409，见该目录 `http-validation.json`。测试未执行被扫描代码；远程collector均mock。
- 新协议analysis_mode只完成结构校验/幂等身份；deep执行阶段在6.1接入。结构调用目标不是算法值证明，当前没有新的密码操作/E3成绩。网页未改，不构建；第4组值传播及后续集成继续待办。

## 2026-10-18 第四组验证结果

- 4.1–4.7完成，累计26/51项。独立候选发现、参数/赋值/返回传播、上下文与缓存隔离及限额见[参数语义说明](python-deep-semantics.md)。
- 新增32项语义回归，全量Python311项、Node52项通过；OpenSpec严格校验通过。[验证记录](../output/deep-semantics-20261018/validation.json)保存命令、版本及代码/夹具/日志摘要。
- [冻结矩阵](../output/deep-semantics-20261018/semantic-matrix.md)运行36例，记录43个内部候选，不读取操作标签调参、不执行输入。两调用RS256/HS256独立；未知分支、缺返回、递归/动态及预算反例保持未知，完整候选在共享结构超限后保留。
- 当前只有未经独立核验的参数事实和传播边，不能作为生产导出或E3。第5组密码规则/密钥类型/独立verifier及后续集成仍待办；未改网页，不构建，无commit、push或部署。

## 2026-10-18 第五组验证结果

- 5.1–5.8完成，累计34/51项。三库明确API子集、密钥类型传播、独立AST见证核验、逐项E0–E3、脱敏证据与历史/当前重放状态见[密码规则与独立核验](python-deep-evidence.md)。第1–4组上文中的“待第5组”是当时阶段记录，以本节为当前进度。
- 新增25项定向测试；全量Python336项、Node52项通过，OpenSpec严格校验通过。[验证记录](../output/deep-crypto-20261018/validation.json)保存版本、命令、源文件/夹具/日志摘要；主线程实施与复核，无子代理。
- [冻结36例矩阵](../output/deep-crypto-20261018/crypto-matrix.md)：全量38个操作、锁定集33个操作定位均无FP/FN；锁定集严格端到端27TP/6FP/6FN，支持范围内27TP/4FP/4FN。差异为Unknown原因/条件/备选表示，原标签不改。相对现有标签算法错误E3为0，不等于独立人工裁决完成。
- 支持范围内Precision/Recall均87.10%，尚未达到最终95%/90%门槛；8.3/8.4保持未完成，不做性能排名或发布声明。新核心尚未接入HTTP deep阶段/网页，接续第6组任务/资源/导出；未改前端，不构建，无commit、push或部署。

## 2026-10-18 第六组验证结果

- 6.1–6.7完成，累计41/51项。四后台输入的显式deep、已有来源复用、基础/完整操作检查点、共享截止/CPU/暂存/保留、合作退出与服务端导出见[后台任务、资源与导出](python-deep-workflow.md)。上文“尚未接入HTTP”保留为历史阶段说明，以本节为当前进度。
- 新增23项工作流测试；完整Python359项、Node52项通过，OpenSpec严格校验通过。故障覆盖取消/超时/CPU等待/迟到、排队源过期、读者/TTL、存储满/写失败、孤立目录、精确200文件/8MiB、结构余额及导出状态。主线程实现和复核，无子代理。
- 正常start.py真实本地HTTP验证页面/health200、basic/deep、来源复用、manifest跨文件双上下文/独立E3、导出及422/404/409，测试服务已关闭。[HTTP记录](../output/deep-workflow-20261018/http-validation.json)、[验证/摘要](../output/deep-workflow-20261018/validation.json)及[主线程复核](../output/deep-workflow-20261018/self-review.json)保存当前证据；远程collector只在回归中mock，不执行输入。
- 复跑冻结36例结果不变，旧第5组矩阵摘要保留；支持范围内87.10%/87.10%仍未通过最终门槛。第7组网页与第8组人工/真实仓库验收继续待办；web/src未改，不构建，无commit、push或部署。

## 2026-10-19 第七组验证结果

- 7.1–7.6完成，累计47/51项。第三张“源码对照台”已落地同级深度页签、显式启动、目录manifest、层级文件树、独立上下文、逐项claim、证据/精确源码、覆盖/预算、取消/过期和服务端导出。使用与范围见[网页说明](python-deep-ui.md)。
- 完整Python359项和Node64项通过；前端正式构建、OpenSpec严格校验及真实8010页面通过。远程浏览器验收使用独立8018 mock collector，生产入口没有fixture路由。四旧报告、来源复用与深度结果兼容见[HTTP记录](../output/deep-ui-20261019/http-validation.json)。
- 1440×960、1280×720、390×844六组主题截图、长路径、键盘/返回焦点和减少动画均记录于output/deep-ui-20261019。根目录design-qa.md包含同输入全幅/局部视觉比较及修复；主线程复核与源文件摘要见该目录self-review.json/validation.json。
- 迟到响应不能覆盖新来源；刷新仅保留任务/来源ID，输入草稿和源码不持久化。取消保留一条完整证据的实际浏览器记录、失败基础保留及源码回收不可重放均已验收。
- 第8组集成门槛、独立人工金标准和真实仓库试点保持4项待办；既有87.10%/87.10%未因页面接入而达到95%/90%。无commit、push、发布或部署，未执行风险样例。
