import { createApp } from 'vue';
import { router } from './router/index.js';
import App from './App.vue';
import './assets/style.css';
import './assets/navigation.css';
// Last on purpose: the dark theme lock restates colours that must not be lost.
import './assets/theme-lock.css';

createApp(App).use(router).mount('#app');
