# Requirements Document

## Introduction

热门仓库批量扫描功能。通过 GitHub Search API 自动获取 star 数最高的 20 个 Python 仓库，对每个仓库执行量子脆弱性扫描，将结果写入静态 JSON 文件，并在前端新增"热门榜单"标签页展示扫描结果。整个流程为一次性 CLI 执行，不涉及调度、数据库或队列。

## Glossary

- **Batch_Scanner**: 一次性批量扫描 CLI 脚本，负责获取热门仓库列表、逐一扫描并输出结果文件
- **GitHub_Search_Client**: 调用 GitHub Search API 获取热门 Python 仓库列表的模块
- **Popular_JSON**: 批量扫描结果的静态 JSON 文件，存储于 `web/data/popular.json`
- **Popular_Tab**: 前端 App.vue 中新增的"热门榜单"标签页组件
- **Scanner**: 现有的 `scan_quantum_vuln.py` 扫描器
- **GitHub_Collector**: 现有的 `backend/collectors.py` 中 `collect_github_sources` 函数
- **FastAPI_Server**: 现有的 FastAPI 后端应用

## Requirements

### Requirement 1: 获取热门 Python 仓库列表

**User Story:** As a 安全研究员, I want to 自动获取 GitHub 上 star 数最高的 Python 仓库列表, so that 我可以批量评估主流开源项目的量子迁移风险。

#### Acceptance Criteria

1. WHEN the Batch_Scanner is executed, THE GitHub_Search_Client SHALL query the GitHub Search API with parameters `language:python`, sorted by stars in descending order, and retrieve up to 20 repositories, returning for each repository its full name (owner/repo), HTML URL, and star count.
2. IF the environment variable `GITHUB_TOKEN` is set, THEN THE GitHub_Search_Client SHALL include the token in the `Authorization` header as `Bearer <token>` for authenticated requests.
3. IF the environment variable `GITHUB_TOKEN` is not set, THEN THE GitHub_Search_Client SHALL make unauthenticated requests to the GitHub Search API.
4. IF the GitHub Search API returns a rate-limit response (HTTP 403 or 429), THEN THE GitHub_Search_Client SHALL log a message indicating rate limiting, suggest setting `GITHUB_TOKEN`, and terminate with a non-zero exit code.
5. IF the GitHub Search API returns an HTTP error other than 403/429, or fails to respond within 20 seconds, THEN THE GitHub_Search_Client SHALL log the error message including the HTTP status code or timeout condition, and terminate with a non-zero exit code.
6. IF the GitHub Search API returns fewer than 20 results, THEN THE GitHub_Search_Client SHALL proceed with the available results without raising an error.

### Requirement 2: 逐仓库批量扫描

**User Story:** As a 安全研究员, I want to 对每个热门仓库执行量子脆弱性扫描, so that 我可以了解各仓库的量子迁移风险状况。

#### Acceptance Criteria

1. WHEN the repository list is obtained, THE Batch_Scanner SHALL iterate over each repository sequentially and invoke the existing GitHub_Collector to download source files.
2. WHEN source files are collected for a repository, THE Batch_Scanner SHALL invoke the existing Scanner to analyze each source file for quantum-vulnerable cryptographic algorithms.
3. IF the GitHub_Collector fails for a single repository (network error, repository not found, or rate limit), THEN THE Batch_Scanner SHALL record the failure reason in the batch result, skip that repository, and continue scanning the remaining repositories.
4. THE Batch_Scanner SHALL record for each successfully scanned repository: repository full name, star count, repository URL, migration score (computed as min(100, high_risk_count×25 + affected_file_count×10 + algorithm_variety×10)), finding count, and the list of distinct vulnerable algorithm names detected.
5. THE Batch_Scanner SHALL record the findings for each repository (up to 20 per repository, ordered by line number ascending) including line number, file name, algorithm name, risk level, and evidence.
6. IF the repository list is empty, THEN THE Batch_Scanner SHALL return a valid batch result with zero repository entries and no error.
7. IF the Scanner produces zero findings for a repository, THEN THE Batch_Scanner SHALL still record that repository as successfully scanned with a finding count of 0, an empty algorithm list, and a migration score of 0.

### Requirement 3: 结果输出为静态 JSON 文件

**User Story:** As a 开发者, I want to 将批量扫描结果存储为静态 JSON 文件, so that 前端可以直接读取展示而无需额外后端逻辑。

#### Acceptance Criteria

1. WHEN all repositories have been scanned, THE Batch_Scanner SHALL write the results atomically to the file path `web/data/popular.json` by first writing to a temporary file in the same directory and then renaming it to the target path, ensuring no partial file is visible to readers.
2. THE Batch_Scanner SHALL produce a JSON file with 2-space indentation containing: a `scanned_at` string (Beijing time, ISO format with `+08:00` offset, seconds precision), a `repos` array where each element contains the fields defined in Requirement 2 (repository full name, star count, repository URL, migration score, finding count, list of distinct vulnerable algorithms, and top findings), and a `meta` object containing `total_repos` (integer count of successfully scanned repositories), `requested_count` (the `--top` argument value or default 20), and `query` (the GitHub Search query string used).
3. THE Batch_Scanner SHALL ensure the output directory `web/data/` exists, creating it recursively if necessary.
4. WHEN the JSON file is written, THE Batch_Scanner SHALL use UTF-8 encoding with `ensure_ascii=False` to preserve Chinese characters in the output.
5. IF the Batch_Scanner fails to write the output file (permission error or disk full), THEN THE Batch_Scanner SHALL print an error message indicating the failure reason to stderr and exit with a non-zero exit code without leaving a partial or temporary file on disk.

### Requirement 4: 后端提供静态 JSON 数据接口

