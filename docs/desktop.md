# 桌面测试版的使用与分发

桌面版保留四类输入、源码定位、迁移知识、热门仓库和四种报告。双击安装程序后，从桌面或开始菜单启动“抗量子迁移风险扫描平台”。无需安装 Python、Node.js 或 WebView2；不需要管理员权限。Windows 安装程序采用当前用户安装，默认不添加开机启动。

## 本次产物

- 下载入口：[GitHub Release桌面0.1.0测试版](https://github.com/yoyuzh/Quantum-resistant/releases/tag/desktop-v0.1.0)。
- Windows x64：`desktop/release/Quantum-Scanner-0.1.0-win-x64.exe`。
- 完整性校验：同目录的 `SHA256SUMS.txt`。
- 首版为未签名测试版，不包含发布者身份认证。正式公开分发前应完成 Windows 代码签名；macOS 还需 Developer ID 签名和 Apple 公证。不要通过关闭系统安全功能解决安装提示。
- macOS 14+ Intel/Apple Silicon 和 Ubuntu 22.04/24.04 x64 的配置已提供，但本次没有这两种平台的实包或实机验收。不将构建配置视为平台兼容认证。

SHA-256 用于校验安装文件的完整性，不能证明发布者身份。在 PowerShell 中运行 `Get-FileHash -Algorithm SHA256 安装程序路径`，与随包校验值比较。

## 数据与网络

本地代码只作静态分析，扫描不会执行上传的代码，也不会安装被扫描的 PyPI 包。代码片段、文件上传、迁移知识和报告导出可离线使用。只有用户主动扫描 GitHub/PyPI 或刷新热门仓库时，后端才访问已有允许列表中的远程服务。

用户数据目录由 Electron 的 `userData` 确定：Windows 通常为 `%APPDATA%\Quantum Resistant Scanner`，macOS 为 `~/Library/Application Support/Quantum Resistant Scanner`，Linux 为 `~/.config/Quantum Resistant Scanner`（可能由 XDG 配置调整）。主题和热门快照位于该目录；日志最多每类4份、每份约1 MiB，不记录令牌、源码正文或请求体。源码、归档和任务结果在其 `cache/scans` 中短期保存，保留原有2 GiB容量、结果15分钟/8份/512 MiB限制。

退出后不恢复扫描任务；先导出需要保存的结果。进行中关闭窗口会提示取消任务并退出，最长约10秒停止本地后端。异常退出遗留的暂存目录在下次启动清理。卸载保留用户设置、热门快照和已导出的报告；可在确认不再需要后自行删除用户数据目录。应用不会写入安装资源目录，也不会携带开发者机器上的热门快照、令牌或扫描结果。

四种报告通过系统保存对话框选择位置。保存完成、取消或失败都有桌面提示；网页的“已生成”只表示内容已生成。HTML 报告可用浏览器打开，并打印为 PDF。

## 从源码构建

构建机需要 Python 3.13（本次使用3.13.5）、Node.js 22.12+（建议24 LTS）、npm及可访问依赖源的网络。收件人的电脑不需要这些开发工具。

```powershell
npm ci --prefix desktop
npm --prefix desktop run build
```

统一脚本创建隔离构建环境、安装锁定依赖、构建前端、跑前端与桌面单元测试、打包Python后端、执行离线后端冒烟检查、生成安装包及校验文件。远程扫描测试不访问真实仓库。Python完整回归另外运行：

```powershell
desktop/.venv-build/Scripts/python.exe -m pip install hypothesis
desktop/.venv-build/Scripts/python.exe -B -m unittest discover -s tests -v
```

macOS/Linux使用 `.venv-build/bin/python`。在各目标平台及架构原生构建：Windows输出NSIS EXE；macOS输出当前架构的DMG（Intel和Apple Silicon各构建一次）；Ubuntu输出DEB。禁止把Windows冻结的后端放入macOS/Linux包。Linux应在最老的受支持发行版Ubuntu22.04构建，随后验证22.04和24.04；GTK/NSS等系统依赖由DEB安装处理，不关闭Chromium沙箱。

许可汇总包含Python运行依赖、CPython和PyInstaller引导程序。如果系统Python没有提供LICENSE文件，构建会明确停止；从对应Python发行版取得LICENSE，保存为`desktop/build/CPYTHON-LICENSE.txt`后再构建。macOS修改Electron fuses后会恢复ad-hoc签名以保持二进制可运行；ad-hoc签名不能替代Developer ID签名和公证。

开发窗口：`npm --prefix desktop start`，后端默认使用PATH中的Python。可通过 `QUANTUM_DESKTOP_PYTHON` 指定Python绝对路径。正式安装包始终使用随包后端，忽略开发入口变量。

## 离线桌面验收

```powershell
$env:QUANTUM_DESKTOP_PYTHON = (Resolve-Path desktop/.venv-build/Scripts/python.exe).Path
$env:QUANTUM_DESKTOP_BACKEND_ENTRY = (Resolve-Path tests/desktop_fixture.py).Path
$env:QUANTUM_DESKTOP_DATA_DIR = Join-Path (Get-Location) 'desktop/validation/fixture-profile'
npm --prefix desktop start
```

该测试适配器只监听127.0.0.1:8018，复用现有browser_fixture替换远程采集，测试数据单独存放。GitHub/PyPI输入包含`slow`可模拟慢任务，`failure`模拟失败。模拟逻辑只在tests目录，未打包；正常入口不会导入它。结束后移除这三个环境变量，再测试正式安装包。不要执行sample_inputs中的代码，它们只能作为静态输入。

## 安全与维护

桌面后端仅监听回环随机端口，所有HTTP资源使用每次启动生成的会话令牌；令牌通过管道传递，只由Electron主进程附加到确切的本地地址。普通浏览器和无令牌客户端不能读取桌面扫描内容。该机制不是对同一操作系统用户恶意程序的隔离，也不提供多用户服务认证。

窗口启用沙箱、上下文隔离及CSP，不向网页暴露Node.js或通用文件/命令接口；外链只允许指定NIST HTTPS域名并由系统浏览器打开。后台进程随父进程退出。安装资源采用ASAR完整性校验，禁用RunAsNode、NODE_OPTIONS及Node调试参数。

首版没有自动更新。分发新版本前重新审计Python/npm依赖、更新仍受支持的Electron版本、重新构建及验收，再由维护者手动分发。签名证书和Apple凭据只放在受保护的构建环境，不能写入仓库。完整第三方许可文件随安装包提供，见`resources/THIRD-PARTY-NOTICES.txt`及Electron/Chromium许可。

内部进程协议使用逐行JSON：父进程通过stdin传递`token`、`data_root`和`cache_root`；后端绑定端口并完成ASGI启动后，通过stdout发送`ready`及`port`、`pid`。`status`命令按`id`返回运行与排队总数，`shutdown`或stdin EOF触发回收；stdout只承载协议，诊断单独写日志。启动最长等待30秒，退出最长等待10秒。不要将含令牌的初始配置放入命令行、网页或日志。

具体已完成和未完成的验收见[桌面验证记录](desktop-validation.md)。
