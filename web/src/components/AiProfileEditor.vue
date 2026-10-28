<script setup>
import { computed,reactive,watch,onBeforeUnmount } from 'vue';
import SelectControl from './SelectControl.vue';
import InfoTip from './InfoTip.vue';
import CheckboxControl from './CheckboxControl.vue';
const props=defineProps({profile:Object,providers:Array,busy:Boolean,canManage:Boolean,popupTarget:Object,first:Boolean});
const emit=defineEmits(['save','test','clear']);
const blank=()=>({name:'',preset:'deepseek',base_url:'https://api.deepseek.com/v1',model:'deepseek-flash',api_key:'',consent:false,json_mode:true,output_parameter:'max_tokens',reasoning_disabled:true,remember:true,protocol:'chat',auth_mode:'bearer',output_mode:'json',region:''});
const form=reactive(blank());
const provider=computed(()=>props.providers.find(p=>p.id===form.preset));
const types=computed(()=>props.providers.map(p=>({value:p.id,label:p.name})));
const regions=computed(()=>provider.value?.regions?.map(r=>({value:r.id,label:r.name})) || []);
watch(()=>props.profile?.id,()=>{const profile=props.profile;Object.assign(form,blank(),profile?Object.fromEntries(Object.keys(blank()).filter(k=>k in profile).map(k=>[k,profile[k]])):{},{api_key:''});},{immediate:true});
function chooseProvider(){const p=provider.value;if(!p)return;Object.assign(form,{base_url:p.base_url,model:p.model,protocol:p.protocol,auth_mode:p.auth_mode,output_mode:p.output_mode,json_mode:p.output_mode!=='prompt',api_key:'',consent:false,region:p.regions?.[0]?.id || ''});}
function region(){form.base_url=provider.value?.regions?.find(r=>r.id===form.region)?.base_url || '';form.consent=false;form.api_key='';}
onBeforeUnmount(()=>{form.api_key='';});
function clearCredential(){form.api_key='';form.consent=false;emit('clear');}
function save(activate){emit('save',{...form,name:form.name.trim() || provider.value?.name || '模型配置'},activate);form.api_key='';}
</script>
<template>
  <form class="profile-editor" @submit.prevent="save(first)"><fieldset :disabled="busy || !canManage || profile?.readonly"><div class="editor-grid">
    <label>配置名称<input v-model="form.name" maxlength="80" placeholder="例如：日常扫描" /></label><SelectControl v-model="form.preset" label="服务类型" :options="types" :popup-target="popupTarget" @update:model-value="chooseProvider" />
    <SelectControl v-if="regions.length" v-model="form.region" label="服务地区" :options="regions" :popup-target="popupTarget" @update:model-value="region" />
    <label class="wide">API 地址<input v-model.trim="form.base_url" type="url" required maxlength="2048" @input="form.consent=false" /></label>
    <label>API 模型 ID<input v-model.trim="form.model" required maxlength="120" placeholder="供应商提供的模型或部署名称" /></label>
    <label>API 密钥<input v-model="form.api_key" type="password" maxlength="8192" autocomplete="new-password" :placeholder="profile?.has_key?'已保存，留空保留原密钥':form.auth_mode==='none'?'本机服务可留空':'填写 API 密钥'" /></label>
    <CheckboxControl v-model="form.remember" class="wide preference-row" label="记住配置" />
    <details class="wide"><summary>协议与输出选项</summary><div class="editor-grid advanced">
      <SelectControl v-model="form.protocol" label="接口协议" :options="[{value:'chat',label:'OpenAI Chat Completions'},{value:'responses',label:'OpenAI Responses'},{value:'anthropic',label:'Anthropic Messages'},{value:'gemini',label:'Gemini GenerateContent'}]" :popup-target="popupTarget" />
      <SelectControl v-model="form.output_mode" label="输出格式" :options="[{value:'schema',label:'JSON Schema'},{value:'json',label:'JSON 对象'},{value:'prompt',label:'提示约束 JSON'}]" :popup-target="popupTarget" />
      <SelectControl v-model="form.auth_mode" label="鉴权方式" :options="[{value:'bearer',label:'Bearer API Key'},{value:'api-key',label:'api-key'},{value:'x-api-key',label:'x-api-key'},{value:'x-goog-api-key',label:'x-goog-api-key'},{value:'none',label:'本机服务无鉴权'}]" :popup-target="popupTarget" />
      <SelectControl v-model="form.output_parameter" label="兼容接口额度参数" :options="[{value:'max_tokens',label:'max_tokens'},{value:'max_completion_tokens',label:'max_completion_tokens'}]" :popup-target="popupTarget" />
      <CheckboxControl v-if="['deepseek','qwen'].includes(form.preset)" v-model="form.reasoning_disabled" label="使用供应商支持的非思考模式" />
    </div></details>
    <CheckboxControl v-model="form.consent" class="wide" label="允许发送扫描所需的脱敏代码片段"><InfoTip label="发送范围与凭据说明">仅发送必要证据，不提供代码执行或联网能力。脱敏不能识别所有秘密；已发送内容无法撤回。密钥由系统安全存储保护，不写入浏览器存储。ChatGPT网页订阅不是API凭据。</InfoTip></CheckboxControl>
  </div></fieldset><footer><button class="button primary" type="submit" :disabled="busy || !canManage || profile?.readonly">{{ first?'保存并启用':'保存配置' }}</button><button v-if="profile" class="button secondary" type="button" :disabled="busy || !canManage" @click="$emit('test')">测试已保存配置</button><button v-if="profile?.has_key && !profile?.readonly" class="button text-action" type="button" :disabled="busy || !canManage" @click="clearCredential">删除凭据</button></footer></form>
</template>
<style scoped>
.profile-editor { display:flex;flex-direction:column;gap:16px;min-width:0;min-height:0;flex:1; }fieldset { border:0;padding:0 8px 0 0;margin:0;min-width:0;min-height:0;overflow:auto;overscroll-behavior:contain;flex:1; }.editor-grid { display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px 20px; }.wide { grid-column:1/-1; }label { display:grid;gap:6px;font-size:14px; }.advanced { padding-top:12px; }footer { display:flex;gap:8px;flex-wrap:wrap;flex:none;padding-top:10px;background:var(--bg-surface); }@media(max-width:600px) { .editor-grid { grid-template-columns:minmax(0,1fr); } }
</style>
