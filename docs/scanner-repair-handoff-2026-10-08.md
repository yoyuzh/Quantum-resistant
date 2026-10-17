# 扫描器修复交接文档

日期：2026-10-08（北京时间）
项目：/Users/mac/Documents/ChatGPT/抗量子密码识别
状态：审查与受控复现完成，尚未修改扫描实现。下一窗口负责修复与验收。

## 1. 本轮目标与约束

按顺序实施：
1. 消除文本调用匹配的异常耗时，验证预算、取消和资源回收。
2. 修复明确的 AST 绑定漏报、JS模板字符串/注释PEM误报、EdDSA标注错误。
3. 补常见可确认算法的密钥导入API和结构化配置列表，并增加正反例与边界测试。

末尾“后续feat”是候选路线，不属于本轮必须实现范围。不扩大为完整多语言解析、跨模块数据流、依赖图谱或数据库改造。

开工先读当前 AGENTS.md、/Users/mac/.codex/RTK.md、docs/architecture.md、docs/security-review.md、docs/desktop.md、docs/local-development.md。检索已有经验、项目测试和成熟实现；本文为线索，必须在当前代码确认。

- 当前主线程实施，不创建或调度子代理；不commit、不push、不发布、不部署。
- 不执行sample_inputs/。文中片段只传给静态扫描器，不eval/exec，不导入被扫描代码。
- 远程测试必须mock；命令遵循RTK，适用时使用 `rtk proxy`。
- 保留URL、CLI、`backend.main:app`、JSON字段、source_id身份、去重与评分公式。
- AST成功时不重复运行文本调用/配置规则补漏。
- 保留单进程后台任务、容量和兼容边界；用户提示中文，Python 3.10+。
- 保留原有未提交修改，不以“清理”为由回退。

交接前工作区：
```text
 M .gitignore
?? .serena/
?? docs/local-development.md
```
上述状态在审查前已存在。本交接另新增本文件及对应提示词。

Serena的Vue依赖曾因并发安装残缺，已按原锁文件补齐33个缺失文件。重连后，本聊天实际验证Python、JavaScript、Vue符号查询均正常。下一窗口仍需确认当前连接和项目激活。
记录：`/Users/mac/.serena/language_servers/static/VueLanguageServer/vue-repair-20261008-110244/`。

Electron曾成功打开扫描页面，是否仍运行需重新观察；此前启动成功不等于修复后的桌面验收。

## 2. 当前扫描逻辑

四种输入 → 文件文本 → 有界后台管线 → AST/文本/PEM规则 → findings/diagnostics/coverage → summary/analysis → 页面和报告。

| 模块 | 责任 |
| --- | --- |
| scanner/engine.py | 按后缀选分析器，AST异常回退、文件身份和诊断 |
| scanner/python_analysis.py | 已知库完整导入目标、别名、作用域、调用和配置字符串 |
| scanner/text_analysis.py | 注释/字符串屏蔽，文本调用/配置，PEM头 |
| scanner/rules.py | 算法画像、API/算法标识/PEM规则 |
| scanner/results.py | 按行与算法去重、source_id、评分 |
| backend/pipeline.py | 有界队列、全局分析并发、源码暂存和收尾 |
| backend/scanning.py、analysis.py | 响应、资产清单和迁移待办 |
| backend/remote_sources.py | GitHub/PyPI采集；PyPI不递归分析依赖 |
| backend/http_safety.py、archives.py | 远程地址/重定向校验、归档边界 |

.py/.pyw/.json和无后缀目前进AST分支；其他语言主要用文本规则。JSON进Python AST不代表已有完整JSON专用解析。通用PEM头只产生算法未知诊断。迁移方向来自静态知识，不是供应链传播分析。

评分：`min(100, 高风险发现数×25 + 受影响文件数×10 + 算法种类数×10)`。
单文件1至4条RSA高风险发现分别为45、70、95、100分。这是启发式优先级，不是概率；本轮不修改公式。

