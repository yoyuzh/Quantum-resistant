# Python 深度分析收尾与剩余验收

2026-10-19，实施基准 HEAD `82896dc316a30d2f86ed758501c3c19a6332f989`。第8组的工程回归8.1、故障回归8.2完成，进度49/51；8.3、8.4仍未完成。没有更改验收门槛、重录标签、创建commit、push、发布或部署。

本轮证据目录：`output/deep-closeout-20261019/`。代码、语料、日志与结果摘要见该目录 `validation.json`；[Scenario索引](../output/deep-closeout-20261019/scenario-coverage.md)覆盖七份规格的33个场景，明确区分当前回归、同日既有视觉记录及未完成门槛。

## 已完成变更的规格同步与归档

`add-evidence-grounded-ai-analysis`原有33/33项完成，本轮398项Python和73项前端回归覆盖其配置、上下文、模型mock、评估、生命周期与前端行为；没有重新访问真实模型。三份新增能力已同步到`openspec/specs/`，保留原Purpose、14个Requirement与25个Scenario，逐段比较一致且主规格严格校验通过。随后归档至`openspec/changes/archive/2026-10-19-add-evidence-grounded-ai-analysis/`，文件内容保持原样。

`ai-spec-sync.json`记录主规格同步比较，`ai-archive.json`记录归档位置。归档CLI使用`--skip-specs`是因为同步已在前一步完成，其`specsUpdated=false`只描述CLI自身未再写规格，不表示主规格没有同步。最终`openspec validate --all --strict`为4项通过：1个尚在实施的深度变更和3份AI主规格。深度变更保留活动状态49/51，未同步为已验收主规格或归档。

## 已完成的工程验收

| 验证 | 结果 | 当前证据 |
|---|---|---|
| 完整Python unittest | 398项通过 | `python-unittest.log` |
| 前端Node测试 | 73项通过 | `web-test.log` |
| 前端生产构建 | 通过，页面资源与本地构建逐字节一致 | `web-build.log`、`page-assets.json` |
| 旧四输入、同步/后台、CLI、评分及四报告 | 固定兼容基线通过；本地四报告HTTP 200 | `python-unittest.log`、`http-validation-current.json` |
| 当前生产入口 | 新进程8011页面/health 200，deep契约及无fixture路由检查通过 | `server-8011.log`、`http-validation-current.json` |
| 四输入与故障HTTP | snippet、平铺/目录上传、来源复用、GitHub/PyPI、失败/取消/过期均通过 | `http-validation-current.json` |
| 路径/链接/摘要、解析与配额、取消/截止/迟到、源清理/存储满/写失败、adapter退出 | 逐测试映射和资源释放断言通过 | `scenario-coverage.json`、`python-unittest.log` |

本机系统没有`python`命令，系统`python3`没有项目依赖；正式回归使用已有`.venv/bin/python`，未安装或更新依赖。指定命令`start.py --port 8010 --strict-port`因已有服务占用端口而拒绝启动，已有8010页面/health仍为200。为了验证当前检出代码，另起8011新进程完成真实HTTP检查；未终止原8010服务。两者页面引用的JS/CSS均与当前构建一致。HTTP助手复用既有`tests.deep_static.ui_http_acceptance.run`，仅在测试调用中把生产目标8010替换为8011，未修改生产或测试源文件。

远程回归全部使用8018独立fixture的mock collector，生产入口没有fixture路由。只有试点输入下载访问公开源码；下载与分析阶段分开，静态分析期间socket连接被拒绝且观察调用数为0。未执行输入源码或`sample_inputs/`。8011、8018由本轮启动的进程验证后关闭，回收日志与端口检查保存在证据目录。

本轮不重拍第7组截图。1440×960、1280×720、390×844、双主题、键盘/减少动画的同日已有证据仍见[网页记录](python-deep-ui.md)、`design-qa.md`和`output/deep-ui-20261019/`，不能将其描述为本轮重新运行的浏览器验收。

## 锁定语料复跑与门槛

固定标签和计分器均未改变。36例全部复跑，锁定集30例、33条操作；支持范围内31条操作。原始逐例结果、完整Unknown原因/条件及版本保存在`crypto-matrix.json`。

| 范围 | TP / FP / FN | Precision / Recall | Wilson 95%区间（两者相同） |
|---|---|---|---|
| 锁定集操作定位 | 33 / 0 / 0 | 100% / 100% | [89.57%, 100%] |
| 锁定集严格端到端 | 27 / 6 / 6 | 81.82% / 81.82% | [65.61%, 91.39%] |
| 预先冻结支持范围内严格端到端 | 27 / 4 / 4 | 87.10% / 87.10% | [71.15%, 94.87%] |

支持范围内未达到Precision≥95%、Recall≥90%。操作定位成功不替代端到端正确；未知表示、条件或原因不一致仍按原计分记FP+FN。

