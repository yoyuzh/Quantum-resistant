<script setup>
import InfoTip from './InfoTip.vue';
import { coverageText } from '../utils/results.js';
defineProps({ score: Object, coverage: Object });
</script>
<template>
  <InfoTip label="统计与分析说明">
    <p v-if="coverage">{{ coverageText(coverage) }}</p>
    <p v-if="score">{{ score.priority }} · 高风险项 × 25 + 受影响文件 × 10 + 算法种类 × 10，上限100。评分表示迁移优先级，不是风险概率。</p>
    <p>迁移评分只按静态确认计算，AI研判和证据不足分别统计。零发现不代表安全；关系图只覆盖本次输入和已完成分析。</p>
    <p>ML-KEM用于密钥封装，ML-DSA和SLH-DSA用于签名。迁移方向仍需核对实际用途与协议兼容性。</p>
  </InfoTip>
</template>
