# 抗量子迁移风险扫描平台

面向抗量子密码迁移的静态分析原型：识别 Python 密码库调用、配置算法标识和专用 PEM 头，展示代码证据及迁移知识。扫描不执行输入代码。

## 已实现的能力

- 四类输入：代码片段、多文件上传（含内置样例）、GitHub 仓库、PyPI 包。
- 支持 RSA、DSA、DH、ECDH/ECDSA/ECC、X25519/X448、Ed25519/Ed448，以及部分 JWT/SSH 配置标识。
- Python AST 解析完整导入目标、直接函数/类别名和常见局部遮蔽；无法解析时保守回退。其他文本语言仅有有限规则，不是完整语义分析器。
- 通用 `PRIVATE KEY` / `PUBLIC KEY` 仅产生“算法待复核”诊断，不默认归类为 RSA。
- 结果含源码定位、按算法/文件筛选、文件/API/证据搜索、每页 50 项分页；同名文件通过 `source_id` 独立定位。
- 右侧提供分析概览、资产清单、发现明细和迁移待办：文件—算法证据图支持12个文件分页、搜索及点击联动，迁移方向是静态参考，不代表真实依赖传播。
- 概览提供规则生成的中文解读、算法分布、受影响文件 Top 8、识别方式与迁移用途统计；图表可联动算法、文件和识别方式筛选，不将统计比例当作风险概率。
- 支持离线 HTML 图文报告（浏览器打印可另存 PDF）、Markdown、JSON 和 CSV 导出，默认不附带完整源码，不宣称标准化 CBOM。报告文件名包含来源和北京时间。
- GitHub、PyPI、热门刷新使用后台任务，显示真实阶段和已完成数量，可取消并保留已分析部分；刷新页面可通过任务 ID 恢复查询。
- 每个输入模式保留当前页面会话中的草稿和上次结果；失败保留旧结果及时间。明暗主题持久化，扫描在右侧呈现至少1.5秒加载动画并显示真实等待时间；尊重减少动画偏好。
- 热门密码学 Python 仓库按 Star 检索，网页默认 8 个、CLI 默认 20 个，每仓库默认最多 6 个文件；展示部分成功、失败原因和详情截断。
- 算法迁移知识由算法资料生成，属于静态参考，不是实际软件供应链依赖图。

迁移评分为启发式优先级：`min(100, 高风险项×25 + 受影响文件×10 + 算法种类×10)`，不是经过实验校准的风险概率。零发现不等于项目安全或完整覆盖。

## 安装与运行

### Windows 日常启动

已安装 Python 依赖并构建前端后，双击项目根目录的 `start.bat`，在浏览器打开窗口中 `Open` 后显示的地址。默认使用 `http://127.0.0.1:8000`，端口占用时自动选择后续空闲端口。

启动脚本优先使用项目的 `.venv\Scripts\python.exe`，否则使用 PATH 中的 `python`。保持启动窗口打开，按 `Ctrl+C` 停止服务；启动失败时窗口会保留错误信息。脚本不会自动安装依赖或重新构建前端，使用已有构建时无需 Node.js。

也可以在 PowerShell 中指定端口（`-StrictPort` 表示占用时直接报错）：

```powershell
.\start.bat -Port 8010 -StrictPort
```

### 首次安装与前端构建

需要 Python 3.10+ 和支持 Vite 5 的 Node.js（18+）。

```sh
python -m pip install -r requirements.txt
npm --prefix web install
npm --prefix web run build
python start.py
```

修改后端 Python 代码后，需要停止原服务并重新运行启动命令；默认启动不启用热重载。仅刷新网页或重建前端不会更新已运行的后端代码。服务重启会清除内存中的扫描任务，重启后刷新页面并重新发起扫描。

默认后端端口为 8000；占用时自动尝试到 8020。需要固定地址时：

```sh
python start.py --port 8010 --strict-port
```

开发环境（Vite 代理自动使用指定后端端口）：

```powershell
./scripts/start_dev.ps1 -BackendPort 8010 -FrontendPort 3010
```

```sh
BACKEND_PORT=8010 FRONTEND_PORT=3010 ./scripts/start_dev.sh
```

默认开发前端为 `http://127.0.0.1:3000/static/`，后端为 `http://127.0.0.1:8000`。单独启动 Vite 时，通过 `BACKEND_URL` 指定代理目标。修改前端后必须重新构建，FastAPI 才会提供新页面；不要手改 `web/index.html` 或 `web/assets/`。

