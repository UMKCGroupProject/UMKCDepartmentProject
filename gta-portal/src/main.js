import { createApp } from 'vue'
import App from '@/App.vue'
import router from "./router"
import store from '/src/store/store.js'
// import Axios from 'axios'

//CSS imports
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/js/src/dropdown';
import 'bootstrap/js/src/button';
import 'bootstrap/js/dist/dropdown.js'

// Vue.config.productionTip = false;
// set auth header
// Axios.defaults.headers.common['Authorization'] = `Bearer ${store.state.token}`;

const app = createApp(App).use(router).use(store);

app.mount('#app');