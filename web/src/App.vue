<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';

const DEFAULT_RSA_CODE = `from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import padding, rsa

def payload() -> bytes:
    return b"demo-message"

if __name__ == "__main__":
    message = payload()

    # 演示：这里故意使用 RSA，便于扫描器识别
    private_key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=2048,
        backend=default_backend(),
    )

    signature = private_key.sign(
        message,
        padding.PKCS1v15(),
        hashes.SHA256(),
    )

    print(signature[:8])`;

// --- 主题 ---
const theme = ref(localStorage.getItem('app-theme') || 'light');
const toggleTheme = () => { theme.value = theme.value === 'light' ? 'dark' : 'light'; };
watch(theme, (val) => { localStorage.setItem('app-theme', val); document.documentElement.setAttribute('data-theme', val); });
onMounted(async () => {
  document.documentElement.setAttribute('data-theme', theme.value);
  try {
    const response = await fetch('/api/knowledge/graph');
    if (response.ok) knowledgeGraph.value = await response.json();
  } catch {
    knowledgeGraph.value = { nodes: [], edges: [] };
  }
});

// --- 状态 ---
const scanMode = ref('snippet');
const snippetFilename = ref('snippet.py');
const snippetContent = ref(DEFAULT_RSA_CODE);
const selectedFiles = ref([]);
const githubRepositoryUrl = ref('https://github.com/pyca/cryptography');
const pypiPackageName = ref('cryptography');
const isScanning = ref(false);
const scanResult = ref(null);
const knowledgeGraph = ref({ nodes: [], edges: [] });
const scanProgress = ref(0);
const errorMsg = ref('');
const expandedFindings = ref(new Set());

// --- 热门榜单 ---
const popularData = ref(null);
const popularLoading = ref(false);
const popularScanning = ref(false);
const popularError = ref('');
const expandedPopularRepo = ref(null);
const popularTopN = ref(20);

// 动画计数器
const animatedSourceCount = ref(0);
const animatedFindingCount = ref(0);
const animatedAlgoCount = ref(0);

// 扫描文本轮播
const scanMessages = [
  '⌁ 正在解析语法树…',
  '⌁ 识别加密算法调用…',
  '⌁ 评估量子脆弱性…',
  '⌁ 生成风险分析报告…'
];
const scanMsgIndex = ref(0);
let scanMsgTimer = null;

// 最小扫描动画时长 (ms) — 即使 API 秒返也会等够这段时间
const MIN_SCAN_DURATION = 2400;

// --- 计算属性 ---
const fileList = computed(() => selectedFiles.value.map(f => f.name));
const findingsByFile = computed(() => {
  if (!scanResult.value) return {};
  const grouped = {};
  scanResult.value.findings.forEach(f => {
    if (!grouped[f.file_name]) grouped[f.file_name] = [];
    grouped[f.file_name].push(f);
  });
  return grouped;
});

const algoCount = computed(() =>
  scanResult.value ? Object.keys(scanResult.value.summary.algorithm_counts).length : 0
);
const migrationScore = computed(() => scanResult.value?.summary?.migration_score || null);
const sourceTypeLabel = computed(() => {
  const labels = {
    snippet: '代码片段',
    manual_upload: '本地文件',
    github_repository: 'GitHub 仓库',
    pypi_package: 'PyPI 包',
  };
  return labels[scanResult.value?.source_type] || '未知来源';
});
const topAlgorithms = computed(() => {
  if (!scanResult.value) return [];
  return Object.entries(scanResult.value.summary.algorithm_counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([name, count]) => ({ name, count }));
});
const graphColumns = computed(() => {
  const groups = {};
  knowledgeGraph.value.nodes.forEach(node => {
    if (!groups[node.type]) groups[node.type] = [];
    groups[node.type].push(node);
  });
  return groups;
});

// 风险等级配色
const riskColors = computed(() => ({
  '高': { color: 'var(--danger)', bg: 'var(--danger-bg)', border: 'var(--danger)' },
  '中': { color: 'var(--warning)', bg: 'var(--warning-bg)', border: 'var(--warning)' },
  '低': { color: 'var(--accent)', bg: 'var(--accent-glow)', border: 'var(--accent)' },
}));

const getRiskStyle = (level) => {
  const key = level.includes('高') ? '高' : level.includes('中') ? '中' : '低';
  return riskColors.value[key] || riskColors.value['低'];
};

// --- 方法 ---
const readJsonResponse = async (response, fallbackMessage) => {
  const text = await response.text();
  if (!text) {
    if (response.ok) return null;
    throw new Error(fallbackMessage || `请求失败（HTTP ${response.status}）`);
  }
  try { return JSON.parse(text); }
  catch { throw new Error(fallbackMessage || '服务返回了非 JSON 内容'); }
};

const toggleMode = (mode) => {
  scanMode.value = mode;
  errorMsg.value = '';
  if (mode === 'popular') {
    loadPopularData();
  }
};

const loadPopularData = async () => {
  popularLoading.value = true;
  popularError.value = '';
  popularData.value = null;
  expandedPopularRepo.value = null;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch('/api/popular/results', { signal: controller.signal });
    clearTimeout(timeoutId);
    if (response.status === 404) {
      popularError.value = '';
      return;
    }
    if (!response.ok) {
      popularError.value = '加载热门仓库数据失败';
      return;
    }
    const data = await response.json();
    if (!data.repos || data.repos.length === 0) {
      popularError.value = '';
      return;
    }
    popularData.value = data;
  } catch (err) {
    popularError.value = '加载热门仓库数据失败';
  } finally {
    clearTimeout(timeoutId);
    popularLoading.value = false;
  }
};

const triggerPopularScan = async () => {
  popularScanning.value = true;
  popularError.value = '';
  popularData.value = null;
  expandedPopularRepo.value = null;
  try {
    const response = await fetch('/api/popular/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ top: popularTopN.value })
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      popularError.value = err.detail || '扫描热门仓库失败';
      return;
    }
    const data = await response.json();
    if (!data.repos || data.repos.length === 0) {
      popularError.value = '扫描完成但未获取到仓库数据';
      return;
    }
    popularData.value = data;
  } catch (err) {
    popularError.value = '扫描热门仓库失败，请检查网络连接';
  } finally {
    popularScanning.value = false;
  }
};

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files);
  const filtered = files.filter(f => /\.(py|pyw|txt|pem|ya?ml|json|cfg|ini|toml)$/i.test(f.name));
  if (filtered.length < files.length) alert('部分文件格式不支持，仅限代码、配置和密钥材料文本文件');
  // 合并去重
  const existing = new Set(selectedFiles.value.map(f => f.name));
  const merged = [...selectedFiles.value];
  filtered.forEach(f => {
    if (!existing.has(f.name)) merged.push(f);
  });
  selectedFiles.value = merged;
};

const removeFile = (index) => {
  selectedFiles.value.splice(index, 1);
};

const animateCount = (refVar, target, duration = 700) => {
  const start = refVar.value;
  const startTime = performance.now();
  const step = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    refVar.value = Math.round(start + (target - start) * eased);
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};