普通扫描600秒、热门1200秒；单文件2MiB；后台2运行/4排队，分析全局并发2；待分析队列16文件/8MiB。保留完整分析部分，未完整结束的热门扫描不覆盖旧快照。其他边界以当前AGENTS.md/architecture.md为准。

## 3. 已确认问题

行号来自交接时版本，可能漂移；按函数名定位。

### A. 高优先级：文本调用正则超线性耗时

位置：scanner/text_analysis.py:92，scan_with_regex：
```python
r"\b([A-Za-z_]\w*(?:\.[A-Za-z_]\w*)*)\s*\("
```
输入 `"a." * n + "a"`，文件名probe.txt，无调用括号、无密码算法。实际测量：

| n | UTF-8字节数 | analyze_source耗时 |
| --- | --- | --- |
| 1000 | 2001 | 0.0151秒 |
| 2000 | 4001 | 0.0604秒 |
| 4000 | 8001 | 0.2384秒 |
| 8000 | 16001 | 0.9932秒 |

长度翻倍，耗时约四倍。64,001字节文本经local_work、Deadline.after(0.05)运行，在外部3秒截止后仍未完成，测试子进程已终止。backend/pipeline.py:128的finish无超时thread.join，analyzer内部没有预算检查。

证据边界：独立本地测试进程复现，未向Electron提交，未实际等待超过生产600秒。不能写成“生产攻击已成功”。

修复与验收：
- 优先线性或有明确工作量上限的调用名提取，避免重复匹配点号链后缀。
- 可分段边界检查预算/取消；复杂度限制应产生诊断，不能静默当作零发现。
- 性能回归用独立进程外部截止；验证长度增长趋势和宽松绝对上限，不绑定精确毫秒值。
- 不以join(timeout)后宣布完成作为修复：旧线程可能仍占CPU、信号量、文件引用并写结果。
- 不未经单独决策改为进程池/多worker，项目已有单进程约束。协作式线程截止不能宣传成通用硬超时。
- 验证正常调用识别、终态不被迟到回调修改、分析槽与暂存引用回收、部分结果一致。

### B. AST绑定导致静默漏报

位置：scanner/python_analysis.py，QuantumCryptoVisitor.visit_FunctionDef（原182行）、visit_Assign、LocalBindings。

以下均返回findings=[]且diagnostics=[]：
```python
def make_key():
    return rsa.generate_private_key(public_exponent=65537, key_size=2048)
from cryptography.hazmat.primitives.asymmetric import rsa
make_key()
```
```python
from cryptography.hazmat.primitives.asymmetric import rsa
if False:
    rsa = None
key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
```

审查中global声明配合后续赋值也复现漏报，需检查global/nonlocal边界；不代表已覆盖全部作用域情况。

验收：
- 上述可明确判定的RSA调用能识别。
- 保留参数遮蔽、真实局部重绑定、类方法作用域、推导式、lambda等既有反例。
- 不简单把全文件所有import无条件并入每个调用；导入前顶层调用、分支冲突、后续重绑定需谨慎。
- 无法可靠解析时按实际能力给诊断，不猜测完整运行路径。
- 修复限于现有静态分析边界，不建设完整解释器或跨模块分析器。

### C. 模板字符串与注释PEM误报

位置：scanner/text_analysis.py，mask_c_style（原29行）、scan_pem（原75行）。

test.js：
```javascript
const note = `RSA.generate(2048)`;
```
当前返回RSA/text_call，实际只有模板文字。

test.py：
```python
# documentation: -----BEGIN RSA PRIVATE KEY-----
```
当前返回RSA/pem_header，实际只有注释。

验收：
- JS/TS模板纯文本不算调用，插值中的真实表达式有对应正例。
- 注释/说明文字不提升为确认PEM发现。
- 保留实际.pem文件和源码中确实承载PEM密钥的字符串；不要整体丢弃所有字符串。
- 行号稳定，覆盖转义、跨行、不完整输入；不破坏.NET等已有屏蔽测试。
- 不宣称一个共享正则实现了完整多语言语法解析。

