<script setup>
defineProps({
  name: { type: String, default: 'scan' },
  size: { type: [Number, String], default: 20 },
});
const paths = {
  shield: ['M12 3 4 6v6c0 5 8 9 8 9s8-4 8-9V6Z', 'm8 12 3 3 5-6'],
  code: ['m8 6-6 6 6 6', 'm16 6 6 6-6 6', 'm14 4-4 16'],
  upload: ['M12 16V3', 'm7 8 5-5 5 5', 'M4 15v5h16v-5'],
  repository: ['M4 3h12v16H6a2 2 0 0 1-2-2V3Z', 'M4 15h12', 'M20 7v14H8'],
  package: ['m12 3 9 5v9l-9 5-9-5V8Z', 'm3 8 9 5 9-5', 'M12 13v9', 'm7 5 10 6'],
  chart: ['M4 20h17', 'M7 16v-5', 'M12 16V4', 'M17 16V8'],
  scan: ['M8 3H3v5', 'M16 3h5v5', 'M21 16v5h-5', 'M8 21H3v-5', 'M3 12h18'],
  search: ['M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14', 'm15 15 6 6'],
  sun: [
    'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8',
    'M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5',
  ],
  moon: ['M20 15A9 9 0 0 1 9 4a9 9 0 1 0 11 11Z'],
  download: ['M12 3v12', 'm7 10 5 5 5-5', 'M4 16v5h16v-5'],
  file: ['M14 2H5v20h14V7Z', 'M14 2v6h5', 'M8 13h8m-8 4h5'],
  graph: ['M4 5h5v5H4Z', 'M15 14h5v5h-5Z', 'M9 7h8v7', 'M6 10v7h9'],
  list: ['M9 5h12M9 12h12M9 19h12', 'm3 5 1 1 2-2m-3 8 1 1 2-2m-3 8 1 1 2-2'],
  arrow: ['M4 12h16', 'm14 6 6 6-6 6'],
  chevron: ['m8 5 7 7-7 7'],
  close: ['m6 6 12 12', 'M6 18 18 6'],
  star: ['m12 3 3 6 6 1-4.5 4.5 1 6-5.5-3-5.5 3 1-6L3 10l6-1Z'],
};
</script>
<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.65"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path v-for="(path, index) in paths[name] || paths.scan" :key="index" :d="path" />
  </svg>
</template>
<style scoped>
svg {
  flex-shrink: 0;
  vertical-align: middle;
}
</style>
