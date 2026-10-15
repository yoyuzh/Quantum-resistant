export function panelScrolls(panel) {
  return !!panel && panel.scrollHeight > panel.clientHeight + 1 &&
    /auto|scroll/.test(getComputedStyle(panel).overflowY);
}

export function capturePosition(panel) {
  return { panel: panelScrolls(panel), top: panelScrolls(panel) ? panel.scrollTop : window.scrollY };
}

export function restorePosition(panel, position) {
  if (!position) return;
  if (position.panel && panelScrolls(panel)) panel.scrollTo({ top: position.top, behavior: 'instant' });
  else window.scrollTo({ top: position.top, behavior: 'instant' });
}

export function focusDestination(target, panel, header, { highlight = false, focus = true } = {}) {
  if (!target) return;
  const rect = target.getBoundingClientRect();
  if (panelScrolls(panel)) {
    panel.scrollTo({ top: panel.scrollTop + rect.top - panel.getBoundingClientRect().top - 16,
      behavior: 'instant' });
  } else {
    window.scrollTo({ top: window.scrollY + rect.top - (header?.getBoundingClientRect().height || 0) - 16,
      behavior: 'instant' });
  }
  if (focus) target.focus({ preventScroll: true });
  if (highlight && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return target.animate([
      { backgroundColor: getComputedStyle(target).getPropertyValue('--control-selected') },
      { backgroundColor: getComputedStyle(target).backgroundColor },
    ], { duration: 700, easing: 'ease-out' });
  }
}

export function ensureFocusVisible(target, panel, header) {
  if (!target?.getBoundingClientRect || target === panel) return;
  const anchor = target.closest?.('label, .select-field') || target;
  const visibleTop = panelScrolls(panel)
    ? panel.getBoundingClientRect().top
    : Math.max(0, header?.getBoundingClientRect().bottom || 0);
  if (anchor.getBoundingClientRect().top < visibleTop + 8) {
    focusDestination(anchor, panel, header, { focus: false });
  }
}
