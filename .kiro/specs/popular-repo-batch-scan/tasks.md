# Implementation Plan: Popular Repo Batch Scan

## Overview

实现热门仓库批量扫描功能：CLI 脚本从 GitHub Search API 获取 top-N Python 仓库，逐一执行量子脆弱性扫描，结果写入静态 JSON，FastAPI 提供数据接口，前端新增"热门榜单"标签页展示。

## Tasks

- [x] 1. 实现 CLI 批量扫描脚本核心逻辑
  - [x] 1.1 创建 `scripts/batch_scan_popular.py` 并实现 GitHub Search API 客户端
    - 创建脚本文件，添加 `from __future__ import annotations`
    - 实现 `RepoInfo` dataclass（full_name, html_url, star_count）
    - 实现 `fetch_popular_repos(top, token)` 函数：调用 GitHub Search API（`q=language:python&sort=stars&order=desc&per_page={top}`），支持 `GITHUB_TOKEN` 环境变量认证
    - 处理速率限制（403/429）：日志提示设置 GITHUB_TOKEN，sys.exit(1)
    - 处理其他 HTTP 错误和 20s 超时：日志记录状态码/超时，sys.exit(1)
    - 结果不足 20 个时正常返回可用结果
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

  - [x] 1.2 实现单仓库扫描函数 `scan_single_repo`
    - 实现 `RepoScanResult` dataclass
    - 调用 `backend.collectors.collect_github_sources` 下载源码
    - 调用 `scan_quantum_vuln.scan_source_for_crypto` 扫描每个源文件
    - 计算迁移评分（复用 `build_migration_score`）
    - 提取去重算法列表，截取 top 20 findings（按 line 升序）
    - 采集失败时记录 error 并返回 success=False
    - 零 findings 时返回 finding_count=0, migration_score=0, algorithms=[]
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.7_

  - [x] 1.3 实现批量扫描编排函数 `run_batch_scan` 和结果输出
    - 顺序遍历仓库列表，调用 `scan_single_repo`，打印进度（"正在扫描 [i/N]: owner/repo"）
    - 单仓库失败时跳过继续
    - 空仓库列表时返回有效空结果
    - 实现 `write_results`：确保 `web/data/` 目录存在，原子写入（tempfile + os.replace）
    - JSON 格式：2-space indent, ensure_ascii=False, UTF-8 编码
    - 包含 `scanned_at`（北京时间 ISO +08:00）、`repos` 数组、`meta` 对象
    - 写入失败时清理临时文件，stderr 输出错误，非零退出
    - _Requirements: 2.3, 2.6, 3.1, 3.2, 3.3, 3.4, 3.5_

  - [x] 1.4 实现 CLI 入口 `main` 函数和 argparse
    - 添加 `--top` 参数（默认 20）
    - 打印完成摘要（总仓库数、总 findings、输出路径）
    - 退出码：成功（含部分成功）为 0，致命错误为非零
    - 添加 `if __name__ == "__main__"` 入口
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 2. Checkpoint - 确保 CLI 脚本结构完整
  - Ensure all tests pass, ask the user if questions arise.

