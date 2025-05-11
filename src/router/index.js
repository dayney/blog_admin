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
        // 内容管理路由
        {
          path: 'content',
          name: 'content-management',
          component: () => import('../views/ContentManagement/index.vue'),
          meta: {
            title: '内容管理',
            activeMenu: 'content'
          }
        },
        // 媒体管理路由
        {
          path: 'media',
          name: 'media-management',
          component: () => import('../views/MediaManagement/index.vue'),
          meta: {
            title: '媒体管理',
            activeMenu: 'media'
          }
        },
        // 用户相关路由
        {
          path: 'user/profile',
          name: 'user-profile',
          component: () => import('../views/user/Profile.vue'),
          meta: {
            title: '个人资料',
            activeMenu: 'user'
          }
        },
        // 账号设置路由
        {
          path: 'account-settings',
          name: 'account-settings',
          component: () => import('../views/AccountSettings/index.vue'),
          meta: {
            title: '账号设置',
            activeMenu: 'user'
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
        },
        {
          path: 'user/manage',
          name: 'user-manage',
          component: () => import('../views/user/UserManage.vue'),
          meta: {
            title: '用户管理',
            activeMenu: 'user-manage'
          }
        },
        // SEO优化路由
        {
          path: 'seo',
          name: 'seo-optimization',
          component: () => import('../views/Dashboard.vue'), // 临时使用仪表盘作为占位符
          meta: {
            title: 'SEO优化',
            activeMenu: 'seo'
          }
        },
        // 微信管理路由
        {
          path: 'wechat',
          name: 'wechat-management',
          component: () => import('../views/Dashboard.vue'), // 临时使用仪表盘作为占位符
          meta: {
            title: '微信管理',
            activeMenu: 'wechat'
          }
        },
        // 原型设计路由
        {
          path: 'prototype',
          name: 'prototype-design',
          component: () => import('../views/Dashboard.vue'), // 临时使用仪表盘作为占位符
          meta: {
            title: '原型设计',
            activeMenu: 'prototype'
          }
        },
        // 页面设计路由
        {
          path: 'page',
          name: 'page-design',
          component: () => import('../views/Dashboard.vue'), // 临时使用仪表盘作为占位符
          meta: {
            title: '页面设计',
            activeMenu: 'page'
          }
        },
        // 系统管理路由
        {
          path: 'system',
          name: 'system-management',
          component: () => import('../views/Dashboard.vue'), // 临时使用仪表盘作为占位符
          meta: {
            title: '系统设置',
            activeMenu: 'system'
          }
        },
        // 日志记录路由
        {
          path: 'log-record',
          name: 'log-record',
          component: () => import('../views/LogRecord/index.vue'),
          meta: {
            title: '操作日志',
            activeMenu: 'log-record'
          }
        }
      ]
    }
  ]
});

export default router;
