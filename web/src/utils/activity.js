import { elapsedSeconds } from './progress.js';

export function elapsedStamp(value) {
  const seconds = elapsedSeconds(value);
  return String(Math.floor(seconds/60)).padStart(2,'0')+':'+String(seconds%60).padStart(2,'0');
}

export function batchWaiting(progress) {
  const activity=progress?.activity;
  if (activity?.waiting_since == null) return 0;
  const seconds=(progress.elapsed || 0)-activity.waiting_since;
  return Number.isFinite(seconds)?Math.max(0,Math.floor(seconds)):0;
}

export function activityHistory(progress) {
  const key=item=>JSON.stringify([item?.action,item?.files || [],item?.repository]);
  const seen=new Set([key(progress?.activity)]),history=[];
  for (const item of [...(progress?.activity_log || [])].reverse()) {
    if (!seen.has(key(item))) {
      seen.add(key(item));history.unshift(item);
      if (history.length===2) break;
    }
  }
  return history;
}
