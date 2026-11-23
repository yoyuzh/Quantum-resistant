import { batchScope, coverageName, label, originName, purposeName, stageText, statuses } from './repositoryAtlas.js';
import { coverageText, formatTime } from './results.js';
import { repositoryCategories } from './repositoryCategories.js';

function plain(value) {
  return String(value ?? '未知').replace(/[\r\n\t]+/g, ' ').replace(/&/g, '&amp;')
    .replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/[\\|\x60*_[\]#!~]/g, '\\$&');
}

function table(lines, headers, rows) {
  lines.push('| ' + headers.join(' | ') + ' |', '| ' + headers.map(() => '---').join(' | ') + ' |');
  for (const row of rows) lines.push('| ' + row.map(plain).join(' | ') + ' |');
  lines.push('');
}

function failureReason(item) {
  // Historic snapshots can contain raw exceptions. Export only the recognized cause.
  const message = item.error || '';
  if (item.code === 'timeout' || /超时/.test(message)) return '扫描超时';
  if (/限制访问|请求过多|限流/.test(message)) return '远程服务限流';
  if (/权限|拒绝访问|拒绝公开访问/.test(message)) return '远程访问被拒绝';
  if (/没有采集到|未找到可扫描/.test(message)) return '没有可扫描文件';
  if (/代理|无法建立远程连接|连接失败/.test(message)) return '远程连接失败';
  if (/格式|编码/.test(message)) return '响应格式或编码异常';
  return item.code === 'collection_error' ? '仓库采集失败' : '未完成';
}

export function inventoryFilename(time) {
  const date = new Date(time || NaN);
  const stamp = Number.isFinite(date.valueOf()) ? new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Shanghai', dateStyle: 'short', timeStyle: 'medium', hour12: false,
  }).format(date).replace(/[-:]/g, '').replace(' ', '-') : '时间未知';
  return '多仓库密码算法清单-' + stamp + '.md';
}

export function inventoryMarkdown(atlas) {
  const { batch, rows } = atlas;
  const library = batch.schema_version === 1;
  const lines = [library ? '# 仓库资料库清单' : '# 多仓库密码算法清单', '', '抗量子密码风险检测与迁移辅助软件', '', library ? '## 资料库范围' : '## 批次概况', '',
    (library ? '最近扫描时间（北京时间） ' : '扫描时间（北京时间） ') + formatTime(batch.scanned_at), '',
    '样本条件　' + plain(batch.meta?.query || '未知'), '', batchScope(atlas), ''];
  if (batch.meta?.incomplete || batch.meta?.timed_out) lines.push(rows.length ? '批次部分完成。' : '批次未完成。', '');
  lines.push('可比较仓库数按判断来源统计。部分扫描仅计已分析文件。', '', '## 算法覆盖', '');
  if (atlas.algorithms.length) {
    const summary = atlas.modes.flatMap(mode => atlas.rankings[mode].map(r =>
      [r.algorithm, label(mode), r.hits + ' / ' + r.eligible, r.partial,
        mode === 'legacy' || !r.eligible ? '未知' : r.total]));
    table(lines, ['算法', '判断来源', '检出 / 可比较仓库', '其中部分扫描', '记录数'], summary);
  } else lines.push(rows.length ? '本批次没有记录算法。' : '无可用仓库结果。', '');
  lines.push('## 逐仓清单', '');
  for (const category of repositoryCategories(rows)) {
    lines.push('### ' + category.label + '（' + category.rows.length + ' 仓）', '');
    for (const row of category.rows) {
      const repo = row.repo;
      const name = plain(repo.full_name);
      const validName = /^[\w.-]+\/[\w.-]+$/.test(repo.full_name) && !repo.full_name.split('/').some(part => part === '.' || part === '..');
      lines.push('#### ' + (validName ? '[' + name + '](https://github.com/' + repo.full_name + ')' : name), '',
        [repo.coverage && coverageName(repo), coverageText(repo.coverage),
          '迁移评分 ' + (repo.analysis_summary?.migration_score ?? repo.migration_score ?? '未知')].filter(Boolean).join('，'), '');
      if (repo.scanned_at) lines.push('仓库扫描时间（北京时间） ' + formatTime(repo.scanned_at) +
        '，规则 ' + plain(repo.rules_version) + '，提交 ' + plain(repo.revision || '未记录'), '');
      if (!repo.algorithm_inventory) {
        lines.push('基础发现 ' + (repo.finding_count ?? '未知') + ' 项；基础检出算法 ' +
          (row.legacy ? row.algorithms.map(plain).join('、') || '无' : '未知') + '。分组数量未知。', '');
        if (repo.analysis_summary) {
          lines.push(statuses.map(s => label(s) + ' ' + (repo.analysis_summary[s] ?? '未知')).join('，'), '');
        }
        for (const [algorithm, position] of row.historicalPositions) {
          lines.push('- ' + plain(algorithm) + ' 历史明细示例　' + plain(position));
        }
        if (!row.historicalPositions.size) lines.push('代表位置不可用。');
        lines.push('');
        continue;
      }
      lines.push(statuses.map(s => label(s) + '：' + stageText(row, s)).join('，'), '');
      if (!row.groups.length) { lines.push('已评估范围内零发现。', ''); continue; }
      const uses = new Map();
      for (const group of row.groups) {
        const key = JSON.stringify([group.algorithm, group.purpose, group.origin]);
        if (!uses.has(key)) uses.set(key, { group, counts: {}, examples: [] });
        const use = uses.get(key);
        use.counts[group.status] = group.count;
        const location = group.example ? group.example.path + ':' + group.example.line : '不可用';
        use.examples.push(label(group.status) + ' ' + location);
      }
      table(lines, ['算法', '用途', '用途来源', ...statuses.map(label), '代表位置（每个非空判断分组至多一处）'],
        [...uses.values()].map(({group, counts, examples}) => [
          group.algorithm, purposeName(group), originName(group),
          ...statuses.map(s => counts[s] ?? (row.count(group.algorithm, s) === null ? '未知' : 0)), examples.join('；')
        ]));
    }
  }
  lines.push('## 失败或未完成仓库', '');
  if (atlas.failures.length) table(lines, ['仓库', '原因'], atlas.failures.map(f => [f.full_name, failureReason(f)]));
  else lines.push(atlas.failed ? '失败原因未记录。' : '共 0 个。', '');
  return lines.join('\n');
}
