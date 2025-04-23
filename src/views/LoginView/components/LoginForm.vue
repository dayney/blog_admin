<template>
  <div class="auth-form-wrapper">
    <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" @submit.prevent="handleLogin">
      <div class="form-item">
        <el-input v-model="loginForm.username" placeholder="请输入用户名" :prefix-icon="User" class="custom-input" />
      </div>

      <div class="form-item">
        <el-input
          v-model="loginForm.password"
          type="password"
          placeholder="请输入密码"
          :prefix-icon="Lock"
          show-password
          class="custom-input"
        />
      </div>

      <div class="form-item">
        <div class="captcha-wrapper">
          <el-input v-model="loginForm.captcha" placeholder="请输入验证码" class="custom-input captcha-input" />
          <div class="captcha-img" @click="refreshCaptcha">
            <img :src="getImageUrl(captchaImageUrl)" alt="验证码" />
          </div>
        </div>
      </div>

      <div class="remember-forgot">
        <el-checkbox v-model="loginForm.remember">记住账号</el-checkbox>
      </div>

      <el-button type="primary" native-type="submit" class="btn-submit" :loading="loading">登录</el-button>
    </el-form>

    <!-- 第三方登录 -->
    <div class="third-party-login">
      <div class="divider">
        <span>第三方账号登录</span>
      </div>
      <div class="third-party-icons">
        <div class="icon-wrap qq"><i class="fab fa-qq"></i></div>
        <div class="icon-wrap wechat"><i class="fab fa-weixin"></i></div>
        <div class="icon-wrap weibo"><i class="fab fa-weibo"></i></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, defineExpose } from 'vue';
import { User, Lock } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { getVerificationCode, verificationUserInfo } from '@/api/login';
import { getImageUrl } from '@/utils/tools';

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

let captchaImageUrl = ref('');
getVerificationCode().then(res => {
  const { uuid, image_path } = res;
  loginForm.uuid = uuid;
  captchaImageUrl.value = image_path;
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
const refreshCaptcha = () => {
  // 实际项目中应该从后端获取新的验证码
  ElMessage.success('验证码已刷新');
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

/* 记住账号和忘记密码 */
.remember-forgot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
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

/* 第三方登录 */
.third-party-login {
  margin-top: 30px;
}

.divider {
  position: relative;
  text-align: center;
  margin-bottom: 20px;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: #e4e7ed;
}

.divider span {
  position: relative;
  padding: 0 15px;
  background-color: #fff;
  font-size: 14px;
  color: #909399;
}

.third-party-icons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.icon-wrap {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: transform 0.3s;
}

.icon-wrap:hover {
  transform: translateY(-3px);
}

.qq {
  background-color: #12b7f5;
}

.wechat {
  background-color: #07c160;
}

.weibo {
  background-color: #e6162d;
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