const startScan = async () => {
  isScanning.value = true;
  errorMsg.value = '';
  scanResult.value = null;
  scanProgress.value = 0;
  expandedFindings.value = new Set();

  scanMsgIndex.value = 0;
  scanMsgTimer = setInterval(() => {
    scanMsgIndex.value = (scanMsgIndex.value + 1) % scanMessages.length;
  }, 1500);

  // 进度条动画
  const progressInterval = setInterval(() => {
    scanProgress.value = Math.min(scanProgress.value + 4, 90);
  }, 120);

  try {
    const startTime = Date.now();
    let response;
    if (scanMode.value === 'snippet') {
      response = await fetch('/api/scan/snippet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: snippetFilename.value, content: snippetContent.value })
      });
    } else if (scanMode.value === 'files') {
      if (selectedFiles.value.length === 0) throw new Error('请先选择文件');
      const formData = new FormData();
      selectedFiles.value.forEach(file => formData.append('files', file));
      response = await fetch('/api/scan/files', { method: 'POST', body: formData });
    } else if (scanMode.value === 'github') {
      response = await fetch('/api/scan/github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repository_url: githubRepositoryUrl.value })
      });
    } else if (scanMode.value === 'pypi') {
      response = await fetch('/api/scan/pypi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ package_name: pypiPackageName.value })
      });
    } else {
      throw new Error('未知扫描模式');
    }

    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, MIN_SCAN_DURATION - elapsed);
    if (remaining > 0) await new Promise(r => setTimeout(r, remaining));

    if (!response.ok) {
      const errData = await readJsonResponse(response, `扫描失败（HTTP ${response.status}）`);
      throw new Error(errData.detail || '扫描失败');
    }
    scanResult.value = await readJsonResponse(response, '扫描接口没有返回有效结果');

    // 进度条填满
    scanProgress.value = 100;
    await new Promise(r => setTimeout(r, 200));

    // 数字动画
    await nextTick();
    animateCount(animatedSourceCount, scanResult.value.summary.source_count);
    animateCount(animatedFindingCount, scanResult.value.summary.finding_count);
    animateCount(animatedAlgoCount, algoCount.value);
  } catch (err) {
    errorMsg.value = err.message;
  } finally {
    clearInterval(scanMsgTimer);
    clearInterval(progressInterval);
    isScanning.value = false;
  }
};

const toggleFinding = (id) => {
  if (expandedFindings.value.has(id)) expandedFindings.value.delete(id);
  else expandedFindings.value.add(id);
};

const getCodeSnippet = (fileName, lineNum) => {
  if (!scanResult.value) return [];
  const source = scanResult.value.sources.find(s => s.file_name === fileName);
  if (!source) return [];
  const lines = source.content.split('\n');
  const start = Math.max(0, lineNum - 4);
  const end = Math.min(lines.length, lineNum + 3);
  return lines.slice(start, end).map((text, idx) => ({
    number: start + idx + 1, text, isTarget: start + idx + 1 === lineNum
  }));
};

const exportMarkdown = async () => {
  if (!scanResult.value) return;
  try {
    const response = await fetch('/api/report/markdown', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        scanned_at: scanResult.value.scanned_at,
        source_type: scanResult.value.source_type,
        sources: scanResult.value.sources,
        findings: scanResult.value.findings
      })
    });
    if (!response.ok) throw new Error('导出报告失败');
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quantum-scan-report-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (err) { alert(err.message); }
};

const formatTime = (isoStr) => {
  if (!isoStr) return '';
  return isoStr.replace('T', ' ').split('.')[0];
};

const formatStarCount = (count) => {
  if (count >= 1000) return (count / 1000).toFixed(1) + 'k';
  return String(count);
};

const formatScannedAt = (isoStr) => {
  if (!isoStr) return '';
  return isoStr.replace('T', ' ').replace(/\+.*$/, '');
};

const getScoreColor = (score) => {
  if (score >= 40) return 'var(--danger)';
  if (score > 0) return 'var(--warning)';
  return 'var(--accent)';
};

const getScoreClass = (score) => {
  if (score >= 40) return 'high';
  if (score > 0) return 'medium';
  return 'low';
};

const sortedPopularRepos = computed(() => {
  if (!popularData.value || !popularData.value.repos) return [];
  return [...popularData.value.repos].sort((a, b) => b.star_count - a.star_count);
});

const toggleRepoDetail = (idx) => {
  if (expandedPopularRepo.value === idx) {
    expandedPopularRepo.value = null;
  } else {
    expandedPopularRepo.value = idx;
  }
};

const riskBadgeClass = (level) => {
  if (level.includes('高') || /high|critical/i.test(level)) return 'high';
  if (level.includes('中') || /medium/i.test(level)) return 'medium';
  return 'low';
};
</script>

