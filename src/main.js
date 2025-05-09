import { createApp } from 'vue';
import { createPinia } from 'pinia';

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

// 引入FontAwesome
import '@fortawesome/fontawesome-free/css/all.min.css';

import App from './App.vue';
import router from './router';

// 导入全局SCSS样式（移到CSS前面）
import './styles/index.scss';
import './assets/main.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(ElementPlus);

app.mount('#app');
