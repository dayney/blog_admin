<template>
  <div class="admin-layout" :class="{ 'sidebar-collapsed': isCollapsed }">
    <!-- 左侧边栏 -->
    <div class="sidebar" :class="{ 'is-collapsed': isCollapsed, 'is-open': isMobileOpen }">
      <div class="logo-container">
        <div class="logo-wrapper">
          <img src="/images/blue-tech-logo.svg" alt="Logo" class="sidebar-logo" />
          <h2 class="logo" v-if="!isCollapsed">小兵CMS</h2>
        </div>
      </div>
      
      <!-- 折叠/展开按钮 -->
      <div class="collapse-button-container">
        <div class="collapse-button" @click="toggleSidebar">
          <i class="fas fa-bars" v-if="isCollapsed"></i>
          <i class="fas fa-indent" v-else></i>
        </div>
      </div>
      
      <!-- 菜单搜索框 -->
      <div class="menu-search" v-if="!isCollapsed">
        <div class="search-wrapper">
          <el-input v-model="searchMenu" placeholder="请输入需要检索的菜单名称" clearable>
            <template #prefix>
              <i class="fas fa-search search-icon"></i>
            </template>
          </el-input>
        </div>
      </div>
      
      <!-- 侧边栏菜单 -->
      <el-menu
        :default-active="activeMenu"
        class="el-menu-vertical"
        @select="handleSelect"
        router
        :collapse="isCollapsed"
        text-color="#333333"
        active-text-color="#FFFFFF"
        :unique-opened="true"
      >
        <el-menu-item index="/dashboard" class="first-menu-item">
          <div class="icon-container">
            <i class="fas fa-tachometer-alt menu-icon"></i>
          </div>
          <template #title>仪表盘</template>
        </el-menu-item>
        
        <el-menu-item index="/content">
          <div class="icon-container">
            <i class="fas fa-file-alt menu-icon"></i>
          </div>
          <template #title>内容管理</template>
        </el-menu-item>
        
        <el-menu-item index="/media">
          <div class="icon-container">
            <i class="fas fa-photo-video menu-icon"></i>
          </div>
          <template #title>媒体管理</template>
        </el-menu-item>
        
        <el-menu-item index="/user/manage">
          <div class="icon-container">
            <i class="fas fa-user-friends menu-icon"></i>
          </div>
          <template #title>用户管理</template>
        </el-menu-item>
        
        <el-menu-item index="/wechat">
          <div class="icon-container">
            <i class="fab fa-weixin menu-icon"></i>
          </div>
          <template #title>微信管理</template>
        </el-menu-item>
        
        <el-menu-item index="/seo">
          <div class="icon-container">
            <i class="fas fa-search menu-icon"></i>
          </div>
          <template #title>SEO优化</template>
        </el-menu-item>
        
        <el-menu-item index="/prototype">
          <div class="icon-container">
            <i class="fas fa-pencil-ruler menu-icon"></i>
          </div>
          <template #title>原型设计</template>
        </el-menu-item>
        
        <el-menu-item index="/page">
          <div class="icon-container">
            <i class="fas fa-desktop menu-icon"></i>
          </div>
          <template #title>页面设计</template>
        </el-menu-item>
        
        <el-menu-item index="/system">
          <div class="icon-container">
            <i class="fas fa-cog menu-icon"></i>
          </div>
          <template #title>系统设置</template>
        </el-menu-item>
      </el-menu>
    </div>

    <!-- 右侧内容区 -->
    <div class="main-content">
      <!-- 顶部导航栏 -->
      <div class="nav-bar">
        <div class="left">
          <div class="top-search-wrapper">
            <el-input
              placeholder="搜索..."
              v-model="searchKeyword"
              class="search-input"
            >
              <template #prefix>
                <i class="fas fa-search"></i>
              </template>
            </el-input>
          </div>
        </div>
        <div class="center">
          <!-- 移除搜索框 -->
        </div>
        <div class="right">
          <div class="notification">
            <el-badge :value="2" class="notification-badge">
              <i class="fas fa-bell"></i>
            </el-badge>
          </div>
          <div class="divider"></div>
          <el-dropdown>
            <div class="user-profile">
              <template v-if="hasAvatar">
                <img :src="userInfo.avatar" alt="用户头像" class="avatar" />
              </template>
              <div v-else class="avatar-placeholder">
                {{ userInitial }}
              </div>
              <span>{{ userInfo.name }}</span>
              <i class="fas fa-angle-down"></i>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="navigateToProfile">个人信息</el-dropdown-item>
                <el-dropdown-item @click="navigateToAccountSettings">账号设置</el-dropdown-item>
                <el-dropdown-item>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
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
const searchKeyword = ref('');

