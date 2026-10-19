# Python 深度分析：后台任务、资源与导出

2026-10-19补充：第7组网页入口、恢复和本地浏览器验收已完成，使用方法及当前证据见[源码对照台](python-deep-ui.md)。下文“待第7组”保留为2026-10-18的阶段记录；最终人工精度与真实仓库门槛仍待第8组。

2026-10-18，第6组6.1–6.7。核心沿用[第5组规则与独立核验](python-deep-evidence.md)，不新增第三方生产依赖，不调用模型，不执行或安装输入项目。后台接口已经接入；第7组网页入口、页面恢复与浏览器验收仍待实施。当前精度仍以冻结矩阵为准，没有因为接入HTTP而通过最终人工验收。

## 显式模式与兼容（6.1）

| 后台输入 | 模式位置 | 默认与路径资格 |
|---|---|---|
| `POST /api/tasks/snippet` | JSON `analysis_mode` | basic；deep仅局部片段 |
| `POST /api/tasks/github` | JSON `analysis_mode` | basic；使用已采集相对路径 |
| `POST /api/tasks/pypi` | JSON `analysis_mode` | basic；使用已采集相对路径 |
| `POST /api/tasks/files` | multipart单个 `analysis_mode` | basic；旧平铺路径，关闭跨模块证明 |
| `POST /api/tasks/files-with-paths` | multipart单个 `analysis_mode` | basic；manifest保存相对路径，详见[来源协议](python-deep-inputs.md) |

模式仅为basic/deep；JSON非法枚举422；multipart重复或非法模式422，字段有界16字节且计入请求总额，超限413。四后台输入的deep模式独立参与幂等指纹；同标识换模式409。默认basic与显式basic等价，保持原统计、分值及结果字段，不输出deep_analysis。同步 `/api/scan/*`、热门和CLI不自动启用deep；新增请求模型只用于后台适配器，旧请求/ScanResponse/报告模型保持不变。

deep返回原基础结果并追加 `deep_analysis`（schema_version=deep-static-1）。`completed`只代表选定静态范围处理结束，不表示无Unknown或安全；无Python为skipped。源码不可读为失败/部分，达到选择/解析/结构限额为partial，不把这些情况误写成skipped或零风险。

## 复用已有来源（6.2）

`POST /api/tasks/deep-analysis` 的JSON严格限制为 `{"source_task_id":"任务ID"}`，仍需 `X-Request-ID`，返回202。拒绝额外字段，不接受客户端自报证据/等级。来源不存在404；未结束、无基础结果、热门或已知源码不可读409；共享队列满429。同标识同来源重放为同一新任务；冲突409，重放优先于重复读取来源。

提交时将**基础结果**写入新任务目录，计入原共享临时配额；排队期间不保留来源读者，也不保留一份源码/完整结果闭包缓存。开始执行后重新检查来源，仅在实际快照读取期间使用TaskStore读者租约。源码过期时保留已提交的基础结果，deep_source_unavailable，不重新采集、不重跑基础扫描，也不延长旧TTL。

实际读取只复制选中的Python源码到新任务的连续存储，沿用source_id、相对路径和原采集摘要；只读快照完成后立即释放原来源读者。副本是新任务的保留来源，计入同一2GiB及正常结果TTL，不是无限副缓存。源摘要变化拒绝复用；失败构建的副本回收。部分来源缺失时，只能在明确覆盖缺口下处理仍可读的部分。

## 共享预算与退出（6.3/6.5）

- 仍用原TaskStore/ScanScheduler的2执行、4等待，共用 `ANALYSIS_SLOTS` 的2个CPU槽。原基础生产者/消费者在线程join完成后才进入deep；不为deep创建线程池、辅助执行线程或子进程。
- 普通deep任务沿用600秒绝对预算，排队时间不重置；基础结束后deep上限为 `min(剩余普通截止,120秒)`。来源后新deep任务在提交时开始120秒总限时，队列和CPU等待均扣除这份预算。`queue_seconds`、`cpu_wait_seconds`、`analysis_seconds`及`effective_seconds`公开实际等待、计算和有效阶段上限。
- 选中源码最多200文件/8MiB，单文件2MiB；已知StoredContent.size在读取/复制前检查，不读第201个文件或超出字节预算的文件。physical_read_bytes记录实际读取，unique_read_bytes记录选中唯一字节；覆盖数量与未知分母保留。
- AST50000节点/深度64，索引100000节点/200000边/32MiB等价结构，单切片200、调用深度3、每函数64上下文、每值4候选；Budgets校验只允许下调。主语义与独立复验索引使用剩余共享结构预算，证据/操作继续从同一余额扣除，并公开used_nodes/used_edges/used_structure_bytes。
- 当前adapter是已选定的标准库AST路线。循环/索引/求值/上下文/验证边界调用同一取消与截止检查；finally释放CPU槽，任务线程退出计算后才结束任务与释放票据，不以超时遗留后台计算。取消后保存完整局部结果，不开始新的切片。没有第三方工具进程需要回收，也没有启用候选实验沙箱。
- 单次ast.parse和底层文件系统操作不可抢占；2MiB输入/节点上限与后续检查限制其范围。上述32MiB是序列化等价结构计量，不是RSS硬保证，也不声明通用强制CPU杀死机制。

