import { reactive } from 'vue';
import { request } from '../api/client.js';
import { configureLimits } from '../utils/files.js';

export const scanLimits = reactive({
  max_files: 5000, max_file_bytes: 2 * 1024 * 1024,
  max_text_bytes: 100 * 1024 * 1024, max_upload_bytes: 110 * 1024 * 1024,
  scan_timeout_seconds: 600, popular_timeout_seconds: 1200,
});

export async function loadScanConfig() {
  const config = await request('/api/config');
  configureLimits(config);
  Object.assign(scanLimits, config);
}
