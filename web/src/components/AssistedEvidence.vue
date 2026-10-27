<script setup>
import { computed, ref } from 'vue';
import CodePreview from './CodePreview.vue';
import InfoTip from './InfoTip.vue';
import DisclosurePanel from './DisclosurePanel.vue';
const props = defineProps({ result: Object, operation: Object, loadSource: Function });
const opened = ref(new Set());
const paths = computed(() => (props.result.deep_analysis?.evidence_paths || []).filter(p => props.operation.evidence_ids.includes(p.evidence_id)));
const positions = computed(() => [...new Map(paths.value.flatMap(p => p.nodes).map(n => [`${n.location.source_id}:${n.location.start_line}`, n.location])).values()]);
const edgeTypes = computed(() => [...new Set(paths.value.flatMap(p => p.edges.map(e => e.edge_type)))]);
const file = id => props.result.sources.find(s => s.source_id === id)?.file_name || id;
const edgeLabels = { CALLS: '调用', IMPORT_BINDING: '导入绑定', ASSIGN_FLOW: '赋值', ARGUMENT_FLOW: '参数传递', RETURN_FLOW: '返回传递', KEY_TYPE_FLOW: '密钥类型' };
const reasons = { unknown_key_source: '密钥来源未确认', unbound_name: '名称来源未解析', unbound_local: '局部值未确认', uninstantiated_template: '缺少调用实例', missing_argument: '缺少实参', generic_key_type: '密钥类型未确认', unsupported_transform: '值经过不支持的运算', unknown_branch: '分支条件未确定', unsupported_algorithm: '算法超出当前规则范围' };
</script>
<template>
  <div class="evidence-detail">
    <p v-if="operation.evidence_scope === 'algorithm_policy'" class="notice">此处识别的是验签允许算法策略，不能据此确认令牌实际采用的算法。</p>
    <p v-if="operation.context.kind === 'uninstantiated_template'" class="notice">当前仅发现封装定义，未解析到调用实例。</p>
    <dl class="claim-list"><template v-for="claim in operation.claims" :key="claim.claim_type">
      <dt>{{ { ALGORITHM: '算法', OPERATION_TYPE: '操作', KEY_SOURCE: '密钥来源', QUANTUM_CLASS: '量子风险分类' }[claim.claim_type] }}</dt>
      <dd>{{ claim.level === 'E3' ? '静态证据已核验' : '待确认' }}<InfoTip v-if="claim.value.kind === 'unknown'" :label="{ALGORITHM:'算法',OPERATION_TYPE:'操作',KEY_SOURCE:'密钥来源',QUANTUM_CLASS:'量子风险分类'}[claim.claim_type]+'未确认原因'">{{ reasons[claim.value.reason] || '当前语义范围内无法确认' }}</InfoTip></dd>
    </template></dl>
    <div class="path-types">
      <span v-for="type in edgeTypes" :key="type">{{ edgeLabels[type] }}</span>
    </div>
    <DisclosurePanel v-for="(span, i) in positions" :key="JSON.stringify(span)" :title="`${file(span.source_id)} · 第 ${span.start_line} 行`" @toggle="$event ? opened.add(i) : opened.delete(i)">
      <CodePreview v-if="opened.has(i)" :sources="result.sources" :finding="{ source_id: span.source_id, line: span.start_line, file_name: file(span.source_id) }" :load-source="loadSource" />
    </DisclosurePanel>
  </div>
</template>
<style scoped>
.evidence-detail { display: grid; gap: 10px; margin-top: 12px; }
.claim-list { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 4px 12px; margin: 0; font-size: 12px; }
dt { color: var(--text-secondary); } dd { display:flex;align-items:center;gap:6px;margin: 0; overflow-wrap: anywhere; }
.path-types { display: flex; flex-wrap: wrap; gap: 6px; font-size: 11px; color: var(--text-secondary); }
.path-types span { padding: 2px 6px; background: var(--bg-input); border-radius: 4px; }
</style>
