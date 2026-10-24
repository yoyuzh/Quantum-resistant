# 抗量子密码风险检测与迁移辅助软件

版本：V1.1.1。通过静态分析识别代码和配置中的量子脆弱密码算法，提供源码证据、密码资产统计、迁移参考与扫描报告。软件提供浏览器界面、Electron 桌面窗口和命令行入口，扫描不会执行输入代码或安装被扫描的包。更新内容见 [更新记录](CHANGELOG.md)。

## 功能

- 输入代码片段、上传多个文件、采集 GitHub 仓库或 PyPI 包。
- 识别 RSA、DSA、DH、ECDH/ECDSA/ECC、X25519/X448、Ed25519/Ed448、EdDSA 家族及部分 JWT/SSH 算法配置。
- Python 使用 AST 识别已知密码库的完整导入目标、调用与常见绑定遮蔽；JSON/YAML 使用结构化配置分析；其他支持文件采用有限文本规则。
- 展示算法、文件、行号、证据、识别依据、原因及迁移建议；支持搜索、分页与筛选，同名文件按 `source_id` 独立定位。
- 提供分析概览、密码资产清单、文件与算法的证据关系、迁移待办和静态算法知识。
- 提供显式启动的 Python 深度分析源码对照台、相对目录上传、独立调用上下文、逐项证据等级与服务端深度 JSON 导出，无需模型。使用与边界见 [网页说明](docs/python-deep-ui.md)。
- 后台扫描显示实际上传/下载字节、采集与分析计数，支持取消、部分结果保留和刷新后恢复任务查询。
- 按 Star 检索并批量扫描热门密码学 Python 仓库；完整结束后原子更新最近一次有效快照。
- 导出 HTML、Markdown、JSON、CSV 报告；HTML 可通过浏览器打印为 PDF。默认不附带完整源码。
- 提供明暗主题、键盘操作和窄屏布局。

迁移评分为启发式优先级，不是风险概率。通用 PEM 头仅提示算法待复核，不能推断 RSA。零发现不代表安全或完整覆盖。迁移知识为静态参考；软件没有自动改写代码、真实依赖传播分析、数据库或完整多语言语义分析；可选 AI 辅助分析的范围与验证边界见下文。

## 安装与运行

源码运行需要 Python 3.10+、Node.js 22.12+ 和 npm；已有前端构建时，日常启动只需要 Python 及其依赖。

```sh
python -m pip install -r requirements.txt
npm --prefix web ci
npm --prefix web run build
python start.py
```

默认地址为 `http://127.0.0.1:8000`，端口占用时尝试后续端口。Windows 可双击 `start.bat`；脚本优先使用项目 `.venv\Scripts\python.exe`，否则使用 PATH 中的 Python。保持启动窗口打开，按 `Ctrl+C` 停止。

GitHub 仓库扫描和热门检索仅使用公开匿名访问，无需配置令牌；系统中已有的 `GITHUB_TOKEN` 不会被使用。仓库扫描在 API 请求受限时尝试下载公开归档；热门检索受搜索额度限制，受限后可稍后重试。只支持公开仓库。

GitHub 仓库和 PyPI 包的完整采集结果会缓存到本机远程源缓存目录，默认有效期 24 小时、上限 512 MiB，使用原子写入并按最早写入时间淘汰。桌面版使用配置的缓存目录；普通运行使用 macOS `~/Library/Caches/quantum-resistant-scans/remote-sources`、Linux `$XDG_CACHE_HOME/quantum-resistant-scans/remote-sources` 或 Windows `%LOCALAPPDATA%/quantum-resistant-scans/remote-sources`。可通过 `QUANTUM_REMOTE_CACHE_DIR` 指定目录。缓存只保存完整采集结果，不保存鉴权凭据；缓存失效或损坏时自动回退远程采集。

固定端口：

```sh
python start.py --port 8010 --strict-port
```

修改后端后必须重启服务；修改前端后必须重新构建。不要手改 `web/index.html` 或 `web/assets/`。任务只保存在当前进程中，服务重启后需重新扫描。

桌面安装包包含 Electron 和冻结的 Python 后端，使用者无需另行安装 Python、Node.js 或 WebView2。支持 Windows x64、Linux x64、macOS Intel 与 Apple Silicon 的原生构建。桌面运行、数据位置及打包方法见 [桌面使用说明](docs/desktop.md)。本次名称整理不会更新此前已发布的安装包。

## 可选 AI 辅助分析

AI 默认关闭。四类普通扫描完成并保留源码后，切换结果区与“分析概览”等同级的“AI 分析”标签页，生成本地脱敏预览，检查目标、预算、片段和跳过范围，再点击“确认本次范围并发送给模型”。打开面板及生成预览不调用模型；每次分析都需主动确认。读取配置只进行本地校验，返回“配置有效”不代表模型连通。原扫描、CLI 和报告不自动调用模型。

AI 意见分为支持原发现、质疑原发现、新候选、无法判定；均需人工复核。引用有效仅表示匹配本次脱敏片段，不改变原始发现或迁移评分。支持取消后续分析、部分结果、刷新恢复及独立 JSON 导出。预览保留 5 分钟、最多 4 份、共 2 MiB；终态与普通任务一样保留 15 分钟、最多 8 份、共 512 MiB 结果，预览及任务纳入同一 2 GiB 临时存储。来源源码过期后仍可查看有限脱敏证据，服务重启后任务失效。取消不能撤回已发送数据，脱敏不能保证发现所有秘密。热门任务不支持 AI 分析。

