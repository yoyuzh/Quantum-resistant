from __future__ import annotations

import ast
import io
import tokenize

from scanner.control import AnalysisLimit, MAX_DEPTH, MAX_NODES, checkpoint
from scanner.rules import Finding, MODULE_HINTS, SENSITIVE_STRING_CONTEXT_RE, STRING_IDENTIFIER_RULES, VULNERABLE_ALGOS


def get_dotted_name(node: ast.AST) -> str | None:
    if isinstance(node, ast.Name):
        return node.id
    if isinstance(node, ast.Attribute):
        parent = get_dotted_name(node.value)
        return f"{parent}.{node.attr}" if parent else None
    return None


def match_module_hint(name: str) -> str | None:
    for prefix, algorithm in MODULE_HINTS:
        if name == prefix or name.startswith(prefix + "."):
            return algorithm
    return None


def resolve_direct_call(name: str) -> str | None:
    return KNOWN_CALLS.get(name)


# Only exact, imported public targets establish an algorithm.
_PREFIX = "cryptography.hazmat.primitives.asymmetric."
KNOWN_CALLS = {
    _PREFIX + "rsa.generate_private_key": "rsa",
    _PREFIX + "dsa.generate_private_key": "dsa",
    _PREFIX + "dh.generate_parameters": "dh",
    _PREFIX + "ec.generate_private_key": "ecc",
    _PREFIX + "ec.ECDH": "ecdh",
    _PREFIX + "ec.ECDSA": "ecdsa",
    _PREFIX + "ec.derive_private_key": "ecc",
    _PREFIX + "ec.EllipticCurvePublicKey.from_encoded_point": "ecc",
    "ecdsa.SigningKey.generate": "ecdsa",
}
# Explicit number/point/byte constructors have a known algorithm, unlike PEM/DER loaders.
for _module, _algorithm in (("RSA", "rsa"), ("DSA", "dsa"), ("ECC", "ecc")):
    for _method in ("generate", "import_key", "construct"):
        KNOWN_CALLS[f"Crypto.PublicKey.{_module}.{_method}"] = _algorithm
    if _module in {"RSA", "DSA"}:
        KNOWN_CALLS[f"Crypto.PublicKey.{_module}.importKey"] = _algorithm
for _curve, _cls in (("x25519", "X25519"), ("x448", "X448"), ("ed25519", "Ed25519"), ("ed448", "Ed448")):
    KNOWN_CALLS[f"{_PREFIX}{_curve}.{_cls}PrivateKey.generate"] = _curve
    KNOWN_CALLS[f"{_PREFIX}{_curve}.{_cls}PrivateKey.from_private_bytes"] = _curve
    KNOWN_CALLS[f"{_PREFIX}{_curve}.{_cls}PublicKey.from_public_bytes"] = _curve
for _algorithm, _module, _private, _public in (
    ("rsa", "rsa", "RSAPrivateNumbers", "RSAPublicNumbers"),
    ("dsa", "dsa", "DSAPrivateNumbers", "DSAPublicNumbers"),
    ("dh", "dh", "DHPrivateNumbers", "DHPublicNumbers"),
    ("ecc", "ec", "EllipticCurvePrivateNumbers", "EllipticCurvePublicNumbers"),
):
    KNOWN_CALLS[f"{_PREFIX}{_module}.{_private}"] = _algorithm
    KNOWN_CALLS[f"{_PREFIX}{_module}.{_public}"] = _algorithm

class LocalBindings(ast.NodeVisitor):
    """Collect lexical locals without entering nested scopes."""

    def __init__(self) -> None:
        self.names: set[str] = set()
        self.globals: set[str] = set()
        self.nonlocals: set[str] = set()

    def visit_Name(self, node: ast.Name) -> None:
        if isinstance(node.ctx, (ast.Store, ast.Del)):
            self.names.add(node.id)

    def visit_Global(self, node: ast.Global) -> None:
        self.globals.update(node.names)

    def visit_Nonlocal(self, node: ast.Nonlocal) -> None:
        self.nonlocals.update(node.names)

    def visit_Import(self, node: ast.Import) -> None:
        self.names.update(a.asname or a.name.split(".")[0] for a in node.names)

    def visit_ImportFrom(self, node: ast.ImportFrom) -> None:
        self.names.update(a.asname or a.name for a in node.names)

    def visit_FunctionDef(self, node: ast.FunctionDef) -> None:
        self.names.add(node.name)

    visit_AsyncFunctionDef = visit_FunctionDef
    visit_ClassDef = visit_FunctionDef

    def visit_Lambda(self, node: ast.Lambda) -> None:
        for value in [*node.args.defaults, *filter(None, node.args.kw_defaults)]:
            self.visit(value)

    def visit_ExceptHandler(self, node: ast.ExceptHandler) -> None:
        if node.name:
            self.names.add(node.name)
        self.generic_visit(node)

    def visit_ListComp(self, node: ast.ListComp) -> None:
        # Comprehension iteration targets belong to their own lexical scope.
        # Assignment expressions, however, bind in the enclosing scope.
        for child in ast.walk(node):
            if isinstance(child, ast.NamedExpr):
                self.visit(child.target)

    visit_SetComp = visit_ListComp
    visit_DictComp = visit_ListComp
    visit_GeneratorExp = visit_ListComp


