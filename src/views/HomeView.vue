<template>
  <div class="home">
    <div class="welcome-section">
      <h1 class="title">博客管理系统</h1>
      <p class="subtitle">欢迎使用博客管理系统</p>
      <div class="actions">
        <router-link to="/dashboard" class="enter-btn"> <i class="fas fa-sign-in-alt"></i> 进入管理系统 </router-link>
        <router-link to="/login" class="login-btn"> <i class="fas fa-user"></i> 登录系统 </router-link>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/scss/variables.scss' as *;

.home {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $bg-color;
}

.welcome-section {
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
