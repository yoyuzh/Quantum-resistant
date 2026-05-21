# AGENTS.md

本文件为 AI 编码助手与新加入的开发者提供本仓库的快速上下文：项目目标、目录结构、运行/测试方式、代码约定与常见陷阱。

## 项目概览

抗量子迁移风险扫描平台。识别 Python 代码、配置文件和 PEM 密钥材料中量子脆弱的传统公钥算法用法（RSA、DSA、DH、ECDH、ECDSA、ECC、X25519/X448、Ed25519/Ed448），并给出迁移到 NIST PQC 标准（FIPS 203 ML-KEM / FIPS 204 ML-DSA / FIPS 205 SLH-DSA）的建议。

四种输入来源：

- `snippet`：粘贴代码片段
- `manual_upload`：本地多文件上传
- `github_repository`：下载 GitHub 仓库 main/master 分支 zip 后扫描
- `pypi_package`：下载 PyPI 包 sdist 或 wheel 后扫描

## 技术栈

| 层级 | 技术 |
| --- | --- |
| 后端 | Python 3，FastAPI，httpx，uvicorn |
| 前端 | Vue 3 (Composition API)，Vite 5 |
| 测试 | `unittest`（标准库），`fastapi.testclient` |
| 打包 | `vite build` → `node scripts/publish-build.mjs` 把产物拷回 `web/index.html` 和 `web/assets/`，由 FastAPI `/static` 直接挂载 |

依赖见 `requirements.txt` 和 `web/package.json`，没有任何额外的构建系统（无 Poetry/PDM/Make）。

## 目录结构

```
.
├── scan_quantum_vuln.py    # 核心扫描器 + CLI（重要：算法规则、AST 访问者、回退正则）
├── start.py                # FastAPI 启动入口（自动选端口 8000-8020）
├── backend/
│   ├── main.py             # 路由、请求模型、上传处理、/static 挂载
│   ├── collectors.py       # GitHub zip + PyPI sdist/wheel 采集，URL/包名校验
│   └── reporting.py        # build_summary, build_markdown_report, 北京时间
├── web/
│   ├── src/App.vue         # 单文件 Vue 应用（UI、扫描请求、Markdown 导出）
│   ├── src/main.js, style.css
│   ├── vite.config.js      # base=/static/，dev proxy /api → 127.0.0.1:8000
│   ├── scripts/publish-build.mjs   # 把 dist/ 的产物拷到 web/index.html + web/assets/
│   ├── index.html, assets/ # 已发布的构建产物，FastAPI 直接服务
│   └── app.js              # 旧版原生 JS UI（不再被首页引用，保留作参考）
├── scripts/
│   ├── start_dev.sh        # macOS/Linux 同时拉起后端 + Vite dev
│   ├── start_dev.ps1, start.ps1, stop_dev_services.ps1
├── sample_inputs/          # 故意写入风险算法的样例文件（仅作扫描输入，不要执行）
├── tests/                  # 后端 API、扫描器、启动脚本测试
├── requirements.txt
└── README.md
```

## 运行与构建

启动开发环境（前后端一起，需要 Node 和 Python）：

```bash
./scripts/start_dev.sh
# 后端：http://127.0.0.1:8000
# 前端：http://127.0.0.1:3000/static/
# 自定义端口：BACKEND_PORT=8010 FRONTEND_PORT=3010 ./scripts/start_dev.sh
```

仅启动后端，由 FastAPI 直接服务已构建好的前端：

```bash
python3 start.py                      # 默认 127.0.0.1:8000，被占用会自动 +1 直到 +20
python3 start.py --port 8010 --strict-port   # 严格端口，占用即失败
```

重新构建前端（修改 `web/src/**` 后必须执行，否则 `python3 start.py` 看到的还是旧页面）：

```bash
cd web && npm install && npm run build
```

`npm run build` = `vite build` + `node scripts/publish-build.mjs`，它会**清空** `web/assets/` 并覆盖 `web/index.html`。不要手动编辑这两个产物。

CLI 单独运行扫描器：

