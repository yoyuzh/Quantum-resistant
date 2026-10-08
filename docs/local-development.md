# 本地开发初始化（macOS）

项目根目录：`/Users/mac/Documents/ChatGPT/抗量子密码识别`。
Python 3.10+；当前初始化使用 Python 3.14.7、Node.js 22.23.2、npm 12.1.0。
开发约束沿用仓库已有的根目录 `AGENTS.md`。

## 安装依赖

```sh
rtk proxy python3 -m venv .venv
rtk proxy .venv/bin/python -m pip install -r requirements.txt
rtk npm --prefix web ci
rtk npm --prefix desktop ci
rtk proxy node desktop/node_modules/electron/install.js
```

Python 虚拟环境与 node_modules 均留在本地；仓库保留已有依赖声明和锁文件。
普通本地运行不需要配置环境变量或访问令牌。桌面打包另见 `docs/desktop.md`。

## 运行

使用已有前端构建，启动 FastAPI 页面：

```sh
rtk proxy .venv/bin/python start.py --port 8010 --strict-port
```

访问 `http://127.0.0.1:8010`，按 Ctrl+C 停止。

前后端开发时，在两个终端分别运行，Vite 将 `/api` 代理到指定后端：

```sh
rtk proxy env QUANTUM_ALLOWED_ORIGINS=http://127.0.0.1:3010,http://localhost:3010 .venv/bin/python start.py --port 8010 --strict-port
rtk proxy env BACKEND_URL=http://127.0.0.1:8010 npm --prefix web run dev -- --host 127.0.0.1 --port 3010 --strictPort
```

桌面开发窗口使用当前虚拟环境：

```sh
rtk proxy env QUANTUM_DESKTOP_PYTHON="$PWD/.venv/bin/python" npm --prefix desktop start
```

## 检查

```sh
rtk proxy .venv/bin/python -m pip check
rtk proxy .venv/bin/python -B -m unittest discover -s tests -v
rtk npm --prefix web test
rtk npm --prefix desktop test
rtk npm --prefix web run build
```

构建会更新已跟踪的 `web/index.html` 和 `web/assets/`，只通过构建生成这些文件。
远程自动测试使用 mock；不要执行 sample_inputs 中的源码，也不要把测试通过写成真实远程服务或桌面安装包已验收。

Serena 项目配置及 onboarding 位于 `.serena/`；可在根目录使用 `rtk proxy serena memories check` 检查记忆引用（需本机提供 Serena CLI）。

## 本次初始化检查（2026-10-08）

- Python、web、desktop 依赖已安装；`pip check` 通过。
- 前端 37 项和桌面端 6 项 Node 测试通过，Vite 构建通过。
- Python 共 192 项测试，1 项错误：`test_windows_proxy_and_explicit_environment_priority` 直接 mock 仅 Windows 提供的 `urllib.request.getproxies_registry`，macOS 无此属性。保留上游代码，未修改该测试。
- 临时服务的首页、生成资源、`/api/health` 均返回 200；本地片段扫描返回 200 并识别 1 项 RSA 发现。验收后服务已停止。
- 构建产物已还原为仓库版本；重新开发时运行构建命令生成。原有 `AGENTS.md` 未改动，未另建 `agent.md`。
- web 安装报告 3 项高危依赖告警；后续 audit 查询遇到 TLS 连接失败，尚未核实告警详情。本次保留上游锁文件，未自动升级依赖。
- 初始化前的空 Git 元数据备份在相邻目录 `.quantum-resistant-empty-git-20261008`；当前根目录已使用克隆仓库的完整历史与 origin。
- Serena onboarding 已完成，`serena memories check` 检查通过。
