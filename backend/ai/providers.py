"""Explicit provider defaults; never probe protocols or switch destinations."""
from __future__ import annotations


def preset(identity, name, url, model='', protocol='chat', auth='bearer', output='json', **extra):
    return dict(id=identity, name=name, base_url=url, model=model, protocol=protocol,
                auth_mode=auth, output_mode=output, **extra)


PROVIDERS = [
    preset('deepseek','DeepSeek','https://api.deepseek.com/v1','deepseek-flash'),
    preset('openai','OpenAI','https://api.openai.com/v1',protocol='responses',output='schema'),
    preset('azure','Azure OpenAI','',protocol='responses',auth='api-key',output='schema'),
    preset('claude','Claude','https://api.anthropic.com/v1',protocol='anthropic',auth='x-api-key',output='schema'),
    preset('gemini','Gemini','https://generativelanguage.googleapis.com/v1beta',protocol='gemini',auth='x-goog-api-key',output='schema'),
    preset('qwen','阿里云百炼／通义千问','https://dashscope.aliyuncs.com/compatible-mode/v1',
           regions=[{'id':'cn','name':'中国北京','base_url':'https://dashscope.aliyuncs.com/compatible-mode/v1'},
                    {'id':'intl','name':'新加坡','base_url':'https://dashscope-intl.aliyuncs.com/compatible-mode/v1'},
                    {'id':'us','name':'美国','base_url':'https://dashscope-us.aliyuncs.com/compatible-mode/v1'},
                    {'id':'custom','name':'工作空间专属地址','base_url':''}]),
    preset('zhipu','智谱 GLM','https://open.bigmodel.cn/api/paas/v4'),
    preset('kimi','Kimi','https://api.moonshot.cn/v1'),
    preset('minimax','MiniMax','https://api.minimaxi.com/v1'),
    preset('ark','火山方舟／豆包','https://ark.cn-beijing.volces.com/api/v3'),
    preset('baidu','百度千帆','https://qianfan.baidubce.com/v2'),
    preset('hunyuan','腾讯混元','https://api.hunyuan.cloud.tencent.com/v1',output='prompt'),
    preset('tokenhub','腾讯 TokenHub','https://tokenhub.tencentcloudmaas.com/v1'),
    preset('siliconflow','SiliconFlow','https://api.siliconflow.cn/v1'),
    preset('openrouter','OpenRouter','https://openrouter.ai/api/v1'),
    preset('xai','xAI','https://api.x.ai/v1'),
    preset('mistral','Mistral','https://api.mistral.ai/v1'),
    preset('groq','Groq','https://api.groq.com/openai/v1'),
    preset('ollama','Ollama','http://localhost:11434/v1',auth='none'),
    preset('lmstudio','LM Studio','http://localhost:1234/v1',auth='none'),
    preset('compatible','自定义兼容服务','',output='prompt'),
]
BY_ID = {p['id']: p for p in PROVIDERS}


def defaults(identity):
    if identity not in BY_ID:
        raise ValueError('不支持的服务类型')
    return BY_ID[identity]