### D. EdDSA过度推断为Ed25519

位置：scanner/rules.py:181，STRING_IDENTIFIER_RULES。
`jwt_algorithm = "EdDSA"` 当前报告Ed25519。

[RFC 8037 第3.1节](https://www.rfc-editor.org/rfc/rfc8037.html#section-3.1)明确EdDSA可使用Ed25519或Ed448，具体变体取决于密钥subtype/crv。

验收：
- 只有EdDSA标识时保留家族或说明曲线未确认，不断言Ed25519。
- 明确Ed25519/Ed448证据仍准确识别。
- 若新增通用EdDSA画像，同步检查backend/analysis.py的SIGNATURES、迁移用途、知识资料、统计和报告，避免落入无关默认用途分组。
- 保留字段结构与评分公式；说明预期算法值纠正。

## 4. 本轮限定的覆盖补充

这些是能力缺口，不全部等同程序安全漏洞。

### 已知库密钥导入
以下均为零发现：
```python
from Crypto.PublicKey import RSA
key = RSA.import_key(key_bytes)
```
```python
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey
key = Ed25519PrivateKey.from_private_bytes(key_bytes)
```

补已知库直接导入、方法和别名形式；增加同名业务库、重绑定等反例。通用load_pem_private_key/load_der_private_key与未知key.sign()不能推断RSA。requirements.txt目前没有cryptography运行依赖，不假定它已存在。

### 结构化算法配置
test.yaml：
```yaml
algorithms:
  - RS256
  - ES256
```
当前零发现，无诊断；相同含义Python列表/JSON字典已有正例。

优先复用成熟JSON/YAML/TOML解析能力，按配置上下文处理列表；不把全文任何RSA/RS256字样计风险。新增依赖需兼容Python3.10、桌面打包和资源预算。解析不执行对象构造，限制深度、循环和展开等新增复杂度。覆盖嵌套、多行、注释、普通说明、畸形与资源边界。

### 留待另行扩展的语言缺口
Node.js标准API也漏报：
```javascript
import { generateKeyPairSync } from 'node:crypto';
const keys = generateKeyPairSync('rsa', { modulusLength: 2048 });
```
本轮不强制建立JS/Java/Go/Rust完整解析器，记录支持矩阵即可。

## 5. 安全复现脚本

项目根目录执行，只运行扫描器，不执行字符串源码，不访问网络：
```sh
rtk proxy .venv/bin/python -B - <<'PY'
import json
from scanner.engine import analyze_source
prefix = "from cryptography.hazmat.primitives.asymmetric import rsa\n"
cases = [
    ("late_import", "test.py",
     "def make_key():\n    return rsa.generate_private_key(public_exponent=65537, key_size=2048)\n"
     + prefix + "make_key()"),
    ("unreachable_shadow", "test.py",
     prefix + "if False:\n    rsa = None\nkey = rsa.generate_private_key(public_exponent=65537, key_size=2048)"),
    ("imported_key", "test.py",
     "from Crypto.PublicKey import RSA\nkey = RSA.import_key(key_bytes)"),
    ("from_private_bytes", "test.py",
     "from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey\n"
     "key = Ed25519PrivateKey.from_private_bytes(key_bytes)"),
    ("template_literal", "test.js", "const note = `RSA.generate(2048)`;"),
    ("pem_comment", "test.py", "# documentation: -----BEGIN RSA PRIVATE KEY-----"),
    ("eddsa", "test.py", 'jwt_algorithm = "EdDSA"'),
    ("yaml_list", "test.yaml", "algorithms:\n  - RS256\n  - ES256"),
]
for label, name, source in cases:
    findings, diagnostics = analyze_source(source, name, include_metadata=True)
    print(json.dumps({
        "case": label,
        "algorithms": [item["algorithm"] for item in findings],
        "diagnostics": [item["code"] for item in diagnostics],
    }, ensure_ascii=False))
PY
```

长输入必须在独立进程设置外部超时。3秒是复现保护，不是生产验收阈值：
```sh
rtk proxy .venv/bin/python -B - <<'PY'
import json
import subprocess
import sys
probe = (
    "from backend.task_execution import local_work\n"
    "from backend.collection_common import Deadline\n"
    "import time,json\n"
    "source='a.'*32000+'a'\n"
    "start=time.perf_counter()\n"
    "result=local_work([('probe.txt',source)],'snippet',Deadline.after(.05))\n"
    "print(json.dumps({'elapsed':time.perf_counter()-start,'sources':len(result['sources'])}))\n"
)
try:
    result = subprocess.run(
        [sys.executable, "-B", "-c", probe],
        capture_output=True, text=True, timeout=3,
    )
    print("returncode:", result.returncode)
    print(result.stdout)
    print(result.stderr[-1000:])
except subprocess.TimeoutExpired:
    print(json.dumps({
        "bytes": 64001, "scan_budget_seconds": 0.05,
        "external_timeout_seconds": 3, "result": "子进程未及时结束，已终止",
    }, ensure_ascii=False))
PY
```
将这些行为转成正式回归测试，并补正反例；不能只针对单一字符串打补丁。

## 6. 验证与交付

此前本会话以下相关测试共58项通过（32+26），未覆盖新问题，不是修复后验收，也未声称全套通过：
```sh
rtk proxy .venv/bin/python -B -m unittest tests.test_scanner_regressions tests.test_scan_quantum_vuln -v
rtk proxy .venv/bin/python -B -m unittest tests.test_security_boundaries tests.test_desktop tests.test_remote_compression -v
```

实施步骤：
1. 先添加能复现问题的正反例及资源边界测试，再修复。
2. 跑新增测试/扫描回归，再执行：
```sh
rtk proxy .venv/bin/python -B -m unittest discover -s tests -v
rtk proxy npm --prefix web test
rtk proxy npm --prefix desktop test
```
3. 如更改前端，必须构建并验证FastAPI实际页面，不手改构建产物：
```sh
rtk proxy npm --prefix web run build
rtk proxy .venv/bin/python start.py --port 8010 --strict-port
```
4. 需要模拟远程流程时，按README使用localhost:8018离线fixture，不把模拟逻辑接到生产入口。
5. 实际Electron窗口静态扫描修复相关输入，核对结果、行号、范围诊断、源码定位；按需验证报告算法与迁移用途。启动：
```sh
rtk proxy env QUANTUM_DESKTOP_PYTHON="$PWD/.venv/bin/python" npm --prefix desktop start
```
6. 更新相应能力边界与验收记录。最终报告改动文件、修复行为、测试数量、实测性能、实际桌面结果、剩余限制和未验收项。

docs/local-development.md曾记录macOS上Windows专用getproxies_registry mock导致完整测试失败。这仅是历史线索，需当前实际运行确认。重现时区分既有平台问题与本轮回归，不把全套写成通过，不顺带改无关业务行为。

资源验收核对终态、迟到回调、信号量、暂存引用、完整分析部分和诊断；不以放宽超时/容量、吞异常让测试变绿。单元测试不替代桌面验收。

## 7. 后续feat候选（另行排期）

- 识别依据分层、语言/API支持矩阵，说明零发现和未覆盖范围。
- 成熟库解析PKCS#8/SPKI/X.509的算法、曲线、长度，保护私钥正文。
- 签名/验签/密钥建立/导入用途和参数。
- 稳定发现标识、基线差异、人工确认/忽略理由。
- 复用findings输出SARIF/CI检查，识别后量子/混合方案并记录迁移进度。
- 供应链图谱、跨模块分析和持久化任务另行设计。

这些候选不自动授权数据库、LLM、完整CBOM或发布部署。