**User Story:** As a 前端开发者, I want to 通过 API 获取热门仓库扫描结果, so that 前端可以展示批量扫描数据。

#### Acceptance Criteria

1. THE FastAPI_Server SHALL expose a GET endpoint at `/api/popular/results` that reads the file `web/data/popular.json` and returns its content as the response body with HTTP 200.
2. IF the file `web/data/popular.json` does not exist, THEN THE FastAPI_Server SHALL return HTTP 404 with a JSON body `{"detail": "热门仓库扫描数据尚未生成，请先运行批量扫描脚本"}`.
3. IF the file `web/data/popular.json` exists but cannot be parsed as valid JSON, THEN THE FastAPI_Server SHALL return HTTP 502 with a JSON body containing a `detail` field indicating the data file is corrupted.
4. WHEN the GET `/api/popular/results` request succeeds, THE FastAPI_Server SHALL return the response with `Content-Type: application/json; charset=utf-8` and the response body SHALL be the unmodified JSON content of the file.
5. IF an I/O error occurs while reading `web/data/popular.json`, THEN THE FastAPI_Server SHALL return HTTP 500 with a JSON body containing a `detail` field indicating a file read failure.

### Requirement 5: 前端热门榜单标签页

**User Story:** As a 用户, I want to 在前端看到一个"热门榜单"标签页, so that 我可以浏览热门 Python 仓库的量子迁移风险概览。

#### Acceptance Criteria

1. THE Popular_Tab SHALL appear as a new tab labeled "热门榜单" in the App.vue navigation, positioned after the existing four scan mode tabs (代码片段, 文件上传, GitHub, PyPI).
2. WHEN the user switches to the Popular_Tab, THE Popular_Tab SHALL send a GET request to `/api/popular/results` and display the returned repository list.
3. WHILE the GET request to `/api/popular/results` has not yet resolved, THE Popular_Tab SHALL display a loading indicator consistent with the existing scanning-state animation style used elsewhere in App.vue.
4. IF the API returns HTTP 404, THEN THE Popular_Tab SHALL display a message "暂无数据，请先运行批量扫描脚本生成热门仓库数据".
5. IF the API returns any other non-success HTTP status or a network error, THEN THE Popular_Tab SHALL display a message "加载热门仓库数据失败".
6. IF the API returns HTTP 200 with an empty repository list, THEN THE Popular_Tab SHALL display a message "暂无数据，请先运行批量扫描脚本生成热门仓库数据".
7. IF the GET request to `/api/popular/results` does not respond within 15 seconds, THEN THE Popular_Tab SHALL abort the request and display a message "加载热门仓库数据失败".

### Requirement 6: 热门榜单列表展示

**User Story:** As a 用户, I want to 看到热门仓库的扫描结果列表, so that 我可以快速了解各仓库的量子迁移风险。

#### Acceptance Criteria

1. WHEN data is loaded successfully, THE Popular_Tab SHALL display a list showing each repository's name, star count, migration score, finding count, and up to 4 top vulnerable algorithms (sorted by occurrence count descending).
2. THE Popular_Tab SHALL sort repositories by star count in descending order.
3. THE Popular_Tab SHALL display the migration score with a color-coded indicator: red for score >= 40 (高风险), orange for score > 0 and score < 40 (中风险), green for score = 0 (低风险).
4. THE Popular_Tab SHALL display the scan timestamp from the `scanned_at` field formatted as "YYYY-MM-DD HH:mm:ss" (removing the ISO 'T' separator and timezone suffix).
5. IF the loaded data contains an empty `repos` array (zero repositories), THEN THE Popular_Tab SHALL display a message indicating that no repository scan results are available.
6. THE Popular_Tab SHALL display star counts >= 1000 in abbreviated form using "k" suffix (e.g., 52300 displayed as "52.3k").

### Requirement 7: 仓库详情查看

**User Story:** As a 用户, I want to 点击某个仓库查看详细的扫描发现, so that 我可以了解具体的量子脆弱性问题。

#### Acceptance Criteria

1. WHEN the user clicks a repository row in the Popular_Tab, THE Popular_Tab SHALL expand an inline detail section below that row showing the detailed findings for that repository.
2. WHILE a repository detail section is expanded, THE Popular_Tab SHALL display each finding's file name, line number, algorithm name, risk level, and evidence text, sorted by line number in ascending order, showing up to 20 findings.
3. WHEN the user clicks the expanded repository row again, THE Popular_Tab SHALL collapse the detail section, hiding all findings for that repository.
4. IF the user clicks a different repository row while another is already expanded, THEN THE Popular_Tab SHALL collapse the previously expanded detail section and expand the newly clicked repository's detail section.
5. IF a repository has zero findings, THEN THE Popular_Tab SHALL display a message "该仓库未发现量子脆弱性问题" in the detail section.

### Requirement 8: CLI 脚本入口

**User Story:** As a 开发者, I want to 通过简单的命令行执行批量扫描, so that 我可以随时手动触发一次扫描。

#### Acceptance Criteria

1. THE Batch_Scanner SHALL be executable via `python3 scripts/batch_scan_popular.py` from the project root.
2. THE Batch_Scanner SHALL accept an optional `--top` argument to override the default number of repositories (default: 20).
3. THE Batch_Scanner SHALL print progress information to stdout, including which repository is currently being scanned (e.g., "正在扫描 [3/20]: pallets/flask").
4. WHEN the scan completes, THE Batch_Scanner SHALL print a summary line indicating total repositories scanned, total findings, and the output file path.
5. THE Batch_Scanner SHALL exit with code 0 on success (including partial success where some repos failed but at least one succeeded) and non-zero on fatal errors (inability to reach GitHub Search API).
