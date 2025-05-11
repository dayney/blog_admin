import { createApp } from 'vue';
import { createPinia } from 'pinia';

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

// 引入FontAwesome
import '@fortawesome/fontawesome-free/css/all.min.css';

import App from './App.vue';
import router from './router';

// 导入全局SCSS样式
import './assets/scss/global-styles.scss';
import './assets/scss/index.scss'

// Tailwind CSS
import './assets/scss/tailwind.scss'

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(ElementPlus);

app.mount('#app');
