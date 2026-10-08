# 扫描器第一轮修复与验证记录

日期：2026-10-08，北京时间。由当前主线程实施，没有创建或调度子代理，没有 commit、push、发布或部署。被扫描源码仅作为静态文本处理，没有执行 sample_inputs 源码。性能与资源实验均在独立进程内设置外部截止，没有向 Electron 提交压力输入。

## 本轮改动文件

| 文件 | 改动 |
| --- | --- |
| scanner/text_analysis.py | 完整调用名只消费一次；检查预算；保留公共 scan_with_regex 的 PEM 能力 |
| scanner/lexing.py（新增） | 有界 C 风格注释/文字过滤；JS/TS 模板文字与插值表达式区分；保留原行号 |
| scanner/control.py（新增） | 线程内 ContextVar 检查入口、复杂度限制及分段屏蔽 |
| scanner/python_analysis.py | 延后函数体、直接调用绑定快照、常量分支、global/nonlocal、冲突诊断、明确密钥导入 API |
| scanner/config_analysis.py（新增） | 标准 JSON 语法验证及安全 YAML 节点组合；配置列表与标量行号；解析和复杂度诊断 |
| scanner/pem_analysis.py（新增） | 区分 PEM 材料、注释和独立说明字符串；保留源码及配置中的完整 PEM 字面量 |
| scanner/engine.py | 编排上述能力；AST 成功后不补跑文本调用/配置规则；保持返回字段和元数据开关 |
| scanner/rules.py | EdDSA 家族画像与标识；不再由 EdDSA 推断 Ed25519 |
| backend/analysis.py | EdDSA 属于数字签名迁移用途 |
| backend/pipeline.py、backend/scanning.py | 将共享 Deadline 接入实际分析；中止文件给诊断，收尾等待真实线程退出 |
| requirements.txt、desktop/requirements-runtime.txt | 声明并锁定 PyYAML 6.0.3；不引入 cryptography 运行依赖 |
| tests/test_scanner_repair.py、tests/test_scanner_resources.py（新增） | 16 项行为/边界测试与 2 项外部进程资源测试，多组正反例使用 subTest |
| docs/architecture.md、本文件 | 更新支持范围及验收证据 |
| web/index.html、web/assets/ | 仅由 Vite 构建产生，未手改；前端源码没有修改 |

开工已有 .gitignore、.serena、local-development、交接文档及提示词。工作期间另有并行修改 README、CI/CD 文件、发布脚本、tests/test_collectors.py 和 tests/test_desktop_release.py；均保留，未列为本轮实现。尤其 Windows 代理 mock 的 create=True 是并行修改，不是本轮修复。

## 检索与复现

先读 AGENTS.md、RTK.md、交接文档、architecture、security-review、desktop 和 local-development；记忆注册表未找到本项目相关解法。查阅了现有扫描回归、任务/存储/报告测试及成熟实现，再增加失败回归。

修复前在当前代码复现：延后模块导入与 if False 重绑定漏报；RSA.import_key 与 Ed25519PrivateKey.from_private_bytes 漏报；JS 模板文字产生 RSA 调用误报；Python 注释 PEM 产生确认发现；EdDSA 错标 Ed25519；YAML 多行算法列表零发现。

文本性能复现由独立子进程执行，输入是无调用括号的 `"a." * n + "a"`，文件名 probe.txt：

| n | 字节 | 修复前（秒） | 修复后中位数（秒，3次） |
| --- | --- | --- | --- |
| 1000 | 2001 | 0.015484 | 0.001296 |
| 2000 | 4001 | 0.061340 | 0.002268 |
| 4000 | 8001 | 0.239235 | 0.004729 |
| 8000 | 16001 | 0.937919 | 0.009951 |
| 16000 | 32001 | 未测 | 0.020621 |
| 32000 | 64001 | 见预算实验 | 0.038349 |
| 64000 | 128001 | 未测 | 0.096598 |
| 128000 | 256001 | 未测 | 0.153891 |

趋势已从近似四倍增长变为接近线性增长。测试使用宽松绝对上限和增长比，不绑定上述毫秒值。

修复前 64001 字节输入经 local_work、Deadline.after(0.05) 在外部 3 秒截止后仍未结束，子进程被终止。修复后相同输入可完整分析；约 2MiB（2000001 字节）的更大文本在 0.05 秒预算下约 0.158 秒返回：sources=0、partial=true、timeout=1，包含 analysis_interrupted，scan-analysis 线程数为0。总耗时包含协作式检查和队列收尾，不表示 0.05 秒硬 CPU 超时。另测约 800KB JS 模板文字与 YAML 长标量，同预算下分别约 0.157 秒和 0.200 秒结束。

未进行生产600秒持续压测，不能将受控复现描述为生产攻击已成功。

## 自动测试与构建

最终当前工作区：

| 验证 | 结果 |
| --- | --- |
| `.venv/bin/python -B -m unittest discover -s tests -v` | 214项通过，20.194秒 |
| `npm --prefix web test` | 37项通过 |
| `npm --prefix desktop test` | 6项通过 |
| `npm --prefix web run build` | Vite6.4.3成功，生成入口及 assets |
| `.venv/bin/python -m pip check` | 无依赖冲突 |
| `git diff --check` | 通过 |
| 新增修复与资源测试 | 18项通过 |

214项包含本轮18项与并行新增的4项桌面发布测试。早期全套发现过既有 macOS 缺少 getproxies_registry 的 mock 错误；并行修改添加 create=True 后，最终全套通过。测试记录以最终工作区为准，不将平台修复归为本轮扫描器工作。

