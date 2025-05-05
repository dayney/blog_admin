<template>
  <div class="auth-form-wrapper">
    <el-form ref="registerFormRef" :model="registerForm" :rules="registerRules" @submit.prevent="handleRegister" class="register-form">
      <el-form-item prop="username">
        <div class="input-with-icon">
          <i class="fas fa-user"></i>
          <el-input v-model="registerForm.username" placeholder="请设置用户名" class="custom-input" />
        </div>
      </el-form-item>

      <el-form-item prop="password">
        <div class="input-with-icon">
          <i class="fas fa-lock"></i>
          <el-input
            v-model="registerForm.password"
            type="password"
            placeholder="请设置密码"
            show-password
            class="custom-input"
          />
        </div>
      </el-form-item>

      <el-form-item prop="confirmPassword">
        <div class="input-with-icon">
          <i class="fas fa-lock"></i>
          <el-input
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            show-password
            class="custom-input"
          />
        </div>
      </el-form-item>

      <el-form-item prop="email">
        <div class="input-with-icon">
          <i class="fas fa-envelope"></i>
          <el-input
            v-model="registerForm.email"
            type="email"
            placeholder="请输入邮箱地址"
            class="custom-input"
          />
        </div>
      </el-form-item>

      <el-form-item prop="phone">
        <div class="input-with-icon">
          <i class="fas fa-phone"></i>
          <el-input
            v-model="registerForm.phone"
            type="text"
            placeholder="请输入手机号"
            class="custom-input"
          />
        </div>
      </el-form-item>

      <el-form-item prop="captcha">
        <captcha-input v-model="registerForm.captcha" :captcha-url="captchaImageUrl" @refresh="handleRefreshCaptcha" />
      </el-form-item>

      <el-form-item prop="agreeTerms">
        <el-checkbox v-model="registerForm.agreeTerms">
          我已阅读并同意 <a href="javascript:;" class="term-link">用户协议</a> 和
          <a href="javascript:;" class="term-link">隐私政策</a>
        </el-checkbox>
      </el-form-item>

      <el-button type="primary" native-type="submit" class="btn-submit" :loading="loading">注册</el-button>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, defineExpose } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { getImageUrl } from '@/utils/tools';
import { userRegister } from '@/api/user';
import CaptchaInput from './CaptchaInput.vue';
import useCaptcha from '../hooks/useCaptcha';

const router = useRouter();

// 加载状态
const loading = ref(false);

// 表单引用
const registerFormRef = ref(null);

// 注册表单
const registerForm = reactive({
  uuid: '',
  username: '',
  password: '',
  confirmPassword: '',
  email: '',
  phone: '',
  captcha: '',
  agreeTerms: false
});

// 使用验证码钩子
const { captchaImageUrl, uuid, fetchCaptcha, refreshCaptcha } = useCaptcha();

// 初始化获取验证码
fetchCaptcha().then(({ uuid: captchaUuid }) => {
  registerForm.uuid = captchaUuid;
});

// 清空表单数据
const resetForm = () => {
  registerForm.uuid = '';
  registerForm.username = '';
  registerForm.password = '';
  registerForm.email = '';
  registerForm.phone = '';
  registerForm.confirmPassword = '';
  registerForm.captcha = '';
  registerForm.agreeTerms = false;

  if (registerFormRef.value) {
    registerFormRef.value.resetFields();
  }
};

// 注册表单验证规则
const registerRules = {
  username: [
    { required: true, message: '请设置用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度不能超过20位', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请设置密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度必须在6-20之间', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== registerForm.password) {
          callback(new Error('两次输入的密码不一致'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ],
  email: [
    { required: false, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  phone: [
    { required: false, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1\d{11}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
  ],
  captcha: [{ required: true, message: '请输入6位图形验证码', trigger: 'blur' }],
  agreeTerms: [
    {
      validator: (rule, value, callback) => {
        if (!value) {
          callback(new Error('请阅读并同意用户协议和隐私政策'));
        } else {
          callback();
        }
      },
      trigger: 'change'
    }
  ]
};

// 刷新验证码
const handleRefreshCaptcha = async () => {
  const { uuid: captchaUuid } = await refreshCaptcha();
  registerForm.uuid = captchaUuid;
};

// 注册
const handleRegister = () => {
  console.log('点击了注册按钮');
  registerFormRef.value.validate(async valid => {
    if (valid) {
      loading.value = true;
      let res = await userRegister(registerForm);
      console.log('1111');
      if (res.status) {
        ElMessage.success('注册成功');
        console.log('1111');
        loading.value = false;
        // router.push('/login');
      } else {
        console.log('2222');
        ElMessage.error(res.errormessage);
        loading.value = false;
      }
      console.log('3333');
      loading.value = false;
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
  padding: 20px 0 0;
  width: 100%;
  box-sizing: border-box;
}

.register-form {
  width: 100%;
  box-sizing: border-box;
}

.el-form-item {
  margin-bottom: 20px;
}

/* 输入框样式 */
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

/* 协议同意 */
.term-link {
  color: $primary-color;
  text-decoration: none;
  @include transition;
  
  &:hover {
    color: $primary-hover;
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