<template>
  <div class="app-container">
    <div class="bg-grid"></div>

    <header class="main-header">
      <div class="logo">
        <span class="logo-marker">&gt;_</span>
        <h1>Quantum‑Safe Scanner</h1>
        <span class="logo-divider">·</span>
        <span class="logo-subtitle">抗量子迁移风险分析平台</span>
      </div>
      <div class="header-actions">
        <button @click="toggleTheme" class="btn btn-icon" :title="theme === 'light' ? '切换深色模式' : '切换浅色模式'">
          <span class="theme-icon">{{ theme === 'light' ? '☀' : '☾' }}</span>
        </button>
        <button v-if="scanResult" @click="exportMarkdown" class="btn btn-outline">
          <span class="btn-icon-text">⇩</span> 导出报告
        </button>
      </div>
    </header>

    <main class="main-layout">
      <!-- 左侧工作区 -->
      <section class="workspace">
        <div class="card">
          <div class="tabs">
            <button :class="{ active: scanMode === 'snippet' }" @click="toggleMode('snippet')">
              <span class="tab-icon">&lt;/&gt;</span>
              <span>代码片段</span>
            </button>
            <button :class="{ active: scanMode === 'files' }" @click="toggleMode('files')">
              <span class="tab-icon">⊞</span>
              <span>文件上传</span>
            </button>
            <button :class="{ active: scanMode === 'github' }" @click="toggleMode('github')">
              <span class="tab-icon">⌘</span>
              <span>GitHub</span>
            </button>
            <button :class="{ active: scanMode === 'pypi' }" @click="toggleMode('pypi')">
              <span class="tab-icon">◇</span>
              <span>PyPI</span>
            </button>
            <button :class="{ active: scanMode === 'popular' }" @click="toggleMode('popular')">
              <span class="tab-icon">★</span>
              <span>热门榜单</span>
            </button>
          </div>

          <div class="tab-content">
            <!-- 代码片段模式 -->
            <div v-if="scanMode === 'snippet'" class="snippet-area">
              <div class="form-group">
                <label>文件名</label>
                <input v-model="snippetFilename" type="text" placeholder="e.g. main.py" class="input-field" />
              </div>
              <div class="form-group">
                <label>源代码</label>
                <div class="editor-wrap">
                  <div class="editor-line-numbers">
                    <span v-for="n in snippetContent.split('\n').length" :key="n">{{ n }}</span>
                  </div>
                  <textarea
                    v-model="snippetContent"
                    placeholder="在此粘贴 Python 代码…"
                    class="code-editor"
                    spellcheck="false"
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- 文件上传模式 -->
            <div v-else-if="scanMode === 'files'" class="upload-area">
              <div class="upload-dropzone" @click="$refs.fileInput.click()" @dragover.prevent @drop.prevent @drop="(e) => { const dt = e.dataTransfer; if (dt.files.length) { const input = $refs.fileInput; const fake = new DataTransfer(); Array.from(dt.files).forEach(f => fake.items.add(f)); input.files = fake.files; input.dispatchEvent(new Event('change')); } }">
                <input type="file" ref="fileInput" multiple @change="handleFileSelect" hidden accept=".py,.pyw,.txt,.pem,.yml,.yaml,.json,.cfg,.ini,.toml" />
                <div class="dropzone-hint">
                  <span class="upload-icon">⬆</span>
                  <p>拖放或点击选择文件</p>
                  <small>.py · .pem · .yml · .json &nbsp; 单文件 ≤ 2MB</small>
                </div>
              </div>

              <transition-group name="file-list-enter" tag="div" class="file-list-area">
                <div v-if="selectedFiles.length > 0" key="header" class="file-list-header">
                  <span class="file-count-badge">{{ selectedFiles.length }}</span>
                  个待扫描文件
                </div>
                <div v-for="(file, idx) in selectedFiles" :key="file.name + idx" class="file-chip">
                  <span class="file-chip-icon">▹</span>
                  <span class="file-chip-name">{{ file.name }}</span>
                  <span class="file-chip-size">{{ (file.size / 1024).toFixed(1) }} KB</span>
                  <button @click="removeFile(idx)" class="file-chip-remove" title="移除">×</button>
                </div>
              </transition-group>
            </div>

            <div v-else-if="scanMode === 'github'" class="remote-scan-area">
              <div class="form-group">
                <label>GitHub 仓库地址</label>
                <input
                  v-model="githubRepositoryUrl"
                  type="url"
                  placeholder="https://github.com/owner/repo"
                  class="input-field"
                />
              </div>
              <div class="source-hint">
                将下载 main/master 分支源码压缩包，扫描 Python、配置和密钥材料文件。
              </div>
            </div>

            <div v-else-if="scanMode === 'pypi'" class="remote-scan-area">
              <div class="form-group">
                <label>PyPI 包名</label>
                <input
                  v-model="pypiPackageName"
                  type="text"
                  placeholder="cryptography"
                  class="input-field"
                />
              </div>
              <div class="source-hint">
                优先下载源码包，提取可扫描文件并生成量子脆弱算法迁移建议。
              </div>
            </div>

            <div v-else-if="scanMode === 'popular'" class="popular-area">
              <div v-if="popularScanning" class="popular-loading">
                <span class="btn-spinner"></span> 正在扫描热门仓库，预计需要几分钟…
              </div>
              <div v-else-if="popularLoading" class="popular-loading">
                <span class="btn-spinner"></span> 正在加载热门仓库数据…
              </div>
              <div v-else-if="popularError" class="popular-error">
                <span class="err-prefix">✕</span> {{ popularError }}
                <button @click="triggerPopularScan" class="btn btn-outline popular-scan-btn">重新扫描</button>
              </div>
              <div v-else-if="popularData" class="popular-results">
                <div class="popular-header">
                  <span class="popular-title">热门 Python 仓库量子风险概览</span>
                  <span class="popular-time">{{ formatScannedAt(popularData.scanned_at) }}</span>
                  <button @click="triggerPopularScan" :disabled="popularScanning" class="btn btn-outline popular-scan-btn">
                    ↻ 重新扫描
                  </button>
                </div>
                <div class="popular-list">
                  <template v-for="(repo, idx) in sortedPopularRepos" :key="repo.full_name">
                    <div class="popular-repo-row" :class="{ expanded: expandedPopularRepo === idx }" @click="toggleRepoDetail(idx)">
                      <div class="repo-rank">{{ idx + 1 }}</div>
                      <div class="repo-info">
                        <span class="repo-name">{{ repo.full_name }}</span>
                        <span class="repo-stars">★ {{ formatStarCount(repo.star_count) }}</span>
                      </div>
                      <div class="repo-score" :class="getScoreClass(repo.migration_score)">
                        {{ repo.migration_score }}
                      </div>
                      <div class="repo-findings">
                        {{ repo.finding_count }} 项风险
                      </div>
                      <div class="repo-algos">
                        <span v-for="algo in repo.algorithms.slice(0, 4)" :key="algo" class="algo-pill small">{{ algo }}</span>
                      </div>
                      <span class="btn-arrow" :class="{ open: expandedPopularRepo === idx }">▸</span>
                    </div>
                    <transition name="expand">
                      <div v-if="expandedPopularRepo === idx" class="popular-detail">
                        <div v-if="!repo.findings || repo.findings.length === 0" class="popular-detail-empty">
                          该仓库未发现量子脆弱性问题
                        </div>
                        <div v-else class="popular-detail-list">
                          <div v-for="(f, fIdx) in repo.findings.slice(0, 20)" :key="fIdx" class="popular-finding-row">
                            <span class="line-badge">L{{ f.line }}</span>
                            <span class="popular-finding-file">{{ f.file_name }}</span>
                            <span class="algo-tag">{{ f.algorithm }}</span>
                            <span class="risk-badge" :class="riskBadgeClass(f.risk_level)">{{ f.risk_level }}</span>
                            <span class="popular-finding-evidence">{{ f.evidence }}</span>
                          </div>
                        </div>
                      </div>
                    </transition>
                  </template>
                </div>
              </div>
              <div v-else class="popular-empty">
                <div class="form-group">
                  <label>扫描数量</label>
                  <input v-model.number="popularTopN" type="number" min="1" max="100" class="input-field popular-top-input" placeholder="20" />
                </div>
                <div class="source-hint">
                  自动搜索 GitHub 上与密码学/加密相关的热门 Python 仓库并扫描量子脆弱性。
                </div>
                <button @click="triggerPopularScan" :disabled="popularScanning" class="btn btn-primary" style="margin-top: 0.8rem; width: 100%;">
                  <span class="btn-scan-icon">▶</span> 扫描 Top {{ popularTopN }} 热门仓库
                </button>
              </div>
            </div>

            <div v-if="scanMode !== 'popular'" class="actions">
              <button @click="startScan" :disabled="isScanning" class="btn btn-primary" :class="{ scanning: isScanning }">
                <span v-if="isScanning" class="btn-spinner"></span>
                <span v-if="!isScanning" class="btn-scan-icon">▶</span>
                {{ isScanning ? '分析中…' : '开始扫描' }}
              </button>
            </div>
          </div>
        </div>

        <transition name="slide-down">
          <div v-if="errorMsg" class="error-banner">
            <span class="err-prefix">✕</span> {{ errorMsg }}
          </div>
        </transition>
      </section>

      <!-- 右侧结果区 -->
      <section class="results-area">
        <!-- 热门榜单结果 -->
        <div v-if="scanMode === 'popular' && popularData && popularData.repos.length > 0" class="popular-right-results">
          <div class="popular-right-header">
            <h3>发现量子脆弱性的仓库</h3>
            <span class="popular-right-meta">{{ popularData.repos.filter(r => r.finding_count > 0).length }} / {{ popularData.repos.length }} 个仓库存在风险</span>
          </div>
          <div v-for="repo in popularData.repos.filter(r => r.finding_count > 0)" :key="repo.full_name" class="popular-right-repo">
            <div class="popular-right-repo-header">
              <span class="repo-name">{{ repo.full_name }}</span>
              <span class="repo-stars">★ {{ formatStarCount(repo.star_count) }}</span>
              <div class="repo-score" :class="getScoreClass(repo.migration_score)">{{ repo.migration_score }}/100</div>
            </div>
            <div class="popular-right-algos">
              <span v-for="algo in repo.algorithms" :key="algo" class="algo-pill small">{{ algo }}</span>
            </div>
            <div class="popular-right-findings">
              <div v-for="(f, fIdx) in repo.findings" :key="fIdx" class="popular-right-finding">
                <span class="line-badge">L{{ f.line }}</span>
                <span class="popular-finding-file">{{ f.file_name }}</span>
                <span class="algo-tag">{{ f.algorithm }}</span>
                <span class="risk-badge" :class="riskBadgeClass(f.risk_level)">{{ f.risk_level }}</span>
                <span class="popular-finding-evidence">{{ f.evidence }}</span>
              </div>
            </div>
          </div>
          <div v-if="popularData.repos.filter(r => r.finding_count > 0).length === 0" class="no-risk-banner">
            <span class="ok-marker">✓</span>
            所有仓库均未发现量子脆弱性问题
          </div>
        </div>

        <!-- 热门榜单扫描中 -->
        <div v-else-if="scanMode === 'popular' && popularScanning" class="scanning-state">
          <div class="scan-progress">
            <div class="scan-ring">
              <svg viewBox="0 0 100 100">
                <circle class="ring-bg" cx="50" cy="50" r="42" />
                <circle class="ring-fg" cx="50" cy="50" r="42" />
              </svg>
              <span class="scan-ring-text">⚡</span>
            </div>
          </div>
          <p class="scan-label">⌁ 正在扫描热门仓库，请耐心等待…</p>
          <div class="scan-dots">
            <span></span><span></span><span></span>
          </div>
        </div>

        <!-- 热门榜单空状态 -->
        <div v-else-if="scanMode === 'popular'" class="empty-state">
          <div class="empty-icon-wrapper">
            <span class="empty-icon">★</span>
            <span class="empty-icon-shadow">★</span>
          </div>
          <h2>热门仓库扫描</h2>
          <p>扫描 GitHub 上密码学相关热门仓库，检测量子脆弱算法的使用情况</p>
        </div>

        <!-- 等待状态 -->
        <div v-else-if="!scanResult && !isScanning && !errorMsg" class="empty-state">
          <div class="empty-icon-wrapper">
            <span class="empty-icon">&lt;/&gt;</span>
            <span class="empty-icon-shadow">&lt;/&gt;</span>
          </div>
          <h2>准备就绪</h2>
          <p>输入 Python 代码或上传文件，检测 RSA · ECDSA · DSA · DH 等量子脆弱算法的使用</p>
        </div>

        <!-- 扫描中 -->
        <transition name="fade">
          <div v-if="isScanning" class="scanning-state">
            <div class="scan-progress">
              <div class="scan-ring">
                <svg viewBox="0 0 100 100">
                  <circle class="ring-bg" cx="50" cy="50" r="42" />
                  <circle class="ring-fg" cx="50" cy="50" r="42" />
                </svg>
                <span class="scan-ring-text">⚡</span>
              </div>
              <div class="scan-bar-wrap">
                <div class="scan-bar-track">
                  <div class="scan-bar-fill" :style="{ width: scanProgress + '%' }"></div>
                </div>
              </div>
            </div>
            <p class="scan-label">{{ scanMessages[scanMsgIndex] }}</p>
            <div class="scan-dots">
              <span></span><span></span><span></span>
            </div>
          </div>
        </transition>

        <!-- 结果 -->
        <transition name="fade-up">
          <div v-if="scanResult" class="results-content">
            <div class="summary-grid">
              <div class="summary-card">
                <span class="label">扫描文件</span>
                <span class="value">{{ animatedSourceCount }}</span>
              </div>
              <div class="summary-card accent-danger" :class="{ 'has-findings': animatedFindingCount > 0 }">
                <span class="label">发现风险</span>
                <span class="value danger">{{ animatedFindingCount }}</span>
              </div>
              <div class="summary-card">
                <span class="label">涉及算法</span>
                <span class="value">{{ animatedAlgoCount }}</span>
              </div>
              <div class="summary-card">
                <span class="label">扫描时间</span>
                <span class="value small">{{ formatTime(scanResult.scanned_at) }}</span>
              </div>
            </div>

            <div v-if="migrationScore" class="migration-overview">
              <div class="migration-score" :class="riskBadgeClass(migrationScore.risk_level)">
                <span class="score-label">迁移评分</span>
                <strong>{{ migrationScore.score }}</strong>
                <span>/100</span>
              </div>
              <div class="migration-copy">
                <div class="migration-title">
                  {{ sourceTypeLabel }} · {{ migrationScore.priority }}
                </div>
                <p>
                  高风险 {{ migrationScore.high_risk_findings }} 项，影响 {{ migrationScore.affected_files }} 个文件，
                  涉及 {{ migrationScore.algorithm_variety }} 类传统公钥算法。
                </p>
              </div>
              <div class="top-algorithms" v-if="topAlgorithms.length">
                <span v-for="item in topAlgorithms" :key="item.name" class="algo-pill">
                  {{ item.name }} × {{ item.count }}
                </span>
              </div>
            </div>

            <div v-if="knowledgeGraph.nodes.length" class="knowledge-panel">
              <div class="panel-heading">
                <h3>抗量子迁移知识图谱</h3>
                <span>{{ knowledgeGraph.nodes.length }} 节点 · {{ knowledgeGraph.edges.length }} 关系</span>
              </div>
              <div class="graph-columns">
                <div v-for="(nodes, type) in graphColumns" :key="type" class="graph-column">
                  <span class="graph-type">{{ type }}</span>
                  <span v-for="node in nodes.slice(0, 5)" :key="node.id" class="graph-node">
                    {{ node.label }}
                  </span>
                </div>
              </div>
            </div>

            <!-- 无风险 -->
            <div v-if="scanResult.findings.length === 0" class="no-risk-banner">
              <span class="ok-marker">✓</span>
              扫描完成，未发现已知量子脆弱公钥算法用法，当前代码安全。
            </div>

            <!-- Findings -->
            <div v-else class="findings-list">
              <div v-for="(findings, fileName) in findingsByFile" :key="fileName" class="file-group">
                <h3 class="file-title">
                  <span class="file-icon">◉</span> {{ fileName }}
                  <span class="file-count">{{ findings.length }} 项风险</span>
                </h3>

                <transition-group name="finding-item" appear>
                  <div v-for="(f, idx) in findings" :key="fileName + idx" class="finding-item">
                    <div class="finding-header" :style="{ borderLeftColor: getRiskStyle(f.risk_level).border }">
                      <span class="line-badge">L{{ f.line }}</span>
                      <span class="algo-tag">{{ f.algorithm }}</span>
                      <span class="risk-badge" :class="riskBadgeClass(f.risk_level)">
                        {{ f.risk_level }}
                      </span>
                      <span class="risk-desc">{{ f.evidence }}</span>
                      <button @click="toggleFinding(fileName + idx)" class="btn-text">
                        <span class="btn-arrow" :class="{ open: expandedFindings.has(fileName + idx) }">▸</span>
                        {{ expandedFindings.has(fileName + idx) ? '收起' : '展开' }}
                      </button>
                    </div>

                    <transition name="expand">
                      <div v-if="expandedFindings.has(fileName + idx)" class="code-view">
                        <div class="code-view-header">
                          <span>{{ fileName }} : L{{ f.line }}</span>
                          <span class="code-lang">{{ snippetFilename.split('.').pop() || 'py' }}</span>
                        </div>
                        <pre><code><div v-for="line in getCodeSnippet(fileName, f.line)" :key="line.number" :class="{ 'highlight-line': line.isTarget }"><span class="line-no">{{ line.number }}</span>{{ line.text || ' ' }}</div></code></pre>
                      </div>
                    </transition>

                    <div class="finding-details">
                      <div class="detail-row">
                        <span class="detail-label">原因</span>
                        <span class="detail-value">{{ f.reason }}</span>
                      </div>
                      <div class="detail-row">
                        <span class="detail-label">建议</span>
                        <span class="detail-value">{{ f.recommendation }}</span>
                      </div>
                    </div>
                  </div>
                </transition-group>
              </div>
            </div>
          </div>
        </transition>
      </section>
    </main>
  </div>
