<script setup>
import InfoTip from './InfoTip.vue';
import { coverageText } from '../utils/results.js';
defineProps({ score: Object, coverage: Object });
</script>
<template>
  <InfoTip label="统计与分析说明">
    <p v-if="coverage">{{ coverageText(coverage) }}</p>
    <p v-if="score">迁移评分按静态确认项计算。高风险项 × 25 + 受影响文件 × 10 + 算法种类 × 10，上限 100。</p>
  </InfoTip>
</template>
