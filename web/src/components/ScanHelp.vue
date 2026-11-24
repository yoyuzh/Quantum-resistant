<script setup>
import DisclosurePanel from './DisclosurePanel.vue';
import { scanLimits } from '../composables/useScanConfig.js';
defineProps({ mode: String });
</script>
<template>
  <DisclosurePanel title="扫描限制">
    <p>支持 UTF-8 文本<template v-if="mode === 'snippet'">，文件后缀决定分析方式</template>。</p>
    <p>每来源最多 {{ scanLimits.max_files }} 个文件、{{ scanLimits.max_text_bytes / 1048576 }} MiB 文本；单文件 {{ scanLimits.max_file_bytes / 1048576 }} MiB。
      <template v-if="mode === 'files'">上传请求上限 {{ scanLimits.max_upload_bytes / 1048576 }} MiB（含表单开销）。</template>
    </p>
    <p>基础扫描最多 {{ scanLimits.scan_timeout_seconds / 60 }} 分钟，跨文件核验另有 {{ scanLimits.deep_timeout_seconds / 60 }} 分钟。
      <template v-if="mode === 'github'">扫描公开仓库的默认分支。</template>
      <template v-if="mode === 'pypi'">PyPI 优先扫描源码发行包，备选 wheel。</template>
    </p>
    <p>任务结束后，源码与结果在本机最多保留 15 分钟。服务重启后需重新扫描。</p>
  </DisclosurePanel>
</template>
