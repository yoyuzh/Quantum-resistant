"""Preserve original line numbers while masking recognized secret material."""
from __future__ import annotations

import re

BEGIN = re.compile(r'-----BEGIN (?:[A-Z0-9]+ )*(?:PRIVATE KEY|PUBLIC KEY|CERTIFICATE)-----')
END = re.compile(r'-----END (?:[A-Z0-9]+ )*(?:PRIVATE KEY|PUBLIC KEY|CERTIFICATE)-----')
ASSIGN = re.compile(r'''(?i)((?:["']?)[\w.-]*(?:password|passwd|secret|api[_-]?key|access[_-]?token|auth[_-]?token|authorization)[\w.-]*(?:["']?)\s*[:=]\s*)(.*)''')
TOKEN = re.compile(r'\b(?:sk-[A-Za-z0-9_-]{8,}|gh[pousr]_[A-Za-z0-9_]{10,}|github_pat_[A-Za-z0-9_]+|AKIA[A-Z0-9]{16}|eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+)\b')
KEY_LITERAL = re.compile(r'''(?i)(\b(?:private_?key|public_?key|signing_?key|encryption_?key|key)["']?\s*[:=]\s*)([rubf]*["'].*)''')
QUOTED = re.compile(r'''(?i)[rubf]*(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')''')


def mask_assignment(match):
    value = match[2]
    trimmed = value.lstrip()
    if trimmed.startswith(('"""', "'''")):
        return match[1] + '"[REDACTED]"'
    first = QUOTED.match(trimmed)
    if first:
        return match[1] + '"[REDACTED]"' + trimmed[first.end():]
    if re.match(r'[A-Za-z_]\w*(?:\.\w+)*\s*\(', trimmed):
        # Preserve API/call structure; mask literal arguments within secret-producing calls.
        def literal(item):
            prefix = trimmed[:item.start()]
            return item[0] if re.search(r'\b(?:algorithm|alg|signature_algorithm)\s*=\s*$', prefix) else '"[REDACTED]"'
        return match[1] + QUOTED.sub(literal, trimmed)
    return match[1] + '"[REDACTED]"'


def redact(text):
    lines, pem, block, indent = [], False, None, 0
    for raw in text.splitlines():
        if block is not None:
            if block == 'yaml' and raw.strip() and len(raw) - len(raw.lstrip()) <= indent:
                block = None
            else:
                lines.append('[REDACTED SECRET]')
                if block != 'yaml' and block in raw:
                    block = None
                continue
        match = ASSIGN.search(raw) or KEY_LITERAL.search(raw)
        if match:
            value = match[2].strip()
            if value.startswith(('|', '>')):
                block, indent = 'yaml', len(raw) - len(raw.lstrip())
            elif value.startswith(('"""', "'''")) and value.count(value[:3]) == 1:
                block = value[:3]
        begin, end = BEGIN.search(raw), END.search(raw)
        if begin:
            pem, raw = True, begin[0] + ' [REDACTED]'
        elif pem:
            raw = end[0] if end else '[REDACTED PEM BODY]'
        if end:
            pem = False
        raw = ASSIGN.sub(mask_assignment, raw)
        raw = KEY_LITERAL.sub(mask_assignment, raw)
        raw = TOKEN.sub('[REDACTED TOKEN]', raw)
        raw = re.sub(r'(https?://)[^\s/@]+:[^\s/@]+@', r'\1[REDACTED]@', raw)
        lines.append(raw)
    return lines
