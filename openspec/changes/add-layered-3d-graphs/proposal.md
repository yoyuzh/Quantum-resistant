## Why

仓库全景及单仓证据图需要从长条平面拓扑升级为可审阅的三层空间。3D 场景使用现有关系与证据语义，支持在断网桌面环境运行。

## What Changes

- 两个主视图共用 Three.js、CSS2D、OrbitControls、GSAP 和带辉光的画布。
- 仓库全景按类别、仓库、算法分层，证据工作台按来源、操作、参考或返回分层。提供总览、正视、逐层审阅和聚焦。
- 现有分组、计数、Worker、筛选、证据与源码加载入口继续提供数据。导出支持含标签的 PNG。

## Capabilities

### New Capabilities

- `layered-spatial-graphs` 多仓及单仓的三层空间可视化。

## Impact

影响 Vue 图形组件、前端依赖与打包、图形验收。API、扫描数据和本机资料库格式沿用现有版本。
