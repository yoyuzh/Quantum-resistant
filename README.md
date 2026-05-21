# 抗量子迁移风险扫描平台

本项目用于识别代码、配置片段和密钥材料中可能需要进行抗量子密码迁移的传统公钥算法用法。当前覆盖 `RSA`、`DSA`、`DH`、`ECDH/ECDSA/ECC`，并扩展识别 `X25519/X448`、`Ed25519/Ed448`、JWT/SSH 算法标识以及 PEM 密钥头。

## 功能概览

- 支持粘贴代码片段扫描。
- 支持多文件上传扫描。
- 支持输入 GitHub 仓库地址，下载源码包后批量扫描。
- 支持输入 PyPI 包名，下载源码包或 wheel 后批量扫描。
- 支持识别 Python 加密 API、协议算法字符串和 PEM 密钥头。
- 展示文件名、行号、算法、风险等级、证据、原因和迁移建议。
- 展示迁移评分、迁移优先级和抗量子知识图谱。
- 支持点击结果查看对应行附近代码。
- 支持导出 Markdown 扫描报告。
- 扫描时间和报告时间使用北京时间 `UTC+08:00`。

## 项目结构

```text
.
├── backend/                 # FastAPI API 与静态页面挂载
│   ├── main.py              # 路由、上传处理、扫描接口
│   ├── reporting.py         # Markdown 报告生成
│   └── README.md            # 后端接口简要说明
├── web/                     # Vue 3 + Vite 前端
│   ├── src/                 # 前端源码
│   ├── scripts/             # 前端构建发布脚本
│   ├── assets/              # 构建后由 FastAPI /static 挂载的静态资源
│   ├── index.html           # 构建后由 FastAPI 返回的首页
│   └── package.json
├── scripts/
│   ├── start_dev.sh         # macOS/Linux 同时启动前后端
│   ├── start_dev.ps1        # Windows 同时启动前后端
│   ├── start.ps1            # Windows 后端启动脚本
│   └── stop_dev_services.ps1
├── sample_inputs/           # 风险样例文件
├── tests/                   # 扫描器、API 与启动脚本测试
├── scan_quantum_vuln.py     # 核心扫描器与 CLI
├── start.py                 # FastAPI 后端启动入口
└── requirements.txt         # Python 依赖
```

## 安装依赖

Python 依赖：

```bash
python3 -m pip install -r requirements.txt
```

前端依赖：

```bash
cd web
npm install
```

## 本地开发启动

macOS/Linux 可以在项目根目录运行：

```bash
./scripts/start_dev.sh
```

该脚本会同时启动：

```text
后端 API: http://127.0.0.1:8000
前端页面: http://127.0.0.1:3000/static/
```

按 `Ctrl+C` 会同时停止前后端服务。

如需指定端口：

```bash
BACKEND_PORT=8010 FRONTEND_PORT=3010 ./scripts/start_dev.sh
```

Windows PowerShell 可以在项目根目录运行：

```powershell
.\scripts\start_dev.ps1
```

指定端口：

```powershell
.\scripts\start_dev.ps1 -BackendPort 8010 -FrontendPort 3010
```

如果 Windows 阻止脚本执行，可在当前 PowerShell 窗口临时放行：

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

## 生产式单服务启动

如果希望只启动 FastAPI，由后端直接返回构建后的前端页面，先构建前端：

```bash
cd web
npm run build
cd ..
python3 start.py
```

默认访问地址：

```text
http://127.0.0.1:8000
```

如果 `8000` 端口已被占用，`start.py` 会自动选择 `8001` 到 `8020` 之间的下一个可用端口，并在终端中打印实际访问地址。

## Windows PowerShell 仅启动后端

在项目根目录运行：

```powershell
.\scripts\start.ps1
```

指定偏好的端口：

```powershell
.\scripts\start.ps1 -Port 8001
```

如果不希望自动切换端口，可以开启严格模式：

```powershell
.\scripts\start.ps1 -Port 8000 -StrictPort
```

如果 Windows 阻止脚本执行，可在当前 PowerShell 窗口临时放行：

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

