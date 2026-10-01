from __future__ import annotations

import csv
import io
from html import escape
import unittest

from backend.html_report import build_html_report
from backend.reporting import build_markdown_report
from backend.report_exports import build_json_report, build_csv_report
from backend.scanning import build_scan_response

CODE = 'from Crypto.PublicKey import RSA\nRSA.generate(2048)'


class ReadingReportTests(unittest.TestCase):
    def payload(self):
        result = build_scan_response([('same.py', CODE), ('same.py', CODE)], 'manual_upload').model_dump()
        result.pop('summary')
        result.pop('analysis')
        return result

    def test_order_complete_evidence_and_diagnostics(self):
        payload = self.payload()
        payload['coverage']['partial'] = True
        payload['coverage']['candidate_files'] = None
        payload['diagnostics'] = [{'code': 'download_failed', 'message': '读取失败', 'path': 'lost.py'}]
        html = build_html_report(**payload)
        markdown = build_markdown_report(**payload)
        for report in (html, markdown):
            headings = ['摘要与关键结论', '扫描范围', '主要统计', '密码资产清单', '发现明细', '迁移待办', '附录']
            # HTML nav uses short labels, so headings are unambiguous.
            positions = [report.index(f'<h2>{heading}</h2>' if report is html else f'## {heading}') for heading in headings]
            self.assertEqual(positions, sorted(positions))
            self.assertLess(report.index('部分扫描'), report.index('主要统计'))
            for finding in payload['findings']:
                for field in ('source_id', 'file_name', 'algorithm', 'source_type', 'detection_method', 'library', 'resolved_api', 'reason', 'recommendation'):
                    self.assertIn(escape(str(finding[field]), quote=report is html), report)
            for value in ('download_failed', '读取失败', 'lost.py'):
                self.assertIn(value, report)
            self.assertEqual(report.count('统计分母'), 1)
            self.assertNotIn('其余 0', report)
        self.assertEqual(html.count('<article><h3>'), len(payload['findings']) + 1)

    def test_unknown_and_zero_reports_keep_boundaries_and_appendix(self):
        payload = self.payload()
        payload.update(findings=[], coverage=None)
        for report in (build_html_report(**payload), build_markdown_report(**payload)):
            self.assertIn('扫描范围未知', report)
            self.assertIn('零发现不能证明安全', report)
            self.assertIn('附录', report)
            self.assertIn('无迁移待办', report)

    def test_markdown_evidence_fences_preserve_multiline_and_backticks(self):
        payload = self.payload()
        evidence = '```\n<script>x</script>\n| original |'
        payload['findings'][0]['evidence'] = evidence
        report = build_markdown_report(**payload)
        self.assertIn('````text\n' + evidence + '\n````', report)
        self.assertNotIn('<details', report)
        self.assertNotIn('<br>', report)

    def test_reading_export_does_not_change_json_csv_or_payload(self):
        from copy import deepcopy
        payload = self.payload()
        before = deepcopy(payload)
        structured = build_json_report(**payload)
        csv_before = build_csv_report(payload['findings'])
        build_html_report(**payload)
        build_markdown_report(**payload)
        self.assertEqual(payload, before)
        self.assertEqual(build_json_report(**payload), structured)
        self.assertEqual(build_csv_report(payload['findings']), csv_before)
        self.assertEqual(len(list(csv.reader(io.StringIO(csv_before.lstrip('\ufeff'))))), 3)


if __name__ == '__main__':
    unittest.main()
