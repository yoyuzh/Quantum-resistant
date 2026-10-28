"""Wire adapters share one bounded HTTP transport and one opinion validator."""
from __future__ import annotations

from urllib.parse import quote
from backend.ai.contracts import Opinion


def schema(test=False):
    if test:
        return {'type':'object','properties':{'ok':{'type':'boolean'}},'required':['ok'],'additionalProperties':False}
    properties=Opinion.model_json_schema()['properties']
    properties.pop('opinion_kind',None)
    def clean(value):
        if isinstance(value,dict):
            return {k:clean(v) for k,v in value.items() if k not in ('default','title')}
        if isinstance(value,list):
            return [clean(v) for v in value]
        return value
    item={'type':'object','properties':clean(properties),'required':list(properties),'additionalProperties':False}
    return {'type':'object','properties':{'opinions':{'type':'array','items':item}},'required':['opinions'],'additionalProperties':False}


def encode(config, value):
    messages=value['messages']
    test=len(messages)==1
    definition=schema(test)
    limit=value.get(config.output_parameter,8192)
    mode=config.output_mode
    if config.protocol=='chat':
        if mode=='schema':
            value['response_format']={'type':'json_schema','json_schema':{'name':'crypto_analysis','strict':True,'schema':definition}}
        elif mode=='json':
            value['response_format']={'type':'json_object'}
        else:
            value.pop('response_format',None)
        if config.preset=='qwen' and config.reasoning_disabled:
            value['enable_thinking']=False
        return value
    system='\n'.join(m['content'] for m in messages if m['role']=='system')
    user='\n'.join(m['content'] for m in messages if m['role']=='user')
    if config.protocol=='responses':
        result={'model':config.model,'input':[{'role':'user','content':user}], 'instructions':system,
                'max_output_tokens':limit,'store':False}
        if mode!='prompt':
            result['text']={'format':({'type':'json_schema','name':'crypto_analysis','strict':True,'schema':definition}
                                      if mode=='schema' else {'type':'json_object'})}
        return result
    if config.protocol=='anthropic':
        result={'model':config.model,'system':system,'messages':[{'role':'user','content':user}],'max_tokens':limit}
        if mode=='schema':
            result['output_config']={'format':{'type':'json_schema','schema':definition}}
        return result
    result={'contents':[{'role':'user','parts':[{'text':user}]}],
            'systemInstruction':{'parts':[{'text':system}]},'generationConfig':{'maxOutputTokens':limit}}
    if mode!='prompt':
        result['generationConfig']['responseFormat']={'text':{'mimeType':'application/json',**({'schema':definition} if mode=='schema' else {})}}
    return result


def destination(config):
    paths={'chat':'chat/completions','responses':'responses','anthropic':'messages',
           'gemini':'models/'+quote(config.model.removeprefix('models/'),safe='')+':generateContent'}
    headers={'Content-Type':'application/json','Accept-Encoding':'identity'}
    if config.api_key and config.auth_mode!='none':
        headers['Authorization' if config.auth_mode=='bearer' else config.auth_mode]=('Bearer ' if config.auth_mode=='bearer' else '')+config.api_key
    if config.protocol=='anthropic':
        headers['anthropic-version']='2023-06-01'
    return config.base_url+paths[config.protocol],headers


def decode(config,value):
    # Return a uniform finish type and authoritative usage; never return reasoning blocks.
    if config.protocol=='chat':
        choice=value['choices'][0];usage=value.get('usage',{})
        return choice['message'].get('content'),choice.get('finish_reason'),usage
    if config.protocol=='responses':
        outputs=[c for item in value.get('output',[]) for c in item.get('content',[])]
        if any(c.get('type')=='refusal' for c in outputs):
            return '', 'refusal', {}
        usage=value.get('usage',{})
        return ''.join(c.get('text','') for c in outputs if c.get('type')=='output_text'),('stop' if value.get('status')=='completed' else 'length'),{
            'prompt_tokens':usage.get('input_tokens'),'completion_tokens':usage.get('output_tokens'),'total_tokens':usage.get('total_tokens')}
    if config.protocol=='anthropic':
        usage=value.get('usage',{})
        parts=[usage.get(k,0) for k in ('input_tokens','cache_creation_input_tokens','cache_read_input_tokens')]
        prompt=sum(parts) if all(type(p) is int for p in parts) and 'input_tokens' in usage else None
        completion=usage.get('output_tokens')
        finish={'end_turn':'stop','refusal':'refusal','max_tokens':'length'}.get(value.get('stop_reason'),'invalid')
        return ''.join(b.get('text','') for b in value.get('content',[]) if b.get('type')=='text'),finish,{
            'prompt_tokens':prompt,'completion_tokens':completion,'total_tokens':prompt+completion if prompt is not None and type(completion) is int else None}
    if value.get('promptFeedback',{}).get('blockReason'):
        return '', 'refusal', {}
    candidate=value['candidates'][0];usage=value.get('usageMetadata',{})
    finish={'STOP':'stop','MAX_TOKENS':'length','SAFETY':'refusal','RECITATION':'refusal'}.get(candidate.get('finishReason'),'invalid')
    completion=usage.get('candidatesTokenCount')
    if type(completion) is int:
        completion+=usage.get('thoughtsTokenCount',0)
    return ''.join(p.get('text','') for p in candidate.get('content',{}).get('parts',[]) if not p.get('thought')),finish,{
        'prompt_tokens':usage.get('promptTokenCount'),'completion_tokens':completion,'total_tokens':usage.get('totalTokenCount')}
