<script setup>
import { computed } from 'vue';
import AppIcon from './AppIcon.vue';
const props = defineProps({ mode: String, elapsed: Number, hasResult: Boolean });
const description = computed(
  () =>
    ({
      snippet: '正在静态分析代码片段，识别密码算法与代码证据。',
      files: '正在读取已提交文件，汇总算法使用位置。',
      github: '正在采集仓库候选源码并进行静态分析。',
      pypi: '正在采集包内文本文件并进行静态分析。',
      popular: '正在检索与扫描热门仓库，汇总可用结果。',
    })[props.mode],
);
</script>
<template>
  <div class="scan-loading" role="status" aria-live="polite" aria-busy="true">
    <div class="scan-art" aria-hidden="true">
      <div class="scan-emblem"><AppIcon name="scan" :size="26" /></div>
      <div class="code-paper">
        <div class="paper-heading"><i></i><i></i><i></i></div>
        <div class="code-lines"><span v-for="n in 7" :key="n" :style="{ '--i': n }"></span></div>
        <div class="scan-beam"></div>
      </div>
      <div class="scan-dots"><i></i><i></i><i></i></div>
    </div>
    <p class="eyebrow">密码资产分析</p>
    <h2>正在寻找代码中的密码线索</h2>
    <p class="description">{{ description }}</p>
    <span class="elapsed" aria-live="off">已等待 {{ elapsed || 0 }} 秒</span>
    <p class="small muted">
      {{ hasResult ? '上次结果已保留，完成后更新。' : '分析过程不会执行输入代码。' }}
    </p>
  </div>
</template>
<style scoped>
.scan-loading {
  flex: 1;
  min-height: 440px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  gap: 0.8rem;
  background: radial-gradient(ellipse at 50% 38%, var(--accent-soft), transparent 65%);
  border-radius: inherit;
}
.scan-art {
  width: 240px;
  height: 220px;
  position: relative;
  margin-bottom: 1rem;
}
.code-paper {
  position: absolute;
  inset: 30px 22px;
  padding: 20px;
  overflow: hidden;
  background: var(--bg-surface);
  border-radius: 18px;
  box-shadow: var(--shadow-lg);
}
.paper-heading {
  display: flex;
  gap: 5px;
  margin-bottom: 21px;
}
.paper-heading i {
  width: 5px;
  height: 5px;
  background: var(--text-muted);
  border-radius: 50%;
  opacity: 0.35;
}
.code-lines {
  display: grid;
  gap: 9px;
}
.code-lines span {
  height: 5px;
  width: 85%;
  background: var(--accent);
  border-radius: 5px;
  animation: line-flow 2s ease-in-out infinite;
  animation-delay: calc(var(--i) * -0.16s);
}
.code-lines span:nth-child(2n) {
  width: 60%;
  margin-left: 12%;
}
.code-lines span:nth-child(3n) {
  width: 72%;
}
.scan-beam {
  position: absolute;
  inset: 0 0 auto;
  height: 48px;
  background: linear-gradient(transparent, var(--accent-glow));
  animation: scan 2.4s cubic-bezier(0.45, 0, 0.55, 1) infinite;
}
.scan-emblem {
  position: absolute;
  top: 10px;
  right: 8px;
  z-index: 1;
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  color: var(--on-accent);
  background: var(--accent);
  border-radius: 16px;
  box-shadow: var(--shadow-card);
}
.scan-dots {
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 7px;
}
.scan-dots i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  animation: dot 1.2s ease-in-out infinite;
}
.scan-dots i:nth-child(2) {
  animation-delay: 0.15s;
}
.scan-dots i:nth-child(3) {
  animation-delay: 0.3s;
}
.description {
  max-width: 28rem;
  color: var(--text-secondary);
  font-size: 0.85rem;
}
.elapsed {
  font-size: 0.75rem;
  color: var(--accent-dim);
  font-variant-numeric: tabular-nums;
}
@keyframes scan {
  0% {
    transform: translateY(-48px);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  100% {
    transform: translateY(175px);
    opacity: 0;
  }
}
@keyframes line-flow {
  0%,
  100% {
    opacity: 0.16;
    transform: translateX(0);
  }
  50% {
    opacity: 0.5;
    transform: translateX(4px);
  }
}
@keyframes dot {
  0%,
  100% {
    opacity: 0.3;
    transform: translateY(0);
  }
  50% {
    opacity: 1;
    transform: translateY(-4px);
  }
}
@media (prefers-reduced-motion: reduce) {
  .code-lines span {
    opacity: 0.3;
  }
  .scan-beam {
    display: none;
  }
}
</style>
