import { ref } from 'vue';
export const notice = ref(null);
let sequence = 0;
export function notify(message, kind = 'success', options = {}) {
  const id = ++sequence;
  notice.value = { id, message, kind, duration: kind === 'loading' ? 0 : kind === 'error' || options.action ? 6000 : 3200, ...options };
  return id;
}
export function dismissNotice(id) {
  if (id == null || notice.value?.id === id) notice.value = null;
}
