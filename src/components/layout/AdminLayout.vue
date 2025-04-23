<template>
  <div class="admin-layout" :class="{ 'sidebar-collapsed': isCollapsed }">
    <!-- 左侧边栏 -->
    <div class="sidebar" :class="{ 'is-collapsed': isCollapsed, 'is-open': isMobileOpen }">
      <div class="logo-container">
        <img src="/logo.png" alt="Logo" class="sidebar-logo" />
        <h2 class="logo" v-if="!isCollapsed">博客管理系统</h2>
      </div>
      <!-- 菜单搜索框 -->
      <div class="menu-search">
        <el-input v-model="searchMenu" placeholder="搜索菜单" clearable>
          <template #prefix>
            <i class="fas fa-search"></i>
          </template>
        </el-input>
      </div>
      <!-- 侧边栏菜单 -->
      <el-menu
        :default-active="activeMenu"
        class="el-menu-vertical"
        @select="handleSelect"
        router
        :collapse="isCollapsed"
        background-color="transparent"
        text-color="var(--dark-color)"
        active-text-color="var(--primary-color)"
      >
        <el-menu-item index="dashboard">
          <i class="fas fa-tachometer-alt"></i>
          <span>仪表板</span>
        </el-menu-item>

        <!-- 系统设置菜单组 -->
        <el-sub-menu index="settings">
          <template #title>
            <i class="fas fa-cog"></i>
            <span>系统设置</span>
          </template>
          <el-menu-item index="settings-website">
            <i class="fas fa-globe"></i>
            <span>网站设置</span>
          </el-menu-item>
          <el-menu-item index="settings-seo">
            <i class="fas fa-search"></i>
            <span>SEO设置</span>
          </el-menu-item>
          <el-menu-item index="settings-image">
            <i class="fas fa-image"></i>
            <span>图片设置</span>
          </el-menu-item>
          <el-menu-item index="settings-mobile">
            <i class="fas fa-mobile-alt"></i>
            <span>移动端设置</span>
          </el-menu-item>
          <el-menu-item index="settings-user">
            <i class="fas fa-user-cog"></i>
            <span>用户设置</span>
          </el-menu-item>
          <el-menu-item index="settings-wechat">
            <i class="fab fa-weixin"></i>
            <span>微信设置</span>
          </el-menu-item>
          <el-menu-item index="settings-content">
            <i class="fas fa-file-alt"></i>
            <span>内容设置</span>
          </el-menu-item>
          <el-menu-item index="settings-application">
            <i class="fas fa-cube"></i>
            <span>应用设置</span>
          </el-menu-item>
          <el-menu-item index="settings-finance">
            <i class="fas fa-yen-sign"></i>
            <span>财务设置</span>
          </el-menu-item>
        </el-sub-menu>

        <!-- 系统工具菜单组 -->
        <el-sub-menu index="system">
          <template #title>
            <i class="fas fa-tools"></i>
            <span>系统工具</span>
          </template>
          <el-menu-item index="system-cache">
            <i class="fas fa-database"></i>
            <span>系统缓存</span>
          </el-menu-item>
          <el-menu-item index="system-attachment">
            <i class="fas fa-paperclip"></i>
            <span>附件设置</span>
          </el-menu-item>
          <el-menu-item index="system-storage">
            <i class="fas fa-hdd"></i>
            <span>存储策略</span>
          </el-menu-item>
          <el-menu-item index="system-sms">
            <i class="fas fa-sms"></i>
            <span>短信设置</span>
          </el-menu-item>
          <el-menu-item index="system-email">
            <i class="fas fa-envelope"></i>
            <span>邮件设置</span>
          </el-menu-item>
          <el-menu-item index="system-notification">
            <i class="fas fa-bell"></i>
            <span>系统提醒</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </div>

    <!-- 右侧内容区 -->
    <div class="main-content">
      <!-- 顶部导航栏 -->
      <div class="nav-bar">
        <div class="left">
          <i class="fas fa-bars toggle-sidebar" @click="toggleSidebar"></i>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="route.meta && route.meta.title">{{ route.meta.title }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="right">
          <el-dropdown>
            <span class="user-profile">
              <i class="fas fa-user"></i>
              <span>管理员</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <i class="fas fa-user-circle"></i> 个人信息
                </el-dropdown-item>
                <el-dropdown-item>
                  <i class="fas fa-edit"></i> 修改密码
                </el-dropdown-item>
                <el-dropdown-item>
                  <i class="fas fa-sign-out-alt"></i> 退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <div class="notification">
            <i class="fas fa-bell"></i>
            <span class="badge">3</span>
          </div>
        </div>
      </div>

      <!-- 标签页栏 -->
      <div class="tabs-bar">
        <el-tabs v-model="activeTab" @tab-click="handleTabClick" type="card" closable @tab-remove="removeTab">
          <el-tab-pane v-for="tab in tabs" :key="tab.name" :label="tab.title" :name="tab.name"></el-tab-pane>
        </el-tabs>
      </div>

      <!-- 页面内容 -->
      <div class="page-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// 侧边栏搜索
const searchMenu = ref('');

// 路由相关
const route = useRoute();
const router = useRouter();

// 当前激活的菜单项
const activeMenu = computed(() => {
  return route.meta.activeMenu || route.name;
});

// 标签页管理
const activeTab = ref('');
const tabs = ref([{ title: '仪表板', name: 'dashboard' }]);

// 添加标签页
const addTab = (name, title) => {
  if (!tabs.value.some(tab => tab.name === name)) {
    tabs.value.push({ title, name });
  }
  activeTab.value = name;
};

// 监听路由变化，添加新标签页
watch(
  () => route.name,
  newVal => {
    if (newVal) {
      activeTab.value = newVal;
      const title = route.meta && route.meta.title ? route.meta.title : newVal;
      addTab(newVal, title);
    }
  },
  { immediate: true }
);

// 处理标签页点击
const handleTabClick = tab => {
  if (tab && tab.props && tab.props.name) {
    router.push({ name: tab.props.name });
  }
};

// 移除标签页
const removeTab = targetName => {
  const tabsVal = tabs.value;
  let activeName = activeTab.value;

  if (activeName === targetName) {
    tabsVal.forEach((tab, index) => {
      if (tab.name === targetName) {
        const nextTab = tabsVal[index + 1] || tabsVal[index - 1];
        if (nextTab) {
          activeName = nextTab.name;
        }
      }
    });
  }

  activeTab.value = activeName;
  tabs.value = tabsVal.filter(tab => tab.name !== targetName);

  // 确保activeName存在且有效，再进行路由导航
  if (activeName && tabs.value.some(tab => tab.name === activeName)) {
    router.push({ name: activeName });
  } else if (tabs.value.length > 0) {
    // 如果当前活动标签不存在，但还有其他标签，选择第一个
    activeTab.value = tabs.value[0].name;
    router.push({ name: tabs.value[0].name });
  } else {
    // 如果没有标签了，默认导航到仪表板
    router.push({ name: 'dashboard' });
  }
};

// 处理菜单选择
const handleSelect = key => {
  router.push({ name: key });
};

// 侧边栏状态
const isCollapsed = ref(false);
const isMobileOpen = ref(false);

// 切换侧边栏
const toggleSidebar = () => {
  if (window.innerWidth < 768) {
    isMobileOpen.value = !isMobileOpen.value;
  } else {
    isCollapsed.value = !isCollapsed.value;
  }
};

// 监听窗口大小变化
const handleResize = () => {
  if (window.innerWidth < 768) {
    isCollapsed.value = false;
  }
  isMobileOpen.value = false;
};

// 在组件挂载时添加事件监听
onMounted(() => {
  window.addEventListener('resize', handleResize);
});

// 在组件卸载时移除事件监听
onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.admin-layout {
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

.sidebar {
  width: 250px;
  height: 100%;
  background: var(--sidebar-bg);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-right: 1px solid var(--border-color);
  transition: var(--transition);
  overflow-y: auto;
  overflow-x: hidden;
  flex-shrink: 0;
  z-index: 10;
}

.sidebar.is-collapsed {
  width: 64px;
}

.logo-container {
  display: flex;
  align-items: center;
  height: 60px;
  padding: 0 var(--spacing-base);
  border-bottom: 1px solid var(--border-color);
}

.sidebar-logo {
  width: 32px;
  height: 32px;
  margin-right: 10px;
}

.logo {
  color: var(--dark-color);
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.menu-search {
  padding: var(--spacing-small) var(--spacing-base);
  margin-bottom: var(--spacing-small);
}

.menu-search :deep(.el-input__inner) {
  background-color: rgba(0, 0, 0, 0.05);
  border: none;
  color: var(--dark-color);
  border-radius: var(--border-radius-base);
}

.menu-search :deep(.el-input__prefix) {
  color: var(--dark-color);
}

.menu-search :deep(.el-input__inner::placeholder) {
  color: var(--gray-color);
}

.el-menu-vertical {
  border-right: none;
  background-color: transparent;
}

.el-menu-vertical :deep(.el-menu-item), 
.el-menu-vertical :deep(.el-sub-menu__title) {
  height: 45px;
  line-height: 45px;
  color: var(--dark-color);
  transition: var(--transition);
  margin: 0 10px;
  border-radius: 8px;
}

.el-menu-vertical :deep(.el-menu-item.is-active) {
  background-color: var(--primary-color);
  color: white;
  font-weight: 500;
  border-left: none;
}

.el-menu-vertical :deep(.el-menu-item:hover), 
.el-menu-vertical :deep(.el-sub-menu__title:hover) {
  background-color: rgba(0, 0, 0, 0.05);
  color: var(--dark-color);
}

.el-menu-vertical :deep(.el-menu-item i), 
.el-menu-vertical :deep(.el-sub-menu__title i) {
  margin-right: var(--spacing-small);
  color: inherit;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: var(--bg-color);
  transition: margin-left var(--transition-time);
}

.nav-bar {
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  background: var(--header-bg);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 100;
}

.toggle-sidebar {
  font-size: 18px;
  cursor: pointer;
  color: var(--dark-color);
  margin-right: var(--spacing-base);
  transition: color var(--transition-time);
}

.toggle-sidebar:hover {
  color: var(--primary-color);
}

.nav-bar .right {
  display: flex;
  align-items: center;
}

.user-profile {
  display: flex;
  align-items: center;
  padding: 8px 15px;
  border-radius: 25px;
  cursor: pointer;
  transition: var(--transition);
  background-color: rgba(0, 0, 0, 0.05);
}

.user-profile i {
  font-size: 16px;
  margin-right: 8px;
}

.user-profile span {
  font-size: 14px;
  font-weight: 500;
}

.user-profile:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.notification {
  position: relative;
  margin-left: 15px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition);
}

.notification i {
  font-size: 16px;
  color: var(--dark-color);
}

.notification:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: var(--danger-color);
  color: white;
  font-size: 10px;
  font-weight: 600;
  height: 18px;
  width: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tabs-bar {
  padding: 5px 10px 0;
  background-color: var(--card-bg-color);
  border-bottom: 1px solid var(--border-color);
}

.tabs-bar :deep(.el-tabs__header) {
  margin-bottom: 0;
  border-bottom: none;
}

.tabs-bar :deep(.el-tabs__nav) {
  border: none;
}

.tabs-bar :deep(.el-tabs__item) {
  height: 36px;
  line-height: 36px;
  border: none;
  border-radius: var(--border-radius-base) var(--border-radius-base) 0 0;
  transition: all var(--transition-time);
  color: var(--text-regular);
  font-size: 14px;
  position: relative;
}

.tabs-bar :deep(.el-tabs__item.is-active) {
  background-color: var(--card-bg-color);
  color: var(--primary-color);
  border-bottom: 2px solid var(--primary-color);
  font-weight: 500;
}

.tabs-bar :deep(.el-tabs__item:not(.is-active):hover) {
  color: var(--primary-hover);
}

.tabs-bar :deep(.el-tabs__nav-scroll) {
  padding: 0 var(--spacing-base);
}

.tabs-bar :deep(.el-tabs__active-bar) {
  display: none;
}

.tabs-bar :deep(.el-icon-close) {
  height: 16px;
  width: 16px;
  line-height: 16px;
  border-radius: var(--border-radius-circle);
  transition: all var(--transition-time);
  color: var(--text-secondary);
}

.tabs-bar :deep(.el-icon-close:hover) {
  background-color: var(--danger-color);
  color: var(--text-white);
}

.page-content {
  flex: 1;
  padding: var(--spacing-large);
  overflow-y: auto;
  background-color: var(--bg-color);
}

/* 响应式样式 */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    z-index: 100;
    transform: translateX(-100%);
    box-shadow: var(--shadow);
  }
  
  .sidebar.is-open {
    transform: translateX(0);
  }
  
  .main-content {
    margin-left: 0;
  }
  
  .page-content {
    padding: var(--spacing-base);
  }
}

.nav-bar .left {
  display: flex;
  align-items: center;
}

.nav-bar .left .el-breadcrumb {
  margin-left: var(--spacing-base);
}

.el-menu-vertical :deep(.el-sub-menu .el-menu-item) {
  height: 40px !important;
  line-height: 40px !important;
  padding-left: 54px !important;
  font-size: 13px;
  border-radius: 8px;
  margin: 0 10px;
}

.el-menu-vertical :deep(.el-sub-menu .el-menu-item.is-active) {
  background-color: var(--primary-color);
  color: white;
  border-left: none;
  font-weight: 500;
}
</style>
