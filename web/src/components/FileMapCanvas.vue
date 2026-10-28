<script setup>
import { computed, useId } from 'vue';
import { fileTiles } from '../utils/fileDistribution.js';
const props=defineProps({files:Array,width:Number,height:Number,expanded:Boolean});
defineEmits(['select','expand']);
const clipId=useId();
const distribution=computed(()=>fileTiles(props.files,props.width,props.height,props.expanded));
</script>
<template>
  <svg :viewBox="`0 0 ${width} ${height}`" role="group" aria-label="文件发现数量矩形树图">
    <defs><clipPath v-for="tile in distribution.tiles" :id="`${clipId}-${tile.number}`" :key="tile.data.id"><rect :x="tile.x0+8" :y="tile.y0+6" :width="Math.max(0,tile.x1-tile.x0-16)" :height="Math.max(0,tile.y1-tile.y0-12)" /></clipPath></defs>
    <g v-for="tile in distribution.tiles" :key="tile.data.id" tabindex="0" role="button" :aria-label="`${tile.data.name}，${tile.data.count}项`"
      @click="tile.data.members?$emit('expand'):$emit('select',{sourceId:tile.data.id})"
      @keydown.enter="tile.data.members?$emit('expand'):$emit('select',{sourceId:tile.data.id})"
      @keydown.space.prevent="tile.data.members?$emit('expand'):$emit('select',{sourceId:tile.data.id})">
      <title>{{ tile.data.name }} · {{ tile.data.count }} 项 · AI研判 {{ tile.data.ai || 0 }} 项 · 证据不足 {{ tile.data.pending || 0 }} 项</title>
      <rect :x="tile.x0" :y="tile.y0" :width="tile.x1-tile.x0" :height="tile.y1-tile.y0" rx="5" :class="{other:tile.data.members}" />
      <text :clip-path="`url(#${clipId}-${tile.number})`" text-anchor="middle" :style="{fontSize:tile.font+'px'}">
        <tspan v-for="(line,i) in tile.lines" :key="i" :x="(tile.x0+tile.x1)/2" :y="tile.labelY+i*tile.font*1.2">{{ line }}</tspan>
        <tspan class="file-count" :x="(tile.x0+tile.x1)/2" :y="tile.countY">{{ tile.data.count }} 项</tspan>
      </text>
    </g>
  </svg>
</template>
<style scoped>
svg { width:100%;height:100%;display:block; }g { cursor:pointer; }rect { fill:var(--control-selected);stroke:var(--border-light); }.other { fill:var(--control-bg); }g:hover rect,g:focus rect { stroke:var(--accent);stroke-width:2; }text { fill:var(--text-primary);font-weight:500;pointer-events:none; }.file-count { fill:var(--accent);font-weight:650; }defs rect { fill:white;stroke:none; }
</style>