| 案例 | 原标签 | 当前结果 | 裁决状态 |
|---|---|---|---|
| derived_return | `unsupported_transform` | `shadowed_or_dynamic_binding` | 待独立审查 |
| branches_multiple | 文本条件`condition` / `not condition` | 两个稳定条件ID | 待独立审查，不能直接丢弃条件比较 |
| branch_unknown | `unknown_branch`、无备选 | `unbound_name`，保留带条件RS256备选 | 待独立审查，不能删备选凑匹配 |
| recursion | `recursion_limit` | `recursive_call` | 待独立审查 |
| decorated（既定范围外） | `unsupported_decorator` | `unsupported_function` | 保留范围外统计 |
| unsupported_config（既定范围外） | `unsupported_runtime_config` | `unsupported_transform` | 保留范围外统计 |

相对现有标签的**算法claim**错误E3为0；其他claim由定向篡改/缺边测试验证，未获得独立人工错误率。双调用RS256/HS256隔离测试通过、夹具内容改写0；生产静态核心零网络连接测试通过。这些是已测试输入上的观察，不能外推为所有源码的错误E3/串值/外发均为0。

必要边标签不是完整负边金标准，额外预测边不能直接当错误边率；保持原始边指标供复核。没有通过修改标签、剔除漏检、放宽Unknown匹配或自报unsupported来抬高成绩。

## 真实仓库试点准备及失败

使用Microblog的`v0.23`，只下载`LICENSE`和`app/models.py`。MIT版权及许可文本随输入保留。审查范围在运行引擎前固定为这个文件；预先阅读源码列出第182行`jwt.encode`和第189行`jwt.decode`，均指定HS256，密钥来自运行时配置。完整源码位置、预审理由及人审空栏见`pilot-scope.json`。

GitHub API的TLS连接失败，未取得commit，字段如实为null。公开raw来源可读取，以版本标签和实际SHA-256固定内容，重现时必须先核对摘要：

- `app/models.py`：`07534ea0df91817dc69aff5fb5c2ae5802a322b30cdc892517edf7955cd56bae`，13,728字节。
- `LICENSE`：`a8729e0ebca3234d8c3914fd24ffa274f6cceeba6f4113974f195efe4c4e9aff`。

只读AST路线成功解析1文件，但输出0条操作，未识别预审的两处类方法内JWT调用。结果公开`pilot_scope_only`及包根不唯一缺口；**parsed/analyzed=1不表示两处操作被识别，更不表示该文件无密码行为或安全**。原始结果见`pilot-result.json`，零连接、未导入目标模块和输入前后摘要检查见`pilot-checks.json`。

两处调用只是本代理预审的候选，尚无人类审查者签署，官方TP/FP/FN、Precision/Recall和区间均为null。不报告全仓召回。这个试点没有完成8.3要求的人审裁决，也没有因试跑成功就完成8.4。正确性门槛未通过，未做耗时/RSS性能基准或排名；内存逻辑快照无需额外磁盘物化，记录的物化字节数为0而非RSS值。

## 独立复核包与后续步骤

1. 审查`tests/deep_static/fixtures/corpus.json`及`manifest.json`中的30个锁定案例，先独立阅读输入与标签；在`human-review-decisions.json`填写审查者、结论及理由，当前全部为null/待审。该文件仅是裁决记录草稿，不会自动修改原标签或勾选任务。
2. 对照上述6个差异和`crypto-matrix.json`，区分真实语义错误、Unknown原因契约及标签条件表示问题。必要的标签/计分规范修订须有明确审查依据和版本变化；当前冻结集不因预测不同自动重录。
3. 阅读试点固定源码全部内容及两处调用，明确遗漏、类方法/装饰器/try语义和范围边界，在同一裁决文件签署。进一步修复后重新生成结果，原失败证据保留。
4. 8.3补齐逐操作人工裁决、正式指标和失败说明；8.4在独立人工锁定基准达到95%/90%及四项零错误门槛后才能勾选。当前保持这两项未完成，不归档深度变更。

## 复现入口

```sh
rtk proxy .venv/bin/python -B -m unittest discover -s tests -v
rtk proxy npm --prefix web test
rtk proxy npm --prefix web run build
rtk proxy openspec validate --all --strict
```

矩阵复现须调用`tests.deep_static.crypto_matrix.run_matrix()`并另存新文件，避免默认`main()`覆盖第5组历史目录。HTTP步骤参见`tests.deep_static.ui_http_acceptance.run`：启动正常`start.py`服务及独立`tests.deep_static.browser_fixture`，只在测试中选择空闲端口，不把mock接入生产。

试点复现使用`pilot-input/app/models.py`字面内容构造`SimpleNamespace(file_name='app/models.py', relative_path='app/models.py', source_id='pilot_microblog_models', content=..., content_available=True)`，经`build_snapshot(..., 'github_repository', coverage={'partial': True, 'skip_reasons': {'pilot_scope_only': 1}}, collection_version='microblog-v0.23-content-pinned-1')`调用`analyze_crypto`；保持`commit=None`，禁止导入或执行试点模块。先核对上述摘要，并在分析期间拒绝`socket.socket.connect`，分析后再验摘要。这里仅重放固定输入的失败，不补抓依赖或把覆盖缺口填成全仓完成。