// 用户信息
const userInfo = ref({
  name: '默认用户',
  avatar: '' // 空字符串表示没有头像
});

// 获取用户名首字母
const userInitial = computed(() => {
  if (userInfo.value.name) {
    return userInfo.value.name.charAt(0);
  }
  return '';
});

// 判断是否有头像
const hasAvatar = computed(() => {
  return !!userInfo.value.avatar;
});

// 路由相关
const route = useRoute();
const router = useRouter();

// 跳转到个人资料页面
const navigateToProfile = () => {
  router.push('/user/profile');
};

// 跳转到账号设置页面
const navigateToAccountSettings = () => {
  router.push('/account-settings');
};

// 当前激活的菜单项
const activeMenu = computed(() => {
  return route.meta.activeMenu || route.name;
});

// 侧边栏折叠状态
const isCollapsed = ref(false);
const isMobileOpen = ref(false);

// 切换侧边栏折叠状态
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
};

// 移动端菜单状态管理
const isMobile = ref(false);
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
  if (isMobile.value) {
    isCollapsed.value = true;
  }
};

// 初始化和销毁时处理窗口大小变化
onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});

// 处理菜单项选择
const handleSelect = (index) => {
  console.log('点击handleSelect', index);
  // 如果是移动端，点击菜单后自动收起侧边栏
  if (isMobile.value) {
    isMobileOpen.value = false;
  }
};
</script>

<style scoped>
.admin-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background-color: #f8f8f8;
}

/* 侧边栏样式 */
.sidebar {
  width: 260px;
  height: 100%;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  transition: width 0.3s, transform 0.3s;
  display: flex;
  flex-direction: column;
  z-index: 999;
}

.sidebar.is-collapsed {
  width: 64px;
}

.sidebar.is-collapsed .logo-container {
  justify-content: center;
  padding: 0;
  height: 60px;
}

.sidebar.is-collapsed .sidebar-logo {
  margin-right: 0;
}

.logo-container {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  position: relative;
  background-color: #fff;
}

.logo-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar-logo {
  width: 30px;
  height: 30px;
  margin-right: 12px;
  border-radius: 4px;
}

.collapse-button-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 48px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  background-color: #fff;
}

.collapse-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  cursor: pointer;
  color: #666;
  font-size: 16px;
}

