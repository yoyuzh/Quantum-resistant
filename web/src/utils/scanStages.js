import { progressRows } from './progress.js';

export const scanStages = ['采集', '规则分析', '跨文件核验', '模型复核', '结果整理'];
export function scanStage(progress = {}, assisting = false) {
  progress ||= {};
  const stage = progress.stage || '';
  let index = 0;
  if (['succeeded', 'partial', 'failed', 'cancelled'].includes(progress.state) || stage === '结果整理') index = 4;
  else if (assisting || progress.ai_running || /AI|模型/.test(stage)) index = 3;
  else if (/跨文件/.test(stage)) index = 2;
  else if (/静态分析|规则|汇总|分析文件|读取与分析/.test(stage)) index = 1;
  const ai = progress.ai_progress;
  let row = index === 3 ? (ai ? { label: '问题组', value: ai.completed, total: ai.discovered,
    percent: ai.discovered > 0 ? Math.min(100, Math.floor(ai.completed / ai.discovered * 100)) : null } : null) : progressRows(progress).at(-1);
  if (index >= 2 && index !== 3) row = null;
  const activity = progress.activity;
  if (index === 2 && activity?.total > 0) row = {label:'模块索引',value:activity.completed,total:activity.total,
    percent:Math.min(100,Math.floor(activity.completed/activity.total*100))};
  const title = index === 4 ? '正在整理结果' : index === 3 && !/AI|模型/.test(stage)
    ? (progress.state === 'queued' ? '等待模型复核' : '准备模型复核') : stage || (progress.state === 'queued' ? '等待执行' : '正在准备扫描');
  return { index, title, row };
}
