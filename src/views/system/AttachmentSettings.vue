<template>
  <div class="attachment-settings-container">
    <div class="page-header">
      <h2>附件设置</h2>
      <p class="description">管理网站附件上传和管理的相关配置</p>
    </div>

    <el-card class="settings-card">
      <template #header>
        <div class="card-header">
          <span>基本设置</span>
        </div>
      </template>
      
      <el-form :model="basicForm" label-width="140px" label-position="left">
        <el-form-item label="允许上传的文件类型">
          <el-select v-model="basicForm.allowedTypes" multiple filterable placeholder="选择文件类型" style="width: 100%">
            <el-option v-for="item in fileTypes" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <div class="form-tip">设置允许上传的文件类型，多选</div>
        </el-form-item>

        <el-form-item label="附件最大大小">
          <div class="size-input">
            <el-input-number v-model="basicForm.maxSize" :min="1" :max="100" :step="1" />
            <span class="unit">MB</span>
          </div>
          <div class="form-tip">设置允许上传的单个文件最大大小，单位MB</div>
        </el-form-item>

        <el-form-item label="附件保存路径">
          <el-input v-model="basicForm.uploadPath" placeholder="/uploads" />
          <div class="form-tip">设置附件上传后的保存路径，相对于网站根目录</div>
        </el-form-item>

        <el-form-item label="附件URL前缀">
          <el-input v-model="basicForm.urlPrefix" placeholder="https://cdn.example.com" />
          <div class="form-tip">设置附件访问URL的前缀，为空则使用网站域名</div>
        </el-form-item>

        <el-form-item label="附件命名规则">
          <el-radio-group v-model="basicForm.namingRule">
            <el-radio label="original" value="original">保持原始文件名</el-radio>
            <el-radio label="date" value="date">日期格式</el-radio>
            <el-radio label="random" value="random">随机字符串</el-radio>
            <el-radio label="custom" value="custom">自定义规则</el-radio>
          </el-radio-group>
          <div class="form-tip">设置上传附件的命名规则</div>
        </el-form-item>

        <el-form-item v-if="basicForm.namingRule === 'custom'" label="自定义命名格式">
          <el-input v-model="basicForm.customFormat" placeholder="{year}{month}{day}_{random}" />
          <div class="form-tip">
            可用变量: {year}, {month}, {day}, {hour}, {minute}, {second}, {random}
          </div>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="settings-card">
      <template #header>
        <div class="card-header">
          <span>安全设置</span>
        </div>
      </template>
      
      <el-form :model="securityForm" label-width="140px" label-position="left">
        <el-form-item label="启用上传验证码">
          <el-switch v-model="securityForm.enableCaptcha" active-color="#42b983" />
          <div class="form-tip">开启后，用户上传附件时需要验证码验证</div>
        </el-form-item>

        <el-form-item label="防盗链设置">
          <el-switch v-model="securityForm.enableHotlinkProtection" active-color="#42b983" />
          <div class="form-tip">开启后，可以防止其他网站直接引用您的附件</div>
        </el-form-item>

        <el-form-item v-if="securityForm.enableHotlinkProtection" label="允许引用的域名">
          <el-input 
            v-model="securityForm.allowedDomains" 
            type="textarea" 
            :rows="4" 
            placeholder="每行一个域名，例如：example.com" 
          />
          <div class="form-tip">允许直接引用附件的域名列表，每行一个</div>
        </el-form-item>

        <el-form-item label="文件扫描">
          <el-switch v-model="securityForm.enableScan" active-color="#42b983" />
          <div class="form-tip">开启后，系统会自动扫描上传的文件是否包含恶意代码</div>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="settings-card">
      <template #header>
        <div class="card-header">
          <span>权限设置</span>
        </div>
      </template>
      
      <el-form :model="permissionForm" label-width="140px" label-position="left">
        <el-form-item label="允许游客上传">
          <el-switch v-model="permissionForm.guestUpload" active-color="#42b983" />
          <div class="form-tip">开启后，未登录用户也可以上传附件</div>
        </el-form-item>

        <el-form-item label="允许上传的用户组">
          <el-checkbox-group v-model="permissionForm.allowedGroups">
            <el-checkbox label="admin">管理员</el-checkbox>
            <el-checkbox label="editor">编辑</el-checkbox>
            <el-checkbox label="member">普通会员</el-checkbox>
            <el-checkbox label="vip">VIP会员</el-checkbox>
          </el-checkbox-group>
          <div class="form-tip">设置允许上传附件的用户组</div>
        </el-form-item>

        <el-form-item label="用户组上传配额">
          <el-table :data="permissionForm.quotaList" style="width: 100%">
            <el-table-column prop="group" label="用户组" width="180" />
            <el-table-column prop="dailyQuota" label="每日上传量(MB)" width="180">
              <template #default="scope">
                <el-input-number v-model="scope.row.dailyQuota" :min="0" :step="10" />
              </template>
            </el-table-column>
            <el-table-column prop="totalQuota" label="总配额(MB)">
              <template #default="scope">
                <el-input-number v-model="scope.row.totalQuota" :min="0" :step="100" />
              </template>
            </el-table-column>
          </el-table>
          <div class="form-tip">设置各用户组的上传配额限制，0表示不限制</div>
        </el-form-item>
      </el-form>
    </el-card>

    <div class="form-actions">
      <el-button type="primary" @click="saveSettings">保存设置</el-button>
      <el-button @click="resetForm">重置</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';

