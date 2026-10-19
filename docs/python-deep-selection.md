# Python 深度分析第二组选型记录

2026-10-18，OpenSpec `add-python-deep-analysis` 2.1–2.6。决定：后续正式索引和有界值流采用**标准库 AST 受限回退**，本阶段不引入第三方生产依赖，也不复制候选源码进生产。机器可读决定在 `experiments/deep_selection/selection.lock.json`。这是正式索引前的能力选型，尚未交付生产深度分析。

## 官方来源、版本和许可（2.1）

下列资料于2026-10-18通过官方仓库/PyPI检索，README、许可、构建声明及响应元数据保存在 `output/deep-selection-20261018/research/`。选择的CodeGraph明确为 **xnuinside/codegraph**，不将其他同名项目的能力归给它。完整commit见selection.lock；下载的54份工具源码/测试文件逐文件URL、大小、SHA-256见 `experiments/deep_selection/sources.lock.json`。它们位于忽略目录 `tmp/deep-selection/sources/`；运行器核验锁定字节后才进行矩阵实验。

| 工具/官方来源 | 固定版本/commit前缀 | 作者、许可和分发条件 | 安装/依赖核对 |
|---|---|---|---|
| [Scalpel](https://github.com/SMAT-Lab/Scalpel) / [PyPI](https://pypi.org/project/python-scalpel/) | PyPI 1.0b0；源码dd48ba0 | Apache-2.0；保留版权、许可证和适用NOTICE，修改须注明；README要求引用Li Li、Jiawei Wang、Haowei Quan论文 | pyproject写0.0.1，setup写1.0beta；依赖astor、graphviz、networkx、astunparse、typed-ast、typeshed-client、regex、setuptools、dataclasses、pycg。不能混同包版本和源码commit |
| [CodeGraph](https://github.com/xnuinside/codegraph) / [PyPI](https://pypi.org/project/codegraph/) | 1.2.0 / effefc7 | MIT，Copyright 2019 Iuliia Volkova；分发保留版权及许可全文 | Python>=3.9,<4；click>=8；matplotlib/networkx为可选可视化依赖。实验仅导入core，未安装CLI/可视化依赖 |
| [CBOMkit](https://github.com/cbomkit/cbomkit) | 2.0.0-SNAPSHOT / eea2043 | Apache-2.0，cbomkit组织；原IBM仓库已迁移；保留许可、版权和适用NOTICE | Java21/Quarkus3.38.2；依赖cbomkit-lib、JGit等，是服务/编排，不是轻量Python CFG库；未安装/运行 |
| [CBOMkit-hyperion](https://github.com/cbomkit/sonar-cryptography) | 源码58eea48；兼容表列1.3.7+，不据此猜测源码发布版 | 独立实现Apache-2.0；PycaRSA.java标Copyright2024 PQCA；README许可段明确打包插件含修改后的Sonar分析器，后者为Sonar Source-Available License1.0，不能把整体宣称为Apache | Python规则本身是Java，需受支持SonarQube；有Java分析器/插件依赖；未安装/运行，不使用其自报100%库覆盖作为本项目成绩 |
| [CodeQL CLI许可](https://github.com/github/codeql-cli-binaries/blob/main/LICENSE.md) | 本机无codeql可执行文件 | 学术研究/演示、允许的开源代码和GHAS等使用情形有特定条款，限制再分发/托管服务；许可文本已保存，不推定本项目具有服务化授权 | **不可用、未测**，未下载、安装或运行；不阻塞AST回退 |

本阶段仅保存调研资料和实验引用，不分发上述工具作为软件依赖。将来如复制单个Apache规则，仍须对该文件及依赖逐一核对版权/NOTICE、保留署名和注明修改；本次没有复制规则，5.1仍未完成。CBOM服务、Sonar插件及CodeQL无需成为后续任务的先决条件。

## 共同输入和隔离（2.2 / 2.5）

`experiments/deep_selection/runner.py`只消费第一组`LogicalInput`。36例、同一manifest、同一source_id、相同预算分别运行AST、Scalpel、CodeGraph原版、CodeGraph只读薄适配四条路线，共144次子进程。`codegraph_readonly`只替换`core.read_file_content`为UTF-8只读；没有修改下载源码，也没有把适配结果冒充原版表现。

每次创建私有临时input/scratch，拒绝绝对路径、点段、反斜杠、冒号、控制字符、设备名、Unicode规范化/大小写碰撞及文件目录冲突；内容严格取内存输入，写入后校验SHA-256。输入文件0400、目录0500，物化manifest仍绑定原source_id。工具不见生产存储路径，不沿用用户工程目录，不安装被扫描项目依赖。子进程结束后再次核对输入摘要及逻辑输入，检查视图外标记，finally清理临时目录。

macOS `sandbox-exec`在解释器启动前限制：拒绝网络、输入写入/改权限、视图外文件内容读写、fork及额外程序执行。仅允许读取明确的解释器/系统库、锁定工具、实验依赖、worker、input/scratch，允许scratch写入；系统运行库和文件元数据读取是明确例外，不声称完全零宿主读取。Homebrew的启动器会再spawn Python.app，因此直接运行其实际解释器；根目录仅允许literal `/`读取以供初始化，未放开`subpath /`。

使用`-I -S -B`、清空继承环境，仅预载显式可信模块；不调用CLI、浏览器、渲染器、包推断、插件发现或目标模块import。Scalpel所用NetworkX装饰器先在**可信空CFG**上初始化，避免其动态生成可信库函数被后续审计误判。之后安装补充审计钩子，拒绝输入路径和`<...>`动态代码执行；此钩子是针对已审查适配入口的补充，不能视为任意恶意Python的通用隔离器。

真实OS探针证实9种拒绝：外部内容读、外部写、输入写、输入chmod、额外程序、fork、联网、目标代码exec、动态eval；scratch写允许。网络仅有EPERM/EACCES才算拒绝，连接拒绝等不算。目标exec探针是不会实际执行的无害合成代码对象；共同夹具与`sample_inputs/`均未执行。离开macOS或没有已核验sandbox时直接拒绝实验，不静默无隔离回退。该实验沙箱没有接入生产。

每条路线同限：输入200文件/8MiB，墙钟5秒、CPU3秒、单文件写4MiB、64描述符；scratch以20ms轮询检查16MiB，超额kill进程组。取消和超时均SIGKILL进程组并wait回收。16MiB是轮询阈值而非零超调的文件系统配额；没有宣称硬RSS限制。这些是实验约束，不能代替6.3/6.5的共享预算和生产退出实现。没有通过正确性门槛的模块不会进入生产。

## 能力与失败（2.3 / 2.4）

完整原始记录：`output/deep-selection-20261018/common-fixtures.json`；汇总：`selection-summary.json`。宿主CPython3.14.7；AST明确请求3.10语法（`feature_version`为宿主解析器的尽力兼容，未等同于所有3.10运行时实测）。Scalpel用宿主ast.parse；CodeGraph用宿主tokenize，二者没有冻结目标语法开关。

| 路线 | 36例子进程状态 | 模块错误/位置观察 | 结论 |
|---|---|---|---|
| 标准AST实验 | 36完成，无解析错误 | 保留37/37个逐例去重sink精确span；列为UTF-8字节，带source_id | 只证明解析/位置可用，未证明模块解析、操作或值流 |
| Scalpel CFG/SSA/DUC | 36进程正常返回，**29例有模块失败** | 30个模块因已移除ast.Num失败；保留15/37个sink位置；部分常量/定义/引用有位置，合成节点可能无位置 | CFG并不等于上下文值证明；不能以进程成功算案例正确 |
| CodeGraph原版core | 36失败 | core.py:16用r+读源码，被沙箱以EPERM拒绝 | 不放宽输入只读来迁就工具 |
| CodeGraph只读IO适配 | 36进程完成 | metadata只有符号行范围，没有调用点列/精确span；原生calls为空 | 依赖图有参考价值，不能作为算法/参数/返回证明 |

37是逐例去重sink位置数量，第一组38是操作上下文标签数量；同一个包装sink的两个调用上下文不能合并计作两次位置召回。表内位置保留率不是操作Precision/Recall。所有路线`operation_metrics=null`，没有伪造密码操作TP/FP/FN、Unknown数、错误E3或串值成绩。

Scalpel检查入口为`CFGBuilder.build_from_src`、`SSA.const.SSA.compute_SSA`、`DUC`。`two_contexts`可保留包装sink、返回表达式以及参数引用，但调用方模块在ast.Num失败，且SSA结果没有绑定两次调用实参的独立上下文；RS256/HS256操作、Known/Unknown、ARGUMENT/RETURN_FLOW边均**未建立**。按词法域的use-def不能冒充跨调用证明。逐例报告保留部分事实与明确失败，不把缺事实算Known。完整包在3.14纯wheel解析另因typed-ast没有可用wheel失败（`research/scalpel-full-resolution.log`），未尝试源码构建；源代码最小子集实验并非完整包安装成功。

Scalpel额外源码审计：`cfg/model.py:127 Block.get_source`包含eval；本次从未调用get_source/渲染/可视化。即使CFG子集可运行也不复用这条渲染路径，不用它生成证据。没有为兼容3.14修改上游ast.Num或恢复旧AST类，防止把自行修复算作原版支持。

CodeGraph错边/身份边界逐例留在原始记录：

- `same_names`：`a/use.py`与`b/use.py`均产生`settings._`，无法区分`a/settings.py`与`b/settings.py`；该不完整目标如果强行映射就会跨包串边，实验没有编造唯一source_id。
- `two_contexts`：`main.py`给出两份`wrap.issue`及`wrap._`，没有两条调用点span、参数绑定和返回边；不能据此断言RS256与HS256。
- `relative_alias`：只报告`config._`，无常量值证明或逐表达式位置。`shadowing`只见模块级`app._`，没有可核验局部遮蔽后调用关系，不能据此声称遮蔽语义通过。
- 源码`core.py`的basename模块名、`candidate in module_`和`search_entity_usage`字符串查找与这些边界一致。原生关系不是独立审查后的正确CALLS集合；未生成假的“错误调用率”。

## 模块复用矩阵与依赖冻结（2.6）

| 模块 | 生产复用 | 理由/后续归属 |
|---|---|---|
| 标准库ast.parse/AST位置 | **选用** | 无额外依赖，当前共同夹具位置完整；3.5实现独立包根/作用域/导入索引，3.6补版本与限额诊断 |
| Scalpel CFG builder | 不采用 | 当前宿主兼容失败；修复维护成本高于首版受限语义收益 |
| Scalpel SSA/DUC | 不采用 | 依赖CFG兼容性；缺调用实参/返回上下文身份，位置须额外核验 |
| Scalpel renderer/inference/CLI | 禁入当前生产路线 | renderer含eval；推断/插件/外部环境非已审查入口，无复用必要 |
| CodeGraph parser/metadata | 不采用 | 仅符号行范围，仍须重建字节span，额外tokenize映射成本 |
| CodeGraph依赖/调用图 | 不采用 | basename冲突、字符串查找，无值证明/调用点身份；只读IO还需适配 |
| CBOMkit服务与Hyperion/Sonar插件 | 不采用 | Java/Sonar运行体量及分发边界不适合本地轻量内核，未通过共同夹具运行验证 |
| CBOMkit密码规则知识 | 仅调研参考 | 5.1须逐文件许可核对并本地建规则，当前未复制或声称规则已实现 |
| CodeQL | 不依赖 | 不可用、未测；无待解决生产依赖 |

生产新增依赖冻结为**空集合**；现有项目requirements未变。标准库随宿主解释器提供，结果应记录host_python，不能伪造独立pip版本。当前实际通过的支持范围仅是实验AST解析/调用/定义/导入位置；未来受限路线按3–5组逐步实现参数/顺序赋值/静态分支/透明返回及上下文分离，动态导入、getattr、复杂装饰器、动态global写入/递归超限必须保守Unknown。本组没有提前宣称这些语义已支持，也没有先写完整自研CFG/SSA绕过选型。

## 正确性优先、成本及复现

所有候选均未通过完整操作/证据正确性门槛，AST也只有位置实验，因此**耗时/RSS/磁盘性能对比未测**，不做速度排名。以下仅是安装/物化成本，不是运行性能：锁定工具源码子集Scalpel320039字节、CodeGraph44563字节；实验site-packages实际文件合计5866590字节，不包含解释器，也不是完整工具wheel/桌面打包体积。完整Scalpel安装被阻塞，CBOMkit/Hyperion/CodeQL安装体积未测。生产新增第三方包成本为0；后续生产索引和真实试点仍须独立测量。

从项目根目录重现（遵循本机RTK约定）：

```sh
# 显式在线准备：只取固定可信工具源码，绝不安装被扫描项目依赖。
rtk proxy uv venv --python .venv/bin/python tmp/deep-selection/venv
rtk proxy uv pip install --python tmp/deep-selection/venv/bin/python --only-binary :all: -r experiments/deep_selection/requirements.txt
rtk proxy .venv/bin/python -B -m experiments.deep_selection.prepare
# 其后离线运行；其它宿主版本须显式传--dependencies对应site-packages。
rtk proxy .venv/bin/python -B -m experiments.deep_selection.runner --output output/deep-selection-20261018/common-fixtures.json
rtk proxy .venv/bin/python -B -m unittest tests.deep_static.test_selection -v
rtk proxy .venv/bin/python -B -m unittest discover -s tests -v
rtk proxy openspec validate add-python-deep-analysis --strict
```

源码准备支持已有正确摘要文件离线复用。测试不下载工具、不调用远程服务；沙箱测试用空工具目录，依赖缺失明确失败。没有测试为完成安装自动拉取任何包。`first-run.json`是修复macOS启动器限制前的失败调试记录，已被`common-fixtures.json`取代；不参与选型统计。

本次全量Python **255项通过**（新增11项路径/摘要/清理/真实沙箱/取消/超时测试），日志`output/deep-selection-20261018/python-unittest.log`；隔离、进程回收、摘要结果见`isolation.json`。未修改前端或生产扫描入口；未执行新功能页面验收、真实仓库试点、操作性能测试或发布。独立人工金标准和最终精度门槛仍未完成。
