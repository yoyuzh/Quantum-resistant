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
    return f'<h3>{text(title)}</h3><p class="muted">统计分母：本次全部 {denominator} 项发现</p>' + ''.join(items)


def build_html_report(**payload) -> str:
    report = build_json_report(**payload)
    analysis, summary = report['analysis'], report['summary']
    insights = analysis['insights']
    coverage = report['coverage'] or {}
    sections = []
    def section(identity, title, body):
        sections.append(f'<section id="{identity}"><h2>{title}</h2>{body}</section>')
    section('summary', '关键结论', '<ul>' + ''.join(f'<li>{text(c)}</li>' for c in insights['conclusions']) + '</ul>')
    section('scope', '扫描范围', table(['项目', '本次数据'], [
        ['实际分析文件', summary['source_count']], ['候选文件', coverage.get('candidate_files') if coverage.get('candidate_files') is not None else '未知'],
        ['未扫描候选', coverage.get('skipped_files', '未知')], ['部分采集', '是' if coverage.get('partial') else '否 / 以诊断为准'],
        ['迁移评分', f"{summary['migration_score']['score']}/100（启发式优先级，不是风险概率）"],
    ]) + '<p>扫描只覆盖本次采集和已支持的识别规则；零发现不代表整个项目没有相关用法。</p>')
    body = ''.join(chart(title, insights[key], len(report['findings'])) for key, title in
                   [('algorithms', '算法命中分布'), ('files', '受影响文件 Top 8'), ('methods', '识别方式分布'), ('purposes', '用途分类')])
    body += f'<p>其余 {insights["other_files"]} 个命中文件，共 {insights["other_findings"]} 项发现。</p>'
    section('charts', '统计图表', body)
    section('assets', '密码资产清单', table(['文件 / 身份', '算法 / 用途', '命中数', '识别依据 / API'], [
        [f"{a['file_name']} ({a['source_id']})", f"{a['algorithm']} / {a['purpose']}", a['finding_count'],
         ' / '.join([*(METHOD_LABELS.get(m, '未记录') for m in a['detection_methods']), *a['resolved_apis']])]
        for a in analysis['assets']]))
    section('migration', '迁移待办', '<p>ML-KEM 用于密钥封装；ML-DSA、SLH-DSA 用于数字签名。需结合实际协议与用途选型，不能直接替换任意 API。</p>' + ''.join(
        f'<article><h3>{text(m["algorithm"])} · {m["affected_files"]} 个文件 / {m["finding_count"]} 项发现</h3>'
        f'<p>{text(m["purpose"])}：{text(" / ".join(m["targets"]))}</p><ul>'
        + ''.join(f'<li><strong>{text(a["title"])}</strong>：{text(a["description"])}</li>' for a in m['actions']) + '</ul></article>'
        for m in analysis['migrations']))
    section('evidence', '发现明细', ''.join(
        f'<article><h3>{i + 1}. {text(f["algorithm"])} · 第 {f["line"]} 行</h3>'
        f'<p>{text(f["file_name"])} · {text(f["source_id"])}</p><pre>{text(f["evidence"])}</pre>'
        f'<p>识别方式：{text(METHOD_LABELS.get(f.get("detection_method"), "未记录"))}；API：{text(f.get("resolved_api") or "未记录")}</p>'
        f'<p>{text(f["reason"])}</p><p>迁移参考：{text(f["recommendation"])}</p></article>'
        for i, f in enumerate(report['findings'])) or '<p>没有命中发现。</p>')
    section('notes', '诊断与能力边界', '<ul>' + ''.join(f'<li>{text(d["message"])}</li>' for d in report['diagnostics'])
            + f'</ul><p>{text(report["scope_note"])}</p><p>用途分类是静态参考，非完整供应链依赖或风险传播分析。</p>'
            + '<p>标准参考：<a href="https://csrc.nist.gov/projects/post-quantum-cryptography">NIST 后量子密码标准</a></p>')
    nav = ' · '.join(f'<a href="#{i}">{name}</a>' for i, name in [('summary', '结论'), ('scope', '范围'), ('charts', '图表'), ('assets', '资产'), ('migration', '迁移'), ('evidence', '明细'), ('notes', '边界')])
    return '<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' \
        + '<title>抗量子迁移分析报告</title><style>' + STYLE + '</style><body><main><header><p class="muted">密码资产 · 静态证据 · 迁移参考</p><h1>抗量子迁移分析报告</h1>' \
        + f'<p>来源：{text(SOURCE_LABELS.get(report["source_type"], report["source_type"]))} · 扫描时间：{text(report["scanned_at"])}（北京时间）</p>' \
        + '<p class="print-help">本报告可离线阅读。使用浏览器“打印”，选择“另存为 PDF”。</p></header><nav>' + nav + '</nav>' + ''.join(sections) + '</main></body></html>'


STYLE = """
*{box-sizing:border-box}body{margin:0;background:#eef4f7;color:#213342;font:15px/1.7 'Microsoft YaHei','Segoe UI',sans-serif}
main{max-width:1040px;margin:32px auto;background:white;padding:40px;border-radius:16px}h1{font-size:30px}h2{font-size:21px;color:#087b72;margin-top:32px}h3{font-size:16px}
a{color:#087b72}nav{padding:16px;background:#eff8f7}p,td,li,span{overflow-wrap:anywhere}.muted{color:#526879;font-size:13px}
table{width:100%;border-collapse:collapse;table-layout:fixed;font-size:13px}th,td{text-align:left;vertical-align:top;padding:10px;border-bottom:1px solid #e1eaee}th{background:#eff4f7}
article{padding:12px 0;border-bottom:1px solid #e1eaee}pre{white-space:pre-wrap;overflow-wrap:anywhere;background:#f3f7f9;padding:12px;font-size:12px}
.chart-row{display:grid;grid-template-columns:minmax(0,1fr) minmax(100px,1.2fr) 48px;align-items:center;gap:16px;font-size:12px;margin:10px 0}.chart-row svg{width:100%;height:14px}.chart-row strong{text-align:right}
@page{size:A4;margin:16mm}@media print{body{background:white;font-size:11px}main{margin:0;padding:0;max-width:none}nav,.print-help{display:none}h2,h3{break-after:avoid}thead{display:table-header-group}tr,.chart-row{break-inside:avoid}article{break-inside:auto}a{color:inherit;text-decoration:none}svg,th{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
@media(max-width:600px){main{margin:0;padding:20px}.chart-row{gap:8px;grid-template-columns:minmax(0,1fr) minmax(70px,1fr) 30px}}
"""
