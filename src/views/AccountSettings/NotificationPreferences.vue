<template>
  <div class="account-settings-card left-align-card">
    <div class="settings-header">通知偏好</div>
    <div class="settings-form">
      <el-form label-width="120px" class="form-content">
        <el-form-item label="系统通知">
          <el-switch v-model="form.system" />
          <div class="desc">接收系统维护、更新等相关通知</div>
        </el-form-item>
        <el-form-item label="消息通知">
          <el-switch v-model="form.message" />
          <div class="desc">接收新消息、回复等相关通知</div>
        </el-form-item>
        <el-form-item label="活动通知">
          <el-switch v-model="form.activity" />
          <div class="desc">接收产品活动、促销等相关通知</div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const form = ref({
  system: true,
  message: true,
  activity: false
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