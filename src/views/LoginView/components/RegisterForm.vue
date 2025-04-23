<template>
  <div class="auth-form-wrapper">
    <el-form ref="registerFormRef" :model="registerForm" :rules="registerRules" @submit.prevent="handleRegister">
      <el-form-item prop="username">
        <el-input v-model="registerForm.username" placeholder="请设置用户名" :prefix-icon="User" class="custom-input" />
      </el-form-item>

      <el-form-item prop="password">
        <el-input
          v-model="registerForm.password"
          type="password"
          placeholder="请设置密码"
          :prefix-icon="Lock"
          show-password
          class="custom-input"
        />
      </el-form-item>

      <el-form-item prop="confirmPassword">
        <el-input
          v-model="registerForm.confirmPassword"
          type="password"
          placeholder="请再次输入密码"
          :prefix-icon="Lock"
          show-password
          class="custom-input"
        />
      </el-form-item>

      <el-form-item prop="email">
        <el-input
          v-model="registerForm.email"
          type="email"
          placeholder="请输入邮箱地址"
          :prefix-icon="Message"
          class="custom-input"
        />
      </el-form-item>

      <el-form-item prop="phone">
        <el-input
          v-model="registerForm.phone"
          type="text"
          placeholder="请输入手机号"
          :prefix-icon="Phone"
          class="custom-input"
        />
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
import { User, Lock, Phone, Message } from '@element-plus/icons-vue';
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

<style scoped>
/* 表单项样式 */
.form-item {
  margin-bottom: 20px;
}

.auth-form-wrapper {
  flex: 1;
}

/* 协议同意 */
.term-link {
  color: #409eff;
  text-decoration: none;
}

.term-link:hover {
  color: #66b1ff;
}

/* 登录按钮 */
.btn-submit {
  width: 100%;
  height: 44px;
  font-size: 16px;
  background-color: #409eff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-submit:hover {
  background-color: #66b1ff;
}

/* Element UI 自定义样式 */
:deep(.custom-input) {
  --el-input-height: 40px;
}

:deep(.el-button--primary) {
  --el-button-bg-color: #409eff;
  --el-button-border-color: #409eff;
  --el-button-hover-bg-color: #66b1ff;
  --el-button-hover-border-color: #66b1ff;
  --el-button-active-bg-color: #3a8ee6;
  --el-button-active-border-color: #3a8ee6;
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #409eff;
  border-color: #409eff;
}

:deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
  color: #606266;
}

:deep(.el-checkbox__inner) {
  border-color: #dcdfe6;
}
</style>
