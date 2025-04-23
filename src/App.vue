<script setup>
import { RouterLink, RouterView } from 'vue-router';
import HelloWorld from './components/HelloWorld.vue';
</script>

<template>
  <!-- <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/demo">Demo</RouterLink>
        <RouterLink to="/login">Login</RouterLink>
      </nav>
    </div>
  </header> -->

  <RouterView />
</template>

<style>
/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

body {
  background-color: var(--light-color);
  color: var(--dark-color);
  font-size: 14px;
  line-height: 1.5;
}

/* Element Plus 组件样式优化 */
.el-button--primary {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.el-button--primary:hover, 
.el-button--primary:focus {
  background-color: var(--primary-hover);
  border-color: var(--primary-hover);
}

.el-menu {
  border-right: none;
}

.el-table th {
  background-color: #fafafa;
}

.el-tag {
  border-radius: 4px;
}

.el-card {
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  transition: var(--transition);
}

.el-card:hover {
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

::-webkit-scrollbar-track {
  background-color: rgba(0, 0, 0, 0.05);
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.3);
}
</style>