</template>

<style>
/* ============================================
   Variables
   ============================================ */
:root,
[data-theme="light"] {
  --bg-root: #f2f5f8;
  --bg-surface: #ffffff;
  --bg-card: #ffffff;
  --bg-elevated: #f8fafb;
  --bg-input: #fbfcfd;
  --border: #e1e6eb;
  --border-light: #eaedf2;
  --accent: #0f9b8e;
  --accent-glow: rgba(15, 155, 142, 0.18);
  --accent-dim: #0d7d72;
  --accent-soft: rgba(15, 155, 142, 0.06);
  --text-primary: #1a2532;
  --text-secondary: #5b6b7c;
  --text-muted: #93a3b8;
  --danger: #e54545;
  --danger-bg: rgba(229, 69, 69, 0.07);
  --danger-glow: rgba(229, 69, 69, 0.2);
  --success: #0f9b8e;
  --success-bg: rgba(15, 155, 142, 0.07);
  --warning: #d4790a;
  --warning-bg: rgba(212, 121, 10, 0.07);
  --line-badge-bg: #e3eaf1;
  --line-badge-color: #3d566e;
  --glow-strong: rgba(15, 155, 142, 0.32);
  --shadow-card: 0 1px 2px rgba(0,0,0,0.03), 0 4px 12px rgba(0,0,0,0.04);
  --shadow-lg: 0 2px 6px rgba(0,0,0,0.05), 0 8px 24px rgba(0,0,0,0.06);
  --grid-color: rgba(0,0,0,0.025);
  --font-mono: 'Cascadia Code', 'JetBrains Mono', 'Fira Code', Consolas, monospace;
  --font-sans: 'Inter', 'Segoe UI', 'Microsoft YaHei', system-ui, -apple-system, sans-serif;
  --radius: 8px;
  --radius-lg: 12px;
  --transition-theme: background 0.4s ease, color 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;
}

