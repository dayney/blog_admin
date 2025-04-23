<template>
  <div class="login-view">
    <div class="auth-container">
      <!-- 动态背景效果 -->
      <div class="auth-background">
        <!-- 动态背景效果 - 浮动元素 -->
        <div class="floating-elements">
          <div class="tech-element bubble bubble1"></div>
          <div class="tech-element bubble bubble2"></div>
          <div class="tech-element bubble bubble3"></div>
          <div class="tech-element bubble bubble4"></div>
          <div class="tech-element bubble bubble5"></div>
          <div class="tech-element bubble bubble6"></div>

          <div class="tech-circles">
            <div class="tech-circle"></div>
            <div class="tech-circle"></div>
            <div class="tech-circle"></div>
          </div>

          <div class="digital-lines">
            <div class="d-line"></div>
            <div class="d-line"></div>
            <div class="d-line"></div>
            <div class="d-line"></div>
          </div>

          <!-- Logo与系统名称 -->
          <div class="auth-logo">
            <img src="/logo.png" alt="Logo" class="login-logo" />
            <h1>{{ systemName }}</h1>
            <div class="version">{{ version }}</div>
          </div>
        </div>
      </div>

      <!-- 右侧表单区域 -->
      <div class="login-form-container">
        <!-- 选项卡 -->
        <div class="login-tabs">
          <div class="tab-item" :class="{ active: activeTab === 'login' }" @click="switchTab('login')">用户登录</div>
          <div class="tab-item" :class="{ active: activeTab === 'register' }" @click="switchTab('register')">
            用户注册
          </div>
        </div>

        <!-- 动态组件 -->
        <component :is="currentTabComponent" ref="formRef" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, markRaw } from 'vue';
import LoginForm from './components/LoginForm.vue';
import RegisterForm from './components/RegisterForm.vue';

// 系统信息
const systemName = ref('博客管理系统');
const version = ref('v1.0.0');

// 当前激活的选项卡
const activeTab = ref('login');

// 表单引用
const formRef = ref(null);

// 使用markRaw来避免不必要的响应式转换，提高性能
const LoginFormComponent = markRaw(LoginForm);
const RegisterFormComponent = markRaw(RegisterForm);

// 计算当前应该显示的组件
const currentTabComponent = computed(() => {
  return activeTab.value === 'login' ? LoginFormComponent : RegisterFormComponent;
});

// 切换选项卡
const switchTab = tab => {
  if (activeTab.value !== tab) {
    // 先切换tab，然后在下一个微任务清空表单
    activeTab.value = tab;

    // 使用setTimeout确保组件已经渲染
    setTimeout(() => {
      // 清空表单数据
      if (formRef.value) {
        formRef.value.resetForm();
      }
    }, 0);
  }
};
</script>

<style scoped>
.login-view {
  width: 100vw;
  height: 100vh;
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  overflow: hidden;
}

.auth-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  overflow: hidden;
}

.auth-background {
  position: relative;
  width: 55%;
  height: 100%;
  background: linear-gradient(135deg, var(--login-gradient-start), var(--login-gradient-end));
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

/* 浮动元素 */
.floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.tech-element {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  opacity: 0.6;
  animation: float 15s infinite ease-in-out;
}

.bubble {
  border-radius: 50%;
}

.bubble1 {
  width: 120px;
  height: 120px;
  left: 10%;
  top: 10%;
  background-color: var(--bubble-color-1);
  animation-delay: 0s;
}

.bubble2 {
  width: 80px;
  height: 80px;
  left: 20%;
  top: 40%;
  background-color: var(--bubble-color-2);
  animation-delay: 1s;
}

.bubble3 {
  width: 100px;
  height: 100px;
  left: 50%;
  top: 15%;
  background-color: var(--bubble-color-3);
  animation-delay: 2s;
}

.bubble4 {
  width: 150px;
  height: 150px;
  left: 70%;
  top: 30%;
  background-color: var(--bubble-color-1);
  animation-delay: 3s;
}

.bubble5 {
  width: 70px;
  height: 70px;
  left: 80%;
  top: 60%;
  background-color: var(--bubble-color-2);
  animation-delay: 4s;
}

.bubble6 {
  width: 90px;
  height: 90px;
  left: 30%;
  top: 70%;
  background-color: var(--bubble-color-3);
  animation-delay: 5s;
}

/* 旋转的圆圈 */
.tech-circles {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.tech-circle {
  position: absolute;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: rotate 30s linear infinite;
}

.tech-circle:nth-child(1) {
  width: 300px;
  height: 300px;
  top: calc(50% - 150px);
  left: calc(50% - 150px);
}

.tech-circle:nth-child(2) {
  width: 500px;
  height: 500px;
  top: calc(50% - 250px);
  left: calc(50% - 250px);
  animation-direction: reverse;
}

.tech-circle:nth-child(3) {
  width: 700px;
  height: 700px;
  top: calc(50% - 350px);
  left: calc(50% - 350px);
}

/* 数字线条 */
.digital-lines {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.d-line {
  position: absolute;
  height: 2px;
  background: linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0));
  animation: line-move 8s infinite linear;
}

.d-line:nth-child(1) {
  width: 30%;
  top: 20%;
  left: 0;
  animation-delay: 0s;
}

.d-line:nth-child(2) {
  width: 20%;
  top: 40%;
  left: 20%;
  animation-delay: 2s;
}

.d-line:nth-child(3) {
  width: 40%;
  top: 60%;
  left: 40%;
  animation-delay: 4s;
}

.d-line:nth-child(4) {
  width: 30%;
  top: 80%;
  left: 70%;
  animation-delay: 6s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-20px) rotate(5deg);
  }
  50% {
    transform: translateY(15px) rotate(-5deg);
  }
  75% {
    transform: translateY(-15px) rotate(3deg);
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes line-move {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    transform: translateX(100%);
    opacity: 0;
  }
}

/* Logo 样式 */
.auth-logo {
  position: relative;
  z-index: 2;
  text-align: center;
  margin-top: 40px;
}

.login-logo {
  width: 80px;
  height: 80px;
  margin-bottom: 20px;
}

.auth-logo h1 {
  font-size: 28px;
  font-weight: 500;
  color: #fff;
  margin: 0 0 10px;
}

.auth-logo .version {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

/* 右侧表单部分 */
.login-form-container {
  width: 45%;
  padding: 0 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #fff;
  overflow-y: auto;
}

/* 选项卡样式 */
.login-tabs {
  display: flex;
  border-bottom: 1px solid #e4e7ed;
  margin-bottom: 30px;
}

.tab-item {
  flex: 1;
  padding: 15px 0;
  font-size: 16px;
  color: #606266;
  cursor: pointer;
  text-align: center;
  transition: all 0.3s;
}

.tab-item:hover {
  color: var(--primary-color);
}

.tab-item.active {
  color: var(--primary-color);
  border-bottom: 2px solid var(--primary-color);
}

/* 响应式调整 */
@media (max-width: 992px) {
  .auth-background {
    display: none;
  }

  .login-form-container {
    width: 100%;
    padding: 0 40px;
  }
}
</style>
