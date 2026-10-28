"""Exports built from the saved server result, including pending evidence."""
from __future__ import annotations

import csv
from html import escape
import io
import json

from fastapi import APIRouter, HTTPException
from fastapi.responses import Response

from backend import task_routes
from backend.integration import project
from backend.report_exports import csv_cell
from backend.migration_directions import PURPOSES, effective_purpose

router = APIRouter()


@router.get('/api/tasks/{identity}/report/{format}')
def export(identity: str, format: str, repository_id: str | None = None):
    if format not in ('html', 'markdown', 'json', 'csv'):
        raise HTTPException(400, '不支持的报告格式')
    with task_routes.store.read_job(identity) as job:
        if job.ended is None:
            raise HTTPException(409, '请等待分析结束后导出')
        base = task_routes.store.checkpoint(identity)
        if repository_id:
            with task_routes.store.lock:
                record=getattr(job.control,'popular_snapshots',{}).get(repository_id)
                if not record:
                    raise HTTPException(404,'仓库结果不存在或已过期')
                base=json.loads(record['path'].read_text(encoding='utf-8'))
    value = project(base)
    sources = [{k: v for k, v in source.items() if k != 'content'} for source in value.get('sources', [])]
    rows = value.get('findings', [])
    headers = ['文件', '行号', '算法', '确认状态', '用途', '证据', '说明', '复核意见', '研判模型']
    def status(row):
        return {'confirmed':'静态确认','ai_assessed':'AI研判','pending':'证据不足'}.get(row.get('verification_status'),'静态确认')
    def cells(row):
        return [row['file_name'], row['line'], row['algorithm'], status(row),
                PURPOSES.get(effective_purpose(row),'用途待确认') + ('（AI用途研判）' if row.get('purpose_origin')=='ai' else ''), row['evidence'], row['reason'],
                '；'.join(o['rationale'] for o in row.get('opinions', [])),
                '；'.join(dict.fromkeys(str(o.get('model_origin', {}).get('model') or '未记录') for o in row.get('opinions', [])))]
    if format == 'json':
        content = json.dumps({**base, 'sources': sources}, ensure_ascii=False, indent=2)
        mime = 'application/json'
    elif format == 'csv':
        output = io.StringIO(newline='')
        writer = csv.writer(output)
        writer.writerow(headers)
        writer.writerows([[csv_cell(v) for v in cells(row)] for row in rows])
        content, mime = '\ufeff' + output.getvalue(), 'text/csv'
    else:
        summary = value.get('summary', {})
        changes = value.get('integrated_analysis', {}).get('changes', {})
        intro = f"静态确认 {summary.get('finding_count', 0)} 项；AI研判 {changes.get('ai_assessed',0)} 项；证据不足 {changes.get('pending', 0)} 项。迁移评分仅按静态确认计算。"
        boundary = '本报告只覆盖本次输入和完整完成的分析。静态关联不证明实际运行，模型引用有效不代表语义正确。'
        analysis = value.get('analysis', {})
        sections = [('发现明细', headers, [cells(row) for row in rows]),
                    ('资产清单', ['文件','算法','状态','发现数','迁移方向'],
                     [[a['file_name'],a['algorithm'],status(a),a['finding_count'],' / '.join(a['targets']) or '；'.join(r['label']+'（有条件参考）' for r in a.get('migration_references',[])) or '用途待确认'] for a in analysis.get('assets',[])]),
                    ('迁移待办', ['算法','用途','状态','文件数','方向','操作'],
                     [[a['algorithm'],a.get('purpose','用途待确认'),status(a),a['affected_files'],' / '.join(a['targets']) or '；'.join(r['label']+'（有条件参考）' for r in a.get('migration_references',[])) or '先确认用途','；'.join(v['description'] for v in a['actions'])] for a in analysis.get('migrations',[])]),
                    ('跨文件调用', ['来源','行号','算法','用途','状态'],
                     [[a['source_id'],a['line'],a['algorithm'],a['purpose'],status(a)] for a in value.get('integrated_analysis',{}).get('calls',[])])]
        runs = base.get('ai_analysis', {}).get('runs', [])
        if runs:
            sections.append(('模型运行', ['配置', '模型', '调用数', '实际token'],
                             [[run.get('profile_name') or '未记录', run.get('model') or '未记录',
                               run.get('calls', 0), (run.get('usage') or {}).get('total_tokens') if (run.get('usage') or {}).get('total_tokens') is not None else '未知']
                              for run in runs]))
        if format == 'html':
            def table(title, labels, records):
                return '<h2>'+escape(title)+'</h2><table><thead><tr>'+''.join('<th>'+escape(h)+'</th>' for h in labels)+'</tr></thead><tbody>'+''.join('<tr>'+''.join('<td>'+escape(str(v))+'</td>' for v in record)+'</tr>' for record in records)+'</tbody></table>'
            body = ''.join(table(*section) for section in sections)
            content = '<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>扫描报告</title><style>body{font:14px/1.6 system-ui;margin:24px;color:#18302d}table{border-collapse:collapse;width:100%}td,th{border:1px solid #c9d8d5;padding:8px;text-align:left;overflow-wrap:anywhere}thead{display:table-header-group}tr{break-inside:avoid}@media print{body{margin:0}}</style><h1>抗量子密码风险检测与迁移辅助软件</h1><p>' + escape(intro) + '</p><p>' + escape(boundary) + '</p>' + body + '</html>'
            mime = 'text/html'
        else:
            def cell(v):
                return escape(str(v)).replace('|', '\\|').replace('\n', ' ↵ ')
            content = '# 抗量子密码风险检测与迁移辅助软件 扫描报告\n\n' + intro + '\n\n' + boundary + '\n\n'
            for title, labels, records in sections:
                content += '## '+title+'\n\n| ' + ' | '.join(labels) + ' |\n|' + '---|' * len(labels) + '\n'
                content += '\n'.join('| ' + ' | '.join(cell(v) for v in record) + ' |' for record in records)+'\n\n'
            mime = 'text/markdown'
    extension = 'md' if format == 'markdown' else format
    return Response(content, media_type=mime, headers={'Cache-Control': 'no-store',
                    'Content-Disposition': f'attachment; filename="quantum-integrated-report.{extension}"'})