```bash
python3 -B scan_quantum_vuln.py sample_rsa_code.py
python3 -B scan_quantum_vuln.py sample_inputs/risky_protocol_assets.py --json
```

## 测试

```bash
python3 -B -m unittest discover -s tests -v
```

`tests/test_backend_api.py` 用 `TestClient(app)`，会真的启动 ASGI 应用栈，但远程采集（GitHub/PyPI）通过 `unittest.mock.patch` 替换 `backend.main.collect_github_sources` / `collect_pypi_sources`，**不要让测试发起真实网络请求**。

`tests/test_start.py` 通过绑定真实端口验证 `port_is_available` 和 `choose_port`。

修改扫描规则（`VULNERABLE_ALGOS`、`DIRECT_REGEX_RULES`、`STRING_IDENTIFIER_RULES`、`PEM_HEADER_RULES`、`ALIAS_REGEX_RULES`、`MODULE_HINTS`、`NAME_HINTS`）后必须运行 `tests/test_scan_quantum_vuln.py`，里面包含正则回退、字符串误报抑制、PEM 识别、迁移评分等关键覆盖。

## 扫描器架构（关键）

`scan_quantum_vuln.py` 双层管线：

1. **AST 通道** (`QuantumCryptoVisitor`)：解析 import 与调用，建立 `aliases: dict[str, str]` 把别名映射到算法 key（如 `from ... import rsa as foo` → `aliases["foo"] = "rsa"`）。访问 `Call`、`Assign`、`AnnAssign`、`keyword` 节点，对字符串字面量做敏感上下文匹配（`SENSITIVE_STRING_CONTEXT_RE`，例如键名含 `algorithm`、`jwt`、`ssh`、`tls`、`key`、`cert` 才允许触发 `RS256`、`ssh-rsa` 这类标识规则）。

2. **正则回退** (`scan_with_regex`)：当源码语法错误（YAML/PEM/部分 Python）时仍能工作。先用 `strip_strings_and_comments` 把字符串和注释替换成空格再匹配 API 调用模式，避免误报；PEM 头则直接对原始行匹配。`extract_aliases_from_source` 从原文本里再提取一次别名以支持 alias 模式（`ALIAS_REGEX_RULES`）。

3. **合并** (`merge_findings`) 按 `(line, algorithm)` 去重，最终 finding 字典追加 `source_id`、`file_name`、`source_type`。

`build_migration_score` 给前端的"迁移评分"用的简化公式：`min(100, 高风险数*25 + 受影响文件*10 + 算法种类*10)`，分数阈值 `>=40 高 / >0 中 / =0 低`。

新增算法时需要同时改：`VULNERABLE_ALGOS` 条目 + `DIRECT_REGEX_RULES` / `ALIAS_REGEX_RULES` / `MODULE_HINTS` / `NAME_HINTS` / `resolve_alias_call` 与 `resolve_direct_call`，并在 `tests/test_scan_quantum_vuln.py` 里加用例。

## 后端 API 约定

所有路由前缀 `/api/`，响应模型用 Pydantic（`SourceRecord`、`FindingRecord`、`ScanSummary`、`ScanResponse`）。

| 路由 | 方法 | 说明 |
| --- | --- | --- |
| `/api/health` | GET | 健康检查 |
| `/api/scan/snippet` | POST | JSON `{filename, content}` |
| `/api/scan/files` | POST | `multipart/form-data`，字段名固定为 `files` |
| `/api/scan/github` | POST | JSON `{repository_url}`，必须是 `https://github.com/<owner>/<repo>` |
| `/api/scan/pypi` | POST | JSON `{package_name}`，校验正则 `^[A-Za-z0-9][A-Za-z0-9_.-]{0,213}$` |
| `/api/knowledge/graph` | GET | 算法→数学难题→PQC 推荐的图谱（硬编码，前端展示用） |
| `/api/report/markdown` | POST | 把扫描结果转 Markdown，返回 `text/markdown; charset=utf-8` |
| `/` | GET | 返回构建好的 `web/index.html` |
| `/static/*` | GET | `web/` 目录的静态文件 |

