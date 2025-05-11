<template>
  <div class="login-view">
    <div class="auth-container">
      <!-- 整个背景 -->
      <div class="center-section">
        <!-- 左侧Logo部分 - 使用蓝色背景 -->
        <div class="logo-section">
          <div class="auth-logo">
            <div class="logo-icon">
              <el-icon size="50"><Monitor /></el-icon>
            </div>
            <h1>{{ systemName }}</h1>
            <div class="version">{{ version }}</div>
          </div>

          <!-- AI科技感插图 - 参考分享的图片 -->
          <div class="illustration">
            <div class="ai-container">
              <div class="ai-hexagon">
                <div class="ai-inner">
                  <span>AI</span>
                </div>
                <div class="ai-glow"></div>
              </div>

              <div class="ai-connections">
                <!-- 六边形小图标 - 从8个减少到6个 -->
                <div class="ai-icon ai-icon-1"><i class="el-icon-lock"></i></div>
                <div class="ai-icon ai-icon-2"><i class="el-icon-monitor"></i></div>
                <div class="ai-icon ai-icon-3"><i class="el-icon-data-analysis"></i></div>
                <div class="ai-icon ai-icon-4"><i class="el-icon-cpu"></i></div>
                <div class="ai-icon ai-icon-5"><i class="el-icon-cloudy"></i></div>
                <div class="ai-icon ai-icon-6"><i class="el-icon-share"></i></div>

                <!-- 连接线 - 从8条减少到6条 -->
                <div class="ai-line ai-line-1"></div>
                <div class="ai-line ai-line-2"></div>
                <div class="ai-line ai-line-3"></div>
                <div class="ai-line ai-line-4"></div>
                <div class="ai-line ai-line-5"></div>
                <div class="ai-line ai-line-6"></div>
              </div>

              <!-- 数字粒子效果 -->
              <div class="ai-particles">
                <div v-for="i in 20" :key="i" class="ai-particle"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧表单部分 -->
        <div class="form-section">
          <!-- 选项卡 -->
          <div class="form-tabs">
            <div class="tab-item" :class="{ active: activeTab === 'login' }" @click="switchTab('login')">用户登录</div>
            <div class="tab-item" :class="{ active: activeTab === 'register' }" @click="switchTab('register')">
              用户注册
            </div>
          </div>

          <!-- 表单容器 -->
          <div class="form-container">
            <!-- 动态组件 -->
            <component :is="currentTabComponent" ref="formRef" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, markRaw } from 'vue';
import { Monitor } from '@element-plus/icons-vue';
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

<style lang="scss" scoped>
@use 'sass:math';
@use '@/assets/scss/variables.scss' as *;
@use '@/assets/scss/mixins.scss' as *;

.login-view {
  width: 100vw;
  height: 100vh;
  display: flex;
  background-color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  overflow: hidden;
}

.auth-container {
  width: 100vw;
  height: 100vh;
  background: $bg-color;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.center-section {
  display: flex;
  width: 900px;
  height: 650px;
  background-color: #fff;
  border-radius: $border-radius-base;
  box-shadow: $box-shadow-dark;
  overflow: hidden;
}

/* 左侧Logo部分 - 蓝色背景 */
.logo-section {
  width: 50%;
  background: #0071e3; /* 使用蓝色背景 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  padding: 40px;
  position: relative;
  overflow: hidden;
  
  /* 添加背景网格线 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
    background-size: 20px 20px;
    z-index: 1;
  }
}

.auth-logo {
  text-align: center;
  margin-bottom: 40px;
  position: relative;
  z-index: 2;
}

.logo-icon {
  font-size: 60px;
  margin-bottom: 20px;
}

.auth-logo h1 {
  font-size: 28px;
  font-weight: 500;
  margin-bottom: 10px;
}

.version {
  font-size: 14px;
  opacity: 0.8;
}

.illustration {
  width: 100%;
  max-width: 300px;
  height: 300px;
  margin-top: 20px;
  position: relative;
  z-index: 2;
}

/* AI图标容器 */
.ai-container {
  position: relative;
  width: 100%;
  height: 100%;
}

/* 中央AI六边形 - 添加确切的位置信息便于计算连接线 */
.ai-hexagon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 120px;
  background-color: rgba(255, 255, 255, 0.1);
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  z-index: 3;
  cursor: pointer;
  transition: background-color 0.5s ease;
}

.ai-inner {
  width: 110px;
  height: 110px;
  background-color: rgba(0, 113, 227, 0.8); /* 匹配蓝色背景 */
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  display: flex;
  justify-content: center;
  align-items: center;
}

.ai-inner span {
  color: white;
  font-size: 42px;
  font-weight: bold;
}

.ai-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 160px;
  height: 160px;
  background: radial-gradient(circle, rgba(255, 165, 0, 0.7) 0%, rgba(255, 165, 0, 0) 70%);
  z-index: 1;
}

