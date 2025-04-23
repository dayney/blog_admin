import { createRouter, createWebHistory } from 'vue-router';
import AdminLayout from '../components/layout/AdminLayout.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/demo',
      name: 'demo',
      component: () => import('../views/DemoView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView/LoginView.vue')
    },
    // 后台管理系统路由
    {
      path: '/',
      component: AdminLayout,
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('../views/Dashboard.vue'),
          meta: {
            title: '仪表板',
            activeMenu: 'dashboard'
          }
        },
        // 系统设置路由
        {
          path: 'settings/website',
          name: 'settings-website',
          component: () => import('../views/settings/WebsiteSettings.vue'),
          meta: {
            title: '网站设置',
            activeMenu: 'settings-website'
          }
        },
        {
          path: 'settings/seo',
          name: 'settings-seo',
          component: () => import('../views/settings/SeoSettings.vue'),
          meta: {
            title: 'SEO设置',
            activeMenu: 'settings-seo'
          }
        },
        // 系统工具路由
        {
          path: 'system/cache',
          name: 'system-cache',
          component: () => import('../views/system/CacheSettings.vue'),
          meta: {
            title: '系统缓存',
            activeMenu: 'system-cache'
          }
        },
        {
          path: 'system/attachment',
          name: 'system-attachment',
          component: () => import('../views/system/AttachmentSettings.vue'),
          meta: {
            title: '附件设置',
            activeMenu: 'system-attachment'
          }
        },
        {
          path: 'system/storage',
          name: 'system-storage',
          component: () => import('../views/system/StorageSettings.vue'),
          meta: {
            title: '存储策略',
            activeMenu: 'system-storage'
          }
        },
        {
          path: 'system/sms',
          name: 'system-sms',
          component: () => import('../views/system/SmsSettings.vue'),
          meta: {
            title: '短信设置',
            activeMenu: 'system-sms'
          }
        }
      ]
    }
  ]
});

export default router;
