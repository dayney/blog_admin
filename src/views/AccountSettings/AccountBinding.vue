<template>
  <div class="account-settings-card left-align-card">
    <div class="settings-header">账号绑定</div>
    <div class="binding-list">
      <div class="binding-item">
        <div class="icon wechat"></div>
        <div class="binding-info">
          <div class="binding-label">微信</div>
          <div class="binding-status">未绑定</div>
        </div>
        <el-button type="primary" size="small">立即绑定</el-button>
      </div>
      <div class="binding-item">
        <div class="icon phone"></div>
        <div class="binding-info">
          <div class="binding-label">手机号</div>
          <div class="binding-status">已绑定：138****8000</div>
        </div>
        <el-button size="small">更换绑定</el-button>
      </div>
      <div class="binding-item">
        <div class="icon email"></div>
        <div class="binding-info">
          <div class="binding-label">邮箱</div>
          <div class="binding-status">已绑定：a****n@example.com</div>
        </div>
        <el-button size="small">更换绑定</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
// 可根据实际业务添加绑定/解绑逻辑
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
.binding-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.binding-item {
  display: flex;
  align-items: center;
  background: #f8f9fb;
  border-radius: 4px;
  padding: 16px 20px;
}
.icon {
  width: 32px;
  height: 32px;
  margin-right: 16px;
}
.icon.wechat {
  background: url('https://img.icons8.com/color/48/000000/weixing.png') no-repeat center/cover;
}
.icon.phone {
  background: url('https://img.icons8.com/ios-filled/50/4a90e2/phone.png') no-repeat center/cover;
}
.icon.email {
  background: url('https://img.icons8.com/ios-filled/50/4a90e2/new-post.png') no-repeat center/cover;
}
.binding-info {
  flex: 1;
}
.binding-label {
  font-size: 15px;
  font-weight: 500;
}
.binding-status {
  color: #888;
  font-size: 13px;
  margin-top: 2px;
}
</style> 