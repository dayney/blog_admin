<template>
  <div class="account-settings-card">
    <div class="settings-header">修改密码</div>
    <div class="settings-form">
      <el-form :model="form" ref="formRef" label-width="100px" class="form-content">
        <el-form-item label="当前密码" prop="currentPassword" required>
          <el-input v-model="form.currentPassword" type="password" placeholder="请输入当前密码" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword" required>
          <el-input v-model="form.newPassword" type="password" placeholder="请输入新密码" @input="checkStrength" />
        </el-form-item>
        <div class="password-strength">
          <span>密码强度：</span>
          <span :class="strengthClass">{{ strengthText }}</span>
        </div>
        <el-form-item label="确认新密码" prop="confirmPassword" required>
          <el-input v-model="form.confirmPassword" type="password" placeholder="请再次输入新密码" />
        </el-form-item>
        <div class="form-actions">
          <el-button type="primary" @click="handleSubmit">修改密码</el-button>
          <el-button @click="handleReset">重置</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const form = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});
const formRef = ref();
const strengthText = ref('非常弱');
const strengthClass = ref('strength-weak');

function checkStrength(val) {
  let score = 0;
  if (val.length >= 8) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;
  if (score <= 1) {
    strengthText.value = '非常弱';
    strengthClass.value = 'strength-weak';
  } else if (score === 2) {
    strengthText.value = '较弱';
    strengthClass.value = 'strength-medium';
  } else if (score === 3) {
    strengthText.value = '一般';
    strengthClass.value = 'strength-medium';
  } else {
    strengthText.value = '强';
    strengthClass.value = 'strength-strong';
  }
}

function handleSubmit() {
  // 提交逻辑
}
function handleReset() {
  form.value = { currentPassword: '', newPassword: '', confirmPassword: '' };
  strengthText.value = '非常弱';
  strengthClass.value = 'strength-weak';
}
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
.settings-header {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 24px;
}
.form-content {
  max-width: 400px;
}
.password-strength {
  margin: 0 0 16px 100px;
  font-size: 14px;
}
.strength-weak {
  color: #f56c6c;
}
.strength-medium {
  color: #e6a23c;
}
.strength-strong {
  color: #67c23a;
}
.form-actions {
  margin-left: 100px;
  margin-top: 16px;
}
</style> 