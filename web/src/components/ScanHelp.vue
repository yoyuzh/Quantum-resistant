<script setup>
import DisclosurePanel from './DisclosurePanel.vue';
import { scanLimits } from '../composables/useScanConfig.js';
defineProps({ mode: String });
</script>
<template>
  <DisclosurePanel title="扫描说明">
    <p>仅静态分析，不执行代码。文本使用 UTF-8；代码片段按文件后缀选择分析方式。</p>
    <p>每来源最多 {{ scanLimits.max_files }} 个文件、{{ scanLimits.max_text_bytes / 1048576 }} MiB 文本；单文件 {{ scanLimits.max_file_bytes / 1048576 }} MiB。
      <template v-if="mode === 'files'">上传请求上限 {{ scanLimits.max_upload_bytes / 1048576 }} MiB（含表单开销）。</template>
    </p>
    <p>任务预算 {{ (mode === 'popular' ? scanLimits.popular_timeout_seconds : scanLimits.scan_timeout_seconds) / 60 }} 分钟。
      <template v-if="mode === 'popular'">批次文本预算 512 MiB，按仓库均分，每仓库最多 100 MiB。</template>
      <template v-if="mode === 'github'">读取默认分支的固定版本，优先批量采集源码。</template>
      <template v-if="mode === 'pypi'">优先源码发行包，必要时回退 wheel。</template>
    </p>
    <p>可取消或刷新恢复查询。源码与结果在本机暂存，终态最多保留 15 分钟；服务重启后需重新提交。输入草稿仅保存在当前页面。</p>
  </DisclosurePanel>
</template>