启用配置可写入项目根目录 `.env`，服务启动时自动读取；已有进程环境变量优先。至少设置 `QUANTUM_AI_ENABLED=true`、`QUANTUM_AI_BASE_URL=https://model.example/v1` 和 `QUANTUM_AI_MODEL=review-model`，按供应商要求设置可选的 `QUANTUM_AI_API_KEY`，修改后必须重启服务。凭据不要放入网页、版本库或日志。基址仅允许远程 HTTPS 或本机回环 HTTP，不允许 userinfo、查询参数、片段；公开接口只返回目标 origin，不返回完整基址或凭据。

首版兼容非流式 Chat Completions：基址追加 `chat/completions`，system/user 消息及严格 JSON 内容；`QUANTUM_AI_OUTPUT_PARAMETER` 可设置为 `max_tokens`（默认）或 `max_completion_tokens`。模型请求遇到超时最多自动重试两次，退避1秒、2秒，每次发送计入调用预算；鉴权、限流、HTTP 状态、格式和响应预算错误不重试。可选 `QUANTUM_AI_REASONING_EFFORT=none|low|high|max`，默认不发送。DeepSeek 官方可配置 `QUANTUM_AI_BASE_URL=https://api.deepseek.com/v1`、`QUANTUM_AI_MODEL=deepseek-flash`、`QUANTUM_AI_REASONING_EFFORT=none`；密钥通过进程环境传入。有效预算及全部配置变量见[架构说明](docs/architecture.md#ai-配置与独立数据契约)。

## 命令行

```sh
python -B scan_quantum_vuln.py path/to/source.py --json
python -B scripts/batch_scan_popular.py --top 8 --max-files 6
```

扫描 CLI 保留原 JSON 发现数组；诊断写入 stderr。不指定文件时静态读取 `sample_rsa_code.py`。该文件和 `sample_inputs/` 均为扫描样例，不应直接执行。批量脚本与网页复用同一服务，默认写入 `web/data/popular.json`，会访问真实远程来源。

## 运行范围与资源限制

默认供本机和可信内网使用，无账号系统或多用户隔离，仅支持单进程 API。普通扫描共享 600 秒截止时间，热门批次 1200 秒；全局 2 个运行、4 个排队，HTTP 并发 8。采集与分析通过 16 文件/8 MiB 队列连接，分析全局并发 2。

单文件最多 2 MiB；每来源 5000 文件、100 MiB UTF-8 源码文本；整个上传请求 110 MiB；远程归档 200 MiB。热门批次文本预算 512 MiB，按仓库均分且每仓库不超过 100 MiB。支持 ZIP、未压缩 TAR、gzip/bzip2 TAR，不接受 XZ TAR。归档按成员有界读取，不执行源码，也不按归档路径落地解压。

源码、归档与结果仅在本机临时目录短期保存，全局 2 GiB；终态保留 15 分钟、最多 8 份及 512 MiB 序列化结果。网页按需读取源码，缓存最多 10 个文件。取消/超时保留已完成分析部分；未完整结束的热门扫描不会覆盖旧快照。`coverage` 和 `diagnostics` 分别说明扫描范围与异常，候选数量未知时不推算覆盖率。

默认 Host 仅接受 `localhost`、`127.0.0.1`、`::1`。可信内网访问需明确配置实际主机：

```powershell
$env:QUANTUM_ALLOWED_HOSTS = 'localhost,127.0.0.1,::1,192.168.1.10'
python start.py --host 0.0.0.0 --port 8010 --strict-port
```

写请求的 Origin 必须同源或属于显式配置的 `QUANTUM_ALLOWED_ORIGINS`；开发脚本自动配置。远程采集仅访问固定 HTTPS 服务域名，逐跳校验重定向；AI 仅连接服务端配置的受信端点且不跟随重定向。完整 API、生命周期与安全边界见 [架构说明](docs/architecture.md)。

## 目录与维护

- `scanner/`：规则、AST、配置与文本分析、PEM 识别、资源控制和结果汇总。
- `backend/`：API、采集、后台任务、临时存储、热门编排、统计及报告。
- `web/src/`：Vue 界面；`web/index.html` 与 `web/assets/` 为正式构建产物。
- `desktop/`：Electron 窗口、进程通信、打包配置和依赖许可。
- `scripts/`：启动、批量扫描、HTTP 冒烟及构建身份检查。
- `tests/`、`web/tests/`、`desktop/tests/`：后端、前端和桌面回归。
- `sample_inputs/`、`sample_rsa_code.py`：仅用于静态扫描的样例。

开发启动、CI 和打包发布机制见 [开发与构建](docs/development.md)；检查命令、验收范围和本次整理结果见 [验证说明](docs/validation.md)。

Python 静态深度分析正按 OpenSpec 分阶段实施，已提供快照/路径上传、有界参数及密钥类型流、三库规则和独立证据核验。四类后台输入可显式设置 `analysis_mode=deep`，默认basic；已有来源可通过 `POST /api/tasks/deep-analysis` 复用，服务端提供独立JSON导出。模式、共享预算、取消/保留及导出协议见 [后台任务说明](docs/python-deep-workflow.md)，支持API、逐项等级与实际评测见 [密码规则与独立核验](docs/python-deep-evidence.md)。网页源码对照台已接入并通过本地浏览器验收，见 [网页说明](docs/python-deep-ui.md)。当前49/51项：工程及故障回归通过，真实仓库单文件试跑存在漏检，独立人审与最终95%/90%精度门槛仍未完成；当前支持范围Precision/Recall均87.10%，详见 [收尾与审查包](docs/python-deep-closeout.md)。路径协议见 [来源与索引说明](docs/python-deep-inputs.md)，兼容基线与逐阶段验证见 [实施记录](docs/python-deep-analysis.md)，候选失败证据和复现命令见 [选型记录](docs/python-deep-selection.md)。
