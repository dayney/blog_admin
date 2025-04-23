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

<style scoped>
.home {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
}

.welcome-section {
  text-align: center;
  padding: 40px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
}

.title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #303133;
}

.subtitle {
  font-size: 16px;
  color: #606266;
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
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
}

.enter-btn {
  background-color: #409eff;
  color: white;
}

.enter-btn:hover {
  background-color: #66b1ff;
}

.login-btn {
  border: 1px solid #dcdfe6;
  color: #606266;
  background-color: white;
}

.login-btn:hover {
  border-color: #c6e2ff;
  color: #409eff;
  background-color: #ecf5ff;
}

.enter-btn i,
.login-btn i {
  margin-right: 8px;
}
</style>
