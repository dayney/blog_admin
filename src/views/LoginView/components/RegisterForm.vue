<template>
  <div class="auth-form-wrapper">
    <el-form ref="registerFormRef" :model="registerForm" :rules="registerRules" @submit.prevent="handleRegister">
      <div class="form-item">
        <el-input v-model="registerForm.username" placeholder="请设置用户名" :prefix-icon="User" class="custom-input" />
      </div>

      <div class="form-item">
        <el-input
          v-model="registerForm.password"
          type="password"
          placeholder="请设置密码"
          :prefix-icon="Lock"
          show-password
          class="custom-input"
        />
      </div>

      <div class="form-item">
        <el-input
          v-model="registerForm.confirmPassword"
          type="password"
          placeholder="请再次输入密码"
          :prefix-icon="Lock"
          show-password
          class="custom-input"
        />
      </div>

      <div class="form-item">
        <el-input
          v-model="registerForm.email"
          type="password"
          placeholder="请输入邮箱地址"
          :prefix-icon="Message"
          class="custom-input"
        />
      </div>

      <div class="form-item">
        <el-input
          v-model="registerForm.phone"
          type="password"
          placeholder="请输入手机号"
          :prefix-icon="Phone"
          class="custom-input"
        />
      </div>

      <div class="form-item">
        <div class="captcha-wrapper">
          <el-input v-model="registerForm.captcha" placeholder="请输入验证码" class="custom-input captcha-input" />
          <div class="captcha-img" @click="refreshCaptcha">
            <img :src="getImageUrl(captchaImageUrl)" alt="验证码" />
          </div>
        </div>
      </div>

      <div class="agree-terms">
        <el-checkbox v-model="registerForm.agreeTerms">
          我已阅读并同意 <a href="javascript:;" class="term-link">用户协议</a> 和
          <a href="javascript:;" class="term-link">隐私政策</a>
        </el-checkbox>
      </div>

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
import { getVerificationCode } from '@/api/login';

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

let captchaImageUrl = ref('');
getVerificationCode().then(res => {
  const { uuid, image_path } = res;
  registerForm.uuid = uuid;
  captchaImageUrl.value = image_path;
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
  username: [{ required: true, message: '请设置用户名', trigger: 'blur' }],
  password: [
    { required: true, message: '请设置密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
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
  captcha: [{ required: true, message: '请输入图形验证码', trigger: 'blur' }],
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
const refreshCaptcha = () => {
  // 实际项目中应该从后端获取新的验证码
  ElMessage.success('验证码已刷新');
};

// 注册
const handleRegister = () => {
  registerFormRef.value.validate(valid => {
    if (valid) {
      loading.value = true;
      console.log(registerForm, 'registerForm');
      // setTimeout(() => {
      //   loading.value = false;

      //   // 注册成功，直接登录并跳转
      //   localStorage.setItem('isLoggedIn', 'true');
      //   localStorage.setItem('username', registerForm.username || '新用户');
      //   localStorage.setItem('loginTime', new Date().toISOString());

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

<style scoped>
/* 表单项样式 */
.form-item {
  margin-bottom: 20px;
}

.auth-form-wrapper {
  flex: 1;
}

/* 验证码样式 */
.captcha-wrapper {
  display: flex;
  align-items: center;
}

.captcha-input {
  flex: 1;
}

.captcha-img {
  width: 120px;
  height: 40px;
  margin-left: 10px;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
}

.captcha-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 协议同意 */
.agree-terms {
  margin-bottom: 25px;
  font-size: 14px;
}

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

:deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #dcdfe6 inset;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #409eff inset;
}
</style>
