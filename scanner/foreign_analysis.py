"""Limited imported Node.js crypto calls; no claim of JavaScript data flow."""
from __future__ import annotations

import re
from scanner.lexing import c_style_channels
from scanner.rules import Finding, VULNERABLE_ALGOS
from scanner.control import checkpoint

IDENT = r'[A-Za-z_$][\w$]*'
TYPES = {'rsa': 'rsa', 'rsa-pss': 'rsa', 'dsa': 'dsa', 'dh': 'dh', 'ec': 'ecc',
         'ed25519': 'ed25519', 'ed448': 'ed448', 'x25519': 'x25519', 'x448': 'x448'}


def scan_node_crypto(source):
    clean, comments, _ = c_style_channels(source)
    bindings = []
    patterns = [rf'\bimport\s+(\*\s+as\s+{IDENT}|{IDENT}|\{{[^}}]+\}})\s+from\s*["\'](?:node:)?crypto["\']',
                rf'\b(?:const|let|var)\s+({IDENT}|\{{[^}}]+\}})\s*=\s*require\s*\(\s*["\'](?:node:)?crypto["\']\s*\)']
    for pattern in patterns:
        for match in re.finditer(pattern, comments):
            checkpoint()
            if not clean[match.start():match.start() + 6].strip():
                continue
            value = match[1].strip()
            if value.startswith('{'):
                for part in value[1:-1].split(','):
                    bits = re.split(r'\s+(?:as)\s+|\s*:\s*', part.strip())
                    if bits[0] in ('generateKeyPair', 'generateKeyPairSync'):
                        bindings.append((bits[-1], bits[0], match.span()))
            else:
                bindings.extend((value.split()[-1] + '.' + method, method, match.span()) for method in ('generateKeyPair', 'generateKeyPairSync'))
    results = []
    for target, method, imported in bindings:
        root = target.split('.')[0]
        for match in re.finditer(r'\b' + re.escape(target) + r'\s*\(', clean):
            if match.start() < imported[1]:
                continue
            before = clean[:imported[0]] + ' ' * (imported[1] - imported[0]) + clean[imported[1]:match.start()]
            if re.search(r'\b' + re.escape(root) + r'\s*=(?!=)|\([^)]*\b' + re.escape(root) + r'\b[^)]*\)\s*(?:=>|\{)', before):
                continue
            argument = re.match(r'\s*(["\'])([^"\']+)\1\s*[,)]', comments[match.end():])
            if argument and argument[2] in TYPES:
                profile = VULNERABLE_ALGOS[TYPES[argument[2]]]
                results.append(Finding(source.count('\n', 0, match.start()) + 1, profile.name, profile.risk_level,
                    profile.reason, profile.recommendation, f'node:crypto.{method}({argument[2]})', 'text_call'))
    return results