资源限制：

- 单文件 `MAX_SOURCE_BYTES = 2 MiB`
- 单次上传总量 `MAX_TOTAL_UPLOAD_BYTES = 10 MiB`
- 远程采集单文件 `MAX_COLLECTED_FILE_BYTES = 2 MiB`，最多 `MAX_COLLECTED_FILES = 80`，超时 `HTTP_TIMEOUT_SECONDS = 20`
- 允许的源码后缀：`.py .pyw .txt .pem .yml .yaml .json .cfg .ini .toml`

`backend/main.py` 用 `email.parser` 手动解析 multipart（不依赖 `python-multipart`），保持依赖最小。

## 前端约定

`web/src/App.vue` 是**唯一**的应用文件（约 1800 行，包含 template/script/全部 CSS 变量与样式）。所有交互、API 请求、Markdown 导出都在这里。

- 所有 API 通过 `/api/...` 相对路径，dev 时 Vite 代理到 `127.0.0.1:8000`，生产由 FastAPI 同源服务
- 主题切换通过 `data-theme` 属性 + `localStorage` 持久化
- `MIN_SCAN_DURATION = 2400` 是为了避免后端秒返导致动画闪烁，**不是**真实加载耗时
- `web/app.js` 是早期原生 JS 版 UI，已被 Vue 取代但仍保留在仓库中。修 UI 时请改 `web/src/App.vue`，**不要**改 `web/app.js`

## 编码约定

- Python 用 `from __future__ import annotations`，类型注解使用 `|` 联合（已要求 Python 3.10+）
- 字符串面向用户的提示用中文，代码标识符、注释中的关键技术术语用英文
- 时间戳一律北京时间（`backend/reporting.py:beijing_now_iso`），ISO 格式带 `+08:00`
- 后端不引入 `requests`，统一用 `httpx.Client`
- 前端不要引入 UI 框架（Element/Vuetify 等），保持零 UI 依赖
- 不要把构建工具切到 Webpack、Rollup 配置外层化，保持当前 Vite 默认行为
- 远程采集失败抛 `CollectionError`，路由层转 `HTTPException(502)`；不要把 httpx 异常直接透出

## 常见陷阱

- 修改 `web/src/**` 后忘记 `npm run build`，会发现 `http://127.0.0.1:8000` 仍是旧页面（dev 服务器走 `http://127.0.0.1:3000/static/` 是热更新的）
- 给扫描器加新规则时，如果正则不够严格容易在普通注释或字符串中误报；优先走 AST 通道并配合 `SENSITIVE_STRING_CONTEXT_RE` 上下文，回退正则用 `strip_strings_and_comments` 之后的版本匹配
- `start.py` 默认会在 8000 占用时滑到 8001…8020；脚本和测试假设端口范围在这之间，CI 中要避开
- `tests/test_backend_api.py` 不能联网，加新远程采集功能时务必给 `collect_*_sources` 加 `unittest.mock.patch` 用例
- `web/index.html` 和 `web/assets/index-*.{js,css}` 是构建产物，文件名带 hash，提交时整体替换；手动编辑会被下一次 `npm run build` 覆盖

## 安全注意

- 远程采集只接受 `github.com`，且仅尝试 `main`/`master` 的 zip；不下载二进制、不执行任何代码
- PyPI 采集优先 sdist，回退 wheel；解压时通过 `safe_archive_member_name` 去除 `..` 路径段，避免 zip-slip
- 上传只接受文本类后缀，且强制 UTF-8 解码（`utf-8-sig`），非 UTF-8 直接 400
- 不存储任何上传内容，全部在内存中处理后返回响应

## 扩展方向

README 末尾列出的方向尚未实现：分支选择 / 私有仓库 token、异步任务与历史记录、CSV/JSON/PDF 导出、Java/Go/JS 多语言识别。如果接到相关需求，优先扩展 `scan_quantum_vuln.py` 的规则与 `backend/collectors.py` 的采集器，前端改 `web/src/App.vue` 对应面板。