class QuantumCryptoVisitor(ast.NodeVisitor):
    def __init__(self) -> None:
        self.aliases: dict[str, str] = {}
        self.findings: list[Finding] = []
        self.tree: ast.Module | None = None
        self.class_outer: dict[str, str] | None = None
        self.module_aliases: dict[str, str] = self.aliases
        self.deferred: list[dict] = []
        self.function_calls: dict[str, dict] = {}
        self.diagnostics: list[dict] = []
        self.uncertain: set[str] = set()
        self.node_count = 0
        self.call_contexts = 0

    def visit(self, node: ast.AST) -> object:
        self.node_count += 1
        if len(self.aliases) > 4096:
            raise AnalysisLimit("Python 绑定数量超过分析上限")
        if self.node_count % 128 == 1:
            checkpoint()
        if self.node_count > MAX_NODES:
            raise AnalysisLimit("Python AST 节点超过分析上限")
        return super().visit(node)

    def visit_Module(self, node: ast.Module) -> None:
        self.visit_block(node.body)

    def visit_block(self, statements: list[ast.stmt]) -> None:
        outer_deferred = self.deferred
        outer_calls = self.function_calls
        self.deferred, self.function_calls = [], {}
        for statement in statements:
            self.visit(statement)
        pending = self.deferred
        # Bodies resolve free names at invocation, after enclosing statements.
        for entry in pending:
            environments = entry["calls"] or [entry["environment"].copy()]
            for environment in environments:
                self.scan_function(entry["node"], environment, module_scope=entry["module_scope"])
        self.deferred, self.function_calls = outer_deferred, outer_calls

    def visit_If(self, node: ast.If) -> None:
        self.visit(node.test)
        constant = node.test
        negate = isinstance(constant, ast.UnaryOp) and isinstance(constant.op, ast.Not)
        if negate:
            constant = constant.operand
        if isinstance(constant, ast.Constant):
            value = bool(constant.value)
            for statement in (node.body if value != negate else node.orelse):
                self.visit(statement)
            return
        outer = self.aliases
        self.aliases = outer.copy()
        for statement in node.body:
            self.visit(statement)
        yes = self.aliases
        self.aliases = outer.copy()
        for statement in node.orelse:
            self.visit(statement)
        no = self.aliases
        self.aliases = outer
        for name in yes.keys() | no.keys():
            if yes.get(name) == no.get(name):
                outer[name] = yes.get(name, "")
            else:
                outer[name] = ""
                self.uncertain.add(name)

    def scan_function(self, node: ast.FunctionDef, environment: dict[str, str], *, module_scope: bool) -> None:
        outer, class_outer = self.aliases, self.class_outer
        uncertain = self.uncertain
        self.aliases = environment.copy()
        self.class_outer = None
        self.uncertain = uncertain.copy()
        bindings = LocalBindings()
        for statement in node.body:
            bindings.visit(statement)
        args = [*node.args.posonlyargs, *node.args.args, *node.args.kwonlyargs]
        args += [arg for arg in (node.args.vararg, node.args.kwarg) if arg]
        for name in (bindings.names - bindings.globals - bindings.nonlocals) | {arg.arg for arg in args}:
            self.aliases[name] = ""
            self.uncertain.discard(name)
        for name in bindings.globals:
            # Global declarations bypass enclosing function/class locals.
            self.aliases[name] = environment.get(name, "") if module_scope else self.module_aliases.get(name, "")
        self.visit_block(node.body)
        self.aliases, self.class_outer, self.uncertain = outer, class_outer, uncertain

    def add_finding(self, line: int, algorithm: str, evidence: str, *, resolved_api: str | None = None) -> None:
        profile = VULNERABLE_ALGOS[algorithm]
        library = None
        if resolved_api:
            library = {"Crypto": "PyCryptodome"}.get(resolved_api.split(".")[0], resolved_api.split(".")[0])
        self.findings.append(Finding(line, profile.name, profile.risk_level, profile.reason,
                                     profile.recommendation, evidence,
                                     "ast_call" if resolved_api else "ast_config", library, resolved_api))

    def visit_Import(self, node: ast.Import) -> None:
        for alias in node.names:
            self.aliases[alias.asname or alias.name.split(".")[0]] = alias.name if alias.asname else alias.name.split(".")[0]

    def visit_ImportFrom(self, node: ast.ImportFrom) -> None:
        for alias in node.names:
            self.aliases[alias.asname or alias.name] = f"{node.module}.{alias.name}" if not node.level else ""

    def resolve_algorithm_from_call(self, name: str) -> str | None:
        target = self.resolve_call_target(name)
        return resolve_direct_call(target) if target else None

    def resolve_call_target(self, name: str) -> str | None:
        root, *tail = name.split(".")
        target = self.aliases.get(root)
        if not target:
            return None
        return ".".join([target, *tail])

    def visit_Call(self, node: ast.Call) -> None:
        name = get_dotted_name(node.func)
        if name in self.function_calls:
            self.call_contexts += 1
            if self.call_contexts > 64:
                raise AnalysisLimit("函数调用绑定上下文超过分析上限")
            self.function_calls[name]["calls"].append(self.aliases.copy())
        if name and name.split(".")[0] in self.uncertain and not self.aliases.get(name.split(".")[0]):
            self.diagnostics.append(dict(code="binding_unresolved", line=node.lineno,
                                         message="调用名称存在分支绑定冲突，未确认密码库目标。"))
        algorithm = self.resolve_algorithm_from_call(name) if name else None
        if algorithm:
            self.add_finding(node.lineno, algorithm, name, resolved_api=self.resolve_call_target(name))
        self.generic_visit(node)

    def scan_string_value(self, node: ast.AST, context: str, line: int) -> None:
        if not SENSITIVE_STRING_CONTEXT_RE.search(context):
            return
        if isinstance(node, (ast.List, ast.Tuple, ast.Set)):
            for item in node.elts:
                self.scan_string_value(item, context, getattr(item, "lineno", line))
        elif isinstance(node, ast.Constant) and isinstance(node.value, str):
            if node.value.lstrip().startswith('-----BEGIN '):
                return  # PEM evidence is handled once, at its actual header line.
            for algorithm, pattern, evidence in STRING_IDENTIFIER_RULES:
                match = pattern.search(node.value)
                if match:
                    self.add_finding(line, algorithm, f"{evidence}: {match.group(0)}")

    def invalidate(self, target: ast.AST) -> None:
        for child in ast.walk(target):
            if isinstance(child, ast.Name) and isinstance(child.ctx, (ast.Store, ast.Del)):
                self.aliases[child.id] = ""

    def visit_Assign(self, node: ast.Assign) -> None:
        for target in node.targets:
            self.scan_string_value(node.value, get_dotted_name(target) or "", node.value.lineno)
        self.visit(node.value)
        for target in node.targets:
            self.invalidate(target)

    def visit_AnnAssign(self, node: ast.AnnAssign) -> None:
        if node.value:
            self.scan_string_value(node.value, get_dotted_name(node.target) or "", node.value.lineno)
            self.visit(node.value)
        self.invalidate(node.target)

    def visit_AugAssign(self, node: ast.AugAssign) -> None:
        self.visit(node.value)
        self.invalidate(node.target)

    def visit_NamedExpr(self, node: ast.NamedExpr) -> None:
        self.visit(node.value)
        self.invalidate(node.target)

    def visit_Delete(self, node: ast.Delete) -> None:
        for target in node.targets:
            self.invalidate(target)

    def visit_keyword(self, node: ast.keyword) -> None:
        self.scan_string_value(node.value, node.arg or "", node.value.lineno)
        self.generic_visit(node)

    def visit_Dict(self, node: ast.Dict) -> None:
        for key, value in zip(node.keys, node.values):
            if isinstance(key, ast.Constant) and isinstance(key.value, str):
                self.scan_string_value(value, key.value, value.lineno)
        self.generic_visit(node)

    def visit_FunctionDef(self, node: ast.FunctionDef) -> None:
        for value in [*node.decorator_list, *node.args.defaults, *filter(None, node.args.kw_defaults)]:
            self.visit(value)
        self.aliases[node.name] = ""
        environment = self.class_outer if self.class_outer is not None else self.aliases
        entry = {"node": node, "environment": environment, "calls": [],
                 "module_scope": environment is self.module_aliases}
        self.deferred.append(entry)
        self.function_calls[node.name] = entry

    visit_AsyncFunctionDef = visit_FunctionDef

    def visit_ClassDef(self, node: ast.ClassDef) -> None:
        for value in [*node.decorator_list, *node.bases, *node.keywords]:
            self.visit(value)
        self.aliases[node.name] = ""
        outer = self.aliases
        class_outer = self.class_outer
        self.class_outer = class_outer if class_outer is not None else outer
        self.aliases = outer.copy()
        for statement in node.body:
            self.visit(statement)
        self.aliases = outer
        self.class_outer = class_outer

    def visit_Lambda(self, node: ast.Lambda) -> None:
        for value in [*node.args.defaults, *filter(None, node.args.kw_defaults)]:
            self.visit(value)
        outer = self.aliases
        class_outer = self.class_outer
        self.aliases = (class_outer if class_outer is not None else outer).copy()
        self.class_outer = None
        args = [*node.args.posonlyargs, *node.args.args, *node.args.kwonlyargs]
        args += [a for a in (node.args.vararg, node.args.kwarg) if a]
        for arg in args:
            self.aliases[arg.arg] = ""
        self.visit(node.body)
        self.aliases = outer
        self.class_outer = class_outer

    def visit_For(self, node: ast.For) -> None:
        self.visit(node.iter)
        self.invalidate(node.target)
        for statement in [*node.body, *node.orelse]:
            self.visit(statement)

    visit_AsyncFor = visit_For

    def visit_With(self, node: ast.With) -> None:
        for item in node.items:
            self.visit(item.context_expr)
            if item.optional_vars:
                self.invalidate(item.optional_vars)
        for statement in node.body:
            self.visit(statement)

    visit_AsyncWith = visit_With

    def visit_ExceptHandler(self, node: ast.ExceptHandler) -> None:
        if node.type:
            self.visit(node.type)
        if node.name:
            self.aliases[node.name] = ""
        for statement in node.body:
            self.visit(statement)

    def visit_ListComp(self, node: ast.ListComp) -> None:
        outer = self.aliases
        self.aliases = outer.copy()
        for generator in node.generators:
            self.visit(generator.iter)
            self.invalidate(generator.target)
            for condition in generator.ifs:
                self.visit(condition)
        if isinstance(node, ast.DictComp):
            self.visit(node.key)
            self.visit(node.value)
        else:
            self.visit(node.elt)
        self.aliases = outer

    visit_SetComp = visit_ListComp
    visit_DictComp = visit_ListComp
    visit_GeneratorExp = visit_ListComp


