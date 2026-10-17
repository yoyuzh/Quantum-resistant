# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

`AGENTS.md` 是本项目权威的约束文档（模块边界、行数上限、资源/超时限制、兼容性要求），修改前先阅读；细节见 `docs/architecture.md`。以下为摘要与补充。

## 项目概览

抗量子密码迁移静态扫描原型：FastAPI 后端 + Vue 3/Vite 前端 + Electron 桌面封装（`desktop/`）。四类输入：snippet、manual_upload、github_repository、pypi_package。扫描只做静态分析，**绝不执行被扫描代码**；不要运行 `sample_inputs/` 中的样例。算法迁移知识是静态参考，不是真实供应链图谱。

## 常用命令

```sh
python -m pip install -r requirements.txt
npm --prefix web install

python -B -m unittest discover -s tests -v                 # 全部 Python 测试
python -B -m unittest tests.test_scanner_regressions -v    # 单个模块
python -B -m unittest tests.test_scanner_regressions.ClassName.test_name -v  # 单个用例
npm --prefix web test                                      # 前端纯函数测试（node --test）
npm --prefix web run build                                 # 构建前端，写入 web/index.html 与 web/assets/
python start.py --port 8010 --strict-port                  # 启动服务（无热重载，改后端需重启）
python scan_quantum_vuln.py <path>                         # CLI 扫描（保持 JSON 输出与命令兼容）

npm --prefix desktop test                                  # 桌面 Electron 单元测试
npm --prefix desktop run build                             # 完整桌面打包流水线（隔离环境，见 docs/desktop.md）
python -m tests.browser_fixture                            # 离线 UI 验收（仅 localhost:8018）
```

开发模式：`BACKEND_PORT=8010 FRONTEND_PORT=3010 ./scripts/start_dev.sh`（Vite 通过 `BACKEND_URL` 代理后端）。

## 架构要点

- **扫描核心**：`scan_quantum_vuln.py` 仅为公共兼容导出与 CLI，实现在 `scanner/`（`rules.py`、`python_analysis.py` AST、`text_analysis.py` 其他语言有限规则、`engine.py`、`results.py`）。AST 成功时负责调用/配置识别，不要让规则回退二次引入误报；通用 PEM 头不推断 RSA；诊断不计入确认风险；评分是启发式而非概率。修改规则必须跑扫描回归测试。
- **后端**（`backend/`）：`main.py` 是薄路由 + `app`（入口 `backend.main:app` 必须保留）；`models.py`、`uploads.py`、`scanning.py` 分工；采集走 `collectors.py` → `remote_sources.py`（GitHub/PyPI）/`archives.py`/`collection_common.py`（截止时间、HTTP、并发）；`popular.py` 供网页与 CLI 共用热门批量扫描；`storage.py` 原子写入，`reporting.py` 报告，`knowledge.py` 知识生成。
- **任务模型**：单进程后台任务，边采集边分析，共享截止时间（普通 600s、热门 1200s），有队列/并发/容量上限（具体数值见 AGENTS.md）。文件统计、筛选、源码定位一律使用 `source_id`，不要按文件名合并。
- **前端**（`web/src/`）：`App.vue` 保持 ≤250 行；业务组件 ≤350 行（含样式），不得压缩代码凑行数；只用 Vue props/emits + composables，不引入 UI 框架/Pinia/路由；请求统一经 `api/client.js`；纯函数放 `utils/`，用 Node 原生测试，不在 Python 中复刻前端逻辑。`web/app.js` 是旧版参考，勿改。
- **桌面**（`desktop/`）：Electron 主进程（`src/main.cjs`、`backend.cjs`、`policy.cjs`）启动随包冻结的 Python 后端（PyInstaller，`backend.spec`/`backend_entry.py`）。CI 在 `.github/workflows/`（ci、desktop-build、desktop-release）。

## 必须遵守

- `web/index.html` 与 `web/assets/` 是构建产物，禁止手改；改前端后必须 `npm --prefix web run build` 并验证 FastAPI 页面。
- 远程（GitHub/PyPI）测试必须 mock，不得触发真实网络；网络统一用 httpx。模拟逻辑只放 `tests/`，不得接入生产入口。
- 保留现有 URL、CLI 命令、JSON 输出；诊断写 stderr；API 新增字段只能是可选的（如 `coverage`、`diagnostics`）。
- Python 3.10+，使用 `from __future__ import annotations` 与类型注解；用户提示用中文；时间为北京时间 ISO `+08:00`。
- 不创建子代理；除非用户明确要求，不 commit/push/发布。
