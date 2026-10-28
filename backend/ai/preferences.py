"""Non-secret profile metadata plus explicitly selected OS credential backends."""
from __future__ import annotations

import importlib
import json
import os
from pathlib import Path
import sys
import uuid

from backend.ai.config import POLICY, Settings


def profile_root() -> Path:
    if os.environ.get('QUANTUM_AI_CONFIG_DIR'):
        return Path(os.environ['QUANTUM_AI_CONFIG_DIR']).expanduser().resolve()
    if sys.platform == 'win32':
        return Path(os.environ.get('LOCALAPPDATA', Path.home() / 'AppData/Local')) / 'QuantumResistantScanner/web'
    if sys.platform == 'darwin':
        return Path.home() / 'Library/Application Support/QuantumResistantScanner/web'
    return Path(os.environ.get('XDG_CONFIG_HOME', Path.home() / '.config')) / 'quantum-resistant/web'


class SystemCredentials:
    service = 'org.quantumresistant.scanner.web.ai'

    def backend(self):
        # Never invoke automatic discovery or user-configured third-party backends.
        module, name = ('Windows', 'WinVaultKeyring') if sys.platform == 'win32' else ('macOS', 'Keyring') if sys.platform == 'darwin' else ('SecretService', 'Keyring')
        backend = getattr(importlib.import_module('keyring.backends.' + module), name)()
        if backend.priority <= 0:
            raise RuntimeError('安全存储不可用')
        return backend

    def read(self, identity):
        return self.backend().get_password(self.service, identity)

    def write(self, identity, value):
        self.backend().set_password(self.service, identity, value)

    def delete(self, identity):
        self.backend().delete_password(self.service, identity)


class Preferences:
    def __init__(self, root=None, credentials=None):
        self.root = root or profile_root()
        self.credentials = credentials or SystemCredentials()
        self.status = 'process'
        self.persisted = False

    def record(self):
        file = self.root / 'ai-settings.json'
        if file.stat().st_size > 65536:
            raise ValueError('设置文件过大')
        return json.loads(file.read_text(encoding='utf-8'))

    def load(self):
        try:
            record = self.record()
            value = Settings.model_validate({**record['settings'], 'remember': True, 'api_key': ''})
            if record.get('credential'):
                key = self.credentials.read(record['credential'])
                if not key:
                    raise ValueError('凭据不可用')
                value.api_key = key
            value.consent = value.consent and record.get('policy') == POLICY
            self.persisted, self.status = True, 'system'
            return value
        except FileNotFoundError:
            return None
        except Exception:
            self.status = 'unavailable'
            return None

    def save(self, config):
        identity = uuid.uuid4().hex if config.api_key else None
        temporary = None
        try:
            old = self.record()
        except (OSError, ValueError):
            old = {}
        try:
            if identity:
                self.credentials.write(identity, config.api_key)
            self.root.mkdir(parents=True, exist_ok=True, mode=0o700)
            value = {k: v for k, v in config.public().items() if k in Settings.model_fields and k not in ('remember', 'api_key')}
            temporary = self.root / ('ai-settings-' + uuid.uuid4().hex + '.tmp')
            descriptor = os.open(temporary, os.O_CREAT | os.O_EXCL | os.O_WRONLY, 0o600)
            with os.fdopen(descriptor, 'w', encoding='utf-8') as stream:
                json.dump({'settings': value, 'credential': identity, 'policy': POLICY}, stream, ensure_ascii=False)
                stream.flush()
                os.fsync(stream.fileno())
            os.replace(temporary, self.root / 'ai-settings.json')
            self.persisted, self.status = True, 'system'
        except Exception:
            self.persisted, self.status = False, 'unavailable'
            if temporary is not None:
                try:
                    temporary.unlink(missing_ok=True)
                except OSError:
                    pass
            if identity:
                try:
                    self.credentials.delete(identity)
                except Exception:
                    pass
            return False
        previous = old.get('credential')
        if previous and previous != identity:
            try:
                self.credentials.delete(previous)
            except Exception:
                pass  # New profile is already durable; never discard it.
        return True

    def clear(self):
        try:
            record = self.record()
        except (OSError, ValueError):
            record = {}
        # Metadata is removed first, so failed OS deletion cannot revive a key.
        (self.root / 'ai-settings.json').unlink(missing_ok=True)
        self.persisted, self.status = False, 'process'
        if record.get('credential'):
            try:
                self.credentials.delete(record['credential'])
            except Exception:
                pass
