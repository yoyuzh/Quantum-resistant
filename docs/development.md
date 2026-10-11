# 抗量子密码风险检测与迁移辅助软件开发与构建

## 本地开发

网页运行需要 Python 3.10+，前端开发和构建使用 Node.js 22.12+。依赖分别声明在 `requirements.txt`、`web/package.json` 和 `desktop/package.json`；npm 使用锁文件安装。

```sh
python -m venv .venv
python -m pip install -r requirements.txt
npm ci --prefix web
npm --prefix web run build
python start.py --port 8010 --strict-port
```

创建虚拟环境后应先激活环境或使用其 Python 绝对路径。Windows 日常启动脚本优先使用 `.venv\Scripts\python.exe`。

前后端开发使用以下任一脚本，后端地址通过 `BACKEND_URL` 传给 Vite，开发 Origin 同步配置。

```powershell
./scripts/start_dev.ps1 -BackendPort 8010 -FrontendPort 3010
```

```sh
BACKEND_PORT=8010 FRONTEND_PORT=3010 ./scripts/start_dev.sh
```

单独启动 Vite 时显式设置 `BACKEND_URL`。开发页面路径为 `/static/`。修改 Python 后重启服务，修改前端后构建才能更新 FastAPI 页面。构建替换 `web/index.html` 和 `web/assets/`，禁止手改产物。

完整检查及离线 fixture 见 [验证说明](validation.md)。桌面开发、冻结依赖、原生构建及验收见 [桌面说明](desktop.md)。

## 自动检查

`.github/workflows/ci.yml` 在 push、PR 和手动调用时运行，桌面发布传入标签对应的确切提交。矩阵包括 Ubuntu 22.04 的 Python 3.10/3.13 和 Windows Server 2022 的 Python 3.13，Node.js 使用 24。

检查按锁安装依赖、执行 pip check、前端与桌面 Node 测试、前端构建、完整 Python 回归和真实本地 HTTP 冒烟。远程采集测试使用 mock，样例仅静态读取。CI 仅在临时 checkout 构建，不回写产物；桌面 Node 测试不启动 Electron，可通过 `ELECTRON_SKIP_BINARY_DOWNLOAD=1` 跳过可执行文件下载。

官方 Actions 固定完整 SHA，检查工作流使用 contents: read，checkout 不保存凭据。CI 不打包、不发布、不部署。并行完整 Python 测试应设置各自独立的 TMP/TEMP/TMPDIR，避免清理共享暂存目录时竞争。

## 桌面构建与发布机制

`.github/workflows/desktop-build.yml` 提供手动原生打包验证。`.github/workflows/desktop-release.yml` 在 `vX.Y.Z` 正式标签或兼容的 `desktop-vX.Y.Z` 标签或手动选择已有标签时，验证版本和提交身份，复用 CI，再分别构建 Windows x64 EXE、Ubuntu x64 DEB、macOS Intel DMG、macOS Apple Silicon DMG。

`desktop/package.json` 与锁文件版本必须一致，正式标签为对应 `vX.Y.Z`，历史标签 `desktop-vX.Y.Z` 仍兼容，支持 alpha/beta/rc.N。每端冻结自身架构的 Python 后端，运行冻结后端冒烟、锁定依赖完整回归，并验证安装包格式和 SHA-256。产物仍使用 `Quantum-Scanner-X.Y.Z-目标后缀` 技术文件名；安装名称和窗口标题使用正式中文软件名。

四端成功后，发布任务再次核对远程标签 SHA、各端 BUILD-INFO 与校验值，汇总四安装包、SHA256SUMS.txt 和 BUILD-INFO.json，创建草稿，再按标签转为正式发布或预发布；稳定 `vX.Y.Z` 为正式 Latest，带 alpha/beta/rc 后缀和历史 desktop-v 标签为预发布。不覆盖已有 Release 或移动已发布标签。检查和构建为只读权限，发布任务使用 contents: write 且不 checkout/执行仓库源码。artifact 保留 14 天。

安装包尚未正式代码签名，macOS 尚未 Developer ID 签名/Apple 公证。构建通过不能代替安装后 GUI 实机验收；SHA-256 只校验文件完整性。

项目整理、测试及软著材料准备不触发发布流程；维护者明确决定发布时再创建提交、推送与标签。
