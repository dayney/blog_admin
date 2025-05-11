<template>
  <div class="home-view">
    <div class="content">
      <h1>欢迎使用 <span class="highlight">小兵CMS</span> 管理系统</h1>
      <p>一个现代化、高效、美观的内容管理系统</p>
      <div class="actions">
        <router-link to="/dashboard" class="enter-btn"> <el-icon><ArrowRight /></el-icon> 进入管理系统 </router-link>
        <router-link to="/login" class="login-btn"> <el-icon><User /></el-icon> 登录系统 </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { User, ArrowRight } from '@element-plus/icons-vue';
</script>

<style lang="scss" scoped>
@use '@/assets/scss/variables.scss' as *;

.home-view {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $bg-color;
}

.content {
  text-align: center;
  padding: 40px;
  background-color: $bg-color;
  border-radius: $border-radius-base;
  box-shadow: $box-shadow-base;
  max-width: 500px;
  width: 100%;
}

.title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 10px;
  color: $text-primary;
}

.subtitle {
  font-size: 16px;
  color: $text-secondary;
  margin-bottom: 30px;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.enter-btn,
.login-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 20px;
  border-radius: $border-radius-small;
  font-size: 16px;
  font-weight: 500;
  text-decoration: none;
  transition: all $transition-time;
}

.enter-btn {
  background-color: $primary-color;
  color: $text-white;
  
  &:hover {
    background-color: $primary-color-light;
  }
}

.login-btn {
  border: 1px solid $border-color-base;
  color: $text-secondary;
  background-color: $bg-color;
  
  &:hover {
    border-color: $primary-color-lighter;
    color: $primary-color;
    background-color: $hover-bg-color;
  }
}

.enter-btn i,
.login-btn i {
  margin-right: 8px;
}
</style>
