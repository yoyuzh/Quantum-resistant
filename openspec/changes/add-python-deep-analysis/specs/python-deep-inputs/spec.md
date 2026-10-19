# Spec Delta

## Purpose

为四种输入建立有明确路径保真、身份摘要和覆盖缺口的只读分析来源，必要时提供隔离的文件视图，使跨文件结论可追溯且不会访问或改写用户原始源码和快照之外的内容。

## ADDED Requirements

### Requirement: 四输入资格及保守覆盖

系统 SHALL 支持 snippet、manual_upload、github_repository、pypi_package 的可用 Python 源码进入静态深度分析，不要求模型配置。片段只承诺局部；部分采集继承缺口，无Python时明确skipped，无可读源码时返回原因。热门批次不得自动深度分析。

#### Scenario: I-01 部分采集
- **WHEN** 来源部分完成且仅保留部分Python模块
- **THEN** 只分析已保留快照并公开缺失范围，不补抓或宣称全仓覆盖

### Requirement: 路径保真与来源隔离

系统 SHALL 记录路径保真与跨模块资格。旧平铺上传保持兼容且关闭跨模块证明；可信相对路径、唯一包根及目标绑定成立后才能解析跨文件导入，文件名或source_id唯一不能代替包结构。所有文件关联 SHALL 使用source_id。

#### Scenario: I-02 平铺同名模块
- **WHEN** 旧上传含不同目录的同名文件但没有目录映射
- **THEN** 保留独立身份和基础结果，明确路径缺失，不拼接成确定跨文件调用

### Requirement: 显式路径上传协议

系统 SHALL 提供独立 POST /api/tasks/files-with-paths，使用重复files和单个manifest字段，schema_version=upload-paths-1；entries逐文件index恰好覆盖一次并含relative_path及解码后UTF-8内容SHA-256。旧上传/source_id保持兼容。manifest最多4MiB/5000项且计110MiB请求；沿用单文件2MiB/源码100MiB，超限413，非法结构/路径422，摘要/幂等冲突409，失败整批清理。

路径 SHALL 为规范相对路径，拒绝越界、绝对/驱动器/UNC、链接、控制字符、点段/空段、大小写/Unicode等价冲突、文件目录前缀冲突及不安全平台名称；深度和长度有界。相同内容不同路径或模式 SHALL 计为不同输入指纹。

#### Scenario: I-03 摘要与路径攻击
- **WHEN** 上传有效包、../a.py、大小写冲突、缺项manifest或错误摘要
- **THEN** 有效包获得路径映射，其余按约定整批拒绝且不留下可分析的半批数据

### Requirement: 不可变快照与安全物化

系统 SHALL 以完整内容摘要、source_id、路径/包根及覆盖元数据绑定快照和分析版本；缺少远程commit时明确未知。只能读取已采集内容，不隐式读宿主文件、执行输入、安装依赖或导入目标模块。需要磁盘视图时只能在配额内私有临时根创建普通文件，防止链接/路径逃逸，写后及工具退出后核验摘要；输出写独立临时区，结束/失败/取消清理。

#### Scenario: I-04 文件视图与源码回收
- **WHEN** 工具需要物化文件或来源已被清理
- **THEN** 前者仅获得快照内受控视图且原文件不变；后者明确不可读取/复验，不改读宿主路径或重新联网