.sidebar.is-collapsed .collapse-button-container {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.logo {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
}

.menu-search {
  padding: 10px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.search-wrapper {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e5e5e5;
  background-color: #fbfbfb;
}

.menu-search :deep(.el-input__wrapper) {
  background-color: transparent;
  border: none;
  box-shadow: none !important;
  padding: 0 10px;
}

.menu-search :deep(.el-input) {
  font-size: 14px;
}

.menu-search :deep(.el-input__inner) {
  background-color: transparent;
  border: none;
  color: #333;
  height: 40px;
  font-size: 14px;
}

.menu-search :deep(.el-input__inner::placeholder) {
  color: #999;
  font-size: 14px;
}

.menu-search :deep(.el-input__prefix) {
  color: #999;
  margin-right: 5px;
}

.menu-search :deep(.el-input__suffix) {
  right: 5px;
}

.menu-search :deep(.el-input__clear) {
  color: #999;
  margin-right: 0;
}

.search-icon {
  color: #999;
  font-size: 16px;
}

.el-menu-vertical {
  flex: 1;
  border-right: none;
  overflow-y: auto;
  background-color: #fff;
  padding: 5px 0;
}

.el-menu-vertical:not(.el-menu--collapse) {
  width: 100%;
}

/* 定制侧边栏菜单项样式 */
:deep(.el-menu) {
  background-color: transparent;
  border-right: none;
}

:deep(.el-menu-item) {
  color: #333;
  height: 48px;
  font-size: 14px;
  padding: 0 15px !important;
  margin: 5px 10px;
  border-radius: 6px;
  transition: all 0.3s;
  line-height: 48px;
}

:deep(.el-menu-item.is-active) {
  background-color: #0071e3;
  color: #ffffff;
  font-weight: 500;
  border-radius: 6px;
}

.icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  margin-right: 10px;
  border-radius: 50%;
  background-color: #f5f5f5;
  flex-shrink: 0;
}

.first-menu-item:deep(.is-active) {
  background-color: #0071e3;
}

:deep(.el-menu-item:hover:not(.is-active)) {
  background-color: #0071e3;
  color: #ffffff;
  border-radius: 6px;
}

:deep(.el-menu-item:hover:not(.is-active)) .icon-container {
  background-color: rgba(255, 255, 255, 0.2);
}

:deep(.el-menu-item:hover:not(.is-active)) .menu-icon {
  color: #ffffff;
}

.menu-icon {
  color: #666;
  font-size: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

:deep(.el-menu-item.is-active) .icon-container {
  background-color: rgba(255, 255, 255, 0.2);
}

:deep(.el-menu-item.is-active) .menu-icon {
  color: #ffffff;
}

/* 主内容区样式 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 顶部导航栏样式 */
.nav-bar {
  height: 60px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  padding: 0;
  z-index: 99;
}

.nav-bar .left {
  flex: 1;
  display: flex;
  justify-content: flex-start;
  margin-right: 0;
  padding-left: 20px;
}

.nav-bar .center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.top-search-wrapper {
  width: 280px;
  position: relative;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  background-color: #f5f7fa;
  transition: all 0.2s;
}

.top-search-wrapper:focus-within {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.search-input {
  width: 100%;
}

.search-input :deep(.el-input__wrapper) {
  background-color: transparent;
  box-shadow: none !important;
  padding: 0 10px;
}

.search-input :deep(.el-input__inner) {
  height: 36px;
  font-size: 14px;
  background-color: transparent;
}

.search-input :deep(.el-input__prefix) {
  color: #909399;
}

.nav-bar .right {
  display: flex;
  align-items: center;
  padding-right: 20px;
}

.notification {
  margin-right: 15px;
  position: relative;
  cursor: pointer;
  font-size: 20px;
}

.divider {
  height: 24px;
  width: 1px;
  background-color: #e0e0e0;
  margin: 0 15px 0 0;
}

.notification-badge :deep(.el-badge__content) {
  top: 2px;
  right: 12px;
  font-size: 12px;
  border: 1px solid white;
  padding: 0 5px;
  height: 18px;
  line-height: 16px;
  border-radius: 10px;
}

.user-profile {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding-right: 0;
  border: none !important;
  outline: none !important;
}

.user-profile:hover, 
.user-profile:focus, 
.user-profile:active {
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
}

.user-profile span {
  margin-right: 8px;
}

/* 覆盖element-plus下拉菜单的默认样式 */
:deep(.el-dropdown) {
  outline: none !important;
}

:deep(.el-dropdown:focus-visible) {
  outline: none !important;
}

:deep(.el-dropdown:hover) {
  border: none !important;
  outline: none !important;
}

:deep(.el-dropdown:focus) {
  outline: none !important;
}

:deep(.el-dropdown:active) {
  outline: none !important;
}

/* 覆盖下拉菜单弹出框样式 */
:deep(.el-popper.is-light) {
  border: none !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 覆盖el-popper的箭头样式 */
:deep(.el-popper__arrow) {
  display: none !important;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin-right: 8px;
  background-color: #e6f0fd;
}

/* 页面内容区样式 */
.page-content {
  flex: 1;
  overflow: auto;
  padding: 0;
  background-color: #f8f8f8;
}

/* 适配移动端 */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    transform: translateX(-100%);
  }
  
  .sidebar.is-open {
    transform: translateX(0);
  }
  
  .top-search-wrapper {
    width: 250px;
  }
}

/* 折叠状态下整个菜单样式 */
:deep(.el-menu--collapse) {
  width: 64px;
  padding: 5px 0;
}

/* 折叠状态下菜单项样式 */
:deep(.el-menu--collapse) .el-menu-item {
  padding: 0 !important;
  height: 48px;
  margin: 5px 0;
  width: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0;
}

/* 折叠状态下tooltip触发器样式 */
:deep(.el-menu--collapse .el-tooltip__trigger) {
  display: flex;
  justify-content: center;
  width: 64px;
}

/* 折叠状态下图标容器样式 */
:deep(.el-menu--collapse) .icon-container {
  margin: 0;
  width: 36px;
  height: 36px;
  background-color: #f5f5f5;
  border-radius: 50%;
}

/* 确保普通状态是白色圆圈背景 */
:deep(.el-menu--collapse) .el-menu-item .icon-container {
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 悬停状态图标容器样式 */
:deep(.el-menu--collapse) .el-menu-item:hover {
  background-color: #0071e3;
  color: #ffffff;
  border-radius: 0;
}

:deep(.el-menu--collapse) .el-menu-item:hover .icon-container {
  background-color: rgba(255, 255, 255, 0.2);
}

/* 折叠状态下活动项样式 */
:deep(.el-menu--collapse) .is-active {
  border-radius: 0;
  width: 64px;
  margin: 5px 0;
  background-color: #0071e3;
}

/* 活动状态图标容器样式 */
:deep(.el-menu--collapse) .is-active .icon-container {
  background-color: rgba(255, 255, 255, 0.2);
}

/* 折叠状态下菜单图标样式 */
:deep(.el-menu--collapse) .menu-icon {
  margin-right: 0;
  font-size: 18px;
}

.avatar-placeholder {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin-right: 8px;
  background-color: #0071e3;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 500;
}
</style>
