# 持续集成

工作流位于 `.github/workflows/ci.yml`。推送任意分支、创建或更新 PR，以及 Actions 页面手动运行都会触发检查。桌面版本标签由 CD 调用本工作流，并传入待测试的确切提交。同一事件和分支的新运行会取消旧运行；不同平台的失败不会取消其他平台。

## 检查范围

| 系统 | Python | Node.js |
| --- | --- | --- |
| Ubuntu 22.04 | 3.10、3.13 | 24 |
| Windows Server 2022 | 3.13 | 24 |

每组环境安装 Python 依赖并执行 `pip check`，按锁文件执行前端和桌面端 `npm ci`，运行两套 Node 测试，构建前端，再执行完整 Python 回归和真实 HTTP 冒烟检查。Python 3.10 检查最低支持版本，3.13 对应现有桌面构建版本。

前端构建会更新 `web/index.html` 和 `web/assets/`，CI 仅在临时 checkout 中生成产物，不回写或提交。后端测试读取构建资源，因此构建在 Python 测试之前进行。现有远程采集测试继续使用 mock；`sample_inputs/` 的代码不执行。

`scripts/ci_smoke.py` 启动真正的 `start.py`，使用本机临时端口和独立临时缓存，验证首页、首页引用的 JS/CSS、健康检查、配置接口及 RSA 静态片段扫描。检查成功或失败均停止子进程并清理临时文件，服务失败时输出日志。不访问 GitHub/PyPI 来源。

## 本地复现

在已安装依赖的开发环境中执行：

```sh
python -m pip check
npm --prefix web test
npm --prefix desktop test
npm --prefix web run build
python -B -m unittest discover -s tests -v
python -B scripts/ci_smoke.py
```

CI 使用 `ELECTRON_SKIP_BINARY_DOWNLOAD=1` 跳过 Electron 可执行文件下载。桌面 Node 测试不启动 Electron；本地需要打开桌面窗口时应按桌面说明正常安装 Electron。

## 权限与验收边界

工作流仅有 `contents: read` 权限，不需要仓库密钥，checkout 不保存凭据；Actions 固定到官方发布版本的完整 commit SHA。依赖缓存按声明与锁文件更新。配置方式参考 [GitHub Python CI 文档](https://docs.github.com/en/actions/tutorials/build-and-test-code/python)和 [Node.js CI 文档](https://docs.github.com/en/actions/tutorials/build-and-test-code/nodejs)。

CI 工作流不生成安装包、不发布 Release、不部署服务，也不设置分支保护。[桌面发布工作流](cd.md)复用本 CI 检查后单独打包并发布。HTTP 冒烟通过不代表浏览器交互或正式桌面安装包已验收；真实远程服务仍需单独验收。

只有将工作流推送到 GitHub 后，才能确认托管 Windows/Linux runner 的运行结果。需要阻止失败检查被合并时，再由维护者配置分支保护，将三个 `Checks (...)` 检查设为必需。

## 本地验证记录（2026-10-08）

macOS 上 Python 3.13、3.14 的完整回归各 205 项通过；前端 37 项、桌面端 6 项 Node 测试通过，前端构建和 actionlint 工作流检查通过。Python 3.10、3.13、3.14 的真实 HTTP 冒烟检查通过。

Python 3.10 完整回归有 1 项失败：`test_cancel_partial_results_terminal_freeze_and_storage_release` 子进程收到致命信号；单独运行资源测试仍可复现。额外的隔离复现确认本机 CPython 3.10 在 `ast.parse("a." * 300000 + "a")` 中发生原生崩溃。该问题属于扫描器对超长 Python AST 输入的处理，不是代理 mock 修复或 CI 脚本导致；本轮未修改正在修复的扫描器文件。仍保留最低版本 CI 检查，未跳过或允许失败。Linux 3.10 是否相同需由实际 runner 验证。

尚未提交或推送，GitHub 托管 runner 尚未验收。

## 后续修复与多端构建验证（2026-10-08）

上述 Python 3.10 崩溃已定位并修复：进入 CPython AST 解析器前进行带预算检查的 token 预检查，过长逻辑语句及 token 超限输入转为有限文本分析，并保留 `syntax_fallback` 诊断。新增子进程回归覆盖 300000 段点号链，防止原生崩溃被异常处理掩盖。

`.github/workflows/desktop-build.yml` 提供手动原生构建验证：Windows x64、Ubuntu 22.04 x64、macOS 15 Intel 和 Apple Silicon。每个平台构建自己的 Python 后端与 Electron 安装包，执行冻结后端冒烟、锁定运行依赖检查及完整回归，再上传安装包和校验文件。它不发布 Release；现有 CD 仍只发布 Windows x64。macOS 配置只打包当前 runner 的架构，避免 Intel Electron 被配入 arm64 后端。

同机并行执行多个完整 Python 测试进程时，应为各进程设置独立的 `TMPDIR`、`TMP`、`TEMP`，避免共享暂存目录清理发生竞争。GitHub 各矩阵任务使用独立 runner。
