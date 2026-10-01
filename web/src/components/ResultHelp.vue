<script setup>
import DisclosurePanel from './DisclosurePanel.vue';
defineProps({ score: Object });
</script>
<template>
  <DisclosurePanel title="评分说明与结果边界">
    <p v-if="score">{{ score.priority }} · 高风险项 × 25 + 受影响文件 × 10 + 算法种类 × 10，上限 100。评分是迁移优先级，不是风险概率。</p>
    <p>结果仅覆盖本次输入与当前规则；零发现不能证明安全。资产与关系图是静态证据，不是完整 CBOM 或供应链图谱。图表数量以本次全部发现为分母。</p>
    <p>识别方式表示证据来源，不是置信度。用途与迁移方案需人工复核：ML-KEM 用于密钥封装，ML-DSA、SLH-DSA 用于签名，不能直接替换任意 API。</p>
  </DisclosurePanel>
</template>
