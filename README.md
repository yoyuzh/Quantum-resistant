# 抗量子密码风险检测与迁移辅助软件

版本 V1.5.0。通过静态分析识别代码和配置中的量子脆弱密码算法，提供源码证据、密码资产统计、迁移参考与扫描报告。可通过浏览器、桌面应用和命令行使用。详见[更新记录](CHANGELOG.md)。

## 功能

- 输入代码片段、上传多个文件、采集 GitHub 仓库或 PyPI 包。
- 识别 RSA、DSA、DH、ECDH/ECDSA/ECC、X25519/X448、Ed25519/Ed448、EdDSA 家族及部分 JWT/SSH 算法配置。
- Python 使用 AST 识别已知密码库的完整导入目标、调用与常见绑定遮蔽；JSON/YAML 使用结构化配置分析；其他支持文件采用有限文本规则。
- 展示算法、文件、行号、证据、识别依据、原因及迁移建议；支持搜索、分页与筛选，同名文件按 `source_id` 独立定位。
- 扫描后自动收起输入，默认展示发现明细；桌面窗口按可见高度自动分页，列表与详情并排联动，源码按需展开，窄屏使用详情抽屉。
- 提供分析概览、独立证据关系图子页、密码资产清单、迁移待办和静态算法知识；来源与结果导航在页头相邻居中。
- 关系图连接文件、算法用途与迁移参考，支持搜索、筛选、平移缩放和源码定位，可导出离线交互 HTML 或 PNG。概览提供文件发现矩形树图。
- 后台扫描显示实际上传/下载字节、采集与分析计数，支持取消、部分结果保留和刷新后恢复任务查询。
- 命令行支持按 Star 检索并批量扫描热门密码学 Python 仓库。网页批量扫描统一从「仓库全景」进入。
- 导出 HTML、Markdown、JSON、CSV 报告；HTML 可通过浏览器打印为 PDF。默认不附带完整源码。
- 提供明暗主题、键盘操作和窄屏布局。
- 扫描时可自动使用AI辅助；开关首次默认开启，没有可用配置时引导设置或选择仅静态扫描。支持保存多份模型配置，最多启用一个；切换只影响新任务。等待本次分析结束后统一展示；支持安全记住配置、关闭后补做、停止及继续未完成项。
- Python提供有界跨文件静态分析、独立调用上下文和证据核验；目录上传保留相对路径。用途、AI研判和调用证据融入发现明细、概览、关系图、资产及迁移待办。

结果区分静态确认、AI 研判和证据不足。迁移评分按静态确认项计算，用于安排处置优先级。通用 PEM 头的算法待复核。[AI 配置、发送范围与预算](docs/ai-analysis.md)

## 仓库全景与资料库

仓库全景内置 87 个公开仓库的扫描摘要，其中 81 个已完成全部候选文件扫描和适用的跨文件核验。图中有 44 个仓库关联到 2,587 条静态确认记录。克隆仓库后启动应用，或安装桌面版，即可在「仓库全景」中查看这批数据，无需重新扫描或配置模型。资料库随源码保存在 `web/repository-seed.json`。

- **扫描仓库**可让 AI 选择公开新仓库，或勾选已入库仓库复查并同步更新用途。「全部」覆盖所有分页，有搜索条件时选择全部匹配项。选仓时模型接收公开仓库名称和 Star 数。显式开启 AI 用途复核后，模型会接收规则未识别用途的脱敏证据片段。
- 每轮结束后列出仓库名、候选文件覆盖、跳过原因和入库状态。批量扫描优先下载仓库归档，在批次上限内共享文本预算。新结果覆盖不足时保留完整或已分析更多文件的旧记录。
- **打开仓库关系图**后，可在全屏工作台切换边捆绑图和二维全景图。边捆绑图在同一圆环上呈现所有匹配关系，颜色和线型区分用途。二维全景图点击类别展开仓库，点击仓库或算法聚焦关联节点，也可拖动节点或开启浮动。两张图共用筛选、证据定位、缩放、平移和小地图。二维全景图导出的 HTML 可按类别展开，PNG 将总览与分类详情排列成一张图。可另行导出仓库清单。
- **导出 JSON / 导入 JSON**用于换机接续。相同仓库按扫描时间保留较新结果，同一时间保留本地记录。**导出资料库清单**生成便于阅读的 Markdown。资料库保存计数和代表位置，完整源码和临时任务详情按原生命周期管理。
- 桌面版将修改保存在用户数据目录，源码版保存在 `web/data/repository-library.json`。升级后会自动补入本机资料库缺少的内置仓库，同名仓库使用本机扫描结果。启动和导入均使用本地数据；主动扫描才访问远程仓库。

### 截图与离线资料

将 HTML 保存到本地后用浏览器打开，可缩放、点击节点和查看证据位置。PNG 包含完整图形。截图包解压后打开 `index.html`，可按板块查看 40 张高清截图，包含实际仓库全景和标注的演示扫描。

