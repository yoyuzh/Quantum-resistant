<script setup>
import { computed, ref, watch, nextTick } from 'vue';
import { abstractText, claimLabels, resolutionLabels, edgeLabels, operationLabels, riskLabels } from '../utils/deepAnalysis.js';
const props = defineProps({ operation: Object, paths: Array, sources: Array });
const emit = defineEmits(['locate', 'return-source']);
const chosen = ref('');
const page = ref(1);
const trigger = ref(null);
const paths = computed(() => (props.paths || []).filter(path => props.operation?.evidence_ids.includes(path.evidence_id)));
const selected = computed(() => paths.value.find(path => path.evidence_id === chosen.value) || paths.value[0]);
const nodes = computed(() => (selected.value?.nodes || []).slice((page.value - 1) * 12, page.value * 12));
watch(() => props.operation?.operation_id, () => { chosen.value = ''; page.value = 1; trigger.value = null; });
watch(paths, value => { chosen.value = value[0]?.evidence_id || ''; }, { immediate: true });
watch(chosen, () => { page.value = 1; });
function location(span) {
  const source = props.sources?.find(source => source.source_id === span.source_id);
  return `${source?.relative_path || source?.file_name || span.source_id}:${span.start_line}`;
}
function locate(span, event) { trigger.value = event.currentTarget; emit('locate', span); }
async function back() {
  emit('return-source');
  await nextTick();
  if (trigger.value?.isConnected) trigger.value.focus({ preventScroll: true });
}
</script>
<template>
  <aside class="proof-panel" aria-label="调用链与证据信息">
    <h3>调用链与证据信息</h3>
    <template v-if="operation">
      <p class="small muted">{{ operation.api }} · {{ operation.library }}</p>
      <ol class="call-chain">
        <li v-for="(span, index) in operation.context.call_chain" :key="index">
          <button class="button text-action compact" @click="locate(span, $event)">{{ location(span) }}</button>
        </li>
        <li><button class="button text-action compact" @click="locate(operation.sink_location, $event)">{{ location(operation.sink_location) }}</button><span class="small muted">底层调用</span></li>
      </ol>
      <p v-for="condition in operation.context.conditions" :key="condition" class="notice small">条件：{{ condition }}</p>
      <details v-if="operation.context.arguments.length"><summary>上下文参数（{{ operation.context.arguments.length }}）</summary><p v-for="argument in operation.context.arguments" :key="argument.parameter" class="small muted">{{ argument.parameter }} · {{ argument.fact_id }}</p></details>
      <h4>逐项结论</h4>
      <dl class="claim-grid">
        <div v-for="claim in operation.claims" :key="claim.claim_type">
          <dt>{{ claimLabels[claim.claim_type] }}</dt>
          <dd><strong class="tag">{{ claim.level }}</strong> {{ resolutionLabels[claim.resolution_status] }}
            <p>{{ claim.claim_type === 'OPERATION_TYPE' ? operationLabels[claim.value.value] || abstractText(claim.value) : claim.claim_type === 'QUANTUM_CLASS' ? riskLabels[claim.value.value] || abstractText(claim.value) : claim.claim_type === 'KEY_SOURCE' && claim.value.kind === 'known' ? '已定位静态密钥来源' : abstractText(claim.value) }}</p>
            <p v-for="(alternative, index) in claim.value.alternatives" :key="index" class="small muted">候选 {{ alternative.value }} · 条件：{{ alternative.conditions.join('、') || '未记录' }}</p>
            <p v-if="claim.value.reason" class="muted small">未知原因：{{ claim.value.reason }}</p>
            <p v-for="reason in claim.reasons" :key="reason" class="muted small">{{ reason }}</p>
            <p v-if="claim.missing_edges.length" class="small">缺少：{{ claim.missing_edges.map(edge => edgeLabels[edge]).join('、') }}</p>
          </dd>
        </div>
      </dl>
      <p class="proof-note">E0–E3 表示每项结论的证据强度。E3 不代表必然执行，也不是风险严重度。</p>
      <label>证据路径（{{ paths.length }}）
        <select v-model="chosen" :disabled="!paths.length" aria-label="选择证据路径">
          <option v-if="!paths.length" value="">没有完整证据路径</option>
          <option v-for="(path, index) in paths" :key="path.evidence_id" :value="path.evidence_id">{{ index + 1 }} · {{ claimLabels[path.claim_type] || '公共路径' }}</option>
        </select>
      </label>
      <template v-if="selected">
        <p class="small muted">历史核验：{{ selected.historical_verification_status || selected.verification_status }} · {{ selected.replay_status === 'unavailable' ? '当前源码不可重放' : '保存时可重放：' + selected.replay_status + '；当前以源码读取和导出为准' }}</p>
        <ul class="proof-nodes">
          <li v-for="node in nodes" :key="node.node_id">
            <button class="button text-action compact" @click="locate(node.location, $event)">{{ location(node.location) }}</button>
            <code>{{ node.expression }}</code>
            <span v-if="node.redacted" class="small muted">已遮蔽片段</span>
          </li>
        </ul>
        <div v-if="selected.nodes.length > 12" class="toolbar small">
          <button class="button secondary compact" :disabled="page === 1" @click="page--">前一页节点</button>
          <span>{{ page }} / {{ Math.ceil(selected.nodes.length / 12) }}</span>
          <button class="button secondary compact" :disabled="page * 12 >= selected.nodes.length" @click="page++">后一页节点</button>
        </div>
        <details><summary>证据边与条件（{{ selected.edges.length }}）</summary>
          <ol class="proof-edges"><li v-for="edge in selected.edges" :key="edge.edge_id">
            <strong>{{ edgeLabels[edge.edge_type] }}</strong>
            <p class="small">{{ location(selected.nodes.find(node => node.node_id === edge.source_node).location) }} → {{ location(selected.nodes.find(node => node.node_id === edge.target_node).location) }}</p>
            <p v-for="condition in edge.conditions" :key="condition" class="small muted">条件：{{ condition }}</p>
          </li></ol>
        </details>
        <p v-for="gap in selected.gaps" :key="gap" class="notice small">{{ gap }}</p>
      </template>
      <button v-if="trigger" class="button secondary compact" @click="back">返回证据触发点</button>
    </template>
    <p v-else class="muted">选择操作上下文后查看逐项结论。</p>
  </aside>
