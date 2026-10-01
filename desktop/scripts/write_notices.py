"""Collect license files of exactly the frozen runtime's installed distributions."""
from __future__ import annotations

from importlib import metadata
from pathlib import Path

root = Path(__file__).resolve().parents[1]
from packaging.requirements import Requirement
packages = []
for line in (root / 'requirements-runtime.txt').read_text().splitlines():
    if not line or line.startswith('#'):
        continue
    requirement = Requirement(line)
    if not requirement.marker or requirement.marker.evaluate():
        packages.append(requirement.name)
parts = ['THIRD-PARTY NOTICES\n\nElectron includes its LICENSE and licenses.chromium.html.\n'
         'Python runtime license: https://docs.python.org/3/license.html\n'
         'This file describes bundled dependencies and does not grant a license to the project itself.\n']
# The distributed executable also contains PyInstaller's bootloader.
for name in sorted(set(packages + ['pyinstaller'])):
    distribution = metadata.distribution(name)
    parts.append(f'\n{name} {distribution.version}\n' + '=' * 72 + '\n')
    included = False
    for file in distribution.files or []:
        if 'dist-info' in str(file) and ('license' in file.name.lower() or 'copying' in file.name.lower()):
            parts.append(distribution.locate_file(file).read_text(encoding='utf-8', errors='replace') + '\n')
            included = True
    if not included:
        parts.append('License metadata: ' + str(distribution.metadata.get('License-Expression') or distribution.metadata.get('License', 'See project homepage')) + '\n')
        parts.append('Project: ' + str(distribution.metadata.get('Project-URL') or distribution.metadata.get('Home-page', '')) + '\n')
# CPython's installed license accompanies the frozen interpreter as a notice.
import sys
import sysconfig
python_license = next((candidate for candidate in (
    Path(sys.base_prefix) / 'LICENSE.txt', Path(sys.base_prefix) / 'LICENSE',
    Path(sysconfig.get_path('stdlib')) / 'LICENSE.txt',
    Path(sysconfig.get_path('stdlib')) / 'LICENSE',
    root / 'build' / 'CPYTHON-LICENSE.txt',
) if candidate.is_file()), None)
if python_license is None:
    raise RuntimeError('缺少CPython许可文件，请将所用Python的LICENSE保存为desktop/build/CPYTHON-LICENSE.txt后重新构建')
parts.append('\nCPython\n' + python_license.read_text(encoding='utf-8') + '\n')
(root / 'build').mkdir(exist_ok=True)
notice = '\n'.join(line.rstrip() for line in ''.join(parts).splitlines())
(root / 'build' / 'THIRD-PARTY-NOTICES.txt').write_text(notice.rstrip() + '\n', encoding='utf-8')