资源回归在独立子进程（外部8秒截止）运行真实分析器和实际 TaskStore/暂存存储。取消实验先完成一个文件，再在第二个文件检查点取消，验证：

- 仅保留第一个文件及其1项RSA发现，任务终态为 partial。
- scan-analysis 线程实际退出，队列未完成项及 queued_bytes 均为0。
- 两个全局分析槽均可再次取得，control.pipeline 已清空。
- 仅完成文件的1个 source_id 可定位源码；未完成文件没有对外源码索引。
- 终态后的迟到 emit 不修改状态、已分析数或发现数。
- 关闭 TaskStore 后暂存目录确实移除。

未用 join(timeout) 遗留分析线程。远程测试均通过 mock，没有连接真实仓库或包源。现有测试继续覆盖去重、同名文件身份、评分、报告、热门快照失败保留、容量与取消后的完整部分。

## FastAPI 与实际 Electron

使用 `python start.py --port 8010 --strict-port` 启动真实服务。首页、构建 JS/CSS、health 均200，静态前端源码404；同步 YAML 片段扫描200，并在第2、3行识别 RSA/ECDSA。验收后该临时服务已停止。

Electron 使用源代码模式和当前 .venv，正常 backend_entry，不使用远程 fixture。重启以加载最终代码，最后窗口的本地地址为127.0.0.1:57356；端口是每次启动动态分配的，不能作为固定访问地址。原生 AX 状态与源码展开核对了以下行为：

| 实际桌面输入 | 观察结果 |
| --- | --- |
| 模板文字、插值调用及注释 PEM 的 JS | 仅插值产生第2行RSA发现，45分 |
| 纯模板文字及多行注释 PEM 的 JS | 零发现、无确认 PEM 风险 |
| 嵌套 YAML algorithms 列表，另含 notes: RS256 | 仅第3行RSA、第4行ECDSA，80分 |
| YAML `algorithms: &a [*a]` | 零发现但常驻“扫描异常”；展开说明锚点/别名未覆盖、未展开或推断 |
| 延后导入、if False、RSA/Ed25519 导入与 EdDSA 的 Python | 第2/8行RSA、第10行Ed25519、第11行EdDSA，共4项、3算法、100分 |
| 上述 Python 的 Ed25519 源码展开 | 正确完整 API、cryptography 库、原第10行、source_id=src_90393baaaebd |
| 通用 PRIVATE KEY PEM头 | 零确认发现，未知算法诊断；未猜RSA |
| 合成 RSA PEM头输入（AAAA占位正文） | 1项RSA头信息发现；不声称验证了有效密钥正文 |

最终窗口再次扫描 Python 与 YAML，发现数及 source_id 与前次一致；保留窗口供查看。没有向应用提交长字符串或压力输入。

通过 Electron 原生保存对话框保存 JSON，桌面显示“报告已保存”，随后从磁盘读取验证：

`/Users/mac/Downloads/quantum-repair-desktop.json`（11116字节）

报告4项发现及第2/8/10/11行正确；EdDSA 与 Ed25519 均为数字签名、目标 ML-DSA/SLH-DSA；RSA 保留用途待确认；同一文件 source_id 一致；报告未附完整源码。其他报告格式有代码回归，未逐一进行桌面保存验收。

## 支持边界与未验收项

- 保留 API、CLI、JSON字段开关、source_id、去重及原评分公式。EdDSA 算法值由错误的 Ed25519 纠正为家族 EdDSA；静态知识和报告用途同步更新。
- 已知库按完整目标识别导入/构造 API；同名业务库、重绑定、未知 key.sign 和通用 PEM/DER 加载器不推断RSA。ECC导入只确认家族，不猜具体曲线。
- Python不是完整解释器：仅有限作用域和直接调用绑定快照，不处理完整跨模块数据流、别名调用图或所有执行顺序；JS/其他语言仍为有限文本分析，未补 Node标准 crypto API 的完整解析器。
- 结构化 JSON/YAML 已补列表；TOML仍保留有限文本规则。YAML别名/锚点、复杂键、自定义标签、多文档以及超出复杂度限制的输入均诊断，不静默视为安全。
- 协作式取消/预算不能抢占第三方解析器的单次库调用；2MiB和遍历限制约束工作量，没有宣传通用硬超时。
- PEM仅确认承载材料的头信息，不验证DER/PKCS#8/SPKI/X.509正文，也不验证实际密钥有效性。
- 桌面取消/长时间运行没有另做GUI验收，资源取消由独立进程真实TaskStore回归验证；压力实验未进入应用。
- 未构建或验收新的安装包、Windows/Linux实机、签名和公证；未连接真实GitHub/PyPI。完成的是macOS源代码模式Electron验收。
- 后续feat候选未自动实施。

## 复用依据

- [PyYAML事件与节点接口、安全加载说明](https://pyyaml.org/wiki/PyYAMLDocumentation)：采用SafeLoader节点组合，避免对象构造，加入事件预算与深度限制。
- [RFC8037第3.1节](https://www.rfc-editor.org/rfc/rfc8037.html#section-3.1)：EdDSA家族不能仅由标识推断Ed25519。
- [PyCryptodome RSA](https://www.pycryptodome.org/src/public_key/rsa)、[DSA](https://www.pycryptodome.org/src/public_key/dsa)、[ECC](https://www.pycryptodome.org/src/public_key/ecc)：核对导入API与ECC家族范围；另核对v3.23.0官方源码，importKey只加入RSA/DSA。
- [cryptography Ed25519](https://cryptography.io/en/latest/hazmat/primitives/asymmetric/ed25519/)、[EC](https://cryptography.io/en/latest/hazmat/primitives/asymmetric/ec/)：核对明确曲线字节导入与点/数字构造API。