def validate_parser_input(source: str) -> None:
    """Bound logical statements before entering CPython's recursive AST parser."""
    logical_tokens = 0
    total = 0
    for token in tokenize.generate_tokens(io.StringIO(source).readline):
        total += 1
        if total % 128 == 1:
            checkpoint()
        if total > MAX_NODES:
            raise SyntaxError("Python 输入 token 数超过 AST 预检查上限")
        if token.type == tokenize.NEWLINE:
            logical_tokens = 0
        elif token.type not in (tokenize.NL, tokenize.INDENT, tokenize.DEDENT,
                                tokenize.COMMENT, tokenize.ENDMARKER):
            logical_tokens += 1
            if logical_tokens > MAX_DEPTH * 4:
                raise SyntaxError("Python 逻辑语句超过 AST 预检查上限")

def analyze_with_ast(source: str) -> QuantumCryptoVisitor:
    checkpoint()
    try:
        validate_parser_input(source)
    except tokenize.TokenError as exc:
        raise SyntaxError(str(exc)) from exc
    tree = ast.parse(source)
    # Check before recursive visitors; ast.parse itself remains a bounded,
    # non-preemptible library operation, not a claimed hard CPU timeout.
    stack = [(tree, 0)]
    count = 0
    while stack:
        node, depth = stack.pop()
        count += 1
        if count % 128 == 1:
            checkpoint()
        if depth > MAX_DEPTH or count > MAX_NODES:
            raise AnalysisLimit("Python AST 深度或节点数超过分析上限")
        stack.extend((child, depth + 1) for child in ast.iter_child_nodes(node))
    visitor = QuantumCryptoVisitor()
    visitor.visit(tree)
    visitor.tree = tree
    return visitor


def scan_with_ast(source: str) -> list[Finding]:
    return sorted(analyze_with_ast(source).findings, key=lambda f: (f.line, f.algorithm))
