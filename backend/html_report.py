"""Self-contained, script-free report. Every evidence value is escaped."""
from __future__ import annotations

from html import escape
from backend.analysis import METHOD_LABELS
from backend.report_exports import build_json_report
from backend.reporting import SOURCE_LABELS


def text(value: object) -> str:
    return escape(str(value), quote=True)


def table(headers: list[str], rows: list[list[object]]) -> str:
    return ('<table><thead><tr>' + ''.join(f'<th>{text(h)}</th>' for h in headers)
            + '</tr></thead><tbody>' + ''.join('<tr>' + ''.join(f'<td>{text(c)}</td>' for c in row)
            + '</tr>' for row in rows) + '</tbody></table>')


def chart(title: str, rows: list[dict], denominator: int) -> str:
    maximum = max([r['count'] for r in rows] or [1]) or 1
    items = []
    for row in rows:
        width = round(row['count'] / maximum * 400, 2)
        label = row['label'] + (f" ({row['key']})" if title == '受影响文件 Top 8' else '')
        items.append(f'<div class="chart-row"><span>{text(label)}</span>'
                     f'<svg viewBox="0 0 400 14" role="img" aria-label="{text(row["count"])} 项">'
                     f'<rect width="400" height="14" rx="7" fill="#eaf2f5"/>'
                     f'<rect width="{width}" height="14" rx="7" fill="#0c857b"/></svg>'
                     f'<strong>{row["count"]}</strong></div>')
    return f'<h3>{text(title)}</h3>' + ''.join(items)


def build_html_report(**payload) -> str:
    import json
    from backend.report_presentation import BOUNDARIES, key_conclusions, scope_status
    report = build_json_report(**payload)
    analysis, summary = report['analysis'], report['summary']
    insights, coverage = analysis['insights'], report['coverage']
    sections = []
    def section(identity, title, body):
        sections.append(f'<section id="{identity}"><h2>{text(title)}</h2>{body}</section>')
    metrics = [('发现', summary['finding_count']), ('受影响文件', insights['affected_files']),
               ('主要算法', insights['algorithms'][0]['label'] if insights['algorithms'] else '无'),
               ('迁移优先级', summary['migration_score']['priority'])]
    body = '<div class="metrics">' + ''.join(f'<div><span>{text(k)}</span><strong>{text(v)}</strong></div>' for k, v in metrics) + '</div>'
    body += '<ul>' + ''.join(f'<li>{text(c)}</li>' for c in key_conclusions(analysis)) + '</ul>'
    body += f'<p class="scope-status">{text(scope_status(coverage))}</p>'
    section('summary', '摘要与关键结论', body)
    section('scope', '扫描范围', table(['已分析文件', '候选文件', '跳过文件'], [[
        (coverage or {}).get('scanned_files', summary['source_count']),
        (coverage or {}).get('candidate_files') if (coverage or {}).get('candidate_files') is not None else '未知',
        (coverage or {}).get('skipped_files', '未知')]]))
    body = f'<p class="muted">统计分母：本次全部 {len(report["findings"])} 项发现</p>'
    body += ''.join(chart(title, insights[key], len(report['findings'])) for key, title in
                   [('algorithms', '算法命中分布'), ('files', '受影响文件 Top 8'), ('purposes', '用途分类')])
    if insights['other_files']:
        body += f'<p>其余 {insights["other_files"]} 个命中文件，共 {insights["other_findings"]} 项发现。</p>'
    section('charts', '主要统计', body)
    section('assets', '密码资产清单', table(['文件 / 身份', '算法 / 用途', '命中', '技术依据 / 参考'], [
        [f"{a['file_name']} ({a['source_id']})", f"{a['algorithm']} / {a['purpose']}", a['finding_count'],
         '；'.join(['识别：' + ' / '.join(METHOD_LABELS.get(m, '未记录') for m in a['detection_methods']),
                   '密码库：' + (' / '.join(a['libraries']) or '未记录'),
                   'API：' + (' / '.join(a['resolved_apis']) or '未记录'), '参考：' + ' / '.join(a['targets'])])]
        for a in analysis['assets']]))
    section('evidence', '发现明细', ''.join(
        f'<article><h3>{i + 1}. {text(f["algorithm"])} · 第 {text(f["line"])} 行 · {text(f["risk_level"])}</h3>'
        f'<p class="file-name">{text(f["file_name"])}</p><pre>{text(f["evidence"])}</pre>'
        + '<dl class="evidence-meta">' + ''.join(f'<dt>{text(k)}</dt><dd>{text(v)}</dd>' for k, v in [
            ['文件身份', f['source_id']], ['识别方式', METHOD_LABELS.get(f.get('detection_method'), '未记录') + (f" ({f['detection_method']})" if f.get('detection_method') else '')],
            ['来源', f.get('source_type') or '未记录'],
            ['密码库', f.get('library') or '未记录'], ['完整 API', f.get('resolved_api') or '未记录']]) + '</dl>'
        + f'<p>原因：{text(f["reason"])}</p><p>迁移参考：{text(f["recommendation"])}</p></article>'
        for i, f in enumerate(report['findings'])) or '<p>未发现已知量子脆弱公钥算法用法。</p>')
    section('migration', '迁移待办', ''.join(
        f'<article><h3>{text(m["algorithm"])} · {m["affected_files"]} 个文件 / {m["finding_count"]} 项发现</h3>'
        f'<p>{text(m["purpose"])} · 参考：<strong>{text(" / ".join(m["targets"]))}</strong></p><ol>'
        + ''.join(f'<li><strong>{text(a["title"])}</strong>：{text(a["description"])}</li>' for a in m['actions'])
        + f'</ol><a href="{text(m["reference_url"])}">NIST 标准参考</a></article>'
        for m in analysis['migrations']) or '<p>无迁移待办。</p>')
    details = '<h3>评分与能力边界</h3>' + f'<p>迁移评分 {summary["migration_score"]["score"]}/100</p><ul>'
    details += ''.join(f'<li>{text(line)}</li>' for line in BOUNDARIES) + '</ul>'
    details += chart('识别依据', insights['methods'], len(report['findings']))
    details += '<h3>范围详情</h3>' + table(['字段', '值'], [[k, json.dumps(v, ensure_ascii=False) if isinstance(v, (dict, list)) else v] for k, v in (coverage or {}).items()])
    details += '<h3>文件元信息</h3>' + table(['文件', '元信息'], [[s.get('file_name', ''), json.dumps(s, ensure_ascii=False)] for s in report['sources']])
    details += '<h3>扫描诊断</h3>' + table(['提示', '完整诊断'], [[d.get('message', ''), json.dumps(d, ensure_ascii=False)] for d in report['diagnostics']])
    section('notes', '附录', details)
    nav = ' · '.join(f'<a href="#{i}">{name}</a>' for i, name in [('summary', '摘要'), ('scope', '范围'), ('charts', '统计'), ('assets', '资产'), ('evidence', '证据'), ('migration', '迁移'), ('notes', '附录')])
    return '<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' \
        + '<title>抗量子迁移分析报告</title><style>' + STYLE + '</style><body><main><header><h1>抗量子迁移分析报告</h1>' \
        + f'<p class="muted">{text(SOURCE_LABELS.get(report["source_type"], report["source_type"]))} · {text(report["scanned_at"])}（北京时间）</p></header><nav>' + nav + '</nav>' + ''.join(sections) + '</main></body></html>'