[data-theme="dark"] {
  --bg-root: #0a0f16;
  --bg-surface: #131c26;
  --bg-card: #182230;
  --bg-elevated: #1d2a38;
  --bg-input: #101923;
  --border: #233140;
  --border-light: #2b3b4c;
  --accent: #00d4aa;
  --accent-glow: rgba(0, 212, 170, 0.2);
  --accent-dim: #00a885;
  --accent-soft: rgba(0, 212, 170, 0.05);
  --text-primary: #e3ecf4;
  --text-secondary: #8c9eb0;
  --text-muted: #546678;
  --danger: #ff5c72;
  --danger-bg: rgba(255, 92, 114, 0.08);
  --danger-glow: rgba(255, 92, 114, 0.2);
  --success: #00d4aa;
  --success-bg: rgba(0, 212, 170, 0.07);
  --warning: #f0a040;
  --warning-bg: rgba(240, 160, 64, 0.08);
  --line-badge-bg: #1c3046;
  --line-badge-color: #7abae8;
  --glow-strong: rgba(0, 212, 170, 0.38);
  --shadow-card: 0 1px 2px rgba(0,0,0,0.25), 0 4px 12px rgba(0,0,0,0.25);
  --shadow-lg: 0 2px 6px rgba(0,0,0,0.3), 0 8px 24px rgba(0,0,0,0.3);
  --grid-color: rgba(255,255,255,0.018);
}

* { box-sizing: border-box; }

body {
  margin: 0;
  font-family: var(--font-sans);
  background: var(--bg-root);
  color: var(--text-primary);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transition: var(--transition-theme);
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
  transition: var(--transition-theme);
}

/* 背景网格 */
.bg-grid {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background-image:
    linear-gradient(var(--grid-color) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-color) 1px, transparent 1px);
  background-size: 40px 40px;
  mask-image: radial-gradient(ellipse 70% 55% at 50% 40%, black 28%, transparent 72%);
  transition: var(--transition-theme);
}

.main-header,
.main-layout { position: relative; z-index: 1; }

/* ============================================
   Header
   ============================================ */
.main-header {
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border);
  height: 54px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1.5rem;
  flex-shrink: 0;
  transition: var(--transition-theme);
  box-shadow: 0 1px 2px rgba(0,0,0,0.025);
}

.logo {
  display: flex;
  align-items: baseline;
  gap: 0.45rem;
}

.logo-marker {
  font-family: var(--font-mono);
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--accent);
  text-shadow: 0 0 14px var(--glow-strong);
  animation: marker-pulse 3s ease-in-out infinite;
}

@keyframes marker-pulse {
  0%, 100% { opacity: 1; text-shadow: 0 0 14px var(--glow-strong); }
  50% { opacity: 0.65; text-shadow: 0 0 6px var(--glow-strong); }
}

.logo h1 {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.01em;
}

.logo-divider {
  color: var(--text-muted);
  font-weight: 300;
  font-size: 1.1rem;
}

.logo-subtitle {
  font-size: 0.72rem;
  color: var(--text-muted);
  font-weight: 500;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* ============================================
   Layout
   ============================================ */
.main-layout {
  display: flex;
  flex: 1;
  overflow: hidden;
  max-width: 1320px;
  width: 100%;
  margin: 0 auto;
  padding: 1.1rem;
  gap: 1.1rem;
}

@media (max-width: 1024px) {
  .main-layout { flex-direction: column; overflow-y: auto; }
}

.workspace {
  flex: 0 0 460px;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  min-width: 0;
}

@media (max-width: 1024px) {
  .workspace { flex: none; width: 100%; }
}

.results-area {
  flex: 1;
  overflow-y: auto;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1.15rem;
  min-width: 0;
  transition: var(--transition-theme);
  box-shadow: var(--shadow-card);
}

/* ============================================
   Card
   ============================================ */
.card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.3s;
  box-shadow: var(--shadow-card);
}

.card:hover { box-shadow: var(--shadow-lg); }

/* ============================================
   Tabs
   ============================================ */
.tabs {
  display: flex;
  background: var(--bg-elevated);
  border-bottom: 1px solid var(--border);
  transition: var(--transition-theme);
}

.tabs button {
  flex: 1;
  padding: 0.68rem 0.5rem;
  border: none;
  background: transparent;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.84rem;
  color: var(--text-muted);
  transition: all 0.25s;
  font-family: var(--font-sans);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  position: relative;
}

.tab-icon { font-size: 0.88rem; opacity: 0.7; transition: opacity 0.25s; }

.tabs button:hover { color: var(--text-secondary); }
.tabs button:hover .tab-icon { opacity: 1; }
.tabs button.active {
  background: var(--bg-card);
  color: var(--accent);
  box-shadow: inset 0 -2px 0 var(--accent);
  font-weight: 600;
}
.tabs button.active .tab-icon { opacity: 1; }

/* ============================================
   Form
   ============================================ */
.tab-content { padding: 0.95rem; }

.form-group { margin-bottom: 0.75rem; }

.form-group label {
  display: block;
  font-size: 0.75rem;
  margin-bottom: 0.35rem;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.input-field {
  width: 100%;
  padding: 0.5rem 0.7rem;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--bg-input);
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-size: 0.86rem;
  transition: all 0.25s;
}

.input-field:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-glow);
}

.input-field::placeholder { color: var(--text-muted); font-size: 0.84rem; }

.source-hint {
  color: var(--text-muted);
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 0.7rem 0.8rem;
  font-size: 0.8rem;
  line-height: 1.55;
}

.remote-scan-area {
  min-height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* 编辑器 + 行号 */
.editor-wrap {
  display: flex;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  transition: all 0.25s;
  background: var(--bg-input);
}

.editor-wrap:focus-within {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-glow);
}

.editor-line-numbers {
  padding: 0.75rem 0.35rem 0.75rem 0.55rem;
  font-family: var(--font-mono);
  font-size: 11.5px;
  line-height: 1.6;
  color: var(--text-muted);
  text-align: right;
  user-select: none;
  background: var(--bg-elevated);
  border-right: 1px solid var(--border);
  min-width: 2.6rem;
  display: flex;
  flex-direction: column;
}

.editor-line-numbers span { line-height: 1.6; }

.code-editor {
  flex: 1;
  font-family: var(--font-mono);
  font-size: 11.5px;
  line-height: 1.6;
  padding: 0.75rem;
  border: none;
  background: transparent;
  color: var(--text-primary);
  resize: none;
  tab-size: 4;
  outline: none;
  min-height: 270px;
}

