# Proposal

## Why

现有单文件扫描不能可靠解释跨文件封装的算法实参来源，也不能区分同一密码调用在不同上下文中使用的算法。需要保留快速扫描，优先复用成熟分析基础设施，增加范围有限、证据可独立核验的 Python 静态深度分析。

## What Changes

- 默认保持 basic；显式 deep 增加静态阶段，无需 LLM，不执行输入代码。
- 建立保留相对路径、source_id、SHA-256 和覆盖缺口的只读快照；第三方需要时才物化隔离目录。
- 正式实现索引/数据流之前，用共同夹具验证 Scalpel / CodeGraph 的能力、兼容性、源位置、许可及打包成本，不预先绑定依赖。
- 以密码操作为终点做有界切片，追踪导入、常量、赋值、参数和返回值，隔离调用上下文，明确 resolved / ambiguous / unknown。
- 独立建模操作与证据路径，确定性核验后才能形成高等级结论，不重定义旧 Finding 或 CryptoAsset。
- 复用任务取消、截止、队列和临时存储，深度失败保留完整基础结果及已核验证据。
- 增加同级深度结果入口与独立 JSON 导出，先完成至少30个标注夹具及静态验收。
- LLM、PQC API 扩展和标准 CBOM 导出列为后续变更，不阻塞首版静态闭环。

## Capabilities

### New Capabilities

- `python-deep-inputs`: 四输入资格、路径保真、只读快照和安全物化。
- `python-deep-semantics`: 模块/调用解析、有界值传播和上下文隔离。
- `python-deep-findings`: 操作上下文模型、密码语义和独立风险分类。
- `python-deep-evidence`: 源码/传播边核验、逐项证据等级及可重放性。
- `python-deep-workflow`: 可选静态阶段、共享资源、取消和部分结果。
- `python-deep-interface`: 同级页面、源码定位、覆盖和深度导出。
- `python-deep-evaluation`: 共同基准、引擎选型门槛、正确性及集成验收。

### Modified Capabilities

无。当前 openspec list --specs 没有主规格。

## Impact

拟新增独立 deep_analysis/，扩展后端可选请求/结果字段、路径上传、任务编排和导出适配；前端仅修改 web/src/。新增 tests/deep_analysis/、选型实验及支持/验收文档。不强制引入外部引擎、SonarQube、图数据库或完整 Agent；CodeQL 仅为授权允许时的独立研究基线。

依据为用户最新提供的《成熟方案与学术研究调研》《抗量子密码识别系统 v0.3 实施方案》。2026-10-18 实查 HEAD 为 c359a57，分支虽名为 codex/ai-assisted-analysis，但没有 backend/ai/，不依赖历史 AI 模块。工具能力、许可及论文指标是待核验线索。本次仅重写规划，实施任务全部未完成，不修改版本、不提交、不 push、不发布。
