<script setup>
import { ref } from 'vue';
defineProps({ score: Object });
const menu = ref(null);
function close() {
  menu.value.open = false;
  menu.value.querySelector('summary')?.focus({ preventScroll: true });
}
</script>
<template>
  <details ref="menu" class="result-help" @keydown.esc.prevent="close">
    <summary>评分说明与边界</summary>
    <div class="help-popup">
    <p v-if="score">{{ score.priority }} · 高风险项 × 25 + 受影响文件 × 10 + 算法种类 × 10，上限 100。评分是迁移优先级，不是风险概率。</p>
    <p>结果仅覆盖本次输入与当前规则；零发现不能证明安全。资产与关系图是静态证据，不是完整 CBOM 或供应链图谱。图表数量以本次全部发现为分母。</p>
    <p>识别方式表示证据来源，不是置信度。用途与迁移方案需人工复核：ML-KEM 用于密钥封装，ML-DSA、SLH-DSA 用于签名，不能直接替换任意 API。</p>
    </div>
  </details>
</template>
<style scoped>
.result-help { position: relative; flex-shrink: 0; }
summary { min-height: 28px; padding: 2px 0; font-size: 12px; line-height: 20px; white-space: nowrap; }
.help-popup { position: absolute; z-index: 30; right: 0; top: 100%; width: min(420px, calc(100vw - 48px));
  max-height: 50dvh; overflow-y: auto; padding: 12px; font-size: 13px; line-height: 1.65;
  background: var(--bg-surface); border: 1px solid var(--border-light); border-radius: var(--radius);
  box-shadow: var(--shadow-lg); }
@media (max-width: 600px), (pointer: coarse) { summary { min-height: 44px; } }
</style>