// 文件类型选项
const fileTypes = [
  { label: '图片文件 (jpg, jpeg, png, gif)', value: 'image' },
  { label: '文档文件 (doc, docx, pdf, txt)', value: 'document' },
  { label: '压缩文件 (zip, rar, 7z)', value: 'archive' },
  { label: '音频文件 (mp3, wav, ogg)', value: 'audio' },
  { label: '视频文件 (mp4, avi, mov)', value: 'video' },
  { label: '表格文件 (xls, xlsx, csv)', value: 'spreadsheet' },
  { label: '演示文件 (ppt, pptx)', value: 'presentation' },
];

// 基本设置表单
const basicForm = reactive({
  allowedTypes: ['image', 'document', 'archive'],
  maxSize: 10,
  uploadPath: '/uploads',
  urlPrefix: '',
  namingRule: 'date',
  customFormat: '{year}{month}{day}_{random}',
});

// 安全设置表单
const securityForm = reactive({
  enableCaptcha: false,
  enableHotlinkProtection: true,
  allowedDomains: 'yourdomain.com\nexample.com',
  enableScan: true,
});

// 权限设置表单
const permissionForm = reactive({
  guestUpload: false,
  allowedGroups: ['admin', 'editor', 'vip'],
  quotaList: [
    { group: '管理员', dailyQuota: 0, totalQuota: 0 },
    { group: '编辑', dailyQuota: 500, totalQuota: 5000 },
    { group: '普通会员', dailyQuota: 100, totalQuota: 1000 },
    { group: 'VIP会员', dailyQuota: 200, totalQuota: 2000 },
  ],
});

// 保存设置
const saveSettings = () => {
  console.log('保存设置', {
    basic: basicForm,
    security: securityForm,
    permission: permissionForm,
  });
  
  // 这里应该发送API请求保存设置
  
  ElMessage({
    type: 'success',
    message: '附件设置保存成功！',
  });
};

// 重置表单
const resetForm = () => {
  // 重置为初始值
  basicForm.allowedTypes = ['image', 'document', 'archive'];
  basicForm.maxSize = 10;
  basicForm.uploadPath = '/uploads';
  basicForm.urlPrefix = '';
  basicForm.namingRule = 'date';
  basicForm.customFormat = '{year}{month}{day}_{random}';
  
  securityForm.enableCaptcha = false;
  securityForm.enableHotlinkProtection = true;
  securityForm.allowedDomains = 'yourdomain.com\nexample.com';
  securityForm.enableScan = true;
  
  permissionForm.guestUpload = false;
  permissionForm.allowedGroups = ['admin', 'editor', 'vip'];
  
  ElMessage({
    type: 'info',
    message: '表单已重置',
  });
};
</script>

<style lang="scss" scoped>
@use '@/assets/scss/variables.scss' as *;

.attachment-settings-container {
  padding-bottom: 40px;
}

.page-header {
  margin-bottom: 20px;
  
  h2 {
    margin: 0 0 8px 0;
    color: $text-primary;
    font-size: 24px;
  }
}

.description {
  color: $text-secondary;
  margin: 0 0 20px 0;
  font-size: 14px;
}

.settings-card {
  margin-bottom: 20px;
  border-radius: $border-radius-base;
  
  :deep(.el-card__header) {
    padding: 15px 20px;
    border-bottom: 1px solid $border-color-lighter;
    background-color: $hover-bg-color;
  }
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  span {
    font-size: 16px;
    font-weight: 500;
    color: $text-primary;
  }
}

.header-actions {
  display: flex;
  align-items: center;
}

.form-tip {
  font-size: 12px;
  color: $text-regular;
  margin-top: 5px;
  line-height: 1.4;
}

.form-actions {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  
  .el-button {
    padding: 12px 25px;
    font-size: 14px;
  }
}

.size-input {
  display: flex;
  align-items: center;
}

.unit {
  margin-left: 10px;
  color: $text-secondary;
}

:deep(.el-form-item) {
  margin-bottom: 22px;
}

:deep(.el-switch) {
  margin-right: 10px;
}

.mime-type-tag {
  margin-right: 5px;
  margin-bottom: 5px;
}

.file-type-note {
  font-size: 13px;
  color: $text-regular;
  margin-top: 15px;
  
  strong {
    color: $warning-color;
  }
}
</style> 