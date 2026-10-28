"""Three candidate lanes and bounded multi-file, redacted evidence packets."""
from __future__ import annotations

import ast
import json
import hashlib
import re
from collections import OrderedDict, defaultdict
from bisect import bisect_left, bisect_right

from backend.ai.config import BUDGETS, digest
from backend.ai.redaction import redact
from scanner.parsing import parse_python
from scanner.api_catalog import RULES_VERSION, API_ALGORITHMS
from scanner.lexing import c_style_channels
from scanner.control import analysis_control, AnalysisLimit

CRYPTO = re.compile(r'crypt|cipher|encrypt|decrypt|rsa|ecd[hs]a|ed25519|x25519|key_exchange|jwt|(?:^|[_.])(?:dsa|dh|sign|signing|signer|signature|verify|verifying|verification|kem)(?:$|[_.])', re.I)
CATALOG_NAMES = {part.lower() for api in API_ALGORITHMS for part in api.split('.')[2:-1] if len(part)>2}


def crypto_hint(value: str):
    return CRYPTO.search(re.sub(r'([a-z0-9])([A-Z])', r'\1_\2', value)) or any(p.lower() in CATALOG_NAMES for p in value.split('.'))


def catalog(base, control, check):
    descriptors, symbols, imports, notes = {}, {}, {}, []
    by_location = defaultdict(list)
    dependencies, ambiguous_symbols = {}, set()
    scopes = {}
    sources = {s['source_id']: {k: v for k, v in s.items() if k != 'content'} for s in base.get('sources', [])}
    paths = getattr(control, 'source_paths', {})
    identities = {}
    def define(symbol, position):
        if symbol in symbols:
            symbols.pop(symbol)
            ambiguous_symbols.add(symbol)
        elif symbol not in ambiguous_symbols:
            symbols[symbol] = position
    def add(source_id, line, lane, ref=None, related=(), context=None, fact=None):
        key = (source_id, line, context)
        matches = [descriptors[k] for k in by_location.get(key[:2], ())]
        if context is None and matches:
            for value in matches:
                if lane not in value['lanes']:
                    value['lanes'].append(lane)
                if ref:
                    value['refs'].append(ref)
                if fact:
                    value['facts'].append(fact)
            return
        inherited = descriptors.pop((source_id, line, None), None) if context is not None else None
        if key not in descriptors:
            if len(descriptors) >= 20000:
                return
            descriptors[key] = {'source_id': source_id, 'line': line, 'lanes': [], 'refs': [], 'related': [], 'facts': []}
            if context is not None:
                by_location[key[:2]].append(key)
        item = descriptors[key]
        if inherited:
            item['lanes'].extend(inherited['lanes'])
            item['refs'].extend(inherited['refs'])
            item['facts'].extend(inherited['facts'])
        item['context'] = context
        if lane not in item['lanes']:
            item['lanes'].append(lane)
        if ref:
            item['refs'].append(ref)
        if fact:
            item['facts'].append(fact)
        item['related'].extend(related)
    def add_call(identity, row, lane):
        matches = by_location.get((identity, row['line']), [])
        if any(descriptors[key]['refs'] for key in matches if key in descriptors):
            add(identity, row['line'], lane)
            return
        context = digest([row['line'], row.get('col',0), row.get('end_col',0)])
        add(identity, row['line'], lane, context=context)
        descriptors[(identity,row['line'],context)].update(start_col=row.get('col',0), end_col=row.get('end_col',0))
        descriptors[(identity,row['line'],context)]['call_name'] = row['name']
    for finding in base.get('findings', []):
        add(finding['source_id'], finding['line'], 'review', digest(finding), fact={'algorithm':finding['algorithm'], 'purpose':'unknown', 'api':finding.get('resolved_api'), 'basis':'rule'})
    evidence_paths = {p['evidence_id']: p for p in base.get('deep_analysis', {}).get('evidence_paths', [])}
    for operation in base.get('deep_analysis', {}).get('operations', []):
        span = operation['sink_location']
        related = [*operation['context']['call_chain']]
        for reference in operation['evidence_ids']:
            path = evidence_paths.get(reference)
            if path:
                related.extend(n['location'] for n in path['nodes'])
        unresolved = operation['resolution_status'] != 'resolved' or any(c['level'] != 'E3' for c in operation['claims'] if c['claim_type'] in ('ALGORITHM', 'OPERATION_TYPE'))
        add(span['source_id'], span['start_line'], 'unresolved' if unresolved else 'review', ref=operation['operation_id'], related=related, context=digest(operation['context']),
            fact={'algorithm':operation['algorithm'].get('value','unknown'), 'purpose':operation['operation_type'],
                  'api':operation['api'], 'scope':operation.get('evidence_scope'), 'verified':not unresolved})
    read = 0
    for identity, source in sorted(sources.items(), key=lambda row: (row[1]['file_name'], row[0])):
        check()
        control.emit(stage='模型上下文准备', activity={'action':'检索密码调用与配置来源', 'files':[source['file_name']], 'completed':len(identities), 'total':len(sources)})
        path = paths.get(identity)
        if path is None:
            notes.append('source_unavailable')
            continue
        size = getattr(path, 'size', 0)
        if read + size > BUDGETS['search_bytes']:
            notes.append('source_limit')
            continue
        try:
            text = path.read_text(encoding='utf-8')
        except (OSError, UnicodeError):
            notes.append('source_unavailable')
            continue
        read += len(text.encode('utf-8'))
        identities[identity] = digest([source['file_name'], text])
        if source['file_name'].endswith(('.py', '.pyw')):
            try:
                cached = getattr(control, 'source_facts', {}).get(identity)
                if cached:
                    facts = json.loads(cached.read_text(encoding='utf-8'))
                    if facts['sha256'] != hashlib.sha256(text.encode('utf-8')).hexdigest():
                        notes.append('source_digest_mismatch')
                        identities.pop(identity, None)
                        continue
                    imports[identity] = [row['line'] for row in facts['imports']][:32]
                    dependencies[identity] = [row['target'] for row in facts['imports'] if row['target']]
                    scopes[identity] = facts
                    crypto_lines = sorted(row['line'] for row in facts['calls'] if crypto_hint(row['name']))
                    for row in facts['functions']:
                        symbol = (facts['module'] or source['file_name'].removesuffix('.py').replace('/', '.')) + '.' + row['name']
                        if row['scope'] == '<module>':
                            define(symbol, {'source_id': identity, 'start_line': row['line'], 'end_line': min(row['end'], row['line'] + 24)})
                        first_call = bisect_left(crypto_lines, row['line'])
                        covered = first_call < len(crypto_lines) and crypto_lines[first_call] <= row['end']
                        if crypto_hint(row['name']) and not covered:
                            add(identity, row['line'], 'independent')
                            descriptors[(identity,row['line'],None)].update(focus_kind='definition', scope=row['name'], end_line=row['end'])
                    raw_lines = text.splitlines()
                    for row in facts['calls']:
                        if crypto_hint(row['name']):
                            add_call(identity, row, 'independent')
                        elif row['name'] == 'pow' and re.search(r'private|public|secret|key|cipher|modulus', '\n'.join(raw_lines[row['line']-1:row['end']]), re.I):
                            add_call(identity, row, 'unresolved')
                    continue
                tree = parse_python(text, source['file_name'], check)
                import_lines = []
                top_level = {id(node) for node in tree.body}
                for node in ast.walk(tree):
                    check()
                    if isinstance(node, (ast.Import, ast.ImportFrom)):
                        import_lines.append(node.lineno)
                    if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                        symbol = source['file_name'].removesuffix('.py').replace('/', '.') + '.' + node.name
                        if id(node) in top_level:
                            define(symbol, {'source_id': identity, 'start_line': node.lineno, 'end_line': min(node.end_lineno, node.lineno + 24)})
                        covered = any(isinstance(child, ast.Call) and crypto_hint(ast.unparse(child.func)) for child in ast.walk(node))
                        if crypto_hint(node.name) and not covered:
                            add(identity, node.lineno, 'independent')
                            descriptors[(identity,node.lineno,None)].update(focus_kind='definition', scope=node.name, end_line=node.end_lineno)
                    if isinstance(node, ast.Call):
                        name = ast.unparse(node.func)
                        if crypto_hint(name):
                            add(identity, node.lineno, 'independent')
                        elif name == 'pow' and len(node.args) == 3 and re.search(r'private|public|secret|key|cipher|modulus', ast.unparse(node), re.I):
                            add(identity, node.lineno, 'unresolved')
                imports[identity] = import_lines[:32]
            except (SyntaxError, ValueError, OverflowError, RecursionError):
                notes.append('candidate_parse_failed')
        elif source['file_name'].endswith(('.json', '.yaml', '.yml', '.toml', '.ini', '.cfg')):
            for line, text_line in enumerate(text.splitlines(), 1):
                if re.match(r'\s*["\']?(?:algorithm|alg|cipher|signature_algorithm|key_algorithm)["\']?\s*[:=]', text_line, re.I):
                    add(identity, line, 'independent')
        elif source['file_name'].endswith(('.js', '.jsx', '.ts', '.tsx', '.java', '.go', '.rs', '.cs', '.c', '.h', '.cpp', '.cc', '.hpp')):
            try:
                with analysis_control(check):
                    clean, comments, _ = c_style_channels(text)
                imports[identity] = [n for n, line in enumerate(clean.splitlines(), 1)
                                     if re.match(r'\s*(?:import\b|using\b|use\b|#include\b|.*?\brequire\s*\()', line)][:32]
                for line, value in enumerate(clean.splitlines(), 1):
                    check()
                    names = re.findall(r'\b([A-Za-z_$][\w$.:]*)\s*\(', value)
                    if any(crypto_hint(name) for name in names):
                        add(identity, line, 'independent')
            except AnalysisLimit:
                notes.append('candidate_lexical_limit')
    # One question per invocation of an indexed local wrapper, retaining its definition.
    # Do not fold a statically established operation or distinct caller contexts.
    per_source = defaultdict(list)
    for key, item in descriptors.items():
        if not item['refs']:
            per_source[key[0]].append((key,item))
    for identity, facts in scopes.items():
        check()
        entries = sorted(per_source[identity], key=lambda p:p[1]['line'])
        line_numbers = [v['line'] for _,v in entries]
        at_position = defaultdict(list)
        for pair in entries:
            at_position[(pair[1]['line'],pair[1].get('start_col',0))].append(pair)
        by_name = defaultdict(list)
        for call in facts['calls']:
            by_name[call['name']].append(call)
        for function in facts['functions']:
            check()
            if function['scope'] != '<module>' or not crypto_hint(function['name']):
                continue
            inside = [(k,v) for k,v in entries[bisect_left(line_numbers,function['line']):bisect_right(line_numbers,function['end'])] if k in descriptors]
            callers = [c for c in by_name[function['name']] if not function['line'] <= c['line'] <= function['end']]
            roots = [pair for c in callers for pair in at_position[(c['line'],c.get('col',0))] if pair[0] in descriptors]
            if not roots or not inside:
                continue
            for _, root in roots:
                root['related'].append({'source_id':identity,'start_line':function['line'],'end_line':min(function['end'],function['line']+24)})
                for _, item in inside:
                    root['lanes'] = sorted(set(root['lanes']) | set(item['lanes']))
                    root['related'].append({'source_id':identity,'start_line':item['line']})
            for k,_ in inside:
                descriptors.pop(k,None)
    snapshot = digest([sorted((sources[k]['file_name'], v) for k, v in identities.items()),
                       base.get('deep_analysis', {}).get('snapshot', {}).get('path_fidelity'),
                       base.get('deep_analysis', {}).get('snapshot', {}).get('package_roots'), RULES_VERSION])
    namespace = digest([sorted(source['file_name'] for source in sources.values()),
                        base.get('deep_analysis', {}).get('snapshot', {}).get('path_fidelity'),
                        base.get('deep_analysis', {}).get('snapshot', {}).get('package_roots'), RULES_VERSION])
    symbol_sources = {name: value['source_id'] for name, value in symbols.items()}
    module_sources = defaultdict(set)
    for name, value in symbols.items():
        parts = name.split('.')[:-1]
        for index in range(1, len(parts) + 1):
            module_sources['.'.join(parts[:index])].add(value['source_id'])
    dependency_digests = {}
    for identity, targets in dependencies.items():
        linked = set()
        for target in targets:
            linked.update(module_sources.get(target, ()))
            if target in symbol_sources:
                linked.add(symbol_sources[target])
        dependency_digests[identity] = sorted((sources[k]['file_name'], identities[k]) for k in linked if k in identities)
    items = []
    for item in descriptors.values():
        identity = item['source_id']
        if identity not in identities:
            continue
        # Stable content identity is separate from task-scoped source IDs.
        related = sorted([(sources[p['source_id']]['file_name'], identities.get(p['source_id']), p['start_line'], p.get('start_col'), p.get('end_line'), p.get('end_col')) for p in item['related'] if p['source_id'] in sources], key=str)
        item['candidate_id'] = digest([namespace, sources[identity]['file_name'], identities[identity], item['line'], item.get('context'), related,
                                       dependency_digests.get(identity, []), bool(item['refs'])])[:32]
        item['related'] = list({digest(p): p for p in item['related']}.values())[:64]
        items.append(item)
    return {'snapshot': snapshot, 'candidates': items, 'sources': sources, 'identities': identities,
            'imports': imports, 'symbols': symbols, 'dependencies': dependencies, 'searched_files': len(identities), 'searched_bytes': read,
            'diagnostics': sorted(set(notes)), 'partial': bool(notes or len(descriptors) >= 20000 or (base.get('coverage') or {}).get('partial'))}


