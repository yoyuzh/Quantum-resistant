<script setup>
defineProps({ mode: String });
</script>
<template>
  <div class="graph-legend" aria-label="图例">
    <div class="legend-row"><span><i class="shape file" />{{ mode==='calls'?'来源位置':'文件与发现' }}</span><span><i class="shape algorithm" />{{ mode==='calls'?'操作或定义':'算法与用途' }}</span><span><i class="shape reference" />{{ mode==='calls'?'返回或关联':'迁移参考' }}</span></div>
    <div class="legend-row states"><span><i class="line" />静态关系</span><span><i class="line assessed" />AI研判</span><span><i class="line conditional" />关联／条件参考</span></div>
  </div>
</template>
<style scoped>
.graph-legend { flex:none;display:grid;gap:7px;margin-left:auto;padding:9px 11px;border-radius:8px;background:var(--bg-surface);color:var(--text-secondary);font-size:12px;pointer-events:none; }
.legend-row { display:flex;justify-content:flex-end;align-items:center;gap:14px; }.legend-row span { display:inline-flex;align-items:center;gap:6px;white-space:nowrap; }
.shape { display:block;width:17px;height:12px;flex:none;background:color-mix(in srgb,var(--accent) 7%,var(--bg-surface)); }
.file { border:1px solid #627ec7;border-radius:3px;background:color-mix(in srgb,#627ec7 8%,var(--bg-surface)); }.algorithm { border:1px solid #16877f;border-radius:7px; }.reference { border:1px solid #9a6dc1;clip-path:polygon(20% 0,80% 0,100% 25%,100% 75%,80% 100%,20% 100%,0 75%,0 25%);background:color-mix(in srgb,#9a6dc1 16%,var(--bg-surface)); }
.line { width:22px;border-top:2px solid var(--accent); }.assessed { border-top-style:dashed; }.conditional { border-top-style:dotted; }
@media(max-width:500px){.graph-legend{font-size:11px;padding:7px;gap:5px;}.legend-row{gap:8px;}.shape{width:14px;height:11px;}}
</style>
