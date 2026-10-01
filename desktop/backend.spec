# Python backend assets are explicit: no popular snapshots, tests or secrets.
from pathlib import Path

root = Path(SPECPATH).parent
datas = [(str(root / 'web' / 'index.html'), 'web'),
         (str(root / 'web' / 'assets'), 'web/assets')]
datas += [(str(file), 'sample_inputs') for file in (root / 'sample_inputs').glob('*.py')]
a = Analysis([str(root / 'desktop' / 'backend_entry.py')], pathex=[str(root)],
             binaries=[], datas=datas, hiddenimports=['uvicorn.logging', 'uvicorn.loops.asyncio',
             'uvicorn.protocols.http.h11_impl', 'uvicorn.lifespan.on'],
             hookspath=[], runtime_hooks=[],
             excludes=['hypothesis', 'pytest', 'tests', 'tkinter', 'pip', 'setuptools',
                       'rich', 'pygments', 'pip_audit', 'cyclonedx', 'requests'],
             noarchive=False)
pyz = PYZ(a.pure)
exe = EXE(pyz, a.scripts, [], exclude_binaries=True, name='quantum-backend',
          debug=False, bootloader_ignore_signals=False, strip=False, upx=False,
          console=True, disable_windowed_traceback=False)
coll = COLLECT(exe, a.binaries, a.datas, strip=False, upx=False, name='quantum-backend')