| 内容 | 下载 |
| --- | --- |
| 边捆绑图 | [交互 HTML](https://github.com/yoyuzh/Quantum-resistant/releases/download/v1.5.0/repository-edge-bundling.html) · [完整 PNG](https://github.com/yoyuzh/Quantum-resistant/releases/download/v1.5.0/repository-edge-bundling.png) |
| 二维全景图 | [交互 HTML](https://github.com/yoyuzh/Quantum-resistant/releases/download/v1.5.0/repository-overview.html) · [完整 PNG](https://github.com/yoyuzh/Quantum-resistant/releases/download/v1.5.0/repository-overview.png) |
| 87 仓库资料清单 | [Markdown](https://github.com/yoyuzh/Quantum-resistant/releases/download/v1.5.0/repository-inventory.md) |
| 系统截图 | [截图 ZIP](https://github.com/yoyuzh/Quantum-resistant/releases/download/v1.5.0/system-screenshots.zip) |

## 安装与运行

源码运行需要 Python 3.10+、Node.js 22.12+ 和 npm；已有前端构建时，日常启动只需要 Python 及其依赖。

```sh
python -m pip install -r requirements.txt
npm --prefix web ci
npm --prefix web run build
python start.py
```

默认地址为 `http://127.0.0.1:8000`，端口占用时尝试后续端口。Windows 可双击 `start.bat`；脚本优先使用项目 `.venv\Scripts\python.exe`，否则使用 PATH 中的 Python。保持启动窗口打开，按 `Ctrl+C` 停止。

GitHub 扫描和热门检索使用公开访问。单仓扫描遇到 API 限流时尝试下载公开归档。热门检索受 GitHub 搜索额度限制，限流后可稍后重试。

固定端口：

```sh
python start.py --port 8010 --strict-port
```

修改后端后必须重启服务；修改前端后必须重新构建。不要手改 `web/index.html` 或 `web/assets/`。任务只保存在当前进程中，服务重启后需重新扫描。

桌面安装包包含 Electron 和冻结的 Python 后端。Windows x64、Linux x64、macOS Intel 与 Apple Silicon 安装包见 [V1.5.0 Release](https://github.com/yoyuzh/Quantum-resistant/releases/tag/v1.5.0)。桌面运行、数据位置及打包方法见 [桌面使用说明](docs/desktop.md)。

## 命令行

```sh
python -B scan_quantum_vuln.py path/to/source.py --json
python -B scripts/batch_scan_popular.py --top 8 --max-files 6
```

扫描 CLI 保留原 JSON 发现数组；诊断写入 stderr。不指定文件时静态读取 `sample_rsa_code.py`。该文件和 `sample_inputs/` 均为扫描样例，不应直接执行。批量脚本与网页复用同一服务，默认写入 `web/data/popular.json`，会访问真实远程来源。

## 运行范围与资源限制

默认供本机和可信内网使用，无账号系统或多用户隔离，仅支持单进程 API。普通基础扫描与跨文件核验分别最多600秒，自动AI最多900秒，含排队总截止2100秒；热门基础及跨文件阶段1200秒，整批AI共享900秒、总截止2100秒；全局 2 个运行、4 个排队，HTTP 并发 8。采集与分析通过 16 文件/8 MiB 队列连接，分析全局并发 2。

普通扫描每文件最多 2 MiB，每来源最多 5000 个文件和 100 MiB UTF-8 文本。上传请求上限 110 MiB，远程归档上限 200 MiB。支持 ZIP、未压缩 TAR 和 gzip/bzip2 TAR。归档按成员读取，源码仅作静态分析。

仓库资料库任务每文件最多 4 MiB，每仓最多 100 MiB，整批共享 512 MiB。命令行热门批次按仓库均分 512 MiB，每仓上限 100 MiB。

源码、归档与结果暂存于本机，空间上限 2 GiB。终态结果最多保留 15 分钟、8 份、512 MiB。网页按需读取源码，最多缓存 10 个文件。取消或超时保留已分析的部分。热门批次完整结束后更新快照。`coverage` 记录候选、跳过和降级文件，`diagnostics` 记录原因。

默认 Host 仅接受 `localhost`、`127.0.0.1`、`::1`。可信内网访问需明确配置实际主机：

```powershell
$env:QUANTUM_ALLOWED_HOSTS = 'localhost,127.0.0.1,::1,192.168.1.10'
python start.py --host 0.0.0.0 --port 8010 --strict-port
```

写请求的 Origin 必须同源或属于显式配置的 `QUANTUM_ALLOWED_ORIGINS`；开发脚本自动配置。远程仅访问固定 HTTPS 服务域名，逐跳校验重定向。完整 API、生命周期与安全边界见 [架构说明](docs/architecture.md)。

## 目录与维护

- `scanner/`：规则、AST、配置与文本分析、PEM 识别、资源控制和结果汇总。
- `backend/`：API、采集、后台任务、临时存储、热门编排、统计及报告。
- `web/src/`：Vue 界面；`web/index.html` 与 `web/assets/` 为正式构建产物。
- `desktop/`：Electron 窗口、进程通信、打包配置和依赖许可。
- `scripts/`：启动、批量扫描、HTTP 冒烟及构建身份检查。
- `tests/`、`web/tests/`、`desktop/tests/`：后端、前端和桌面回归。
- `sample_inputs/`、`sample_rsa_code.py`：仅用于静态扫描的样例。

开发启动、CI 和打包发布机制见 [开发与构建](docs/development.md)；检查命令、验收范围和本次整理结果见 [验证说明](docs/validation.md)。