/* 小图标和连接线 */
.ai-connections {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.ai-icon {
  position: absolute;
  width: 30px;
  height: 30px;
  background-color: rgba(255, 255, 255, 0.15);
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 12px;
  z-index: 3;
  transition: background-color 0.3s ease;
  cursor: pointer;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
  
  i {
    opacity: 0.9;
  }
}

/* 图标位置 - 调整为参考图片中的布局 */
.ai-icon-1 {
  top: -6%; /* 顶部 */
  left: 50%;
  transform: translateX(-50%);
}
.ai-icon-2 {
  top: 20%;
  left: 93%;
}
.ai-icon-3 {
  top: 70%; /* 右下方 */
  left: 93%;
}
.ai-icon-4 {
  top: 95%; /* 底部 */
  left: 50%;
  transform: translateX(-50%);
}
.ai-icon-5 {
  top: 70%; /* 左下方 */
  left: -2%;
}
.ai-icon-6 {
  top: 20%; /* 左上方 */
  left: -2%;
}

/* 连接线 - 从中央六边形角到小六边形角 */
.ai-line {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.4);
  height: 1.5px;
  z-index: 1;
  pointer-events: none;
  animation: pulseLine 2s infinite alternate;
}

/* 连接线上的发光点 - 代表数据流动 */
.ai-line::after {
  content: '';
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.8);
  top: -1px;
  animation: moveDot 3s linear infinite;
  box-shadow: 0 0 4px rgba(255, 255, 255, 0.8);
}

/* 连接线 - 重新调整以匹配图片中的样式 */
.ai-line-1 {
  width: 80px;
  top: 30%;
  left: 50%;
  transform: rotate(-90deg); /* 垂直向上 */
  transform-origin: left center;
  animation-delay: 0.1s;
}

.ai-line-1::after {
  animation-delay: 0.1s;
}

.ai-line-2 {
  width: 80px;
  top: 40%;
  left: 70%;
  transform: rotate(-30deg); /* 右上 */
  transform-origin: left center;
  animation-delay: 0.2s;
}

.ai-line-2::after {
  animation-delay: 0.2s;
}

.ai-line-3 {
  width: 80px;
  top: 59%;
  left: 70%;
  transform: rotate(30deg); /* 右下 */
  transform-origin: left center;
  animation-delay: 0.3s;
}

.ai-line-3::after {
  animation-delay: 0.3s;
}

.ai-line-4 {
  width: 80px;
  top: 69%;
  left: 50%;
  transform: rotate(90deg); /* 垂直向下 */
  transform-origin: left center;
  animation-delay: 0.4s;
}

.ai-line-4::after {
  animation-delay: 0.4s;
}

.ai-line-5 {
  width: 80px;
  top: 59.5%;
  left: 30.5%;
  transform: rotate(150deg); /* 左下 */
  transform-origin: left center;
  animation-delay: 0.5s;
}

.ai-line-5::after {
  animation-delay: 0.5s;
}

.ai-line-6 {
  width: 80px;
  top: 40%;
  left: 30.5%;
  transform: rotate(210deg); /* 左上 */
  transform-origin: left center;
  animation-delay: 0.6s;
}

.ai-line-6::after {
  animation-delay: 0.6s;
}

/* 粒子效果 */
.ai-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.ai-particle {
  position: absolute;
  width: 2px;
  height: 2px;
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: moveParticle 10s infinite linear;
}

