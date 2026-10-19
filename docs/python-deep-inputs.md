# Python 深度分析第三组：来源、路径与结构索引

2026-10-18，对应 `add-python-deep-analysis` 3.1–3.7。沿用第二组选定的标准库 AST，不新增生产第三方依赖。本组交付正式只读快照、独立路径上传协议和结构索引；**没有交付算法值传播、密码操作核验或网页深度入口**。`analysis_mode` 在新协议中校验并参与幂等，执行深度阶段仍由第6组接入；当前该接口运行基础扫描，不应据此宣称 deep 分析已完成。

## 上传协议

`POST /api/tasks/files-with-paths`，multipart，要求 `X-Request-ID` 为16–64位字母、数字、短横线或下划线。重复 `files`、单个 `manifest` 和可选单个 `analysis_mode`，字段顺序不限；模式默认 `basic`，可取 `basic|deep`。返回202与原任务状态结构，仍用原查询、结果、源码及取消端点。状态 `target` 显示本地文件数量。

manifest 示例（摘要必须用真实文本计算，不能使用示例占位符）：

```json
{
  "schema_version": "upload-paths-1",
  "entries": [
    {"index": 0, "relative_path": "pkg/__init__.py", "sha256": "<64位小写SHA-256>"},
    {"index": 1, "relative_path": "pkg/sign.py", "sha256": "<64位小写SHA-256>"}
  ]
}
```

`index` 对应 `files` 出现的顺序，必须逐文件恰好覆盖一次，不能重复、缺项或含额外字段；重复JSON键也拒绝。SHA-256针对**严格 UTF-8 解码并按现有上传规则去除初始 BOM 后重新 UTF-8 编码**的文本。CRLF、LF、空格和其余字符不归一化。文件 source_id 沿用旧上传的 `index:规范化上传文件名+内容` 算法；路径单独绑定，不用存储 offset 或 `sources.bin` 作为模块名。有效相对路径进入结果 `file_name`，同名文件仍按 source_id 分开。

本机请求示例：

```sh
# 先按上述规则生成manifest.json，再显式发送；此命令仅展示调用格式。
curl -X POST http://127.0.0.1:8010/api/tasks/files-with-paths \
  -H 'X-Request-ID: example-paths-request-0001' \
  -F 'files=@pkg/__init__.py' -F 'files=@pkg/sign.py' \
  -F 'manifest=<manifest.json' -F 'analysis_mode=basic'
```

manifest最多4MiB/5000项，计入110MiB请求；文件最多5000个、每个2MiB、解码后总文本100MiB。复用原流式解析器、600秒上传总截止/30秒空闲截止、共享队列预留和临时存储。不会先按普通JSON请求将整个上传读入内存。解析器单part有界，完成的文件写入共享 offset 存储；任何失败、断开或取消均由路由释放预留并删除整批目录。

| 情况 | HTTP行为 |
|---|---|
| manifest缺项、重复、额外字段、非法模式或不安全路径 | 422 |
| 内容摘要不匹配；同X-Request-ID改变内容/路径/模式 | 409 |
| 文件、manifest、总请求、文本或临时存储超限 | 413 |
| 同标识同内容/路径/模式（字段顺序可改变） | 202，同一任务ID，删除重复暂存 |
| 队列预留不足 | 429，沿用现有调度 |
| 旧UTF-8/文件类型/传输格式错误 | 保留已有400/415等边界约定 |

路径先NFC，再casefold检查冲突。拒绝绝对路径、盘符、UNC、反斜杠、控制字符、冒号、空段/点段、尾斜杠、尾点/空格、平台设备名、不安全通配字符、等价路径以及文件/目录前缀冲突。至多20段/512 UTF-8字节。不将客户端路径作为宿主读取地址，不接收链接对象。旧 `/api/tasks/files` 继续平铺，不能从文件名反推包结构。

## 逻辑快照及覆盖

`deep_analysis.snapshot.build_snapshot` 只读传入的 StoredDocument / SourceRecord。StoredDocument从已采集 offset 内容读取；SourceRecord只读其内容，`content_available=False`时报告不可用，不重新采集或找同名宿主文件。调用方必须在实际读取期间持有来源读者保护，第6组负责将其接入任务生命周期。

冻结的 Snapshot 包含 LogicalInput、SnapshotIdentity和诊断；文件按路径/source_id规范排序。身份绑定完整文本摘要、路径保真、来源、包根、覆盖、commit和采集版本；未知commit为null，不从URL猜测。snippet仅局部、旧上传 `flat_basename` 禁止跨模块；GitHub/PyPI默认按实际采集路径，新路径上传调用方须显式传 `relative_paths=True`。继承截断/跳过原因；采集、可用、选择、解析、分析分开计数，未知分母保持null。

