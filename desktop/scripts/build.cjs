'use strict';
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..', '..');
const desktop = path.join(root, 'desktop');
const python = path.join(desktop, '.venv-build', process.platform === 'win32' ? 'Scripts/python.exe' : 'bin/python');
const npmCli = process.env.npm_execpath;
if (!npmCli || !fs.existsSync(npmCli)) throw new Error('请通过 npm --prefix desktop run build 运行构建');
function run(command, args, cwd = root) {
  const result = spawnSync(command, args, { cwd, stdio: 'inherit', windowsHide: true, shell: false });
  if (result.error || result.status !== 0) throw new Error(`构建步骤失败：${path.basename(command)}`);
}
const arch = process.arch;
if (!['win32', 'darwin', 'linux'].includes(process.platform) ||
    !(arch === 'x64' || (process.platform === 'darwin' && arch === 'arm64'))) {
  throw new Error('当前操作系统或架构不在首版目标中');
}
if (!fs.existsSync(python)) run(process.env.QUANTUM_BUILD_PYTHON || 'python', ['-m', 'venv', path.join(desktop, '.venv-build')]);
const pythonArch = spawnSync(python, ['-c', 'import platform; print(platform.machine().lower())'], { encoding: 'utf8', windowsHide: true });
const expectedArch = arch === 'arm64' ? ['arm64', 'aarch64'] : ['amd64', 'x86_64'];
if (pythonArch.status !== 0 || !expectedArch.includes(pythonArch.stdout.trim())) throw new Error('Python 与桌面构建架构不一致');
run(python, ['-m', 'pip', 'install', '-r', path.join(desktop, 'requirements-build.txt')]);
run(process.execPath, [npmCli, 'ci', '--prefix', 'web']);
run(process.execPath, [npmCli, '--prefix', 'web', 'test']);
run(process.execPath, [npmCli, '--prefix', 'web', 'run', 'build']);
run(process.execPath, [npmCli, '--prefix', 'desktop', 'test']);
run(python, [path.join(desktop, 'scripts', 'write_notices.py')]);
run(python, ['-m', 'PyInstaller', '--noconfirm', '--clean', '--distpath',
  path.join(desktop, 'build', 'backend'), '--workpath', path.join(desktop, 'build', 'work'),
  path.join(desktop, 'backend.spec')]);
run(python, [path.join(desktop, 'scripts', 'smoke_backend.py'),
  path.join(desktop, 'build', 'backend', 'quantum-backend', process.platform === 'win32' ? 'quantum-backend.exe' : 'quantum-backend')]);
const builder = path.join(desktop, 'node_modules', 'electron-builder', 'cli.js');
const target = { win32: '--win', darwin: '--mac', linux: '--linux' }[process.platform];
run(process.execPath, [builder, target, `--${arch}`, '--publish', 'never'], desktop);
run(process.execPath, [path.join(__dirname, 'checksums.cjs')], desktop);