/* 随机位置粒子 */
.ai-particle:nth-child(1) {
  top: 10%;
  left: 20%;
  animation-delay: 0s;
}
.ai-particle:nth-child(2) {
  top: 15%;
  left: 60%;
  animation-delay: 0.5s;
}
.ai-particle:nth-child(3) {
  top: 25%;
  left: 30%;
  animation-delay: 1s;
}
.ai-particle:nth-child(4) {
  top: 35%;
  left: 70%;
  animation-delay: 1.5s;
}
.ai-particle:nth-child(5) {
  top: 40%;
  left: 25%;
  animation-delay: 2s;
}
.ai-particle:nth-child(6) {
  top: 50%;
  left: 80%;
  animation-delay: 2.5s;
}
.ai-particle:nth-child(7) {
  top: 60%;
  left: 15%;
  animation-delay: 3s;
}
.ai-particle:nth-child(8) {
  top: 65%;
  left: 65%;
  animation-delay: 3.5s;
}
.ai-particle:nth-child(9) {
  top: 75%;
  left: 35%;
  animation-delay: 4s;
}
.ai-particle:nth-child(10) {
  top: 80%;
  left: 75%;
  animation-delay: 4.5s;
}
.ai-particle:nth-child(11) {
  top: 5%;
  left: 45%;
  animation-delay: 5s;
}
.ai-particle:nth-child(12) {
  top: 20%;
  left: 85%;
  animation-delay: 5.5s;
}
.ai-particle:nth-child(13) {
  top: 30%;
  left: 10%;
  animation-delay: 6s;
}
.ai-particle:nth-child(14) {
  top: 45%;
  left: 60%;
  animation-delay: 6.5s;
}
.ai-particle:nth-child(15) {
  top: 55%;
  left: 20%;
  animation-delay: 7s;
}
.ai-particle:nth-child(16) {
  top: 70%;
  left: 50%;
  animation-delay: 7.5s;
}
.ai-particle:nth-child(17) {
  top: 85%;
  left: 30%;
  animation-delay: 8s;
}
.ai-particle:nth-child(18) {
  top: 25%;
  left: 50%;
  animation-delay: 8.5s;
}
.ai-particle:nth-child(19) {
  top: 50%;
  left: 40%;
  animation-delay: 9s;
}
.ai-particle:nth-child(20) {
  top: 75%;
  left: 80%;
  animation-delay: 9.5s;
}

/* 动画定义 */
@keyframes pulse {
  0% {
    opacity: 0.5;
    transform: scale(0.9);
  }
  100% {
    opacity: 0.8;
    transform: scale(1.1);
  }
}

@keyframes pulseIcon {
  0% {
    opacity: 0.7;
  }
  100% {
    opacity: 1;
  }
}

@keyframes pulseLine {
  0% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.7;
  }
}

@keyframes moveDot {
  0% {
    left: 0;
  }
  100% {
    left: 100%;
  }
}

@keyframes moveParticle {
  0% {
    transform: translate(0, 0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translate(50px, -30px);
    opacity: 0;
  }
}

/* 右侧表单部分 */
.form-section {
  width: 50%;
  padding: 40px;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  position: relative;
}

/* 选项卡样式 */
.form-tabs {
  display: flex;
  border-bottom: 1px solid $border-color-light;
  margin-bottom: 20px;
  position: absolute;
  top: 40px;
  left: 40px;
  right: 40px;
  z-index: 10;
  height: 52px; /* 固定选项卡高度 */
}

.tab-item {
  flex: 1;
  padding: 15px 0;
  font-size: 16px;
  color: $text-secondary;
  cursor: pointer;
  text-align: center;
  transition: all 0.3s;
  
  &:hover {
    color: $primary-color;
  }
  
  &.active {
    color: $primary-color;
    border-bottom: 2px solid $primary-color;
  }
}

/* 表单容器 */
.form-container {
  $tab-height: 52px;
  
  @include flex-column;
  flex: 1;
  margin-top: $tab-height; /* 选项卡高度 */
  padding: 0;
  height: calc(100% - #{$tab-height});
  overflow: auto;
  width: 100%;
}
</style>
