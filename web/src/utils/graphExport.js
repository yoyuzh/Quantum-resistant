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
  document.addEventListener('keydown', event => {
    if (event.key === 'Tab' || event.key.startsWith('Arrow')) document.documentElement.dataset.keyboard = 'true';
  }, true);
  document.addEventListener('pointerdown', () => { delete document.documentElement.dataset.keyboard; }, true);
  const main = document.querySelector('main');
  let svg = main.querySelector(':scope > svg');
  const detail = document.querySelector('aside');
  const heading = detail.querySelector('h2'), location = detail.querySelector('[data-location]');
  const relations = detail.querySelector('[data-relations]'), back = detail.querySelector('[data-back]');
  const nodes = new Map(), adjacency = new Map();
  const categoryPicker = document.querySelector('[data-graph-picker]');
  const views = Array.from(document.querySelectorAll('[data-graph-view]'));
  const sections = new Map();
  for (const [index, template] of views.entries()) {
    const section = template.dataset.graphSection;
    if (section && !sections.has(section)) sections.set(section, index);
  }
  let selection, previous, opener, initial, view, drag, suppressClick;
  const theme = ['--bg-elevated', '--bg-surface', '--text-primary', '--text-secondary', '--accent', '--accent-dim',
    '--border', '--font-sans', '--control-bg', '--control-hover', '--workspace-dot'];
  for (const name of theme) {
    const value = svg.style.getPropertyValue(name).trim();
    if (value) document.body.style.setProperty(name, value);
  }
  function render() { svg.setAttribute('viewBox', [view.x, view.y, view.width, view.height].join(' ')); }
  function point(event) { return new DOMPoint(event.clientX, event.clientY).matrixTransform(svg.getScreenCTM().inverse()); }
  function zoom(factor, x = view.x + view.width / 2, y = view.y + view.height / 2) {
    const ratio = Math.max(initial.width / 20, Math.min(initial.width * 4, view.width / factor)) / view.width;
    view = { x:x + (view.x - x) * ratio, y:y + (view.y - y) * ratio, width:view.width * ratio, height:view.height * ratio };
    render();
  }
  function close(restoreFocus = true) {
    svg.querySelectorAll('.related,.selected').forEach(item => item.classList.remove('related', 'selected', 'flowing'));
    detail.hidden = true;
    selection = previous = null;
    if (restoreFocus) opener?.focus({ preventScroll:true });
  }
  function openView(index) {
    const next = views[index]?.content.querySelector('svg');
    if (!next) return;
    close(false);
    categoryPicker.selectedIndex = index;
    const replacement = next.cloneNode(true);
    svg.replaceWith(replacement);
    attach(replacement);
  }
  function relationAction(text, activate) {
    const button = document.createElement('button');
    button.className = 'relation-action';
    const parts = /^(.*)[，·]\s*([\d,]+\s*(?:项(?:检出)?|条关联))$/.exec(text);
    const label = document.createElement('span');
    label.textContent = parts ? parts[1] : text;
    button.append(label);
    if (parts) {
      const count = document.createElement('span');
      count.className = 'relation-count';
      count.textContent = parts[2];
      button.append(count);
    }
    button.onclick = activate;
    return button;
  }
  function show(item, parent = null) {
    svg.querySelectorAll('.related,.selected').forEach(element => element.classList.remove('related', 'selected', 'flowing'));
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
    if (svg.hasAttribute('data-repository-overview')) {
      edges.map(edge => ({ edge, width:Number(edge.querySelector('[data-graph-flow]')?.dataset.graphFlow) }))
        .filter(({ width }) => width > 0).sort((a,b) => b.width - a.width).slice(0, 7)
        .forEach(({ edge }) => edge.classList.add('flowing'));
    }
    for (const edge of edges) {
      edge.classList.add('related');
      nodes.get(edge.dataset.graphFrom)?.classList.add('related');
      nodes.get(edge.dataset.graphTo)?.classList.add('related');
      if (graphFrom) continue;
      relations.append(relationAction(edge.dataset.graphDetail, () => show(edge, item)));
    }
    if (graphFrom) {
      const endpoints = document.createElement('div');
      endpoints.className = 'endpoints';
      for (const key of [graphFrom, graphTo]) {
        const node = nodes.get(key);
        if (!node) continue;
        endpoints.append(relationAction(node.querySelector('title')?.textContent || node.dataset.graphDetail, () => show(node)));
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
  detail.querySelector('[data-close]').onclick = () => close();
  back.onclick = () => show(previous);
  if (categoryPicker) categoryPicker.onchange = () => openView(categoryPicker.selectedIndex);
  function activate(event) {
    const item = event.target.closest('[data-graph-detail]');
    if (!item) return;
    const destination = sections.get(item.dataset.graphKey);
    if (destination !== undefined) {
      const current = categoryPicker.selectedIndex;
      const sameSection = views[current].dataset.graphSection === item.dataset.graphKey;
      openView(sameSection ? 0 : destination);
      categoryPicker.focus({ preventScroll:true });
      return;
    }
    opener = item;
    if (item === selection) close();
    else show(item);
  }
  function attach(element) {
    svg = element;
    initial = Object.fromEntries(['x', 'y', 'width', 'height'].map(key => [key, svg.viewBox.baseVal[key]]));
    view = { ...initial };
    drag = opener = null;
    suppressClick = false;
    nodes.clear();
    adjacency.clear();
    for (const item of svg.querySelectorAll('[data-graph-detail]')) {
      const { graphKey, graphFrom, graphTo, graphDetail } = item.dataset;
      item.setAttribute('tabindex', graphFrom ? '-1' : '0');
      item.setAttribute('role', 'button');
      item.setAttribute('aria-label', graphDetail);
      if (sections.has(graphKey)) item.setAttribute('aria-expanded',
        String(views[categoryPicker.selectedIndex].dataset.graphSection === graphKey));
      if (!graphFrom) {
        if (graphKey) nodes.set(graphKey, item);
        continue;
      }
      for (const key of [graphFrom, graphTo]) {
        if (!adjacency.has(key)) adjacency.set(key, []);
        adjacency.get(key).push(item);
      }
    }
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
    svg.addEventListener('click', event => { if (!suppressClick) activate(event); });
    svg.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); activate(event); }
    });
  }
  attach(svg);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !detail.hidden) {
      if (previous) show(previous);
      else close();
    }
  });
}

