<script setup>
import AppIcon from './AppIcon.vue';
defineProps({ data: Object, mode: String });
defineEmits(['open']);
// Shared decorative backdrop; actual records are rendered only in the workbench.
const paths = [
  ['M100 100C260 90 290 180 440 165S680 75 835 105', '#627ec7'],
  ['M130 295C290 320 285 165 440 165S650 245 805 275', '#16877f'],
  ['M95 195C260 200 290 315 505 285S655 135 835 105', '#9a6dc1'],
  ['M100 100C280 85 285 70 520 75S680 240 805 275', '#ac8128'],
  ['M95 195C255 190 315 60 520 75S665 350 875 350', '#488faa'],
  ['M130 295C260 315 310 315 505 285S695 355 875 350', '#4e916b'],
];
</script>
<template>
  <div class="graph-preview">
    <div class="preview-art" aria-hidden="true">
      <svg viewBox="0 0 980 440" preserveAspectRatio="xMidYMid meet">
        <path v-for="([d,color],i) in paths" :key="i" :d="d" :stroke="color" class="connection" />
        <g fill="#dce7f9" stroke="#627ec7">
          <rect x="60" y="74" width="85" height="52" rx="14" transform="rotate(-8 100 100)" />
          <rect x="53" y="168" width="86" height="54" rx="12" transform="rotate(6 95 195)" />
          <rect x="87" y="268" width="86" height="54" rx="13" transform="rotate(-5 130 295)" />
        </g>
        <g fill="#d7eeea" stroke="#16877f"><circle cx="440" cy="165" r="35"/><circle cx="520" cy="75" r="27"/><circle cx="505" cy="285" r="32"/></g>
        <g fill="#eae0f4" stroke="#9a6dc1"><path d="M835 72L875 105L835 138L795 105Z"/><path d="M805 238L846 275L805 312L764 275Z"/><path d="M875 321L909 350L875 379L841 350Z"/></g>
      </svg>
    </div>
    <div class="preview-center">
      <div class="entry-stage">
        <div class="entry-halo" aria-hidden="true" />
        <svg class="entry-lines" viewBox="0 0 520 220" aria-hidden="true">
          <g class="entry-branches"><path d="M64 50C118 50 103 110 150 110M72 170C126 170 103 110 150 110M456 50C402 50 417 110 370 110M448 170C394 170 417 110 370 110"/><path d="M23 110H150M370 110H497"/></g>
          <g class="entry-satellites"><circle cx="64" cy="50" r="6"/><circle cx="448" cy="170" r="6"/><path d="M72 163L79 170L72 177L65 170ZM456 43L463 50L456 57L449 50Z"/><circle cx="23" cy="110" r="3"/><circle cx="497" cy="110" r="3"/></g>
        </svg>
        <button class="button primary preview-open" @click="$emit('open','')"><AppIcon name="expand" :size="28" /><span>打开完整图</span><AppIcon class="entry-arrow" name="arrow" :size="20" /></button>
      </div>
    </div>
  </div>
</template>
<style scoped>
.graph-preview { flex:1;min-height:240px;position:relative;isolation:isolate;overflow:hidden;border-radius:var(--radius);background:var(--bg-elevated); }
.preview-art { position:absolute;inset:-4%;pointer-events:none;filter:blur(9px);opacity:.52; }
.preview-art::after { content:'';position:absolute;inset:0;background:radial-gradient(ellipse at center,var(--bg-surface) 0%,transparent 58%),linear-gradient(0deg,var(--bg-surface),transparent 24%,transparent 80%,var(--bg-surface));opacity:.75; }
.preview-art svg { width:100%;height:100%;stroke-width:2; }.connection { fill:none;stroke-width:4;opacity:.7; }
.preview-center { position:absolute;inset:0;display:grid;place-items:center; }
.entry-stage { position:relative;isolation:isolate;display:grid;place-items:center;width:min(520px,calc(100vw - 64px));height:220px; }
.entry-halo { position:absolute;width:84%;height:72%;border-radius:50%;background:radial-gradient(ellipse,color-mix(in srgb,var(--accent) 18%,transparent),transparent 70%);animation:entry-breathe 4.8s ease-in-out infinite;pointer-events:none; }
.entry-lines { position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none; }
.entry-branches { fill:none;stroke:var(--accent);stroke-width:1.4;opacity:.24; }.entry-branches path:last-child { stroke-dasharray:2 7; }
.entry-satellites { fill:var(--bg-surface);stroke:var(--accent);stroke-width:1.5;opacity:.54; }
.preview-open { position:relative;gap:14px;min-width:260px;min-height:80px;padding:20px 28px;border:0;border-radius:42px;color:#fff;background:linear-gradient(115deg,#087c71,#0b6973);font-size:19px;font-weight:650;letter-spacing:.04em;box-shadow:0 12px 28px color-mix(in srgb,var(--accent) 20%,transparent);transition:transform 180ms ease,box-shadow 180ms ease; }
.preview-open::before { content:'';position:absolute;inset:-8px;border-radius:50px;background:color-mix(in srgb,var(--accent) 9%,transparent);z-index:-1;pointer-events:none;animation:entry-breathe 4.8s ease-in-out infinite; }
.preview-open:hover:not(:disabled) { background:linear-gradient(115deg,#096e64,#095d67);transform:translateY(-2px);box-shadow:0 16px 36px color-mix(in srgb,var(--accent) 26%,transparent); }
.preview-open:active:not(:disabled) { transform:translateY(0); }.preview-open span { white-space:nowrap; }
.entry-arrow { opacity:.8;transition:transform 180ms ease; }.preview-open:hover .entry-arrow { transform:translateX(3px); }
@keyframes entry-breathe { 0%,100% { opacity:.55;transform:scale(.97); }50% { opacity:1;transform:scale(1.08); } }
@media(max-width:500px){.entry-stage{height:190px;}.preview-open{min-width:228px;min-height:72px;padding:18px 22px;font-size:17px;gap:12px;}}
@media(prefers-reduced-motion:reduce){.entry-halo,.preview-open::before{animation:none;}.preview-open,.entry-arrow{transition:none;}.preview-open:hover:not(:disabled),.preview-open:hover .entry-arrow{transform:none;}}
@media(forced-colors:active){.preview-art,.entry-halo,.entry-lines,.preview-open::before{display:none;}.preview-open{background:ButtonFace;color:ButtonText;}}
</style>