## CLI

```sh
python -B scan_quantum_vuln.py sample_inputs/risky_protocol_assets.py --json
python -B scripts/batch_scan_popular.py --top 8 --max-files 6
```

扫描 CLI 保持原 JSON 发现数组形式，诊断输出到 stderr。批量脚本与网页共用检索和扫描服务，批量默认输出 `web/data/popular.json`。

## 限制与扫描范围

单文件 2 MiB，单次上传最多 80 个文件、整个 multipart 请求最多 10 MiB（包含表单开销），只接受允许后缀的 UTF-8 文本。远程最多采集 80 个文件，单文件 2 MiB，归档响应限制见 `backend/collection_config.py`。

网页后台任务：GitHub/PyPI 180 秒、热门批次 120 秒，采集最多使用前 150 秒/90 秒并为分析预留时间。状态查询为独立短请求，断线后退避重连，不重新发起扫描。取消和超时是协作式机制，不强制中断单次 Python 分析；后台任务给并发工作至多 2 秒整理窗口，网络连接也有独立超时。旧同步远程接口与批量 CLI 仍使用 90 秒/60 秒预算。

仅支持单进程 API 服务。最多同时运行 2 个后台任务、排队 4 个，进程内 HTTP 并发最多 8；热门仓库并发 3，每仓库文件并发 2。采集文本总量上限 20 MiB。终态任务最多保留 15 分钟、8 个及 128 MiB 的序列化结果（不代表进程总内存上限），访问/提交/结束任务时清理；达到容量时可能提前淘汰。源码与结果保留在内存，浏览器只在 sessionStorage 保存进行中的任务 ID；服务重启任务消失。不要使用多个 Uvicorn worker。

热门任务未完整结束或被取消时只展示本次部分结果，不覆盖上次 JSON 快照；界面可切换查看上次快照。正常完成的批次可包含明确失败仓库。进入已完成结果的原子保存阶段后不再接受取消。

`coverage` 包含实际文件数、采集上限、候选数、跳过数及是否存在未扫描部分。候选总数未知时为 `null`，不计算完整覆盖率。`diagnostics` 与已确认发现分开，包含稳定代码、中文说明和可选 `source_id`。旧榜单缺少范围字段时显示“扫描范围未知”。

GitHub 优先使用默认分支文件树并发采集，必要时尝试分支源码归档；可用 `GITHUB_TOKEN` 缓解 API 限流。若令牌返回 401，公开资源会在同一时间预算内匿名重试一次。联网请求优先使用显式代理环境变量；Windows 未配置时自动读取已启用的静态系统代理。PyPI 保持直连优先，连接失败时才尝试代理；优先 sdist、回退 wheel，保留包内目录。远程归档只在内存中读取，不落地解压、不执行源码。

热门结果原子替换，全部失败不覆盖旧结果。网页热门刷新采用单进程锁；多 worker 或多进程部署不具备跨进程互斥。当前建议单进程运行。

## 代码与验证

- `scanner/`：算法规则、Python 分析、文本回退与结果汇总；`scan_quantum_vuln.py` 保留公共入口。
- `backend/`：模型、采集、扫描、热门编排、原子存储、知识和报告；`backend.main:app` 保持启动兼容。
- `web/src/`：组件、composable、API 模块、纯函数和集中主题样式。
- `tests/`：unittest、模拟 HTTP/归档测试、Hypothesis 属性测试；`web/tests/` 直接测试 JavaScript。

```sh
python -B -m unittest discover -s tests -v
npm --prefix web test
npm --prefix web run build
```

测试不访问真实远程服务。离线浏览器验收可运行 `python -m tests.browser_fixture`，访问 `http://127.0.0.1:8018/`：真实扫描/上传/导出及后台任务配合模拟采集，仓库或包名含 `timeout` / `failure` 时分别模拟超时/失败，含 `slow` 时逐文件慢速分析，可测试刷新与取消；热门第二次刷新模拟失败，第三次恢复。`/fixture/report` 是离线图文报告样例。该入口仅供本地测试，数据写临时目录。

研究报告规划的真实依赖图谱、传播分析、Neo4j/数据库、LLM、完整多语言解析、历史任务及实验评估尚未实现。详见 [架构说明](docs/architecture.md)。
