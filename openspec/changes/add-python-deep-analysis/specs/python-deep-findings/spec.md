# Spec Delta

## Purpose

以密码操作的调用上下文为独立结果粒度，分开描述算法、操作、密钥来源及量子类别，既能表达同一底层调用的不同参数，也能保留候选与未知而不改变原快速扫描统计和评分。

## ADDED Requirements

### Requirement: 独立操作结果与稳定身份

系统 SHALL 在独立deep_analysis结果中记录operation_id、底层模板身份、可信API、操作类型、算法/家族、resolution_status、调用点/底层位置、上下文、证据及风险类别。身份 SHALL 绑定快照/source_id/精确span/上下文/规则版本；不能按文件和算法合并不同调用。无调用者模板的未解析上下文 SHALL 单列，不冒充一次运行。

#### Scenario: F-01 一模板两上下文
- **WHEN** 同一jwt.encode被两处传入不同算法
- **THEN** 模板身份可相同，操作身份不同，折叠不丢失调用点和各自参数

### Requirement: 独立发现支持API

系统 SHALL 在选择范围内独立发现支持的密码API及包装/方法调用，原findings仅作额外线索。导入、配置、密钥生成和实际签验等静态操作 SHALL 分开；结构候选不经核验不得当已确定密码行为。范围外手写实现不得默认为无风险。

#### Scenario: F-02 旧扫描没有finding
- **WHEN** 基础扫描为空但选择模块内存在受支持的跨文件密码封装调用
- **THEN** 深度仍尝试解析并输出操作或明确未知原因，不直接跳过

### Requirement: 三库明确子集及语义分类

系统 SHALL 为PyJWT、pyca/cryptography、PyCryptodome公布逐API版本化支持清单，区分签名/验证/加密/解密/密钥生成/交换/导入等操作。算法映射需可信值或类型证据；RS256为RSA签名、HS256为HMAC-SHA256，不能共用非对称迁移分类。通用PEM/加载器不证明RSA，ECC家族不证明曲线；未来KEM扩展不得冒充通用数据加密。

#### Scenario: F-03 导入与算法误判反例
- **WHEN** 只有RSA导入、通用PEM加载或HS256签名配置
- **THEN** 不报告已发生RSA签名；HS256不归为RSA量子脆弱算法

### Requirement: 逐项状态与旧结果兼容

系统 SHALL 独立评定ALGORITHM、OPERATION_TYPE、KEY_SOURCE、QUANTUM_CLASS的证据和解析状态，resolved需必要链完整且唯一，ambiguous保留候选/条件，unknown保留原因。量子分类依赖已核验算法与版本化映射，不自动推断部署/业务优先级。深度结果 SHALL 不改写原findings、资产、风险计数或migration_score。

#### Scenario: F-04 算法确定但密钥来源未知
- **WHEN** RS256参数链可核验而密钥来自未知运行时对象
- **THEN** 算法结论与密钥来源分别标级，不把算法已知推广为全部结论已知，基础评分不变