export function interactiveGraphHtml(svg, title, views = []) {
  const picker = views.length > 1 ? '<select data-graph-picker aria-label="仓库类别">' +
    views.map(view => `<option>${escapeMarkup(view.label)}</option>`).join('') + '</select>' : '';
  const templates = views.length > 1 ? views.map(view =>
    `<template data-graph-view data-graph-section="${escapeMarkup(view.section)}">${view.svg}</template>`).join('') : '';
  return `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeMarkup(title)}</title><style>
*{box-sizing:border-box}body{margin:0;background:var(--bg-elevated,#f5f7f8);color:var(--text-primary,#192734);font:14px var(--font-sans,system-ui,sans-serif);height:100dvh;display:flex;flex-direction:column}
header{display:flex;align-items:center;flex-wrap:wrap;gap:6px;padding:8px 12px;background:var(--bg-surface,#fff)}h1{font-size:16px;margin:0 auto 0 0}
button,select{font:inherit;color:inherit;border:0;border-radius:8px;background:var(--control-bg,#e7edf0);padding:6px 10px;cursor:pointer}select{max-width:min(100%,224px)}
button:hover,select:hover{background:var(--control-hover,#dbe9e7)}
button:focus,select:focus,aside a:focus{outline:none}
:root[data-keyboard] :is(button,select):focus-visible{box-shadow:inset 0 -2px var(--accent,#076d67)}
:root[data-keyboard] aside a:focus-visible{text-decoration:underline 2px}
main{flex:1;min-height:0;position:relative}main>svg{display:block;width:100%;height:100%;cursor:grab;touch-action:none;user-select:none}
main>svg:active{cursor:grabbing}[data-graph-detail]{cursor:pointer}
[data-graph-detail]:focus,aside:focus{outline:none}
[data-graph-from]>path:first-of-type{transition:opacity 150ms ease-out}[data-graph-from]:is(:hover,.related)>path:first-of-type{opacity:1}
[data-graph-detail]:is(:hover,.related,.selected)>text{fill:var(--accent-dim,#076d67);font-weight:700}
:root[data-keyboard] [data-graph-detail]:focus-visible>text{fill:var(--accent-dim,#076d67);text-decoration:underline}
[data-repository-overview] [data-graph-detail].selected>rect{fill:color-mix(in srgb,var(--bg-surface,#fff) 80%,var(--accent,#076d67))}
@media(forced-colors:active){:root[data-keyboard] :is(button,select):focus-visible{outline:2px solid Highlight;outline-offset:-2px}}
@media(prefers-reduced-motion:reduce){[data-graph-from]>path:first-of-type{transition:none}}
aside{position:absolute;right:12px;top:12px;width:min(410px,calc(100% - 24px));max-height:calc(100% - 24px);overflow:auto;overscroll-behavior:contain;background:var(--bg-surface,#fff);border:1px solid var(--border,#cbd7db);border-radius:14px;padding:12px;overflow-wrap:anywhere;box-shadow:0 8px 26px #15262823}
aside[hidden]{display:none}aside h2{font-size:15px;margin:9px 0;white-space:pre-wrap}aside p{margin:8px 0 4px}aside a{color:var(--accent-dim,#076d67)}
.detail-actions,.endpoints{display:flex;gap:6px;flex-wrap:wrap}.detail-actions{justify-content:flex-end}[data-relations]{display:grid;gap:5px;margin-top:10px}
.relation-action{display:flex;justify-content:space-between;align-items:center;gap:8px;min-height:34px;text-align:start}
.relation-action::after{content:"";width:6px;height:6px;flex:none;border:solid var(--accent-dim,#076d67);border-width:1.5px 1.5px 0 0;transform:rotate(45deg);margin-inline-end:2px}
.relation-count{font-size:12px;color:var(--text-secondary,#4f6371);white-space:nowrap;margin-inline-start:auto}
@media(min-width:1024px){main:has(aside:not([hidden])){display:grid;grid-template-columns:minmax(0,1fr) min(410px,36%);gap:8px}
main:has(aside:not([hidden])) aside{position:relative;inset:auto;width:auto;margin:8px 8px 8px 0;align-self:start}}
@media(max-width:1023px){main:has(aside:not([hidden])){display:flex;flex-direction:column}main:has(aside:not([hidden]))>svg{flex:1;min-height:0}aside{position:relative;inset:auto;order:-1;width:auto;margin:8px;max-height:40%;flex:none}}
main:has(>svg[data-repository-graph]){display:block;background:radial-gradient(circle,var(--workspace-dot,#bbdadd) .8px,transparent 1px) 0 0/20px 20px,var(--bg-elevated,#f5f7f8)}
main:has(>svg[data-repository-graph]) aside:not([hidden]){position:absolute;inset:12px 12px auto auto;width:min(360px,42%);max-height:60%;margin:0}
main>svg[data-repository-graph]>rect{fill:none}
[aria-expanded]>[data-graph-toggle]{display:inline}
[aria-expanded="true"]>[data-graph-toggle]>path:last-child{display:none}
.flowing>[data-graph-flow]{display:inline;animation:graph-flow 1.45s linear infinite}
@keyframes graph-flow{to{stroke-dashoffset:-33}}
@media(prefers-reduced-motion:reduce){.flowing>[data-graph-flow]{display:none}}
@media(max-width:760px){main:has(>svg[data-repository-graph]) aside:not([hidden]){inset:8px 8px auto;width:auto;max-height:min(40%,240px)}}
</style>
<header><h1>${escapeMarkup(title)}</h1>${picker}<button data-out aria-label="缩小">−</button><button data-in aria-label="放大">＋</button><button data-reset>复位</button></header>
<main>${svg}<aside hidden tabindex="-1" aria-label="关系详情"><div class="detail-actions"><button data-back>返回节点关系</button><button data-close>收起</button></div><h2></h2><div data-location></div><div data-relations></div></aside></main>
${templates}<script>(${startGraphViewer.toString()})();</script></html>`;
}

export async function exportGraph(format, svg, title, views) {
  if (format === 'html') {
    download(new Blob([interactiveGraphHtml(svg, title, views)], { type:'text/html;charset=utf-8' }), `${title}.html`);
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
