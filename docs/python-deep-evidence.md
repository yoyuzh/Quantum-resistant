# Python 深度分析：密码规则与独立核验

第5组（5.1–5.8）的规则/支持范围在运行锁定操作评测前冻结如下。入口为 `deep_analysis.pipeline.analyze_crypto(snapshot)`；输入来自第3组不可变快照，不读取宿主项目文件，不执行或导入输入。第6组接入后台调度，第7组接入页面，本组不声称HTTP deep功能已可用。

## 规则与版本前提（5.1）

本地声明式注册表 `crypto_rules.RULES` 版本 `crypto-subset-1`，参数语义为 `bounded-backward-1+keys-1`、引擎 `deep-ast-1`、独立核验 `ast-witness-1`。逐API声明静态角色、必要导入边、参数子集和返回对象类型；包装方法还须KEY_TYPE_FLOW，跨调用实参须ARGUMENT_FLOW，消费函数结果须RETURN_FLOW。CALLS从不代替值证明。规则清单只代表这些API，不代表整个库。

规则依据：PyJWT 2.10.1、cryptography 45 API子集、PyCryptodome 3.23.0。结果 `versions.library_profiles` 公开这些判读前提，诊断 `library_version_assumption` 明确**没有核实目标依赖实际安装版本**；不执行输入安装或查询其运行环境。E3只是在记录的静态语义/规则前提下证明，不是运行/部署事实。PyJWT1.x及其他版本不能无条件沿用2.10.1行为。

2026-10-18复用审查：沿用[第2组选型记录](python-deep-selection.md)固定的 CBOMkit-hyperion `58eea48bde9c5757ebef991c0861c08b70689e15`，具体参考文件 `python/src/main/java/com/ibm/plugin/rules/detection/asymmetric/PycaRSA.java`，Copyright 2024 PQCA、Apache-2.0；文件头要求保留许可证/适用NOTICE。其规则依赖Java的DetectionRuleBuilder、PycaHash、Sonar类型系统，插件整体还涉及Sonar Source-Available License 1.0，未直接复制、翻译或分发其实现。本地规则按公共Python API独立编写；因此没有新增生产vendor模块或第三方依赖，也不把上游库覆盖率当本项目成绩。若以后复制该文件或依赖，必须重新核对NOTICE/署名及插件分发条件。

