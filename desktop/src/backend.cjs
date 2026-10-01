'use strict';
const { spawn } = require('node:child_process');
const { EventEmitter } = require('node:events');
const readline = require('node:readline');
const { randomBytes } = require('node:crypto');

class BackendProcess extends EventEmitter {
  constructor(command, args, { dataRoot, cacheRoot, log = () => {}, timeout = 30000, spawnProcess = spawn } = {}) {
    super();
    this.command = command;
    this.args = args;
    this.config = { data_root: dataRoot, cache_root: cacheRoot, token: randomBytes(32).toString('hex') };
    this.token = this.config.token;
    this.log = log;
    this.timeout = timeout;
    this.spawnProcess = spawnProcess;
    this.pending = new Map();
    this.sequence = 0;
    this.stopping = false;
  }
  async start() {
    return new Promise((resolve, reject) => {
      let ready = false;
      const env = { ...process.env, PYTHONUTF8: '1', PYTHONDONTWRITEBYTECODE: '1' };
      for (const key of ['PYTHONPATH', 'PYTHONHOME', 'NODE_OPTIONS', 'ELECTRON_RUN_AS_NODE']) delete env[key];
      const timer = setTimeout(() => fail(new Error('扫描服务启动超时')), this.timeout);
      const fail = (error) => { clearTimeout(timer); reject(error); };
      try {
        this.child = this.spawnProcess(this.command, this.args, { stdio: ['pipe', 'pipe', 'pipe'], windowsHide: true, shell: false, env });
      } catch { fail(new Error('无法启动扫描服务')); return; }
      this.child.stdin.on('error', () => {});
      this.child.stderr.on('data', () => this.log('扫描后端输出诊断，请查看 backend.log'));
      let protocolBytes = 0;
      this.child.stdout.on('data', (chunk) => {
        protocolBytes += chunk.length;
        if (protocolBytes > 65536) { this.child.kill(); fail(new Error('扫描服务通信异常')); }
        if (chunk.includes(10)) protocolBytes = 0;
      });
      const lines = readline.createInterface({ input: this.child.stdout });
      lines.on('line', (line) => {
        let message;
        try { message = JSON.parse(line); } catch { fail(new Error('扫描服务通信异常')); return; }
        if (!ready && message.event === 'ready') {
          if (!Number.isInteger(message.port) || message.port < 1 || message.port > 65535 ||
              !Number.isInteger(message.pid) || message.pid < 1) {
            fail(new Error('扫描服务启动信息无效')); return;
          }
          ready = true;
          this.origin = `http://127.0.0.1:${message.port}`;
          clearTimeout(timer);
          resolve(this.origin);
        } else if (message.event === 'status' && Number.isInteger(message.active) && message.active >= 0) {
          const complete = this.pending.get(message.id);
          if (complete) { this.pending.delete(message.id); complete(message.active); }
        }
      });
      this.child.once('error', () => fail(new Error('扫描服务文件缺失或无法运行')));
      this.child.once('close', () => {
        lines.close();
        if (!ready) fail(new Error('扫描服务未能启动'));
        for (const complete of this.pending.values()) complete(null);
        this.pending.clear();
        this.emit('exit', this.stopping);
      });
      this.child.stdin.write(`${JSON.stringify(this.config)}\n`);
      // Secret remains only in the in-memory header capability.
      this.config = null;
    });
  }
  async active() {
    if (!this.child?.pid || this.child.exitCode !== null || this.child.signalCode !== null) return null;
    const id = ++this.sequence;
    return new Promise((resolve) => {
      const timer = setTimeout(() => { this.pending.delete(id); resolve(null); }, 1500);
      this.pending.set(id, (count) => { clearTimeout(timer); resolve(count); });
      this.child.stdin.write(`${JSON.stringify({ command: 'status', id })}\n`);
    });
  }
  async stop() {
    this.stopping = true;
    if (!this.child?.pid || this.child.exitCode !== null || this.child.signalCode !== null) return;
    await new Promise((resolve) => {
      const timer = setTimeout(() => { this.child.kill('SIGKILL'); }, 10000);
      this.child.once('close', () => { clearTimeout(timer); resolve(); });
      this.child.stdin.end(`${JSON.stringify({ command: 'shutdown' })}\n`);
    });
  }
}
module.exports = { BackendProcess };
