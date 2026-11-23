export const escapeMarkup = value => String(value ?? '').replace(/[&<>"']/g,
  character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));

function download(blob, name) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Serialized with the document so the saved graph works offline.
function startGraphViewer() {
  const svg = document.querySelector('main svg');
  const detail = document.querySelector('aside');
  const heading = detail.querySelector('h2'), location = detail.querySelector('[data-location]');
  const relations = detail.querySelector('[data-relations]'), back = detail.querySelector('[data-back]');
  const nodes = new Map(), adjacency = new Map();
  let selection, previous, opener;
  for (const item of svg.querySelectorAll('[data-graph-key]')) {
    const { graphKey, graphFrom, graphTo } = item.dataset;
    if (!graphFrom) nodes.set(graphKey, item);
    else for (const key of [graphFrom, graphTo]) {
      if (!adjacency.has(key)) adjacency.set(key, []);
      adjacency.get(key).push(item);
    }
  }
  const initial = { ...Object.fromEntries(['x', 'y', 'width', 'height'].map(key => [key, svg.viewBox.baseVal[key]])) };
  let view = { ...initial }, drag, suppressClick;
  function render() { svg.setAttribute('viewBox', [view.x, view.y, view.width, view.height].join(' ')); }
  function point(event) { return new DOMPoint(event.clientX, event.clientY).matrixTransform(svg.getScreenCTM().inverse()); }
  function zoom(factor, x = view.x + view.width / 2, y = view.y + view.height / 2) {
    const ratio = Math.max(initial.width / 20, Math.min(initial.width * 4, view.width / factor)) / view.width;
    view = { x:x + (view.x - x) * ratio, y:y + (view.y - y) * ratio, width:view.width * ratio, height:view.height * ratio };
    render();
  }
  function close() {
    svg.querySelectorAll('.related,.selected').forEach(item => item.classList.remove('related', 'selected'));
    detail.hidden = true;
    selection = previous = null;
    opener?.focus({ preventScroll:true });
  }
  function show(item, parent = null) {
    svg.querySelectorAll('.related,.selected').forEach(element => element.classList.remove('related', 'selected'));
    previous = parent;
    selection = item;
    selection.classList.add('selected');
    detail.hidden = false;
    back.hidden = !previous;
    heading.textContent = item.dataset.graphDetail;
    location.replaceChildren();
    relations.replaceChildren();
    const { graphKey, graphFrom, graphTo, graphLocation, graphUrl } = item.dataset;
    const edges = graphFrom ? [item] : adjacency.get(graphKey) || [];
    for (const edge of edges) {
      edge.classList.add('related');
      nodes.get(edge.dataset.graphFrom)?.classList.add('related');
      nodes.get(edge.dataset.graphTo)?.classList.add('related');
      if (graphFrom) continue;
      const button = document.createElement('button');
      button.textContent = edge.dataset.graphDetail;
      button.onclick = () => show(edge, item);
      relations.append(button);
    }
    if (graphFrom) {
      const endpoints = document.createElement('div');
      endpoints.className = 'endpoints';
      for (const key of [graphFrom, graphTo]) {
        const node = nodes.get(key);
        if (!node) continue;
        const button = document.createElement('button');
        button.textContent = node.querySelector('title')?.textContent || node.dataset.graphDetail;
        button.onclick = () => show(node);
        endpoints.append(button);
      }
      relations.append(endpoints);
    }
    if (graphLocation) {
      const label = document.createElement('p');
      label.textContent = '代表位置';
      location.append(label);
      const pinned = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/blob\/[a-f\d]{40}\/[^#]+#L\d+$/i.test(graphUrl || '');
      const entry = document.createElement(pinned ? 'a' : 'code');
      entry.textContent = graphLocation;
      if (pinned) { entry.href = graphUrl; entry.target = '_blank'; entry.rel = 'noopener noreferrer'; }
      location.append(entry);
    }
    detail.scrollTop = 0;
    detail.focus({ preventScroll:true });
  }
  document.querySelector('[data-in]').onclick = () => zoom(1.25);
  document.querySelector('[data-out]').onclick = () => zoom(.8);
  document.querySelector('[data-reset]').onclick = () => { view = { ...initial }; render(); close(); };
  detail.querySelector('[data-close]').onclick = close;
  back.onclick = () => show(previous);
  svg.addEventListener('wheel', event => {
    if (event.ctrlKey || event.metaKey) return;
    event.preventDefault();
    const { x, y } = point(event);
    zoom(event.deltaY < 0 ? 1.18 : .85, x, y);
  }, { passive:false });
  svg.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    suppressClick = false;
    drag = { id:event.pointerId, x:event.clientX, y:event.clientY, view:{ ...view }, matrix:svg.getScreenCTM().inverse() };
  });
  svg.addEventListener('pointermove', event => {
    if (drag?.id !== event.pointerId) return;
    const x = event.clientX - drag.x, y = event.clientY - drag.y;
    if (!suppressClick && Math.hypot(x,y) < 5) return;
    if (!suppressClick) svg.setPointerCapture(event.pointerId);
    suppressClick = true;
    view.x = drag.view.x - x * drag.matrix.a;
    view.y = drag.view.y - y * drag.matrix.d;
    render();
  });
  for (const type of ['pointerup','pointercancel','pointerleave','lostpointercapture']) svg.addEventListener(type, () => { drag = null; });
  function activate(event) {
    const item = event.target.closest('[data-graph-detail]');
    if (!item) return;
    opener = item;
    if (item === selection) close();
    else show(item);
  }
  svg.addEventListener('click', event => { if (!suppressClick) activate(event); });
  svg.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); activate(event); }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !detail.hidden) {
      if (previous) show(previous);
      else close();
    }
  });
  for (const node of svg.querySelectorAll('[data-graph-detail]')) {
    node.setAttribute('tabindex', node.dataset.graphFrom ? '-1' : '0');
    node.setAttribute('role', 'button');
    node.setAttribute('aria-label', node.dataset.graphDetail);
  }
}

