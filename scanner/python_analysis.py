from __future__ import annotations

import ast

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
    algorithm = match_module_hint(name)
    if not algorithm:
        return None
    prefix = "cryptography.hazmat.primitives.asymmetric."
    calls = {
        prefix + "rsa.generate_private_key": "rsa",
        prefix + "dsa.generate_private_key": "dsa",
        prefix + "dh.generate_parameters": "dh",
        prefix + "ec.generate_private_key": "ecc",
        prefix + "ec.ECDH": "ecdh",
        prefix + "ec.ECDSA": "ecdsa",
        "Crypto.PublicKey.RSA.generate": "rsa",
        "Crypto.PublicKey.DSA.generate": "dsa",
        "Crypto.PublicKey.ECC.generate": "ecc",
        "ecdsa.SigningKey.generate": "ecdsa",
    }
    for curve, cls in (("x25519", "X25519"), ("x448", "X448"), ("ed25519", "Ed25519"), ("ed448", "Ed448")):
        calls[f"{prefix}{curve}.{cls}PrivateKey.generate"] = curve
    return calls.get(name)


class LocalBindings(ast.NodeVisitor):
    """Collect lexical locals without entering nested scopes."""

    def __init__(self) -> None:
        self.names: set[str] = set()

    def visit_Name(self, node: ast.Name) -> None:
        if isinstance(node.ctx, (ast.Store, ast.Del)):
            self.names.add(node.id)

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
        self.class_outer: dict[str, str] | None = None

    def add_finding(self, line: int, algorithm: str, evidence: str) -> None:
        profile = VULNERABLE_ALGOS[algorithm]
        self.findings.append(Finding(line, profile.name, profile.risk_level, profile.reason, profile.recommendation, evidence))

    def visit_Import(self, node: ast.Import) -> None:
        for alias in node.names:
            self.aliases[alias.asname or alias.name.split(".")[0]] = alias.name if alias.asname else alias.name.split(".")[0]

    def visit_ImportFrom(self, node: ast.ImportFrom) -> None:
        for alias in node.names:
            self.aliases[alias.asname or alias.name] = f"{node.module}.{alias.name}" if not node.level else ""

    def resolve_algorithm_from_call(self, name: str) -> str | None:
        root, *tail = name.split(".")
        target = self.aliases.get(root)
        if not target:
            return None
        return resolve_direct_call(".".join([target, *tail]))

    def visit_Call(self, node: ast.Call) -> None:
        name = get_dotted_name(node.func)
        algorithm = self.resolve_algorithm_from_call(name) if name else None
        if algorithm:
            self.add_finding(node.lineno, algorithm, name)
        self.generic_visit(node)

    def scan_string_value(self, node: ast.AST, context: str, line: int) -> None:
        if not SENSITIVE_STRING_CONTEXT_RE.search(context):
            return
        if isinstance(node, (ast.List, ast.Tuple, ast.Set)):
            for item in node.elts:
                self.scan_string_value(item, context, getattr(item, "lineno", line))
        elif isinstance(node, ast.Constant) and isinstance(node.value, str):
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
        outer = self.aliases
        class_outer = self.class_outer
        self.aliases = (class_outer if class_outer is not None else outer).copy()
        self.class_outer = None
        bindings = LocalBindings()
        for statement in node.body:
            bindings.visit(statement)
        args = [*node.args.posonlyargs, *node.args.args, *node.args.kwonlyargs]
        args += [arg for arg in (node.args.vararg, node.args.kwarg) if arg]
        for name in bindings.names | {arg.arg for arg in args}:
            self.aliases[name] = ""
        for statement in node.body:
            self.visit(statement)
        self.aliases = outer
        self.class_outer = class_outer

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


def analyze_with_ast(source: str) -> QuantumCryptoVisitor:
    visitor = QuantumCryptoVisitor()
    visitor.visit(ast.parse(source))
    return visitor


def scan_with_ast(source: str) -> list[Finding]:
    return sorted(analyze_with_ast(source).findings, key=lambda f: (f.line, f.algorithm))