.code-editor::placeholder { color: var(--text-muted); }

/* ============================================
   Upload
   ============================================ */
.upload-dropzone {
  border: 2px dashed var(--border);
  border-radius: var(--radius-lg);
  padding: 1.5rem 1.2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  background: var(--bg-input);
  position: relative;
  overflow: hidden;
}

.upload-dropzone::after {
  content: '';
  position: absolute;
  inset: -50%;
  background: radial-gradient(circle, var(--accent-glow) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s;
}

.upload-dropzone:hover {
  border-color: var(--accent);
  transform: translateY(-1px);
}
.upload-dropzone:hover::after { opacity: 1; }

.dropzone-hint { position: relative; z-index: 1; }

.upload-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 0.55rem;
  animation: float 2.8s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-7px); }
}

.dropzone-hint p {
  margin: 0;
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.92rem;
}
.dropzone-hint small {
  color: var(--text-muted);
  font-size: 0.76rem;
}

.file-list-area {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-top: 0.65rem;
}

.file-list-header {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.1rem 0;
}

.file-count-badge {
  background: var(--accent);
  color: #fff;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.08rem 0.45rem;
  border-radius: 20px;
  min-width: 1.4rem;
  text-align: center;
}

.file-chip {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 0.45rem 0.55rem;
  font-size: 0.8rem;
  transition: all 0.2s;
}

.file-chip:hover {
  border-color: var(--border-light);
  box-shadow: var(--shadow-card);
}

.file-chip-icon {
  color: var(--accent);
  font-size: 0.7rem;
  flex-shrink: 0;
}

.file-chip-name {
  font-family: var(--font-mono);
  color: var(--text-primary);
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.78rem;
}

.file-chip-size {
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 0.7rem;
  flex-shrink: 0;
}

.file-chip-remove {
  background: transparent;
  border: 1px solid transparent;
  border-radius: 4px;
  color: var(--text-muted);
  font-size: 1rem;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
  transition: all 0.2s;
  line-height: 1;
}

.file-chip-remove:hover {
  color: var(--danger);
  background: var(--danger-bg);
  border-color: rgba(229, 69, 69, 0.2);
}

/* ============================================
   Buttons
   ============================================ */
.actions { margin-top: 0.6rem; }

.btn {
  padding: 0.58rem 1.15rem;
  border-radius: var(--radius);
  font-weight: 600;
  font-size: 0.86rem;
  cursor: pointer;
  border: none;
  font-family: var(--font-sans);
  transition: all 0.25s;
  position: relative;
  overflow: hidden;
}

.btn:disabled { opacity: 0.4; cursor: not-allowed; }

.btn-primary {
  background: linear-gradient(135deg, var(--accent), var(--accent-dim));
  color: #fff;
  width: 100%;
  letter-spacing: 0.03em;
}

.btn-primary::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
  transform: translateX(-100%);
  transition: transform 0.55s;
}

.btn-primary:hover:not(:disabled)::after { transform: translateX(100%); }
.btn-primary:hover:not(:disabled) {
  box-shadow: 0 4px 24px var(--glow-strong);
  transform: translateY(-1px);
}

.btn-primary.scanning {
  background: var(--text-muted);
  pointer-events: none;
}

.btn-scan-icon {
  font-size: 0.75rem;
  margin-right: 0.3rem;
}

.btn-spinner {
  width: 14px; height: 14px;
  border: 2px solid rgba(255,255,255,0.25);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.65s linear infinite;
  display: inline-block;
  vertical-align: middle;
  margin-right: 0.4rem;
}

@keyframes spin { to { transform: rotate(360deg); } }

.btn-outline {
  background: transparent;
  border: 1px solid var(--border-light);
  color: var(--text-secondary);
  font-size: 0.78rem;
  padding: 0.4rem 0.8rem;
}

.btn-outline:hover { border-color: var(--accent); color: var(--accent); }
.btn-icon-text { margin-right: 0.2rem; font-family: var(--font-mono); font-weight: 700; }

.btn-icon {
  background: transparent;
  border: 1px solid var(--border-light);
  color: var(--text-secondary);
  font-size: 0.95rem;
  width: 32px; height: 32px;
  padding: 0;
  border-radius: var(--radius);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s;
}

.btn-icon:hover { border-color: var(--accent); color: var(--accent); }
.theme-icon { line-height: 1; transition: transform 0.3s; }
.btn-icon:hover .theme-icon { transform: rotate(30deg); }

/* 展开按钮 */
.btn-text {
  background: transparent;
  color: var(--accent);
  font-size: 0.76rem;
  padding: 0.25rem 0.55rem;
  border: 1px solid transparent;
  border-radius: var(--radius);
  cursor: pointer;
  font-family: var(--font-mono);
  font-weight: 600;
  white-space: nowrap;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.btn-text:hover { border-color: var(--accent); background: var(--accent-soft); }
.btn-text:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--accent-glow); }

.btn-arrow {
  display: inline-block;
  transition: transform 0.25s;
  font-size: 0.65rem;
}
.btn-arrow.open { transform: rotate(90deg); }

/* ============================================
   Error
   ============================================ */
.error-banner {
  background: var(--danger-bg);
  color: var(--danger);
  padding: 0.65rem 0.85rem;
  border-radius: var(--radius);
  border: 1px solid rgba(229, 69, 69, 0.18);
  font-size: 0.82rem;
  font-family: var(--font-mono);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.err-prefix { font-weight: 800; font-size: 0.9rem; }

/* ============================================
   Empty State
   ============================================ */
.empty-state {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.empty-icon-wrapper {
  position: relative;
  margin-bottom: 1rem;
}

.empty-icon {
  font-family: var(--font-mono);
  font-size: 3.6rem;
  font-weight: 800;
  color: var(--border-light);
  position: relative;
  z-index: 1;
}

.empty-icon-shadow {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  font-family: var(--font-mono);
  font-size: 5rem;
  font-weight: 800;
  color: var(--border);
  z-index: 0;
  filter: blur(14px);
}

.empty-state h2 {
  color: var(--text-secondary);
  margin-bottom: 0.35rem;
  font-size: 1.2rem;
  font-weight: 700;
}
.empty-state p {
  font-size: 0.85rem;
  margin: 0;
  color: var(--text-muted);
  max-width: 350px;
  line-height: 1.55;
}

/* ============================================
   Scanning
   ============================================ */
.scanning-state {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.scan-progress { margin-bottom: 1.1rem; display: flex; flex-direction: column; align-items: center; gap: 1rem; }

.scan-ring {
  width: 90px; height: 90px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.scan-ring svg { width: 100%; height: 100%; animation: ring-rotate 2s linear infinite; }

@keyframes ring-rotate { to { transform: rotate(360deg); } }

.ring-bg { fill: none; stroke: var(--border); stroke-width: 3; }

.ring-fg {
  fill: none;
  stroke: var(--accent);
  stroke-width: 3;
  stroke-dasharray: 180 280;
  stroke-linecap: round;
  animation: ring-dash 1.5s ease-in-out infinite;
  filter: drop-shadow(0 0 8px var(--glow-strong));
}

@keyframes ring-dash {
  0% { stroke-dasharray: 40 280; }
  50% { stroke-dasharray: 200 280; }
  100% { stroke-dasharray: 40 280; }
}

.scan-ring-text {
  position: absolute;
  font-size: 1.6rem;
  animation: marker-pulse 1.2s ease-in-out infinite;
}

/* 进度条 */
.scan-bar-wrap { width: 240px; }
.scan-bar-track {
  height: 3px;
  border-radius: 3px;
  background: var(--border-light);
  overflow: hidden;
}

.scan-bar-fill {
  height: 100%;
  border-radius: 3px;
  background: linear-gradient(90deg, var(--accent), var(--accent-dim));
  transition: width 0.3s ease;
  box-shadow: 0 0 8px var(--glow-strong);
}

.scan-label {
  font-size: 0.88rem;
  color: var(--text-secondary);
  font-family: var(--font-mono);
  margin: 0 0 0.85rem;
}

.scan-dots { display: flex; gap: 0.45rem; }
.scan-dots span {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--accent);
  animation: dot-bounce 1.4s ease-in-out infinite;
}
.scan-dots span:nth-child(2) { animation-delay: 0.2s; }
.scan-dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes dot-bounce {
  0%, 80%, 100% { transform: scale(0.5); opacity: 0.35; }
  40% { transform: scale(1.4); opacity: 1; }
}

/* ============================================
   Summary
   ============================================ */
.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.6rem;
  margin-bottom: 1.15rem;
}

@media (max-width: 768px) {
  .summary-grid { grid-template-columns: repeat(2, 1fr); }
}

.summary-card {
  background: var(--bg-elevated);
  padding: 0.8rem 0.5rem;
  border-radius: var(--radius);
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid var(--border);
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
  cursor: default;
}

.summary-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-card); }