STYLE = """
*{box-sizing:border-box}body{margin:0;background:#eef4f7;color:#213342;font:14px/1.7 'Microsoft YaHei','Segoe UI',sans-serif}
main{max-width:1040px;margin:32px auto;background:white;padding:40px;border-radius:16px}h1{font-size:30px}h2{font-size:21px;color:#087b72;margin-top:32px}h3{font-size:16px}
a{color:#087b72}nav{padding:16px;background:#eff8f7}p,td,li,span{overflow-wrap:anywhere}.muted{color:#526879;font-size:12px}
table{width:100%;border-collapse:collapse;table-layout:fixed;font-size:12px}th,td{text-align:left;vertical-align:top;padding:10px;border-bottom:1px solid #e1eaee}th{background:#eff4f7}
article{padding:12px 0;border-bottom:1px solid #e1eaee}pre{white-space:pre-wrap;overflow-wrap:anywhere;background:#f3f7f9;padding:12px;font-size:14px}
.chart-row{display:grid;grid-template-columns:minmax(0,1fr) minmax(100px,1.2fr) 48px;align-items:center;gap:16px;font-size:14px;margin:10px 0}.chart-row svg{width:100%;height:14px}.chart-row strong{text-align:right}
.metrics{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.metrics div{padding:12px;background:#eff8f7}.metrics span{display:block;font-size:12px;color:#526879}.metrics strong{display:block;font-size:24px;overflow-wrap:anywhere}.scope-status{padding:12px;border-left:3px solid #0c857b;background:#eff8f7}.file-name{font-weight:600}.evidence-meta{display:grid;grid-template-columns:80px minmax(0,1fr);gap:4px 12px;font-size:12px;color:#526879}.evidence-meta dd{margin:0;overflow-wrap:anywhere}
@page{size:A4;margin:16mm}@media print{body{background:white;font-size:11px}main{margin:0;padding:0;max-width:none}nav,.print-help{display:none}h2,h3{break-after:avoid}thead{display:table-header-group}tr,.chart-row{break-inside:avoid}article{break-inside:auto}a{color:inherit;text-decoration:none}svg,th{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
@media(max-width:600px){.metrics{grid-template-columns:repeat(2,minmax(0,1fr))}main{margin:0;padding:20px}.chart-row{gap:8px;grid-template-columns:minmax(0,1fr) minmax(70px,1fr) 30px}}
"""
