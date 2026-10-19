# Python 深度分析：有界参数语义

第4组（4.1–4.7）采用第2组冻结的标准库 AST 路线，不新增生产依赖。`deep_analysis.engine.analyze(snapshot)` 只读取第3组不可变快照，返回内部 `SemanticResult`。版本为 `api-candidates-1` / `bounded-backward-1`，实际宿主验证为 Python 3.14.7，目标语法仍受索引的版本与解析诊断约束。Python 3.10+ 是代码兼容目标，未在所有解释器版本运行本组测试。

## 分析范围（矩阵运行前冻结）

| 语义 | 支持范围 | 保守边界 |
|---|---|---|
| 独立发现 | 按索引可信目标发现三库 API 候选及其直接包装调用者，不依赖旧 findings | 纯导入/无库手写代码不产生确定操作；未知接收者方法仅保留未知线索 |
| 参数绑定 | 普通/仅位置/仅关键字参数，定义位置的静态默认值；字面 list/tuple 的 `*`、字符串键字面 dict 的 `**` | 缺参、重复、额外参数、动态展开均 Unknown；不支持变长形参转发 |
| 值传播 | 标量字面量、名称、顺序赋值、唯一包根下绝对/相对/别名模块常量 | 多根、平铺、缺模块、遮蔽不拼接；运行时 JSON/YAML/环境值不求值 |
| 条件 | if/条件表达式，支持静态真值；同值分支收敛，不同值 Ambiguous，未知分支保留 Unknown 及已知备选 | 不做通用可达性证明；循环/try/with/match 内候选保守未知 |
| 返回 | 直接函数透明 return、消费调用结果、多文件参数与返回链 | 无返回不生成 RETURN_FLOW；运算/拼接等 DERIVED 不代表值相等；生成器返回不当调用结果 |
| 上下文 | 同一 sink 的多调用独立绑定；无调用者模板独立保留 | 递归、装饰器、async、闭包、动态命名空间/global/属性改写保守未知 |

API 名称集合可复用旧扫描器已知全名，但没有复用旧发现、算法映射或分值。PyJWT encode/decode 暂时提供参数结构绑定，未指定库可选参数保持 `unspecified_api_parameter`，不补猜库默认值。其余 API 参数只记录 `arg0…` 和关键字。密钥对象类型、白名单方法的领域确认、RS256/HS256 分类与版本规则属于第5组；这里的候选不等于已核验 CryptoOperation，也不授予 E3。

`FlowStep` 分开记录 LITERAL、IMPORT_BINDING、ASSIGN_FLOW、CALLS、ARGUMENT_FLOW、RETURN_FLOW 和 DERIVED，绑定精确 source_id/span 与内部 frame 身份。内部事实可能含源码字面量，**不能直接作为生产导出**；遮蔽、独立逐边核验和白名单序列化尚待第5/6组。

## 缓存和限额

缓存只存在于一次 analyze 调用中。键绑定快照、索引/宿主/目标/发现/语义版本、模块 source_id、完整作用域、调用点链、原始参数事实身份、条件及全局读取截止位置；不会按函数名共享具体值。参数投影前后使用同一 frame 身份，证明边不会因加入参数边而改变上下文。操作 ID 另外绑定 sink、上下文、参数事实及发现/语义版本；模板与调用不能合并为同一操作。

默认调用深度3、每函数64上下文、每值4候选、单切片200节点，条件16、参数/容器64。表达式依赖深度复用 AST 深度64，避免长赋值链触发宿主递归错误。继承200文件/8MiB、AST50000/深度64、索引100000节点/200000边/32MiB结构预算；配置只下调。索引已用节点/边/结构量作为语义计量起点，事实、传播边、缓存引用、上下文及候选继续共享计量。结构字节是规范 JSON 等价计量，包含索引，不是 RSS 硬上限。

切片/依赖深度超限仅将当前候选降为未知；共享结构超限停止后续工作，保留此前完整候选。checkpoint 在索引、发现、上下文和求值循环检查；取消异常交由调用者处理。120秒及普通剩余截止、CPU/任务/临时存储的生产调度接入仍在第6组，不在这里重建线程池。

常见原因：`uninstantiated_template`、`unbound_name`、`unbound_local`、`missing_argument`、`invalid_argument_binding`、`dynamic_unpack`、`dynamic_default`、`unknown_branch`、`missing_return`、`unsupported_transform`、`unsupported_attribute`、`unsupported_function`、`unsupported_closure`、`unsupported_control_flow`、`dynamic_scope_write`、`dynamic_namespace`、`wildcard_import`、`recursive_call`/`recursive_value`、`call_depth_limit`、`context_limit`、`evaluation_depth_limit`、`slice_limit`、`value_limit`、`condition_limit`、`semantic_structure_limit`。这些不是“无风险”。完整执行也可能含 Unknown。

## 验证方法

`tests.deep_static.test_semantics` 按上述范围测试正例、反例、上下文身份及预算；`tests.deep_static.semantic_matrix` 读取冻结36例的源码，不读取预期操作标签调参，不执行源码，记录各候选的原始参数状态与边类型。矩阵不输出最终操作 TP/FP/FN、端到端 Precision/Recall 或错误 E3 成绩；这些须等待第5组领域规则和独立 verifier，真实仓库及人工审查仍待第8组。

```sh
.venv/bin/python -B -m unittest tests.deep_static.test_semantics -v
.venv/bin/python -B -m tests.deep_static.semantic_matrix
.venv/bin/python -B -m unittest discover -s tests -v
npm --prefix web test
openspec validate add-python-deep-analysis --strict
```

本组没有修改前端，不重复构建；未接入 HTTP deep 阶段、网页、模型或远程采集，不执行 `sample_inputs/` 或任何夹具源码。

2026-10-18 验证：32项新增语义测试、全量Python311项、Node52项通过；OpenSpec严格校验通过。[逐例矩阵](../output/deep-semantics-20261018/semantic-matrix.md)记录36例/43个内部候选（41个调用上下文、2个未实例化模板），[原始事实](../output/deep-semantics-20261018/semantic-matrix.json)、[主线程复核](../output/deep-semantics-20261018/self-review.json)及[版本/摘要/命令](../output/deep-semantics-20261018/validation.json)一并保存。43不是正确操作数；未知方法、密钥生成和领域映射尚未进行最终操作裁决。
