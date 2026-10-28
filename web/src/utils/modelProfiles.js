export function modelStatus(profile) {
  if(profile?.loading)return '读取配置中';
  if(profile?.load_error)return '无法读取配置';
  if(!profile?.profile_id && !profile?.id)return '未启用模型';
  if(profile.credential_unavailable)return '凭据未恢复';
  if(!profile.has_key && profile.auth_mode!=='none')return '缺少密钥';
  if(!profile.consent)return '未授权发送';
  const state=profile.connection?.status;
  if(state==='provider_auth')return '鉴权失败';
  if(state==='provider_balance')return '额度不足';
  if(state==='tested')return '连接测试通过';
  if(state==='success')return '最近调用成功';
  if(state && state!=='untested')return '最近连接失败';
  return profile.ready?'已配置 · 未测试':'配置不完整';
}
