# 桌面持续交付与 Release 发布

`.github/workflows/desktop-release.yml` 自动构建 Windows x64 安装程序并发布 GitHub **预发布版本**。未签名测试版沿用现有桌面能力边界；macOS/Linux 安装包不在本次交付范围。

## 触发方式

- 推送 `desktop-vX.Y.Z` 标签，自动运行发布流程。
- 在 Actions → Desktop Release → Run workflow 中输入已存在的桌面标签，手动运行同一流程。

标签必须等于 `desktop-v` 加 `desktop/package.json` 的版本号，`desktop/package-lock.json` 的两处版本也必须一致。支持 `X.Y.Z` 和 `X.Y.Z-alpha/beta/rc.N`。标签对应提交必须包含本次 CI/CD 工作流和辅助脚本。已有 `desktop-v0.1.0` Release 不会被覆盖或修改。

## 发布流程

1. 检查标签、版本及 Git 提交，确定唯一提交 SHA。
2. 调用已有 CI，对该 SHA 执行完整 Windows/Linux 检查；任一检查失败均停止。
3. Windows 原生构建复用 `npm --prefix desktop run build`：前端构建、前端/桌面测试、锁定 Python 依赖、PyInstaller 冻结后端、冻结后端离线冒烟、NSIS 打包及 SHA-256 校验文件。
4. 使用锁定的打包 Python 环境再次跑完整回归及 `pip check`，检查安装包文件头、校验值及提交身份，生成发布说明和构建信息。
5. 将产物保存为本次 Actions 的 artifact，再由单独发布任务下载，复核远程标签仍指向已测试提交及校验值。
6. 创建草稿并附加安装包、`SHA256SUMS.txt`、`BUILD-INFO.json`，完成后转为预发布版本，检查线上附件与状态。

CI 在分支 push、PR、手动运行时独立执行；桌面标签由发布流程调用 CI，避免重复跑同一组检查。测试、打包、发布使用同一个 SHA，手动运行也不会误测默认分支。

## 准备下一版

下面以 `0.1.1` 为例，**仅是维护者未来发布时的步骤，本轮没有执行**：

```sh
npm --prefix desktop version 0.1.1 --no-git-tag-version
# 检查 package.json、package-lock.json 的版本，以及完整 CI/CD 改动。
# 完成代码检查后，由维护者提交并推送本次版本代码，再创建版本标签：
git tag desktop-v0.1.1
git push origin desktop-v0.1.1
```

发布前应处理 [CI 验证记录](ci.md) 中的 Python 3.10 AST 崩溃问题；所有 CI 检查都必须成功，未设置跳过或允许失败。

## 权限、失败与验收

构建及 CI 只有 `contents: read`；发布任务使用自动提供的 `GITHUB_TOKEN` 和 `contents: write`，不需要保存 PAT。发布任务不 checkout 或执行仓库源码。Actions 固定官方发布版本的完整 SHA。实现依据 [可复用工作流](https://docs.github.com/en/actions/how-tos/reuse-automations/reuse-workflows)、[构建产物](https://docs.github.com/en/actions/tutorials/store-and-share-data)及 [GitHub CLI 发布命令](https://cli.github.com/manual/gh_release_create)。

同一标签发布串行执行，不中断已经开始的上传。已存在的 Release 会让创建步骤失败；不删除旧 Release、不覆盖附件。上传或发布失败可能留下草稿，维护者应先检查草稿及运行日志，再决定如何恢复。不要通过重打同名标签替换已发布版本。

每次 Release 附件包含安装包、校验文件和构建信息；Actions 额外保留发布说明，artifact 保留 14 天。预发布不设为 latest。SHA-256 只验证文件完整性；正式公开版需要另行接入代码签名。CI 与冻结后端冒烟不代表安装后桌面交互已实机验收。

本轮仅在本地配置及验证脚本和工作流，未提交、推送、创建标签或发布 Release。macOS 无法替代 Windows 原生打包验收；真实 Windows runner、下载附件及正式安装还需在远程首次运行后验收。

## 本地验证记录（2026-10-08）

- 两份工作流通过 actionlint 检查，Git 差异无空白错误。
- 新增 4 项发布测试通过，覆盖版本和标签错误、轻量/附注标签、提交不一致、安装包被篡改/缺失，以及构建信息。
- Python 3.13 的普通依赖环境和桌面锁定运行依赖环境，完整回归各 213 项通过；锁定环境的 `pip check` 通过。
- Python 3.10 的新增发布测试通过；完整回归仍有 1 项资源测试子进程原生崩溃，发布门禁不会绕过该失败。
- Windows 安装包构建、artifact 上传和 GitHub Release 发布尚未在真实 runner 验收。

## 后续验证版本

本轮全流程验证使用 `0.1.1`，保留已发布的 `desktop-v0.1.0`。Python 3.10 AST 崩溃已通过解析前 token 预检查修复，长输入转为带诊断的有限文本分析。另增加手动多端原生构建工作流（见 [CI 说明](ci.md)），其产物保存在 Actions artifact；本 CD 的发布范围仍为 Windows x64。
