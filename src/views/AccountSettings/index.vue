<template>
  <div class="profile-outer-container">
    <div class="profile-container">
      <div class="profile-page">
        <!-- 顶部仅保留返回按钮 -->
        <div class="profile-header">
          <div class="user-info">
            <el-button class="back-btn" @click="goBack">返回</el-button>
          </div>
        </div>
        <!-- 导航标签栏 -->
        <div class="nav-tabs">
          <div
            v-for="tab in tabs"
            :key="tab.name"
            :class="['tab-item', { active: activeTab === tab.name }]"
            @click="activeTab = tab.name"
          >
            {{ tab.label }}
          </div>
        </div>
        <!-- 主要内容区域 -->
        <div class="main-content main-content-left">
          <div class="right-content module-center-content">
            <ChangePassword v-if="activeTab === 'changePassword'" />
            <SecuritySettings v-if="activeTab === 'security'" />
            <AccountBinding v-if="activeTab === 'binding'" />
            <NotificationPreferences v-if="activeTab === 'notification'" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ChangePassword from './ChangePassword.vue';
import SecuritySettings from './SecuritySettings.vue';
import AccountBinding from './AccountBinding.vue';
import NotificationPreferences from './NotificationPreferences.vue';

const tabs = [
  { name: 'changePassword', label: '修改密码' },
  { name: 'security', label: '安全设置' },
  { name: 'binding', label: '账号绑定' },
  { name: 'notification', label: '通知偏好' }
];
const activeTab = ref('changePassword');

function goBack() {
  window.history.back();
}
</script>

<style lang="scss" scoped>
@use '@/assets/scss/variables.scss' as *;
.profile-outer-container {
  background-color: $bg-color;
  min-height: 100vh;
  padding: 20px;
}
.profile-container {
  border-radius: $border-radius-base;
  background-color: $card-bg-color;
  margin: 0 auto;
  max-width: 1200px;
  box-shadow: $box-shadow-base;
}
.profile-page {
  background-color: $card-bg-color;
  min-height: 100vh;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}
.profile-header {
  background-color: $bg-color;
  padding: 15px 20px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-bottom: 1px solid $border-color-lighter;
}
.user-info {
  display: flex;
  align-items: center;
}
.user-name {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
}
.back-btn {
  margin-right: 10px;
}
.nav-tabs {
  display: flex;
  background-color: #fff;
  border-bottom: 1px solid #e8e8e8;
  overflow-x: auto;
  white-space: nowrap;
  &::-webkit-scrollbar {
    display: none;
  }
}
.tab-item {
  padding: 12px 16px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  position: relative;
  &.active {
    color: #1890ff;
    &:after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background-color: #1890ff;
    }
  }
}
.main-content {
  display: flex;
  padding: 15px;
  position: relative;
}
// 新增靠左样式
.main-content-left {
  justify-content: flex-start;
}
.right-content {
  flex: 1;
}
</style> 