const valid = (value) => value === 'light' || value === 'dark';

export function readThemePreference(desktop, storage = () => window.localStorage) {
  try {
    const value = desktop?.readTheme();
    if (valid(value)) return value;
  } catch { /* Fall back to browser storage. */ }
  try {
    return storage().getItem('app-theme') === 'dark' ? 'dark' : 'light';
  } catch { return 'light'; }
}

export function persistThemePreference(value, desktop, storage = () => window.localStorage) {
  try { storage().setItem('app-theme', value); } catch { /* Session theme still works. */ }
  try {
    Promise.resolve(desktop?.saveTheme(value)).catch(() => {});
  } catch { /* A storage error must not block native theme synchronization. */ }
}
