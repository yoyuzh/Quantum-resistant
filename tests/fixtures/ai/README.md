# AI 固定语料 v1

所有源码均为人工构造的最小文本，只能读取、解析，禁止作为程序执行。`manifest.json` 固定路径、SHA-256、project_family、dev/test 集合和标签。相同来源及其改写样例必须共享 project_family，不得跨集合。

标签单位为样本 ID + 原始行号 + 算法 + 用途 + category。一份真值最多匹配一次，重复预测去重。category：quantum_vulnerable（本次量子脆弱资产）、pqc_asset（后量子密码资产）、crypto_misuse（传统密码误用）、non_crypto（数学/非密码负例）。PQC 资产不等于部署安全；传统密码误用的安全/不安全不能直接转换为 PQC 安全标签。默认评分只针对 quantum_vulnerable；unknown 或弃答不删除真值及其召回分母。

样本覆盖已知别名、未知调用、封装、纯数学负例、注释内指令、PEM 脱敏、同名路径和证据不足。首批只有少量人工样本，不是代表性仓库基准。

`saved_predictions.json` 的四组均为**人工保存的流程测试预测**，包括故意错误、无引用和弃答。不是供应商真实输出，不得据其数值声称模型识别率或提升。组名为 static/model_only/static_review/hybrid；前者也只是冻结预测，不能代替当前规则实测。候选按行范围计算召回；意见按完整匹配单位评分。用量和耗时未实测均为 null。

复现：在项目根目录运行 `.venv/bin/python -B scripts/evaluate_ai.py --output docs/ai-baseline-v1.json`。不需要网络、API 密钥或执行样例。数据、提示、候选规则和核验版本记录在输出中。真实模型验收另按 docs/validation.md 执行。
