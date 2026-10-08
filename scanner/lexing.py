"""Bounded C-style literal/comment masking, including JS template expressions.

This is a lexical filter, not a full JavaScript or C# parser.
"""
from __future__ import annotations

from scanner.control import AnalysisLimit, MAX_DEPTH, checkpoint, mask_span


def c_style_channels(source: str) -> tuple[str, str, list[tuple[int, int]]]:
    calls, comments = list(source), list(source)
    literals: list[tuple[int, int]] = []
    templates: list[tuple[int, bool]] = []
    # A template pushes expression frames; braces within expressions are balanced.
    stack: list[tuple[str, int]] = [('code', 0)]
    i, next_check, size = 0, 0, len(source)
    while i < size:
        if i >= next_check:
            checkpoint()
            next_check = i + 2048
        state, braces = stack[-1]
        char = source[i]
        if state == 'template':
            if char == '\\':
                mask_span(calls, i, min(i + 2, size))
                i += 2
            elif char == '`':
                calls[i] = ' '
                start, dynamic = templates.pop()
                if not dynamic:
                    literals.append((start, i + 1))
                stack.pop()
                i += 1
            elif source.startswith('${', i):
                templates[-1] = (templates[-1][0], True)
                mask_span(calls, i, i + 2)
                stack.append(('expression', 1))
                i += 2
            else:
                if char not in '\r\n':
                    calls[i] = ' '
                i += 1
        elif source.startswith('//', i) or source.startswith('/*', i):
            start = i
            if source.startswith('//', i):
                end = source.find('\n', i + 2)
                i = size if end < 0 else end
            else:
                end = source.find('*/', i + 2)
                i = size if end < 0 else end + 2
            mask_span(calls, start, i)
            mask_span(comments, start, i)
        elif char in '\"\'' or source.startswith('@"', i):
            start = i
            verbatim = source.startswith('@"', i)
            quote = '"' if verbatim else char
            i += 2 if verbatim else 1
            raw = quote == '"' and not verbatim and source.startswith('""', i)
            if raw:
                count = 1
                while i < size and source[i] == '"':
                    if i % 2048 == 0:
                        checkpoint()
                    count += 1
                    i += 1
                end = source.find('"' * count, i)
                i = size if end < 0 else end + count
            else:
                while i < size:
                    if i >= next_check:
                        checkpoint()
                        next_check = i + 2048
                    if verbatim and source.startswith('""', i):
                        i += 2
                    elif source[i] == quote:
                        i += 1
                        break
                    elif source[i] == '\\' and not verbatim:
                        i += 2
                    else:
                        i += 1
                i = min(i, size)
            literals.append((start, i))
            mask_span(calls, start, i)
        elif char == '`':
            calls[i] = ' '
            templates.append((i, False))
            stack.append(('template', 0))
            i += 1
        elif state == 'expression' and char in '{}':
            braces += 1 if char == '{' else -1
            if braces == 0:
                calls[i] = ' '
                stack.pop()
            else:
                stack[-1] = (state, braces)
            i += 1
        else:
            i += 1
        if len(stack) > MAX_DEPTH:
            raise AnalysisLimit('模板插值嵌套超过分析上限')
    return ''.join(calls), ''.join(comments), literals
