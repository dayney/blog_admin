<template>
  <div class="auth-form-wrapper">
    <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" @submit.prevent="handleLogin" class="login-form">
      <el-form-item label="用户名" prop="username">
        <div class="input-with-icon">
          <el-icon><User /></el-icon>
          <el-input v-model="loginForm.username" placeholder="请输入用户名" class="custom-input" />
        </div>
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <div class="input-with-icon">
          <el-icon><Lock /></el-icon>
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            show-password
            class="custom-input"
          />
        </div>
      </el-form-item>

      <el-form-item prop="captcha">
        <captcha-input v-model="loginForm.captcha" :captcha-url="captchaImageUrl" @refresh="handleRefreshCaptcha" />
      </el-form-item>

      <div class="remember-forgot">
        <div class="remember-me">
          <el-checkbox v-model="loginForm.remember">记住账号</el-checkbox>
        </div>
        <a href="javascript:;" class="forgot-link">忘记密码?</a>
      </div>

      <el-button type="primary" native-type="submit" class="btn-submit" :loading="loading">
        <span v-if="loading">
          <el-icon class="is-loading"><Loading /></el-icon> 登录中...
        </span>
        <span v-else>登录</span>
      </el-button>
    </el-form>

    <!-- 第三方登录 -->
    <div class="other-login">
      <div class="other-login-title">
        <span>第三方账号登录</span>
      </div>
      
      <div class="social-login">
        <div class="social-btn qq-bg">
          <el-icon><ChatDotSquare /></el-icon>
        </div>
        <div class="social-btn weixin-bg">
          <el-icon><ChatDotRound /></el-icon>
        </div>
        <div class="social-btn weibo-bg">
          <el-icon><Promotion /></el-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, defineExpose } from 'vue';
import { User, Lock, Loading, ChatDotSquare, ChatDotRound, Promotion } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
// import { verificationUserInfo } from '@/api/login.js';
import { getImageUrl } from '@/utils/tools';
import CaptchaInput from './CaptchaInput.vue';
import useCaptcha from '../hooks/useCaptcha';

const router = useRouter();

// 加载状态
const loading = ref(false);

// 表单引用
const loginFormRef = ref(null);

// 登录表单
const loginForm = reactive({
  uuid: '',
  username: '',
  password: '',
  captcha: '',
  remember: false
});

// 使用验证码钩子
const { captchaImageUrl, fetchCaptcha, refreshCaptcha } = useCaptcha();

// 初始化获取验证码
fetchCaptcha().then(({ uuid: captchaUuid }) => {
  loginForm.uuid = captchaUuid;
});

// 清空表单数据
const resetForm = () => {
  loginForm.username = '';
  loginForm.password = '';
  loginForm.captcha = '';
  loginForm.remember = false;

  if (loginFormRef.value) {
    loginFormRef.value.resetFields();
  }
};

// 登录表单验证规则
const loginRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
};

// 刷新验证码
const handleRefreshCaptcha = async () => {
  const { uuid: captchaUuid } = await refreshCaptcha();
  loginForm.uuid = captchaUuid;
};

// 登录
const handleLogin = () => {
  loginFormRef.value.validate(valid => {
    if (valid) {
      loading.value = true;
      console.log(loginForm, 'loginForm');
      // verificationUserInfo(loginForm).then(res => {
      //   console.log(res);
      // });

      // setTimeout(() => {
      //   loading.value = false;

      //   // 登录成功，设置登录状态
      //   localStorage.setItem('isLoggedIn', 'true');
      //   localStorage.setItem('username', loginForm.username || '默认用户');
      //   localStorage.setItem('loginTime', new Date().toISOString());

      //   // 如果设置了"记住我"，可以设置更长的有效期
      //   if (loginForm.remember) {
      //     localStorage.setItem('rememberMe', 'true');
      //   }

      //   // 跳转到首页
      //   router.push('/');
      // }, 500);
    }
  });
};

defineExpose({
  resetForm
});
</script>

<style lang="scss" scoped>
@use 'sass:math';
@use '@/styles/variables.scss' as *;
@use '@/styles/mixins.scss' as *;

/* 表单项样式 */
.auth-form-wrapper {
  @include flex-column;
  justify-content: flex-start;
  position: relative;
  height: 100%;
  overflow-y: auto;
  padding: 20px 0 0; /* 移除水平内边距 */
  width: 100%;
  box-sizing: border-box;
}

.login-form {
  width: 100%;
  box-sizing: border-box;
}

.el-form-item {
  margin-bottom: 20px;
}

.login-title {
  font-size: $font-size-xl;
  font-weight: $font-weight-medium;
  margin-bottom: 30px;
  color: $text-primary;
  text-align: center;
}

.input-with-icon {
  position: relative;
  @include flex-start;
  width: 100%;
  
  i {
    position: absolute;
    left: 12px;
    color: $text-placeholder;
    font-size: 16px;
    z-index: 1;
  }
}

.custom-input {
  width: 100%;
  
  :deep(.el-input__inner) {
    padding-left: 40px;
    height: 44px;
    font-size: $font-size-base;
    border-radius: $border-radius-mini;
  }
}

/* 记住账号和忘记密码 */
.remember-forgot {
  @include flex-between;
  margin-bottom: 25px;
}

.remember-me {
  @include flex-start;
  
  :deep(.el-checkbox__label) {
    font-size: $font-size-base;
    color: $text-secondary;
  }
}

.forgot-link {
  font-size: $font-size-base;
  color: $primary-color;
  text-decoration: none;
  @include transition;
  
  &:hover {
    opacity: 0.8;
  }
}

/* 登录按钮 */
.btn-submit {
  width: 100%;
  height: 44px;
  font-size: $font-size-medium;
  background-color: $primary-color;
  border: none;
  border-radius: $border-radius-mini;
  cursor: pointer;
  @include transition(background-color);
  
  &:hover {
    background-color: $primary-hover;
  }
}

/* 第三方登录 */
.other-login {
  margin-top: 30px;
  
  &-title {
    position: relative;
    text-align: center;
    margin-bottom: 20px;
    
    &::before,
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      width: calc(50% - 100px);
      height: 1px;
      background-color: $border-color-light;
    }
    
    &::before {
      left: 0;
    }
    
    &::after {
      right: 0;
    }
    
    span {
      position: relative;
      padding: 0 15px;
      background-color: #fff;
      font-size: $font-size-base;
      color: $text-placeholder;
      z-index: 1;
    }
  }
}

.social-login {
  @include flex-center;
  gap: 20px;
  margin-top: 20px;
}

.social-btn {
  @include icon-button(40px, #fff);
  @include transition(transform, 0.3s, ease);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}

// 社交平台背景色
$social-colors: (
  'qq': #12B7F5,
  'weixin': #07C160,
  'weibo': #E6162D
);

@each $name, $color in $social-colors {
  .#{$name}-bg {
    background-color: $color;
  }
}

/* Element UI 自定义样式 */
:deep(.el-button--primary) {
  --el-button-bg-color: $primary-color;
  --el-button-border-color: $primary-color;
  --el-button-hover-bg-color: $primary-hover;
  --el-button-hover-border-color: $primary-hover;
  --el-button-active-bg-color: $primary-dark;
  --el-button-active-border-color: $primary-dark;
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: $primary-color;
  border-color: $primary-color;
}

:deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
  color: $text-secondary;
}

:deep(.el-checkbox__inner) {
  border-color: $border-color;
}
</style>
