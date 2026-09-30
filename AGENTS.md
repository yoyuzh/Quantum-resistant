# AGENTS.md

## 工作约束

由当前主线程实施，不创建或调度子代理。除非用户明确要求，不创建 commit、不 push、不发布或部署。不要执行 `sample_inputs/` 中故意包含风险算法的样例。

## 项目定位

抗量子迁移静态扫描原型，FastAPI + Vue 3 + Vite。四种输入：snippet、manual_upload、github_repository、pypi_package。算法迁移知识是静态参考；实际供应链图谱、传播分析、数据库、LLM 和完整多语言解析仍未实现。

## 模块边界

- `scan_quantum_vuln.py`：公共兼容导出及 CLI；扫描实现位于 `scanner/rules.py`、`python_analysis.py`、`text_analysis.py`、`engine.py`、`results.py`。
- `backend/main.py`：薄路由与 `app` 入口。模型在 `models.py`，上传解析在 `uploads.py`，扫描组装在 `scanning.py`。
- `backend/collectors.py`：采集公共接口。`remote_sources.py` 负责 GitHub/PyPI，`archives.py` 负责归档，`collection_common.py` 负责截止时间、HTTP 与并发调度。
- `backend/popular.py`：网页与 CLI 共用的热门检索、单仓库扫描和批量编排。`storage.py` 原子写入，`reporting.py` 生成报告，`knowledge.py` 从算法资料生成知识。
- `web/src/App.vue`：组合页面与顶层状态；保持 <=250 行。
- `web/src/components/`：输入、结果、源码、知识、热门列表等，业务组件原则上 <=350 行（含样式），不得压缩代码凑行数。
- `web/src/composables/`：扫描、热门、主题状态；`api/client.js` 统一请求/错误/超时；`utils/` 纯函数；`styles/theme.css` 主题变量，`style.css` 基础样式。
- `web/app.js` 为旧版参考，不是当前界面入口，不应继续修改。

## 验证与构建

```sh
python -B -m unittest discover -s tests -v
npm --prefix web test
npm --prefix web run build
python start.py --port 8010 --strict-port
```

修改扫描规则需跑扫描回归测试；远程测试必须 mock，不能触发真实网络。`test_batch_scan_properties.py` 已接入 unittest。前端纯函数用 Node 原生测试，不使用 Python 复制前端逻辑。

`npm run build` 会替换 `web/index.html` 与 `web/assets/`。禁止手改这些产物；更改前端后必须构建并验证 FastAPI 页面。开发脚本将后端地址通过 `BACKEND_URL` 传给 Vite 代理。

离线 UI 验收入口：`python -m tests.browser_fixture`（仅 localhost:8018），行为见 README。不要把模拟逻辑接入生产入口。

## 兼容与可信度

保留现有 URL、`backend.main:app`、CLI 命令及 JSON 输出；诊断写 stderr。API 在原字段外新增可选 `coverage` 和 `diagnostics`。文件统计、筛选与源码定位统一用 `source_id`，不能按同名文件合并。

AST 成功时负责调用及配置识别，避免回退规则二次引入误报；仅信任已知密码库的完整导入目标。通用 PEM 头不能推断 RSA。算法配置跳过注释；诊断不计入确认风险。评分是启发式优先级，不是风险概率。

普通扫描600秒、热门网页/同步/CLI批次1200秒共享截止时间。四类输入使用单进程后台任务，边采集边分析；队列16文件/8MiB，分析全局并发2。状态短请求查询，2个运行/4个排队。进程HTTP并发8。每来源5000文件/100MiB文本；热门512MiB按仓库均分且每仓库不超过100MiB。取消与超时保留完整分析部分；热门未完整结束不覆盖快照。原子写入失败保留旧结果，热门互斥仅限单进程。详情见 docs/architecture.md。

单文件2MiB，上传5000个/源码100MiB/整个请求110MiB；归档200MiB，严格UTF-8。上传有界流式读取，CPU分析移到线程。源码/归档/结果使用本机临时存储，全局2GiB；终态15分钟/8份/512MiB序列化结果，定时及惰性清理；重启清理孤立目录。网页结果不附完整源码，按source_id读取，缓存10文件。远程异常使用 `CollectionError` / `CollectionTimeout` 转换中文502/504；重复热门扫描409；非法参数400/422，超限413。

## 约定

Python 3.10+，使用 future annotations 与类型注解；网络统一 httpx。用户提示中文；时间为北京时间 ISO +08:00。前端只用 Vue props/emits 与 composable，不引入 UI 框架、Pinia 或路由。样式兼顾键盘焦点、窄屏、长路径及减少动画偏好。细节见 `docs/architecture.md`。