最多选200个Python文件/8MiB，可只下调；超限保留完整已选择文件和缺口。不自动添加缺失模块，也不把未选文件当作已解析。普通包由 `__init__.py`链确定根，单层模块允许根 `.`；多个候选根（例如根目录脚本和 `src/pkg`同时存在）或无根时关闭跨模块解析。namespace package、动态sys.path、任意安装布局不在支持范围。

## AST索引支持范围

`symbol_index.build_index` 默认请求3.10语法并记录宿主完整版本、目标语法及 `ast-index-1`。本机实测宿主3.14.7；`feature_version` 是宿主解析器尽力兼容，不能等同于在所有Python3.10+解释器运行验证。

| 已验证结构能力 | 保守边界 |
|---|---|
| 普通模块、函数/类定义、作用域、参数、导入、调用位置 | 不执行导入，不推运行时可达性 |
| 唯一根下绝对/相对导入、别名、直接本地函数与模块成员调用 | 多根、缺模块、循环/歧义、平铺、namespace布局不作确定跨模块目标 |
| 完整jwt/cryptography/Crypto导入目标字符串 | 本地同名模块（包括解析失败模块）优先，字符串不是已核验密码操作 |
| 参数遮蔽、重赋值、条件导入、星号导入、模式捕获、全局/属性改写的保守屏蔽 | 不做顺序值传播；多次绑定即保守未知，可能牺牲召回 |
| 调用点为1基行/0基UTF-8字节列、结束不包含，用source_id绑定 | 中文列已验证；前端字符位置转换留第7组 |
| 类和方法的定义索引 | 类体/接收者分派调用、装饰器效果、lambda/推导式内部调用暂不解析 |

exec/eval/动态命名空间操作会阻止该模块确定目标；未知对象方法、反射和动态接收者不按方法名猜库。只有CALLS结构，没有ARGUMENT_FLOW或RETURN_FLOW；不能据此生成已知算法、E3或迁移类别。

每文件最多50000 AST节点、深度64；索引累计100000 AST节点/200000调用边/32MiB序列化等价结构，配置只下调。结构计入AST dump、符号/调用记录及源码字节，不表示硬RSS限制。迭代遍历调用检查点，语法错误、递归错误和超限给可定位诊断，失败文件不计成功解析；达到累计限额保留完整局部模块/符号，调用集合按模块完整提交。分析计数仍为0，直到后续语义引擎完成。

## 按需磁盘视图

当前AST直接读逻辑快照，不会自动物化。`materialized`仅为明确需要文件视图的调用方提供临时普通文件；无第三方引擎接入。POSIX目录句柄与O_NOFOLLOW不足的平台直接禁用。路径预检、目录句柄逐级进入、排他硬链接创建，禁止已有目标覆盖/链接跟随；输入文件0400，结束复验文件类型、大小、摘要及根目录身份。父目录替换/链接攻击和内容变更均拒绝。

输入和scratch每次写入都先走既有TemporaryStorage配额账本，移动进私有子目录不重复计费。仅通过 `write_scratch` 写入的scratch被计量；不把该接口当成允许第三方任意磁盘写入的沙箱。所有退出路径清理文件、目录、句柄及账本；取消/存储不足已注入验证。该视图不是任意恶意进程隔离器；外部工具限制及共享任务生命周期仍在6.3/6.5。

## 验证证据

- 新增24项测试：`tests/deep_static/test_snapshot_index.py`、`test_path_upload.py`，其中GitHub/PyPI通过mock collector走真实后台扫描后验证快照与覆盖；未访问远程服务或执行输入。
- 全量Python279项通过，Node52项通过；日志目录 `output/deep-input-index-20261018/`。
- 本地真实启动：`.venv/bin/python start.py --port 8010 --strict-port`；`live_check.py` 验证页面200、上传202、任务succeeded、路径保真、同ID重放以及422/409，记录 `http-validation.json`。
- OpenSpec严格校验通过。未修改前端源码/构建产物，未进行新deep网页验收；本组没有性能排名、人工精度或真实仓库成绩，也未提交、push或发布。

场景对应：I-01/I-02为四来源及mock截断/缺模块/多根测试；I-03为真实API和本地HTTP路径协议；I-04为offset快照、丢失/解码、物化攻击/清理；S-01为别名/相对/同名/遮蔽；S-05/W-03仅覆盖本组解析/索引/暂存上限。全任务截止、资源退出、证据核验、页面和最终人工门槛仍按后续组实施。
