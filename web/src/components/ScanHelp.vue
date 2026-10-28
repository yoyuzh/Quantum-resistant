<script setup>
import DisclosurePanel from './DisclosurePanel.vue';
import { scanLimits } from '../composables/useScanConfig.js';
defineProps({ mode: String });
</script>
<template>
  <DisclosurePanel title="扫描范围与限制">
    <p>仅静态分析，不执行代码。文本须为 UTF-8<template v-if="mode === 'snippet'">，按文件后缀选择分析方式</template>。</p>
    <p>每来源最多 {{ scanLimits.max_files }} 个文件、{{ scanLimits.max_text_bytes / 1048576 }} MiB 文本；单文件 {{ scanLimits.max_file_bytes / 1048576 }} MiB。
      <template v-if="mode === 'files'">上传请求上限 {{ scanLimits.max_upload_bytes / 1048576 }} MiB（含表单开销）。</template>
    </p>
    <p>任务预算 {{ (mode === 'popular' ? scanLimits.popular_timeout_seconds : scanLimits.scan_timeout_seconds) / 60 }} 分钟。
      <template v-if="mode === 'popular'">批次文本预算 512 MiB，按仓库均分，每仓库最多 100 MiB。</template>
      <template v-if="mode === 'github'">仅支持公开仓库，读取默认分支的固定版本。</template>
      <template v-if="mode === 'pypi'">优先源码发行包，必要时回退 wheel。</template>
    </p>
    <p>源码与结果在本机暂存，任务结束后最多保留 15 分钟；重启服务后需重新扫描。输入草稿不会随刷新保存。</p>
  </DisclosurePanel>
</template>
