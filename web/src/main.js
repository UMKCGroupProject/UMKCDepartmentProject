import { createApp } from 'vue';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store/store.js';

// One import pulls in every Bootstrap plugin. The old main.js imported
// dropdown twice (once from js/src, once from js/dist) plus button.
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

createApp(App).use(router).use(store).mount('#app');
