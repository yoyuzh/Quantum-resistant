# Python 深度分析：源码对照台

2026-10-19，OpenSpec 第7组。页面沿用第三张“源码对照台”方向，使用真实任务、快照和独立证据；生成图中的源码、行号、Unknown 和统计不作为分析结果。

## 使用

1. 保持默认“基础扫描”，或主动选择“基础扫描 + Python 深度分析”，再提交四种来源之一。
2. 基础结果中的“深度分析”与分析概览、资产清单、发现明细、迁移待办同级。打开只读取已有状态和需要的源码，不创建分析任务、不请求模型。
3. 已完成的基础来源可以点击“开始深度分析”复用；不会重新采集或重跑基础扫描。“编辑来源与扫描模式”可返回输入。
4. 选择目录保留相对路径；普通文件选择及拖放为平铺上传，不能据此做确定性跨模块证明。目录与普通文件不可混合，清空后再选择。不支持目录选择或安全摘要的浏览器可退回普通文件上传；目录摘要需要 localhost 或 HTTPS。
5. 相对路径目录树按 source_id 定位；两个同名文件不会合并。中间选择独立操作上下文，支持算法、解析状态、风险、操作类型、任一结论等级、来源和关键词筛选，每页8个上下文。未实例化模板另行计数和标注。
6. 源码上窗显示调用点，下窗显示底层调用。证据节点可定位源码，返回按钮恢复原触发点焦点。行号从1开始、列为0基UTF-8字节、结束位置不包含；中文及非BMP字符转成浏览器字符位置后高亮。源码窗口有界，避免渲染整个文件。
7. 右侧分别显示算法、操作类型、密钥来源、风险类别的 E0–E3、解析状态、Unknown原因、候选条件、缺失边及证据路径。节点每页12个；单条路径最多200节点/200边，沿用服务端上限。E3是静态证据强度，不是执行保证或风险严重度。
8. “导出深度 JSON”从服务端保存结果的专用GET端点下载，不提交客户端证据或核验状态；原HTML/Markdown/JSON/CSV报告保持原接口。

## 状态、恢复与边界

范围独立显示采集、可用Python、已选、已解析、已分析及其分母。未知分母显示“未知”；无Python为“已跳过”，不是零风险。预算详情包括文件/字节限额、有效时间、排队/计算等待/分析耗时、结构与节点/边用量、截断及诊断。

深度失败或取消保留基础结果和完整检查点；无完整路径不伪造结果。重新分析失败时，已有深度证据的源码和导出仍绑定原结果任务，避免把旧证据与新失败任务混用。连接中断可重连，显式取消交给服务端收尾。

刷新只保存各来源的任务ID，以及来源后深度任务的 sourceTaskId/taskId；源码、文件对象、输入草稿和结果JSON不写入浏览器持久存储。终态仍受服务端15分钟/8份/512MiB保留约束，刷新不续期。切换来源及卸载会中止旧查询，并用来源身份和请求代次阻止迟到覆盖。

源码过期时显示不可读取，并将受影响证据标为当前不可重放；历史核验不会被冒充为当前复验。未读取的路径仅展示保存时状态，当前状态以实际源码读取及服务端导出为准。服务重启需重新扫描。片段仅能说明局部；GitHub/PyPI只覆盖已采集内容，静态分析不执行输入或安装其依赖。

## 验收

生产入口：`python start.py --port 8010 --strict-port`。独立离线入口：`python -m tests.deep_static.browser_fixture`，仅监听127.0.0.1:8018。后者只mock远程collector，并提供取消等待、深度失败和源码回收控制；生产入口没有fixture路由或模拟分支。

| 项目 | 当前证据 |
|---|---|
| 四输入、相对目录/平铺、来源复用、两上下文、服务端导出 | `output/deep-ui-20261019/http-validation.json`；真实IAB目录选择、片段、mock GitHub/PyPI交互 |
| 页签打开不分析/不调用模型 | `open-tab-requests.json`：仅GET源码；Node零请求测试 |
| 取消、失败、来源回收 | `cancelled-partial.png`、`deep-failed-basic-preserved.png`、`failure-preserved.png`、`expired-source-preserved.png`、`expired-source-export.json` |
| 1440×960、1280×720、390×844、双主题 | `layout-validation.json`及六组PNG；scrollWidth均等于视口宽度。手机另外保存完整长页及视口截图；720高使用正常纵向滚动 |
| 长路径、双主题手机 | `long-path-validation.json`、`long-path-*.png`，远程collector为mock |
| 键盘与减少动画 | `keyboard-motion.json`、`mobile-keyboard-source.png`；页签方向键、源码聚焦及返回焦点；减少动画时animation为none |
| 视觉对照与代码检查 | 根目录`design-qa.md`；`comparison-full.png`/`comparison-source.png`；`self-review.json` |

本次Python全量359项通过；Node原生64项通过；前端构建、实际FastAPI HTTP及OpenSpec严格校验通过。新增Node覆盖路径/摘要/BOM/换行/非法UTF-8/回退、同名文件树、过滤分页、UTF-8列换算、无自动分析、来源隔离/迟到、ID恢复、取消和失败结果任务身份。

第8组独立人工金标准及真实仓库试点仍未完成，既有支持范围87.10%精确率/召回率没有因页面接入而达到最终95%/90%门槛。未创建commit、push、发布或部署，未执行sample_inputs风险样例。

```sh
rtk proxy npm --prefix web test
rtk proxy npm --prefix web run build
rtk proxy .venv/bin/python -B -m unittest discover -s tests -v
rtk proxy .venv/bin/python -m tests.deep_static.browser_fixture
# 另开终端，确保生产8010及离线8018都已启动
rtk proxy .venv/bin/python -m tests.deep_static.ui_http_acceptance
```