.summary-card .label {
  font-size: 0.67rem;
  color: var(--text-muted);
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: 700;
}

.summary-card .value {
  font-family: var(--font-mono);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  transition: color 0.3s;
}

.summary-card .value.danger { transition: all 0.5s; }
.summary-card.accent-danger.has-findings .value.danger {
  color: var(--danger);
  text-shadow: 0 0 14px var(--danger-glow);
}
.summary-card .value.small { font-size: 0.74rem; color: var(--text-secondary); }

.summary-card::before {
  content: '';
  position: absolute;
  top: 0; left: 20%; right: 20%;
  height: 2px;
  border-radius: 0 0 2px 2px;
  background: var(--border-light);
  transition: background 0.3s;
}
.summary-card.accent-danger.has-findings::before { background: var(--danger); }

.migration-overview {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 0.75rem;
  align-items: center;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 0.8rem;
  margin-bottom: 0.9rem;
}

@media (max-width: 900px) {
  .migration-overview { grid-template-columns: 1fr; }
}

.migration-score {
  min-width: 86px;
  height: 72px;
  border-radius: var(--radius);
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.12rem;
  background: var(--accent-soft);
  color: var(--accent);
  border: 1px solid rgba(15, 155, 142, 0.16);
  position: relative;
  font-family: var(--font-mono);
}

.migration-score.high {
  background: var(--danger-bg);
  color: var(--danger);
  border-color: rgba(229, 69, 69, 0.2);
}

.migration-score.medium {
  background: var(--warning-bg);
  color: var(--warning);
  border-color: rgba(212, 121, 10, 0.2);
}

.score-label {
  position: absolute;
  top: 0.45rem;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 0.66rem;
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-weight: 700;
}

.migration-score strong {
  font-size: 1.65rem;
  line-height: 1;
  margin-top: 1rem;
}

.migration-copy {
  min-width: 0;
}

.migration-title {
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.migration-copy p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.82rem;
  line-height: 1.5;
}

.top-algorithms {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.35rem;
  max-width: 220px;
}

.algo-pill {
  border: 1px solid var(--border);
  background: var(--bg-card);
  color: var(--text-secondary);
  border-radius: 20px;
  padding: 0.18rem 0.55rem;
  font-size: 0.72rem;
  font-family: var(--font-mono);
  white-space: nowrap;
}

.knowledge-panel {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--bg-input);
  padding: 0.85rem;
  margin-bottom: 1rem;
}

.panel-heading {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  border-bottom: 1px solid var(--border);
  padding-bottom: 0.45rem;
  margin-bottom: 0.65rem;
}

.panel-heading h3 {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-primary);
}

.panel-heading span {
  color: var(--text-muted);
  font-size: 0.72rem;
  font-family: var(--font-mono);
}

.graph-columns {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(145px, 1fr));
  gap: 0.5rem;
}

.graph-column {
  display: flex;
  flex-direction: column;
  gap: 0.32rem;
  min-width: 0;
}

.graph-type {
  color: var(--accent-dim);
  font-family: var(--font-mono);
  font-size: 0.66rem;
  font-weight: 700;
}

.graph-node {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 0.28rem 0.42rem;
  color: var(--text-secondary);
  font-size: 0.74rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ============================================
   No Risk
   ============================================ */
.no-risk-banner {
  background: var(--success-bg);
  color: var(--success);
  padding: 0.9rem 1.1rem;
  border-radius: var(--radius);
  text-align: center;
  border: 1px solid rgba(15, 155, 142, 0.15);
  font-size: 0.87rem;
  font-weight: 500;
  line-height: 1.5;
}

.ok-marker {
  font-family: var(--font-mono);
  font-weight: 800;
  background: var(--success);
  color: #fff;
  padding: 0.05rem 0.35rem;
  border-radius: 3px;
  margin-right: 0.35rem;
  font-size: 0.75rem;
}

/* ============================================
   Findings
   ============================================ */
.findings-list { display: flex; flex-direction: column; gap: 1.1rem; }

.file-group:last-child { margin-bottom: 0; }

.file-title {
  font-family: var(--font-mono);
  font-size: 0.88rem;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border);
  padding-bottom: 0.4rem;
  margin: 0 0 0.65rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.file-icon { font-size: 0.75rem; color: var(--accent); }
.file-count {
  margin-left: auto;
  font-size: 0.72rem;
  color: var(--text-muted);
  background: var(--bg-elevated);
  padding: 0.12rem 0.55rem;
  border-radius: 20px;
  border: 1px solid var(--border);
}

.finding-item {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  margin-bottom: 0.55rem;
  overflow: hidden;
  background: var(--bg-elevated);
  transition: all 0.3s;
}

.finding-item:hover { box-shadow: var(--shadow-card); }

.finding-header {
  padding: 0.55rem 0.7rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  border-left: 3px solid var(--accent);
  transition: border-color 0.3s;
}

.line-badge {
  background: var(--line-badge-bg);
  color: var(--line-badge-color);
  padding: 0.1rem 0.45rem;
  border-radius: 3px;
  font-size: 0.7rem;
  font-family: var(--font-mono);
  font-weight: 600;
}

.algo-tag {
  background: var(--accent-soft);
  color: var(--accent);
  padding: 0.1rem 0.5rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 700;
  font-family: var(--font-mono);
  letter-spacing: 0.02em;
  border: 1px solid rgba(15, 155, 142, 0.1);
}

.risk-badge {
  padding: 0.12rem 0.52rem;
  border-radius: 20px;
  font-size: 0.68rem;
  font-weight: 700;
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}
.risk-badge.high   { background: var(--danger-bg); color: var(--danger); border: 1px solid rgba(229,69,69,0.15); }
.risk-badge.medium { background: var(--warning-bg); color: var(--warning); border: 1px solid rgba(212,121,10,0.15); }
.risk-badge.low    { background: var(--accent-soft); color: var(--accent); border: 1px solid rgba(15,155,142,0.12); }

.risk-desc {
  flex: 1;
  font-size: 0.83rem;
  color: var(--text-primary);
  min-width: 130px;
  font-weight: 500;
}

/* Code view */
.code-view {
  background: var(--bg-input);
  border-bottom: 1px solid var(--border);
  overflow: hidden;
}

.code-view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.38rem 0.65rem;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  color: var(--text-muted);
  background: var(--bg-elevated);
  border-bottom: 1px solid var(--border);
}

