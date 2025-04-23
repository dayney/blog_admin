import { createApp } from 'vue';
import { createPinia } from 'pinia';

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

// 引入FontAwesome
import '@fortawesome/fontawesome-free/css/all.min.css';

import App from './App.vue';
import router from './router';

import './assets/main.css';

// 引入环境配置
import { envName } from './utils/tools.js';

// 根据环境设置页面标题
document.title = envName;

console.log(`当前环境: ${import.meta.env.MODE}`);
console.log(`API地址: ${import.meta.env.VITE_API_BASE_URL}`);
console.log(`图片地址: ${import.meta.env.VITE_IMAGE_BASE_URL}`);

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(ElementPlus);

app.mount('#app');
