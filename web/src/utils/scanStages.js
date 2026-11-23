import { progressRows } from './progress.js';
import { batchWaiting } from './activity.js';

export const scanStages = ['采集', '规则分析', '跨文件核验', '模型复核', '结果整理'];

export function completedModelProgress(progress) {
  if (progress?.status === 'completed' && progress.discovered > 0 && progress.completed === progress.discovered)
    return progress;
  return null;
}

function modelRow(ai) {
  return ai ? { label: '已复核组数', value: ai.completed, total: ai.discovered,
    percent: ai.discovered > 0 ? Math.min(100, Math.floor(ai.completed / ai.discovered * 100)) : null } : null;
}

function modelDetail(progress, waiting) {
  const active = progress.ai_progress?.active_groups;
  if (active) return `${active} 组等待模型回复（${waiting} 秒）`;
  return progress.activity?.action || '';
}

export function modelCompletionStage(ai, index) {
  return { index, title: '模型复核完成', row: modelRow(ai), icon: 1 };
}
export function libraryScanStages(progress) {
  const start = progress?.library_recheck ? ['准备复查'] : progress?.library_refresh ? ['准备更新'] : ['检索候选', 'AI 筛选'];
  return [...start, '扫描仓库', ...(progress?.purpose_review ? ['用途复核'] : []), '资料入库'];
}

export function libraryScanStage(progress = {}, waiting = batchWaiting(progress)) {
  const title = progress?.stage || '正在准备扫描';
  const total = progress?.total_repos;
  const completed = progress?.completed_repos ?? 0;
  const stages = libraryScanStages(progress);
  const reviewing = progress?.purpose_review && (progress.ai_running || /^模型上下文准备/.test(title));
  const saving = title === '保存仓库资料库' || title === '结果整理' || title === '已结束';
  const index = saving ? stages.length - 1 : reviewing ? stages.indexOf('用途复核')
    : total > 0 ? stages.indexOf('扫描仓库') : title === 'AI 筛选仓库' ? 1 : 0;
  const ai = progress?.ai_progress;
  let row = null;
  if (reviewing && !saving) row = modelRow(ai);
  else if (!saving && !reviewing && total > 0) row = { label: '已处理仓库', value: completed, total,
    percent: Math.min(100, Math.floor(completed / total * 100)) };
  const detail = reviewing && !saving ? modelDetail(progress, waiting) : title === 'AI 筛选仓库' && progress.discovery_candidates != null
    ? `${progress.discovery_candidates} 个候选仓库` : '';
  return { index, title, row, detail, modelWaiting: reviewing && !saving && ai?.active_groups > 0,
    icon: reviewing || title === 'AI 筛选仓库' ? 1 : total > 0 ? 2 : 0 };
}

export function scanStage(progress = {}, assisting = false, waiting = batchWaiting(progress)) {
  progress ||= {};
  const stage = progress.stage || '';
  let index = 0;
  if (['succeeded', 'partial', 'failed', 'cancelled'].includes(progress.state) || stage === '结果整理') index = 4;
  else if (assisting || progress.ai_running || /AI|模型/.test(stage)) index = 3;
  else if (/跨文件/.test(stage)) index = 2;
  else if (/静态分析|规则|汇总|分析文件|读取与分析/.test(stage)) index = 1;
  const ai = progress.ai_progress;
  let row = index === 3 ? modelRow(ai) : progressRows(progress).at(-1);
  if (index >= 2 && index !== 3) row = null;
  const activity = progress.activity;
  if (index === 2 && activity?.total > 0) row = {label: activity.action === '核验跨文件调用' ? '已检查调用' : '已索引模块', value:activity.completed,total:activity.total,
    percent:Math.min(100,Math.floor(activity.completed/activity.total*100))};
  const title = index === 4 ? '正在整理结果' : index === 3 && !/AI|模型/.test(stage)
    ? (progress.state === 'queued' ? '等待模型复核' : '准备模型复核') : stage || (progress.state === 'queued' ? '等待执行' : '正在准备扫描');
  return { index, title, row, detail: index === 3 ? modelDetail(progress, waiting) : '', modelWaiting: index === 3 && ai?.active_groups > 0 };
}