- [x] 3. 实现后端 API 端点
  - [x] 3.1 在 `backend/main.py` 中添加 GET `/api/popular/results` 端点
    - 读取 `web/data/popular.json` 文件
    - 文件不存在 → HTTP 404，body `{"detail": "热门仓库扫描数据尚未生成，请先运行批量扫描脚本"}`
    - JSON 解析失败 → HTTP 502，body 含 detail 字段说明数据文件损坏
    - I/O 错误 → HTTP 500，body 含 detail 字段说明读取失败
    - 成功 → HTTP 200，Content-Type `application/json; charset=utf-8`，返回文件原始内容
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [x]* 3.2 在 `tests/test_backend_api.py` 中添加 `/api/popular/results` 端点测试
    - 测试文件存在时返回 200 + 正确内容
    - 测试文件不存在时返回 404 + 正确错误消息
    - 测试文件内容非法 JSON 时返回 502
    - mock I/O 错误时返回 500
    - 使用 `unittest.mock.patch` 避免真实文件依赖
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 4. 实现前端热门榜单标签页
  - [x] 4.1 在 `web/src/App.vue` 中添加"热门榜单"标签页导航和状态
    - 在现有四个标签（代码片段、文件上传、GitHub、PyPI）之后添加第五个标签"热门榜单"
    - 添加响应式状态：`popularData`, `popularLoading`, `popularError`, `expandedPopularRepo`
    - 实现 `loadPopularData` 函数：GET `/api/popular/results`，15s 超时（AbortController）
    - 处理 404 → 显示"暂无数据，请先运行批量扫描脚本生成热门仓库数据"
    - 处理其他错误/超时 → 显示"加载热门仓库数据失败"
    - 切换到标签页时触发数据加载
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_

  - [x] 4.2 实现热门榜单列表展示 UI
    - 实现 `formatStarCount(count)` 函数：>=1000 显示为 "X.Xk"，<1000 显示原数字
    - 实现 `formatScannedAt(isoString)` 函数：ISO 时间戳 → "YYYY-MM-DD HH:mm:ss"
    - 实现 `getScoreColor(score)` 函数：>=40 红色, >0 橙色, ==0 绿色
    - 列表按 star_count 降序排列
    - 每行显示：仓库名、star 数、迁移评分（带颜色）、finding 数、最多 4 个算法
    - 显示扫描时间戳
    - 空 repos 数组时显示提示信息
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

  - [x] 4.3 实现仓库详情展开/折叠交互
    - 实现 `toggleRepoDetail(repoIndex)` 函数
    - 点击仓库行展开内联详情区域
    - 再次点击折叠详情
    - 点击其他仓库时折叠当前展开的详情，展开新点击的
    - 详情区域显示 findings：文件名、行号、算法名、风险等级、证据（按行号升序，最多 20 条）
    - 零 findings 时显示"该仓库未发现量子脆弱性问题"
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 5. Checkpoint - 确保前后端功能完整
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. 编写测试
  - [x]* 6.1 创建 `tests/test_batch_scan.py` 单元测试
    - mock `httpx.Client` 验证 GitHub Search API 调用参数和认证头
    - mock `collect_github_sources` 和 `scan_source_for_crypto` 验证编排逻辑
    - 验证 `--top` 参数解析
    - 验证进度输出格式
    - 验证退出码（成功/部分成功/致命错误）
    - 验证原子写入逻辑（tempfile + rename）
    - 验证空仓库列表场景
    - _Requirements: 1.1–1.6, 2.1–2.7, 3.1–3.5, 8.1–8.5_

  - [x]* 6.2 Write property test: fault tolerance preserves remaining scans
    - **Property 1: Fault tolerance preserves remaining scans**
    - 对任意仓库列表，若某个仓库采集失败，其余仓库仍正常产出结果，失败仓库记录 error
    - **Validates: Requirements 2.3**

  - [x]* 6.3 Write property test: migration score computation
    - **Property 2: Migration score computation is correct**
    - 对任意 findings 集合，验证 score = min(100, high_risk×25 + affected_files×10 + algorithm_variety×10)
    - **Validates: Requirements 2.4**

  - [x]* 6.4 Write property test: findings capped and sorted
    - **Property 3: Findings are capped and sorted**
    - 对任意 N 条 findings，输出最多 20 条且按 line 升序
    - **Validates: Requirements 2.5, 7.2**

  - [x]* 6.5 Write property test: JSON serialization structure
    - **Property 4: JSON serialization produces valid structure with Chinese preserved**
    - 对任意含中文的 batch result，序列化后 round-trip 一致，含 scanned_at/repos/meta 字段，中文字面保留
    - **Validates: Requirements 3.2, 3.4**

  - [x]* 6.6 Write property test: score color classification
    - **Property 6: Score color classification matches thresholds**
    - 对 [0,100] 内任意整数，验证颜色分类：>=40 红, >0 橙, ==0 绿
    - **Validates: Requirements 6.3**

  - [x]* 6.7 Write property test: timestamp formatting
    - **Property 7: Timestamp formatting removes ISO artifacts**
    - 对任意合法 ISO 8601 +08:00 时间戳，格式化结果匹配 "YYYY-MM-DD HH:mm:ss"
    - **Validates: Requirements 6.4**

  - [x]* 6.8 Write property test: star count abbreviation
    - **Property 8: Star count abbreviation**
    - 对任意非负整数，>=1000 显示 "X.Xk"，<1000 显示原数字
    - **Validates: Requirements 6.6**

  - [x]* 6.9 Write property test: repository list sorted by star count
    - **Property 9: Repository list sorted by star count descending**
    - 对任意仓库列表，排序后 star_count 严格非递增
    - **Validates: Requirements 6.2**

- [x] 7. Final checkpoint - 确保所有测试通过
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- 所有测试使用 `unittest.mock.patch` 避免真实网络请求
- 前端纯函数（formatStarCount, formatScannedAt, getScoreColor）的正确性通过 Python 端等价函数的 PBT 覆盖
- CLI 脚本通过 `python3 scripts/batch_scan_popular.py` 从项目根目录执行

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2"] },
    { "id": 2, "tasks": ["1.3"] },
    { "id": 3, "tasks": ["1.4", "3.1"] },
    { "id": 4, "tasks": ["3.2", "4.1"] },
    { "id": 5, "tasks": ["4.2"] },
    { "id": 6, "tasks": ["4.3"] },
    { "id": 7, "tasks": ["6.1", "6.2", "6.3", "6.4", "6.5", "6.6", "6.7", "6.8", "6.9"] }
  ]
}
```