.code-lang {
  background: var(--accent-glow);
  color: var(--accent);
  padding: 0.05rem 0.45rem;
  border-radius: 3px;
  font-weight: 600;
  text-transform: lowercase;
}

.code-view pre {
  margin: 0;
  padding: 0.5rem 0;
  font-size: 11.5px;
  line-height: 1.6;
  font-family: var(--font-mono);
}

.highlight-line {
  background: var(--accent-glow);
  border-left: 3px solid var(--accent);
  display: block;
}

.line-no {
  color: var(--text-muted);
  width: 2.4rem;
  display: inline-block;
  text-align: right;
  margin-right: 0.65rem;
  user-select: none;
  font-size: 0.82em;
}

/* Detail */
.finding-details {
  padding: 0.65rem 0.7rem;
  font-size: 0.81rem;
  line-height: 1.6;
}

.detail-row {
  margin-bottom: 0.35rem;
  display: flex;
  gap: 0.4rem;
  align-items: baseline;
}

.detail-row:last-child { margin-bottom: 0; }

.detail-label {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--accent-dim);
  background: var(--accent-soft);
  padding: 0.06rem 0.45rem;
  border-radius: 4px;
  white-space: nowrap;
  flex-shrink: 0;
}

.detail-value { color: var(--text-secondary); word-break: break-word; }

/* ============================================
   Popular Tab
   ============================================ */
.popular-area {
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.popular-empty {
  text-align: center;
  padding: 2rem 1rem;
}
.popular-empty p {
  color: var(--text-muted);
  font-size: 0.88rem;
  margin: 0 0 1rem;
}

.popular-scan-btn {
  font-size: 0.72rem;
  padding: 0.3rem 0.6rem;
  margin-left: auto;
}

.popular-top-input {
  width: 80px;
  text-align: center;
}

/* Right-side popular results */
.popular-right-results { display: flex; flex-direction: column; gap: 1rem; }
.popular-right-header { display: flex; justify-content: space-between; align-items: baseline; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; }
.popular-right-header h3 { margin: 0; font-size: 1rem; font-weight: 700; color: var(--text-primary); }
.popular-right-meta { font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono); }
.popular-right-repo {
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.popular-right-repo-header { display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap; }
.popular-right-repo-header .repo-name { font-weight: 700; font-size: 0.9rem; }
.popular-right-repo-header .repo-stars { font-size: 0.75rem; color: var(--text-muted); }
.popular-right-repo-header .repo-score { margin-left: auto; font-weight: 700; font-size: 0.82rem; }
.popular-right-algos { display: flex; gap: 0.3rem; flex-wrap: wrap; }
.popular-right-findings { display: flex; flex-direction: column; gap: 0.25rem; margin-top: 0.3rem; border-top: 1px solid var(--border-light); padding-top: 0.4rem; }
.popular-right-finding {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.78rem;
  flex-wrap: wrap;
  padding: 0.2rem 0;
}

.popular-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.88rem;
  padding: 2rem 0;
}

.popular-error {
  background: var(--danger-bg);
  color: var(--danger);
  padding: 0.65rem 0.85rem;
  border-radius: var(--radius);
  border: 1px solid rgba(229, 69, 69, 0.18);
  font-size: 0.82rem;
  font-family: var(--font-mono);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.popular-results { display: flex; flex-direction: column; gap: 0.6rem; }
.popular-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
.popular-title { font-weight: 700; font-size: 0.9rem; color: var(--text-primary); }
.popular-time { font-size: 0.75rem; color: var(--text-muted); }
.popular-list { display: flex; flex-direction: column; gap: 0.35rem; }
.popular-repo-row {
  display: flex; align-items: center; gap: 0.6rem;
  padding: 0.55rem 0.7rem;
  background: var(--bg-elevated);
  border: 1px solid var(--border-light);
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.2s;
}
.popular-repo-row:hover { border-color: var(--accent); box-shadow: 0 0 0 2px var(--accent-soft); }
.repo-rank { font-weight: 700; font-size: 0.8rem; color: var(--text-muted); min-width: 1.5rem; text-align: center; }
.repo-info { flex: 1; display: flex; flex-direction: column; gap: 0.15rem; min-width: 0; }
.repo-name { font-weight: 600; font-size: 0.84rem; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.repo-stars { font-size: 0.72rem; color: var(--text-muted); }
.repo-score { font-weight: 700; font-size: 0.9rem; min-width: 2.2rem; text-align: center; }
.repo-score.high { color: var(--danger); }
.repo-score.medium { color: var(--warning); }
.repo-score.low { color: var(--accent); }
.repo-findings { font-size: 0.75rem; color: var(--text-secondary); white-space: nowrap; }
.repo-algos { display: flex; gap: 0.25rem; flex-wrap: wrap; }
.algo-pill.small { font-size: 0.65rem; padding: 0.1rem 0.35rem; }

.popular-repo-row.expanded { border-color: var(--accent); background: var(--bg-card); }
.popular-detail {
  background: var(--bg-input);
  border: 1px solid var(--border);
  border-top: none;
  border-radius: 0 0 var(--radius) var(--radius);
  padding: 0.6rem 0.7rem;
  margin-top: -0.35rem;
  margin-bottom: 0.35rem;
}
.popular-detail-empty {
  color: var(--text-muted);
  font-size: 0.82rem;
  text-align: center;
  padding: 0.5rem 0;
}
.popular-detail-list { display: flex; flex-direction: column; gap: 0.3rem; }
.popular-finding-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.3rem 0.4rem;
  border-radius: 4px;
  font-size: 0.78rem;
  flex-wrap: wrap;
}
.popular-finding-row:hover { background: var(--bg-elevated); }
.popular-finding-file {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--text-secondary);
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.popular-finding-evidence {
  flex: 1;
  font-size: 0.75rem;
  color: var(--text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ============================================
   Transitions
   ============================================ */
.fade-enter-active, .fade-leave-active { transition: opacity 0.35s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.fade-up-enter-active { transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
.fade-up-leave-active { transition: all 0.2s ease-in; }
.fade-up-enter-from { opacity: 0; transform: translateY(20px); }
.fade-up-leave-to { opacity: 0; transform: translateY(-10px); }

.slide-down-enter-active { transition: all 0.3s ease-out; }
.slide-down-leave-active { transition: all 0.2s ease-in; }
.slide-down-enter-from { opacity: 0; transform: translateY(-8px); }
.slide-down-leave-to { opacity: 0; transform: translateY(-8px); }

.expand-enter-active { transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1); overflow: hidden; }
.expand-leave-active { transition: all 0.25s ease-in; overflow: hidden; }
.expand-enter-from, .expand-leave-to { max-height: 0; opacity: 0; }

.finding-item-enter-active { transition: all 0.45s cubic-bezier(0.16, 1, 0.3, 1); }
.finding-item-leave-active { transition: all 0.2s ease-in; }
.finding-item-enter-from { opacity: 0; transform: translateX(-14px); }
.finding-item-leave-to { opacity: 0; transform: translateX(14px); }

.file-list-enter-active { transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1); }
.file-list-leave-active { transition: all 0.2s ease-in; position: absolute; }
.file-list-enter-from { opacity: 0; transform: translateY(-6px); }
.file-list-leave-to { opacity: 0; transform: scale(0.95); }
.file-list-move { transition: transform 0.3s; }

/* ============================================
   Scrollbar
   ============================================ */
::-webkit-scrollbar { width: 5px; height: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border-light); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }

/* ============================================
   Responsive
   ============================================ */
@media (max-width: 1024px) {
  .main-header { padding: 0 1rem; }
  .logo h1 { font-size: 0.9rem; }
  .logo-subtitle { display: none; }
  .logo-divider { display: none; }
  .main-layout { padding: 0.75rem; max-width: 100%; }
}
</style>
