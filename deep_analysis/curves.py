"""Recognize a small set of imported ecdsa curves without evaluating them."""
from __future__ import annotations

import ast
from deep_analysis.symbol_index import dotted, resolve

CURVES = frozenset({'NIST192p', 'NIST224p', 'NIST256p', 'NIST384p', 'NIST521p',
                    'SECP256k1', 'BRAINPOOLP256r1', 'BRAINPOOLP384r1', 'BRAINPOOLP512r1'})


def supported_curve(node, module, modules):
    if any(k.arg is None for k in node.keywords):
        return False
    curve = next((k.value for k in node.keywords if k.arg == 'curve'), node.args[0] if node.args else None)
    if curve is None:
        return True
    call = next((c for c in module.calls if c.location.start_line == node.lineno
                 and c.location.start_col == node.col_offset), None)
    if call is None:
        return False
    target, _ = resolve(dotted(curve), call.scope, module, list(modules), all(m.name is not None for m in modules))
    return target in {prefix + name for prefix in ('ecdsa.', 'ecdsa.curves.') for name in CURVES}