## 检查点与终态（6.4/6.6）

基础结果在任何deep读取或CPU等待前保存。核心每产生一个完整、已独立核验的操作，才向同一个TaskStore提交检查点；未完成的路径不提交。存储先写新文件，成功且任务仍运行时交换指针，再删除旧文件；写失败、缓存超限和迟到回调保留上一完整检查点。终态拒绝更新进度与结果。

内层deep为completed/partial/failed/cancelled/skipped；有基础结果且深度失败/取消/超限时，外层为partial。排队中的来源后任务被取消，也保留已保存基础结果；没有结果的排队取消才移除整个目录。若故障发生在首份deep证据写入之前，可能只剩基础检查点：外层partial和错误原因可见，deep导出409，不能伪造一份“已完成”结果。

basic/deep共用终态900秒、8份、512MiB序列化结果和全局2GiB。定时/惰性到期、空间压力淘汰均跳过实际读者；关闭或失败的目录删除在最后读者退出后进行。存储满时不能删除仍在读的来源换空间。有旧检查点时不牺牲其源码与结果来覆盖；没有旧检查点时才沿用原有先回收可选源码、尝试保留基础分析的机制。来源副本/正常保留数据随任务清理，重启只清理无租约孤立目录，不恢复任务或外发。

## 服务端独立导出（6.7）

`GET /api/tasks/{id}/deep-analysis/export` 从保存结果校验并生成白名单JSON，附下载文件名deep-analysis.json。不存在/已过期404，未结束/无deep结果409；不接收客户端证据、源码或等级。字段仅为schema_version、status、snapshot、operations、evidence_paths、coverage、diagnostics、budgets、versions；完整源码、密钥/口令及宿主路径不进入导出。原四报告路径/字段不变。

保存的片段已经遮蔽，不能替代原文复验。导出时只检查该证据实际引用的来源：文件丢失为unavailable，摘要变化为requires_revalidation；保留历史核验状态，不冒充当前重新授予E3。完整重验仍须原文和匹配的规则/语义版本，见第5组说明。

## 当前验证

新增23项工作流测试，覆盖四输入/两种上传、默认与模式冲突、来源复用及404/409/429、排队源过期/取消、运行取消/完整路径、剩余截止/CPU等待、精确200文件/8MiB、下调限额、写失败/存储满、共享淘汰/实际读者、孤立目录、迟到回调及导出秘密/重放状态。远程collector全部mock；实际扫描、快照、核验、存储和调度直接运行。

完整Python359项、Node52项通过；OpenSpec严格校验通过。正常 `python start.py --port 8010 --strict-port` 的真实127.0.0.1服务验证了页面/health200、basic/deep、来源后新任务、manifest跨文件包装的RS256/HS256独立E3、导出以及422/404/409；测试服务结束后已关闭。记录见 [http-validation.json](../output/deep-workflow-20261018/http-validation.json)、[validation.json](../output/deep-workflow-20261018/validation.json) 和 [主线程复核](../output/deep-workflow-20261018/self-review.json)。

复跑冻结36例矩阵后，锁定集严格端到端仍为27TP/6FP/6FN、相对标签算法错误E3为0；支持范围内27TP/4FP/4FN，未达到最终95%/90%门槛，未改标签。此次结果另存 [第6组矩阵](../output/deep-workflow-20261018/crypto-matrix.json)，第5组历史矩阵保留原记录摘要。

本组没有修改web/src或构建产物，未重跑前端构建；第7组新页面、浏览器尺寸/主题/键盘验收与第8组独立人工/真实仓库验收仍待办。没有commit、push、发布或部署。

```sh
rtk proxy .venv/bin/python -B -m unittest tests.deep_static.test_workflow -v
rtk proxy .venv/bin/python -B -m unittest discover -s tests -v
rtk proxy npm --prefix web test
rtk proxy openspec validate add-python-deep-analysis --strict
rtk proxy .venv/bin/python start.py --port 8010 --strict-port
```