</template>
<style scoped>
.proof-panel { min-width: 0; padding: 1rem; background: var(--bg-surface); border-radius: var(--radius); display: flex; flex-direction: column; gap: .7rem; overflow-wrap: anywhere; }
h3 { font-size: 1rem; } h4 { margin: .3rem 0 0; font-size: .9rem; }
.call-chain { margin: 0; padding-left: 1.2rem; color: var(--accent-dim); }
.call-chain li { padding-bottom: .35rem; }
.call-chain .button { text-align: left; justify-content: flex-start; }
.claim-grid { margin: 0; border: 1px solid var(--border); border-radius: var(--radius); }
.claim-grid > div { display: grid; grid-template-columns: 4.5rem minmax(0, 1fr); }
.claim-grid > div + div { border-top: 1px solid var(--border); }
dt, dd { padding: .5rem .6rem; margin: 0; font-size: .78rem; }
dt { color: var(--text-secondary); border-right: 1px solid var(--border); }
dd p { margin-top: .3rem; }
.proof-note { font-size: .73rem; color: var(--text-secondary); }
.proof-nodes { list-style: none; padding: 0; margin: 0; display: grid; gap: .5rem; }
.proof-nodes li { border-left: 2px solid var(--accent-dim); padding-left: .6rem; }
.proof-nodes code { display: block; font: .75rem var(--font-mono); }
.proof-edges { max-height: 240px; overflow-y: auto; padding-left: 1.3rem; font-size: .8rem; }
.proof-edges li + li { margin-top: .6rem; }
</style>