## API 接口

默认后端地址为 `http://127.0.0.1:8000`。

- `GET /`：生产式 Web 可视化页面。
- `GET /api/health`：服务健康检查。
- `POST /api/scan/snippet`：扫描粘贴的代码片段。
- `POST /api/scan/files`：扫描上传的多个代码文件。
- `POST /api/scan/github`：扫描 GitHub 仓库源码，参数为 `repository_url`。
- `POST /api/scan/pypi`：扫描 PyPI 包源码，参数为 `package_name`。
- `GET /api/knowledge/graph`：返回算法、数学难题、量子威胁和 PQC 迁移建议的图谱数据。
- `POST /api/report/markdown`：根据扫描结果生成 Markdown 报告。

远程采集会提取 `.py`、`.pyw`、`.txt`、`.pem`、`.yml`、`.yaml`、`.json`、`.cfg`、`.ini`、`.toml` 文件。单文件限制 2 MB，单次远程采集最多扫描 80 个文件。

## 命令行扫描

扫描示例文件：

```bash
python3 -B scan_quantum_vuln.py sample_rsa_code.py
```

输出 JSON：

```bash
python3 -B scan_quantum_vuln.py sample_inputs/risky_protocol_assets.py --json
```

示例输出：

```text
【高风险】在第8行发现量子脆弱算法：X25519
  证据：x25519.X25519PrivateKey.generate
  原因：X25519 属于椭圆曲线 Diffie-Hellman 密钥交换，量子计算可高效求解其离散对数基础。
  建议：密钥交换迁移到 FIPS 203 ML-KEM，或在过渡期使用经评估的混合密钥交换。
```

## 扫描覆盖范围

当前规则覆盖：

- Python API：`cryptography`、`pycryptodome`、`ecdsa` 中的 RSA/DSA/DH/ECC/ECDH/ECDSA/X25519/X448/Ed25519/Ed448 用法。
- 协议算法标识：`RS256`、`PS256`、`ES256`、`EdDSA`、`ssh-rsa`、`rsa-sha2-*`、`ssh-dss`、`ecdsa-sha2-*`、`ssh-ed25519` 等。
- PEM 密钥头：RSA、DSA、EC private/public key header。

为降低误报，协议算法字符串只在变量名或参数名含有 `algorithm`、`jwt`、`ssh`、`tls`、`key`、`cert` 等上下文时触发；普通说明文本不会直接报风险。

## 风险样例文件

项目内置了一组用于 Web 上传测试的风险代码样例：

```text
sample_inputs/
├── risky_rsa_cryptography.py
├── risky_dh_dsa_cryptography.py
├── risky_ecc_cryptography.py
├── risky_pycryptodome_rsa_dsa.py
├── risky_ecdsa_library.py
├── risky_partial_syntax_fallback.py
└── risky_protocol_assets.py
```

这些文件是故意写入传统公钥算法用法的测试输入，不需要实际运行。启动服务后，可以在页面中选择“多文件上传”，一次性上传 `sample_inputs` 目录下的 `.py` 文件进行测试。

## 测试

运行扫描器、API 和启动脚本测试：

```bash
python3 -B -m unittest discover -s tests -v
```

构建前端：

```bash
cd web
npm run build
```

## 常见问题

- 访问 `http://127.0.0.1:3000/static/` 报 API 错误：确认后端 `http://127.0.0.1:8000/api/health` 正常。
- 访问 `http://127.0.0.1:8000` 看到旧页面：先运行 `cd web && npm run build` 重新发布前端构建产物。
- 端口被占用：`python3 start.py` 会自动切换后端端口；开发脚本严格使用指定端口，可以换端口后重试。
- PowerShell 无法运行脚本：使用 `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` 临时放行当前窗口。

## 后续扩展方向

- 支持更完整的 GitHub 分支选择和私有仓库 token。
- 增加异步任务、扫描进度和历史记录。
- 支持 CSV、JSON、PDF 等更多导出格式。
- 扩展 Java、Go、JavaScript 等语言的算法识别规则。
