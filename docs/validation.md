# 抗量子密码风险检测与迁移辅助软件验证说明

## 常规检查

```sh
python -B -m unittest discover -s tests -v
npm --prefix web test
npm --prefix desktop test
npm --prefix web run build
python -B scripts/ci_smoke.py
```

先构建前端，再验证 FastAPI 实际页面。HTTP 冒烟启动真实本地服务，检查页面、引用的 JS/CSS、健康与配置接口，以及静态片段扫描；结束时停止服务。远程测试全部使用 mock，不执行 `sample_inputs/` 或其他风险样例。

Python 回归覆盖扫描规则、AST/配置/PEM、复杂度与截止、上传和归档边界、HTTP 安全、调度/取消、临时存储、热门快照、报告、桌面通信与发布身份。Node 原生测试直接验证前端纯函数、请求错误与重试、分页/源码缓存、真实进度和桌面策略，不以 Python 复制前端逻辑。

## 离线界面验收

```sh
python -m tests.browser_fixture
```

仅访问 `http://127.0.0.1:8018/`。真实本地扫描、上传、导出和后台任务配合模拟采集，不访问真实远程仓库。源码只作为文本读取。仓库/包名中的关键字控制场景：

- `timeout`、`failure`：超时或失败。
- `slow`：8 文件慢任务；`large`：120 文件慢任务。
- `unknown`：候选总数未知；`legacy`：缺少范围/分析字段的历史结构。
- 热门两个成功仓库及一个失败仓库；第二次刷新失败，第三次恢复。

`/fixture/report` 提供报告样例，`?kind=partial`、`zero`、`unknown` 检查不同状态。重点验证四输入模式、刷新恢复、取消后部分结果、失败保留旧结果、同名文件源码定位、分页/筛选、四种导出、窄屏与键盘操作。桌面 fixture 的独立环境变量和启动方式见 [桌面说明](desktop.md)，模拟逻辑不接入生产入口。

## 本次项目整理

整理日期：2026-10-11，北京时间。正式名称统一为“抗量子密码风险检测与迁移辅助软件”，正式版本从 V1.0.0 编号，并同步网页/API/桌面及 npm 元数据。

删除未使用的 `web/app.js` 和 `web/styles.css`、过期 `.kiro` 规划、重复后端 README、个人环境初始化笔记和阶段性验收记录；将 CI/CD 与开发配置归并为 `development.md`，验证流程归并为本文。清理临时截图/日志、Python 和 Hypothesis 缓存、重复 `web/dist/` 及旧桌面安装包/冻结后端/打包中间目录，删除文件备份位于项目外。保留开发依赖环境，便于后续维护。

保留 CLI 默认样例、内置扫描样例、所有测试、正式前端构建、第三方许可、锁文件、桌面资源及公共兼容接口。桌面名称更新时保留历史用户数据路径，避免主题与热门快照丢失。历史热门扫描快照已移出源码并加入忽略规则；无快照时页面显示可继续扫描的空状态。个人软著材料保存在仓库外，不参与公开源码和安装包分发。

本次 Python 完整回归 217 项、前端 Node 测试 37 项、桌面 Node 测试 6 项全部通过；pip check 无依赖冲突。前端生产构建通过；真实本地 HTTP 冒烟检查页面、JS/CSS、健康、配置与静态片段扫描通过。Chrome 交互验收覆盖片段、同名文件上传、源码定位、资产与迁移视图、四种报告导出、空榜单、1440px 和 390px 布局；手机页面无横向溢出。离线 fixture 验收 GitHub/PyPI、刷新恢复后台查询、取消及已完成部分保留，没有触发真实远程采集。

Windows 回归使用 `PYTHONUTF8=1`，使中文子进程输出与父进程解码一致。`git diff --check` 通过。Windows x64 NSIS 安装包已本机构建并安装到独立验收目录，完成启动、静态 RSA 扫描、行号证据定位、资产与迁移视图及原生 HTML 保存验证；退出后应用和随包后端进程均已结束。安装包格式与 SHA-256 检查通过，Authenticode 状态为 NotSigned。

应用源码统计为110文件、9772物理行（包含空行与注释）：`backend/`、`scanner/`、`web/src/`、`desktop/src/`，以及 `scan_quantum_vuln.py`、`start.py`、`desktop/backend_entry.py`；不含测试、样例、构建脚本、依赖与生成产物。

桌面路径补充检查覆盖首次创建目录、历史用户数据路径、开发环境覆盖与安装模式忽略覆盖。按 [Electron app API](https://www.electronjs.org/docs/latest/api/app#appsetpathname-path) 的要求先创建目录，再设置 userData，避免新安装启动失败。

## 验收边界

本次验证环境为 Windows 11、Python 3.13.5、Node.js 24.15.0、npm 11.12.1。它是本次整理环境，不能证明全部开发者此前的硬件/环境或申请所需的开发完成、首次发表日期。

V1.0.0 正式发布工作流再次在四个目标架构原生构建，执行锁定运行依赖回归、冻结后端冒烟及身份/校验检查；结果以对应 Release 的 Actions 和 BUILD-INFO.json 为准。真实 GitHub/PyPI 网络效果、最低硬件配置、未签名安装包在不同系统中的提示、macOS/Linux 安装后 GUI 交互和完整旧版覆盖安装，未作为本次实机兼容结论；历史用户数据路径兼容已单独验证。