export function interactiveGraphHtml(svg, title) {
  return `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeMarkup(title)}</title><style>
*{box-sizing:border-box}body{margin:0;background:#f5f7f8;color:#192734;font:14px system-ui,sans-serif;height:100dvh;display:flex;flex-direction:column}
header{display:flex;align-items:center;flex-wrap:wrap;gap:6px;padding:8px 12px;background:#fff}h1{font-size:16px;margin:0 auto 0 0}
button{font:inherit;color:inherit;border:0;border-radius:6px;background:#e7edf0;padding:6px 10px;cursor:pointer}
main{flex:1;min-height:0;position:relative}main>svg{display:block;width:100%;height:100%;cursor:grab;touch-action:none;user-select:none}
main>svg:active{cursor:grabbing}[data-graph-detail]{cursor:pointer}
[data-graph-from]>path:first-of-type{transition:opacity 150ms ease-out}[data-graph-from]:is(:hover,.related)>path:first-of-type{opacity:1}
[data-graph-detail]:is(:hover,:focus-visible,.related,.selected)>text{fill:var(--accent,#076d67);font-weight:700}
@media(prefers-reduced-motion:reduce){[data-graph-from]>path:first-of-type{transition:none}}
aside{position:absolute;right:12px;top:12px;width:min(410px,calc(100% - 24px));max-height:calc(100% - 24px);overflow:auto;background:white;border:1px solid #cbd7db;border-radius:8px;padding:12px;overflow-wrap:anywhere}
aside[hidden]{display:none}aside h2{font-size:15px;margin:9px 0;white-space:pre-wrap}aside p{margin:8px 0 4px}aside a{color:#076d67}
.detail-actions,.endpoints{display:flex;gap:6px;flex-wrap:wrap}[data-relations]{display:grid;gap:5px;margin-top:10px}[data-relations] button{text-align:start}
@media(min-width:1024px){main:has(aside:not([hidden])){display:grid;grid-template-columns:minmax(0,1fr) min(410px,36%);gap:8px}
main:has(aside:not([hidden])) aside{position:relative;inset:auto;width:auto;margin:8px 8px 8px 0;align-self:start}}
@media(max-width:1023px){main:has(aside:not([hidden])){display:flex;flex-direction:column}main:has(aside:not([hidden]))>svg{flex:1;min-height:0}aside{position:relative;inset:auto;order:-1;width:auto;margin:8px;max-height:40%;flex:none}}</style>
<header><h1>${escapeMarkup(title)}</h1><button data-out aria-label="缩小">−</button><button data-in aria-label="放大">＋</button><button data-reset>复位</button></header>
<main>${svg}<aside hidden tabindex="-1" aria-label="关系详情"><div class="detail-actions"><button data-back>返回节点关系</button><button data-close>收起</button></div><h2></h2><div data-location></div><div data-relations></div></aside></main>
<script>(${startGraphViewer.toString()})();</script></html>`;
}

export async function exportGraph(format, svg, title) {
  if (format === 'html') {
    download(new Blob([interactiveGraphHtml(svg, title)], { type:'text/html;charset=utf-8' }), `${title}.html`);
    return;
  }
  const imageSvg = new DOMParser().parseFromString(svg, 'image/svg+xml').documentElement;
  const width = Number(imageSvg.getAttribute('width')), height = Number(imageSvg.getAttribute('height'));
  const scale = Math.min(2, 8192 / Math.max(width, height), Math.sqrt(24000000 / (width * height)));
  imageSvg.setAttribute('width', Math.max(1, Math.round(width * scale)));
  imageSvg.setAttribute('height', Math.max(1, Math.round(height * scale)));
  const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(imageSvg)], { type:'image/svg+xml;charset=utf-8' }));
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    if (!blob) throw new Error('图片生成失败');
    const save = () => download(blob, `${title}.png`);
    if (globalThis.quantumDesktop) return save;
    save();
  } finally { URL.revokeObjectURL(url); }
}