def select(catalogue, completed):
    lanes = defaultdict(list)
    for item in catalogue['candidates']:
        if item['candidate_id'] not in completed:
            lane = 'unresolved' if 'unresolved' in item['lanes'] else 'independent' if 'independent' in item['lanes'] else 'review'
            lanes[lane].append(item)
    output = []
    while len(output) < BUDGETS['groups'] and any(lanes.values()):
        for lane in ('unresolved', 'unresolved', 'independent', 'review'):
            if lanes[lane] and len(output) < BUDGETS['groups']:
                output.append(lanes[lane].pop(0))
    return output


def packets(catalogue, selected, paths, check):
    cache = OrderedDict()
    def lines(identity):
        check()
        if identity not in cache:
            while len(cache) >= 2:
                cache.popitem(last=False)
            text = paths[identity].read_text(encoding='utf-8')
            if digest([catalogue['sources'][identity]['file_name'], text]) != catalogue['identities'][identity]:
                raise ValueError('来源源码摘要已改变，请重新扫描')
            cache[identity] = redact(text)
        cache.move_to_end(identity)
        return cache[identity]
    def evidence(positions):
        grouped = defaultdict(set)
        for span in positions:
            identity = span['source_id']
            if identity not in paths:
                continue
            text = lines(identity)
            exact = span.get('exact', False)
            lo = max(1, span['start_line'] - (0 if exact else 3))
            hi = min(len(text), span.get('end_line', span['start_line']) + (0 if exact else 4), lo + 25)
            grouped[identity].update(range(lo, hi + 1))
            grouped[identity].update(catalogue['imports'].get(identity, []))
        output, used = [], 0
        for identity, numbers in grouped.items():
            text = lines(identity)
            runs = []
            for n in sorted(numbers):
                if not 1 <= n <= len(text):
                    continue
                if runs and runs[-1][-1] == n - 1:
                    runs[-1].append(n)
                else:
                    runs.append([n])
            for run in runs:
                value = '\n'.join(text[n - 1] for n in run)
                size = len(value.encode('utf-8'))
                if size > 16384 or used + size > 32768:
                    continue
                used += size
                output.append({'evidence_id': digest([catalogue['identities'][identity], run])[:24],
                    'source_id': identity, 'file_name': catalogue['sources'][identity]['file_name'],
                    'start_line': run[0], 'end_line': run[-1], 'text': value})
        return output
    output = []
    for item in selected:
        positions = [{'source_id': item['source_id'], 'start_line': item['line'],
                      'end_line': item.get('end_line',item['line']), 'exact':item.get('focus_kind')=='definition'}, *item['related']]
        # Include a unique relevant wrapper immediately; unrelated symbols remain opt-in expansions.
        call_name = item.get('call_name', '')
        dependencies = catalogue.get('dependencies', {}).get(item['source_id'], [])
        definitions = [(name, span) for name, span in catalogue['symbols'].items()
                       if call_name and name.rsplit('.', 1)[-1] == call_name.rsplit('.', 1)[-1]
                       and (span['source_id'] == item['source_id'] or name in dependencies or name.rsplit('.',1)[0] in dependencies)]
        if len(definitions) == 1:
            positions.append(definitions[0][1])
        snippets = evidence(positions)
        expansions = {}
        # Only unique, indexed symbols from the approved source snapshot can be requested.
        for symbol, position in catalogue['symbols'].items():
            check()
            if len(expansions) >= 8:
                break
            related = any(symbol == target or symbol.startswith(target + '.') for target in catalogue.get('dependencies', {}).get(item['source_id'], []))
            if redact(symbol)[0] != symbol:
                continue
            if (position['source_id'] == item['source_id'] or related) and (position['source_id'] != item['source_id'] or position['start_line'] != item['line']):
                additions = [e for e in evidence([position]) if e['evidence_id'] not in {s['evidence_id'] for s in snippets}]
                if additions:
                    expansions[symbol] = additions
        if snippets:
            output.append({**item, 'evidence': snippets, 'expansions': expansions})
    return output
