<template>
  <div class="account-settings-card left-align-card">
    <div class="settings-header">安全设置</div>
    <div class="settings-form">
      <el-form label-width="120px" class="form-content">
        <el-form-item label="两步验证">
          <el-switch v-model="form.twoStep" />
          <div class="desc">开启两步验证后，登录时需要额外验证，账号更加安全</div>
        </el-form-item>
        <el-form-item label="登录通知">
          <el-switch v-model="form.loginNotify" />
          <div class="desc">开启后，账号异地登录时会发送邮件通知</div>
        </el-form-item>
        <el-form-item label="异常登录拦截">
          <el-switch v-model="form.abnormalLogin" />
          <div class="desc">开启后，系统会自动识别并拦截可疑的登录行为</div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const form = ref({
  twoStep: false,
  loginNotify: true,
  abnormalLogin: true
});
</script>

<style scoped>
.account-settings-card {
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 8px #f0f1f2;
  padding: 32px 32px 32px 32px;
  max-width: 600px;
  margin-left: 0;
}
.left-align-card {
  margin-left: 0;
  padding-left: 32px;
}
.settings-header {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
  text-align: left;
}
.form-content {
  max-width: 400px;
}
.desc {
  color: #888;
  font-size: 13px;
  margin-top: 4px;
}
</style> 