官方参考：[PyJWT 2.10.1 API](https://github.com/jpadilla/pyjwt/blob/2.10.1/jwt/api_jwt.py)、[JWS头部算法优先级](https://github.com/jpadilla/pyjwt/blob/2.10.1/jwt/api_jws.py)、[cryptography RSA](https://cryptography.io/en/45.0.6/hazmat/primitives/asymmetric/rsa/)、[EC](https://cryptography.io/en/45.0.6/hazmat/primitives/asymmetric/ec/)、[Ed25519](https://cryptography.io/en/45.0.6/hazmat/primitives/asymmetric/ed25519/)、[X25519](https://cryptography.io/en/45.0.6/hazmat/primitives/asymmetric/x25519/)、[PyCryptodome ECC 3.23.0](https://github.com/Legrandin/pycryptodome/blob/v3.23.0/lib/Crypto/PublicKey/ECC.py)。本次下载的PyJWT/ECC公开源码仅保存在验证research目录，未导入运行。

## 冻结支持子集（5.2–5.4）

| 库 | 完整API或已证接收者 | 静态解释与边界 |
|---|---|---|
| PyJWT | `jwt.encode` / `jwt.decode` | encode显式算法及headers.alg优先；decode的algorithms是允许集合，单元素可解析，多元素保持多值，不能声称实际token使用了其中某个值 |
| cryptography | `cryptography.hazmat.primitives.asymmetric.rsa.generate_private_key`、`ec.generate_private_key` | RSA/EC家族与密钥生成；EC不推具体曲线、密钥长度/填充及摘要组合不在首版结论中 |
| cryptography | 同前缀 `ed25519.Ed25519PrivateKey.generate`、`x25519.X25519PrivateKey.generate` | 明确密钥类型生成 |
| cryptography | Ed25519/X25519 PrivateKey.from_private_bytes、PublicKey.from_public_bytes | 明确类型导入/构造，不解析实际密钥字节 |
| cryptography | `cryptography.hazmat.primitives.serialization.load_pem_private_key` / `load_pem_public_key` | 只报告泛型密钥导入；不凭PEM头、加载器或sign方法推断RSA |
| cryptography | 已证RSA/EC/Ed25519私钥sign、公钥verify；public_key转换；X25519私钥exchange | 校验白名单方法形参结构和密钥角色；未知other.sign、不支持方法/反射不认定密码操作，以诊断保留未知线索 |
| PyCryptodome | `Crypto.PublicKey.RSA/DSA.generate/import_key/importKey`、`Crypto.PublicKey.ECC.generate/import_key` | 生成与导入分开，ECC只到家族；不支持ECC.importKey或旧raw-key.sign |
| PyCryptodome | `Crypto.Signature.pkcs1_15.new`、`pss.new`、`DSS.new`，其已证signer的sign/verify | new只是对象构造，不冒充签名；DSS须DSA/ECC密钥及显式支持mode，RSA方案须RSA密钥 |

RS/PS为RSA，ES为EC，EdDSA为非对称家族；HS256/384/512为HMAC-SHA256/384/512和symmetric类别。量子类别只是版本化算法映射，不能据此推断业务优先级。没有算法参数时保持unknown，不猜PyJWT默认值；decode `options.verify_signature=False` 为unknown操作及verification_disabled。2.10.1的deprecated `verify=False` 本身不关闭签名验证；未知options/headers不绕过为确定算法。导入语句本身、手写数学、未支持API没有确定操作。

## 证据、等级和重放（5.5–5.7）

主分析器使用现有有界求值器加显式key_type/key_origin元数据；普通字符串无法伪造密钥对象。密钥类型经赋值、参数与透明返回传播，未知分支或截断不继承确定类型。证据按claim分别绑定身份，避免一条路径的核验状态覆盖另一项claim。

`Verifier` 从快照**重新构建索引**；`proof_replay.Replay` 是另一套只读AST见证解释器，不调用engine、Evaluator或FactStore。按提交的调用链重新绑定参数、重读赋值/分支/导入/返回与密钥构造，重建必需边集合；逐边要求相同端点及类型，拒绝多余或缺失边。重新检查完整源摘要、UTF-8字节span、AST节点、导入顺序、上下文、词法条件、版本与身份。被引用的源节点也必须完整保留，删除字面量节点不能仅凭已知哈希通过。

四项claim独立评级：无依据E0、线索E1、局部或缺链E2、唯一值且必要链完整并通过独立核验E3。算法已知不推出密钥来源已知；静态操作角色E3不证明调用一定执行。未知/多值保留原因，旧Finding、资产、统计与评分不变。

保存节点表达式统一投影为 `<Call>` / `<Name>` 等AST类型，不保存源码原文、变量名、密钥/口令/载荷或宿主路径；算法字段仅允许版本化白名单。完整源摘要、source_id和字节span保留身份。该投影刻意不足以在源码回收后复演：`revalidate(result, None)`保留历史结论并标记unavailable；不凭哈希重新授级。版本或内容变化须重新分析，不改写旧快照身份。历史核验状态单列保留；当前复验失败降级受影响claim。整个静态链无模型调用和源码外发。

单路径仍为最多200节点/边且受slice_nodes下调限制；新证据/操作与语义结构及复验索引共用节点、边、32MiB序列化等价预算。完整操作作为提交单位；超限保留此前完整结果。结构预算不等于RSS保证，第6组仍负责总截止、CPU调度、来源读者及实际临时存储清理。

## 验证状态

2026-10-18定向25项通过，覆盖逐API、双接收者、通用加载器、跨文件密钥返回、双上下文、缺每类必要边、错误摘要/中文字节位置/条件/上下文、伪造算法、过期/版本/内容重验、秘密遮蔽和无外发。全量Python336项、Node52项通过；OpenSpec严格校验通过。命令与摘要见[validation.json](../output/deep-crypto-20261018/validation.json)，主线程复核见[self-review.json](../output/deep-crypto-20261018/self-review.json)。未创建子代理。

[冻结矩阵](../output/deep-crypto-20261018/crypto-matrix.md)运行36例，[原始记录](../output/deep-crypto-20261018/crypto-matrix.json)保存每例gold、prediction、操作、脱敏路径、四claim与六类边指标。原夹具及manifest未修改；只将fixture snapshot身份适配到真实快照，source_id/span/上下文/标签不改。

| 范围 | 操作定位 TP/FP/FN | 严格端到端 TP/FP/FN | Precision / Recall |
|---|---|---|---|
| 全36例 | 38/0/0 | 32/6/6 | 84.21% / 84.21% |
| 锁定30例 | 33/0/0 | 27/6/6 | 81.82% / 81.82% |
| 锁定集支持范围内 | 31/0/0 | 27/4/4 | 87.10% / 87.10% |

锁定集端到端Precision和Recall的Wilson95%区间均为65.61%–91.39%；支持范围内均为71.15%–94.87%。六处严格差异是derived_return、branches_multiple、branch_unknown、recursion、decorated及unsupported_config的Unknown原因、已知备选或条件身份表示不同；没有把这些差异删出分母或据引擎修改标签。33/33定位不能代替端到端通过。

相对现有标签的**算法错误E3为0**，同一包装的RS256/HS256保持独立；其他claim的错误E3由定向篡改测试覆盖，尚无独立人工金标准。读取输入的前后规范序列化未变；静态链网络/exec禁止测试通过，不执行任何fixture源码或sample_inputs。逐类型边表是与手写必要边清单的严格比较：gold不是完整负边标注，额外预测中有直接API参数边等未标注边，不能把额外项直接宣称为误边率。

**尚未达到最终发布门槛**（支持范围内Precision≥95%、Recall≥90%）；8.3/8.4继续未完成。夹具标签仍未经独立人工裁决，真实仓库试点、性能门槛、新任务/HTTP/UI阶段仍未执行。没有改前端，不构建；没有commit、push或部署。

复现：

```sh
rtk proxy .venv/bin/python -B -m unittest tests.deep_static.test_crypto_evidence -v
rtk proxy .venv/bin/python -B -m tests.deep_static.crypto_matrix
rtk proxy .venv/bin/python -B -m unittest discover -s tests -v
rtk proxy npm --prefix web test
rtk proxy openspec validate add-python-deep-analysis --strict
```
