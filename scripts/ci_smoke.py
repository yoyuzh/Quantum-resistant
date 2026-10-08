"""Check the real local server and built assets without remote collection."""

from __future__ import annotations

from html.parser import HTMLParser
import os
from pathlib import Path
import socket
import subprocess
import sys
import tempfile
import time

import httpx


ROOT = Path(__file__).resolve().parents[1]


class BuiltAssets(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.scripts: list[str] = []
        self.styles: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attributes = dict(attrs)
        if tag == "script" and attributes.get("type") == "module":
            self.scripts.append(attributes.get("src") or "")
        if tag == "link" and attributes.get("rel") == "stylesheet":
            self.styles.append(attributes.get("href") or "")


def require(condition: bool, message: str) -> None:
    if not condition:
        raise RuntimeError(message)


def check_application(client: httpx.Client) -> None:
    page = client.get("/")
    page.raise_for_status()
    require("text/html" in page.headers.get("content-type", ""), "首页未返回 HTML")
    assets = BuiltAssets()
    assets.feed(page.text)
    require(bool(assets.scripts and assets.styles), "首页缺少构建后的 JS 或 CSS")
    for path in assets.scripts + assets.styles:
        require(path.startswith("/static/assets/"), f"非预期构建资源路径：{path}")
        response = client.get(path)
        response.raise_for_status()
        require(bool(response.content), f"构建资源为空：{path}")
        expected_type = "javascript" if path in assets.scripts else "text/css"
        require(expected_type in response.headers.get("content-type", ""),
                f"构建资源类型错误：{path}")

    config = client.get("/api/config")
    config.raise_for_status()
    require(isinstance(config.json(), dict), "配置接口未返回对象")
    # This is a static string sent to the scanner, never imported or executed.
    response = client.post("/api/scan/snippet", json={
        "filename": "ci-smoke.py",
        "content": "from cryptography.hazmat.primitives.asymmetric import rsa\n"
                   "key = rsa.generate_private_key(public_exponent=65537, key_size=2048)\n",
    })
    response.raise_for_status()
    findings = response.json()["findings"]
    require(len(findings) == 1 and findings[0]["algorithm"] == "RSA"
            and findings[0]["line"] == 2, "片段扫描结果与预期不符")


def main() -> None:
    with socket.socket() as listener:
        listener.bind(("127.0.0.1", 0))
        port = listener.getsockname()[1]

    with tempfile.TemporaryDirectory(prefix="quantum-ci-") as directory:
        environment = dict(os.environ)
        environment.update({
            "TMPDIR": directory, "TMP": directory, "TEMP": directory,
            "PYTHONUTF8": "1", "PYTHONDONTWRITEBYTECODE": "1",
            "QUANTUM_ALLOWED_HOSTS": "127.0.0.1",
            "QUANTUM_ALLOWED_ORIGINS": "",
        })
        with (Path(directory) / "server.log").open("w+", encoding="utf-8") as log:
            process = subprocess.Popen(
                [sys.executable, "-B", "start.py", "--host", "127.0.0.1",
                 "--port", str(port), "--strict-port"],
                cwd=ROOT, env=environment, stdout=log, stderr=log,
            )
            try:
                with httpx.Client(base_url=f"http://127.0.0.1:{port}",
                                  trust_env=False, timeout=5) as client:
                    deadline = time.monotonic() + 30
                    while True:
                        require(process.poll() is None, "服务在就绪前退出")
                        try:
                            health = client.get("/api/health")
                        except httpx.TransportError:
                            require(time.monotonic() < deadline, "等待服务就绪超时")
                            time.sleep(0.2)
                            continue
                        health.raise_for_status()
                        require(health.json() == {"status": "ok"}, "健康检查结果异常")
                        break
                    check_application(client)
            except Exception:
                log.flush()
                log.seek(0)
                print(log.read(), file=sys.stderr)
                raise
            finally:
                if process.poll() is None:
                    process.terminate()
                try:
                    process.wait(timeout=10)
                except subprocess.TimeoutExpired:
                    process.kill()
                    process.wait(timeout=5)
    print("冒烟检查通过：首页、JS/CSS、健康检查、配置和静态片段扫描。")


if __name__ == "__main__":
    main()
