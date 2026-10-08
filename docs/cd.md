# 桌面多端持续交付与 Release 发布

从 0.1.2 起，`.github/workflows/desktop-release.yml` 在同一个 GitHub 预发布中提供四端安装包：

| 平台 | 原生 runner | 产物 |
| --- | --- | --- |
| Windows x64 | windows-2022 | Quantum-Scanner-X.Y.Z-win-x64.exe |
| Linux x64 | ubuntu-22.04 | Quantum-Scanner-X.Y.Z-linux-amd64.deb |
| macOS Intel | macos-15-intel | Quantum-Scanner-X.Y.Z-mac-x64.dmg |
| macOS Apple Silicon | macos-15 | Quantum-Scanner-X.Y.Z-mac-arm64.dmg |

每端冻结对应平台和架构的 Python 后端，不跨端复用二进制。安装包尚未正式代码签名，macOS 尚未 Developer ID 签名和 Apple 公证。自动构建不代表安装后的 GUI 实机验收。

## 触发和版本

推送 desktop-vX.Y.Z 标签自动触发，也可在 Actions 手动输入已有标签运行。标签、desktop/package.json 和 package-lock.json 两处版本必须一致，支持 X.Y.Z 及 alpha/beta/rc.N。测试、构建、发布绑定标签对应的确切 SHA。

已有 Release 不覆盖、不删除，不移动已发布标签。后续版本更新两个 npm 版本文件，提交推送后创建新标签。本轮使用 0.1.2，保留已发布的 0.1.0、0.1.1。

## 发布门禁

1. 检查标签、版本和提交身份，再对同一 SHA 执行 Linux Python 3.10/3.13、Windows Python 3.13 的完整 CI。
2. 四端原生构建：前端和桌面 Node 测试、锁定 Python 依赖、PyInstaller 冻结、后端冒烟、Electron 打包和 SHA-256。
3. 各端锁定运行环境执行 pip check 和完整 Python 回归，校验安装包格式、文件名、版本、标签、SHA 和校验文件，生成该端 BUILD-INFO。
4. 四端全部成功才进入发布任务。下载本次运行的四份 artifact，复核远程标签未移动，各端身份和校验值一致。
5. 汇总四个安装包、统一 SHA256SUMS.txt、包含四端记录的 BUILD-INFO.json。创建草稿，上传完成后转为预发布，检查线上六个附件全部存在且非空。

缺少任一端或任何检查失败，不发布部分平台。artifact 保留 14 天。上传失败可能留下草稿；恢复前检查日志和草稿，不自动删除或覆盖已有附件。

## 权限和验证

检查及构建使用 contents: read；仅发布任务使用 contents: write 和自动 GITHUB_TOKEN。发布任务不 checkout 或执行仓库源码，只执行工作流中固定的汇总及发布步骤。官方 Actions 固定完整 SHA。

SHA256SUMS.txt 覆盖四个安装包；BUILD-INFO.json 包含标签、版本、源码 SHA，以及每端文件名、SHA-256、Python/Node 版本和运行编号。下载后使用 sha256sum、shasum -a 256 或 PowerShell Get-FileHash 核验；校验值不能代替代码签名。

发布脚本回归覆盖四类目标、格式错误、校验不匹配、缺失文件及提交身份错误。工作流通过 actionlint。上一轮四端原生构建已在真实 runner 通过；本轮验证四端附件进入同一 Release 后的下载校验。
