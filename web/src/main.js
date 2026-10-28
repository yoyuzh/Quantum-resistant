import { createApp } from 'vue';
import App from './App.vue';
import './style.css';
import './styles/workspace.css';

document.addEventListener('keydown', event => {
  if (event.key === 'Tab' || event.key.startsWith('Arrow')) document.documentElement.dataset.keyboard = 'true';
}, true);
document.addEventListener('pointerdown', () => { delete document.documentElement.dataset.keyboard; }, true);

createApp(App).mount('#app');
