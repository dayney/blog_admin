import { createApp } from 'vue';
import { createPinia } from 'pinia';

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

// 引入Element Plus图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

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

// 注册所有Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(createPinia());
app.use(router);
app.use(ElementPlus);

app.mount('#app');
