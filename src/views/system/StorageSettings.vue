<template>
  <div class="storage-settings-container">
    <div class="page-header">
      <h2>存储策略</h2>
      <p class="description">配置网站文件存储的策略，支持本地存储和多种云存储</p>
    </div>

    <el-card class="settings-card">
      <template #header>
        <div class="card-header">
          <span>存储引擎</span>
        </div>
      </template>
      
      <el-form :model="settingsForm" label-width="140px" label-position="left">
        <el-form-item label="当前存储策略">
          <el-radio-group v-model="settingsForm.currentStorage" @change="handleStorageChange">
            <el-radio label="local" value="local">本地存储</el-radio>
            <el-radio label="oss" value="oss">阿里云OSS</el-radio>
            <el-radio label="cos" value="cos">腾讯云COS</el-radio>
            <el-radio label="qiniu" value="qiniu">七牛云</el-radio>
            <el-radio label="s3" value="s3">AWS S3</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 本地存储设置 -->
    <el-card v-if="settingsForm.currentStorage === 'local'" class="settings-card">
      <template #header>
        <div class="card-header">
          <span>本地存储设置</span>
        </div>
      </template>
      
      <el-form :model="settingsForm.local" label-width="140px" label-position="left">
        <el-form-item label="上传目录">
          <el-input v-model="settingsForm.local.uploadDir" placeholder="/www/uploads" />
          <div class="form-tip">设置文件上传的本地目录，需要有写入权限</div>
        </el-form-item>

        <el-form-item label="访问URL">
          <el-input v-model="settingsForm.local.accessUrl" placeholder="https://example.com/uploads" />
          <div class="form-tip">设置文件访问的URL前缀</div>
        </el-form-item>

        <el-form-item label="目录结构">
          <el-select v-model="settingsForm.local.directoryStructure" placeholder="请选择目录结构">
            <el-option label="按日期分目录 (年/月/日)" value="date" />
            <el-option label="按文件类型分目录" value="type" />
            <el-option label="按用户ID分目录" value="user" />
            <el-option label="自定义目录结构" value="custom" />
          </el-select>
          <div class="form-tip">选择文件存储的目录结构方式</div>
        </el-form-item>

        <el-form-item v-if="settingsForm.local.directoryStructure === 'custom'" label="自定义目录格式">
          <el-input v-model="settingsForm.local.customStructure" placeholder="{year}/{month}/{day}" />
          <div class="form-tip">
            可用变量: {year}, {month}, {day}, {type}, {user_id}, {random}
          </div>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 阿里云OSS设置 -->
    <el-card v-if="settingsForm.currentStorage === 'oss'" class="settings-card">
      <template #header>
        <div class="card-header">
          <span>阿里云OSS设置</span>
        </div>
      </template>
      
      <el-form :model="settingsForm.oss" label-width="140px" label-position="left">
        <el-form-item label="AccessKey ID">
          <el-input v-model="settingsForm.oss.accessKeyId" placeholder="请输入AccessKey ID" />
        </el-form-item>

        <el-form-item label="AccessKey Secret">
          <el-input v-model="settingsForm.oss.accessKeySecret" placeholder="请输入AccessKey Secret" type="password" show-password />
        </el-form-item>

        <el-form-item label="Bucket">
          <el-input v-model="settingsForm.oss.bucket" placeholder="请输入Bucket名称" />
        </el-form-item>

        <el-form-item label="Endpoint">
          <el-input v-model="settingsForm.oss.endpoint" placeholder="例如：oss-cn-beijing.aliyuncs.com" />
          <div class="form-tip">阿里云OSS的地域节点</div>
        </el-form-item>

        <el-form-item label="自定义域名">
          <el-input v-model="settingsForm.oss.domain" placeholder="例如：cdn.example.com" />
          <div class="form-tip">可选，设置后将使用此域名访问文件</div>
        </el-form-item>

        <el-form-item label="存储目录">
          <el-input v-model="settingsForm.oss.directory" placeholder="例如：uploads/" />
          <div class="form-tip">文件存储在Bucket中的前缀目录</div>
        </el-form-item>

        <el-form-item label="连接测试">
          <el-button type="primary" @click="testConnection('oss')">测试连接</el-button>
          <span v-if="testResults.oss.status" class="test-result" :class="testResults.oss.success ? 'success' : 'error'">
            {{ testResults.oss.message }}
          </span>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 腾讯云COS设置 -->
    <el-card v-if="settingsForm.currentStorage === 'cos'" class="settings-card">
      <template #header>
        <div class="card-header">
          <span>腾讯云COS设置</span>
        </div>
      </template>
      
      <el-form :model="settingsForm.cos" label-width="140px" label-position="left">
        <el-form-item label="SecretId">
          <el-input v-model="settingsForm.cos.secretId" placeholder="请输入SecretId" />
        </el-form-item>

        <el-form-item label="SecretKey">
          <el-input v-model="settingsForm.cos.secretKey" placeholder="请输入SecretKey" type="password" show-password />
        </el-form-item>

        <el-form-item label="Bucket">
          <el-input v-model="settingsForm.cos.bucket" placeholder="请输入Bucket名称" />
        </el-form-item>

        <el-form-item label="Region">
          <el-input v-model="settingsForm.cos.region" placeholder="例如：ap-beijing" />
          <div class="form-tip">腾讯云COS的地域</div>
        </el-form-item>

        <el-form-item label="自定义域名">
          <el-input v-model="settingsForm.cos.domain" placeholder="例如：cdn.example.com" />
          <div class="form-tip">可选，设置后将使用此域名访问文件</div>
        </el-form-item>

        <el-form-item label="存储目录">
          <el-input v-model="settingsForm.cos.directory" placeholder="例如：uploads/" />
          <div class="form-tip">文件存储在Bucket中的前缀目录</div>
        </el-form-item>

        <el-form-item label="连接测试">
          <el-button type="primary" @click="testConnection('cos')">测试连接</el-button>
          <span v-if="testResults.cos.status" class="test-result" :class="testResults.cos.success ? 'success' : 'error'">
            {{ testResults.cos.message }}
          </span>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 七牛云设置 -->
    <el-card v-if="settingsForm.currentStorage === 'qiniu'" class="settings-card">
      <template #header>
        <div class="card-header">
          <span>七牛云设置</span>
        </div>
      </template>
      
      <el-form :model="settingsForm.qiniu" label-width="140px" label-position="left">
        <el-form-item label="AccessKey">
          <el-input v-model="settingsForm.qiniu.accessKey" placeholder="请输入AccessKey" />
        </el-form-item>

        <el-form-item label="SecretKey">
          <el-input v-model="settingsForm.qiniu.secretKey" placeholder="请输入SecretKey" type="password" show-password />
        </el-form-item>

        <el-form-item label="Bucket">
          <el-input v-model="settingsForm.qiniu.bucket" placeholder="请输入Bucket名称" />
        </el-form-item>

        <el-form-item label="区域">
          <el-select v-model="settingsForm.qiniu.zone" placeholder="请选择区域">
            <el-option label="华东" value="z0" />
            <el-option label="华北" value="z1" />
            <el-option label="华南" value="z2" />
            <el-option label="北美" value="na0" />
            <el-option label="东南亚" value="as0" />
          </el-select>
        </el-form-item>

        <el-form-item label="域名">
          <el-input v-model="settingsForm.qiniu.domain" placeholder="例如：cdn.example.com" />
          <div class="form-tip">七牛云的访问域名，必填</div>
        </el-form-item>

        <el-form-item label="是否使用HTTPS">
          <el-switch v-model="settingsForm.qiniu.https" active-color="#42b983" />
          <div class="form-tip">开启后，将使用HTTPS协议访问文件</div>
        </el-form-item>

        <el-form-item label="连接测试">
          <el-button type="primary" @click="testConnection('qiniu')">测试连接</el-button>
          <span v-if="testResults.qiniu.status" class="test-result" :class="testResults.qiniu.success ? 'success' : 'error'">
            {{ testResults.qiniu.message }}
          </span>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- AWS S3设置 -->
    <el-card v-if="settingsForm.currentStorage === 's3'" class="settings-card">
      <template #header>
        <div class="card-header">
          <span>AWS S3设置</span>
        </div>
      </template>
      
      <el-form :model="settingsForm.s3" label-width="140px" label-position="left">
        <el-form-item label="Access Key">
          <el-input v-model="settingsForm.s3.accessKey" placeholder="请输入Access Key" />
        </el-form-item>

        <el-form-item label="Secret Key">
          <el-input v-model="settingsForm.s3.secretKey" placeholder="请输入Secret Key" type="password" show-password />
        </el-form-item>

        <el-form-item label="Bucket">
          <el-input v-model="settingsForm.s3.bucket" placeholder="请输入Bucket名称" />
        </el-form-item>

        <el-form-item label="Region">
          <el-input v-model="settingsForm.s3.region" placeholder="例如：us-west-1" />
          <div class="form-tip">AWS S3的区域</div>
        </el-form-item>

        <el-form-item label="自定义端点">
          <el-input v-model="settingsForm.s3.endpoint" placeholder="例如：https://s3.amazonaws.com" />
          <div class="form-tip">可选，兼容其他S3协议的存储服务</div>
        </el-form-item>

        <el-form-item label="自定义域名">
          <el-input v-model="settingsForm.s3.domain" placeholder="例如：cdn.example.com" />
          <div class="form-tip">可选，设置后将使用此域名访问文件</div>
        </el-form-item>

        <el-form-item label="存储目录">
          <el-input v-model="settingsForm.s3.directory" placeholder="例如：uploads/" />
          <div class="form-tip">文件存储在Bucket中的前缀目录</div>
        </el-form-item>

        <el-form-item label="连接测试">
          <el-button type="primary" @click="testConnection('s3')">测试连接</el-button>
          <span v-if="testResults.s3.status" class="test-result" :class="testResults.s3.success ? 'success' : 'error'">
            {{ testResults.s3.message }}
          </span>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 高级选项 -->
    <el-card class="settings-card">
      <template #header>
        <div class="card-header">
          <span>高级选项</span>
        </div>
      </template>
      
      <el-form :model="settingsForm.advanced" label-width="140px" label-position="left">
        <el-form-item label="文件URL有效期">
          <div class="size-input">
            <el-input-number v-model="settingsForm.advanced.urlExpiration" :min="0" :step="1" />
            <span class="unit">分钟</span>
          </div>
          <div class="form-tip">对于私有存储，设置签名URL的有效期，0表示永久有效</div>
        </el-form-item>

        <el-form-item label="存储类型">
          <el-select v-model="settingsForm.advanced.storageClass" placeholder="请选择存储类型">
            <el-option label="标准存储" value="standard" />
            <el-option label="低频访问" value="infrequent" />
            <el-option label="归档存储" value="archive" />
          </el-select>
          <div class="form-tip">选择文件的存储类型，不同类型有不同的费用和访问特性</div>
        </el-form-item>

        <el-form-item label="文件处理方式">
          <el-select v-model="settingsForm.advanced.fileProcessing" placeholder="请选择处理方式">
            <el-option label="直接上传" value="direct" />
            <el-option label="本地处理后上传" value="local_process" />
            <el-option label="云端处理" value="cloud_process" />
          </el-select>
          <div class="form-tip">选择文件上传前的处理方式</div>
        </el-form-item>

        <el-form-item label="启用CDN加速">
          <el-switch v-model="settingsForm.advanced.enableCdn" active-color="#42b983" />
          <div class="form-tip">开启后，将使用CDN加速文件访问</div>
        </el-form-item>

        <el-form-item label="CDN域名" v-if="settingsForm.advanced.enableCdn">
          <el-input v-model="settingsForm.advanced.cdnDomain" placeholder="例如：cdn.example.com" />
          <div class="form-tip">设置CDN的访问域名</div>
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

// 设置表单
const settingsForm = reactive({
  currentStorage: 'local',
  
  // 本地存储设置
  local: {
    uploadDir: '/www/uploads',
    accessUrl: 'https://example.com/uploads',
    directoryStructure: 'date',
    customStructure: '{year}/{month}/{day}'
  },
  
  // 阿里云OSS设置
  oss: {
    accessKeyId: '',
    accessKeySecret: '',
    bucket: '',
    endpoint: 'oss-cn-beijing.aliyuncs.com',
    domain: '',
    directory: 'uploads/'
  },
  
  // 腾讯云COS设置
  cos: {
    secretId: '',
    secretKey: '',
    bucket: '',
    region: 'ap-beijing',
    domain: '',
    directory: 'uploads/'
  },
  
  // 七牛云设置
  qiniu: {
    accessKey: '',
    secretKey: '',
    bucket: '',
    zone: 'z0',
    domain: '',
    https: true
  },
  
  // AWS S3设置
  s3: {
    accessKey: '',
    secretKey: '',
    bucket: '',
    region: 'us-west-1',
    endpoint: '',
    domain: '',
    directory: 'uploads/'
  },
  
  // 高级设置
  advanced: {
    urlExpiration: 0,
    storageClass: 'standard',
    fileProcessing: 'direct',
    enableCdn: false,
    cdnDomain: ''
  }
});

// 连接测试结果
const testResults = reactive({
  oss: { status: false, success: false, message: '' },
  cos: { status: false, success: false, message: '' },
  qiniu: { status: false, success: false, message: '' },
  s3: { status: false, success: false, message: '' }
});

// 处理存储策略变更
const handleStorageChange = (value) => {
  console.log('存储策略变更为:', value);
};

// 测试连接
const testConnection = (type) => {
  // 重置测试状态
  testResults[type].status = true;
  testResults[type].success = false;
  testResults[type].message = '正在测试连接...';
  
  // 模拟测试过程
  setTimeout(() => {
    testResults[type].success = true;
    testResults[type].message = '连接成功！';
    
    // 真实场景下应该发送API请求测试连接
    // try {
    //   const response = await api.testStorageConnection(type, settingsForm[type]);
    //   testResults[type].success = response.success;
    //   testResults[type].message = response.message;
    // } catch (error) {
    //   testResults[type].success = false;
    //   testResults[type].message = '连接失败: ' + error.message;
    // }
  }, 1000);
};

// 保存设置
const saveSettings = () => {
  console.log('保存设置', {
    currentStorage: settingsForm.currentStorage,
    storageConfig: settingsForm[settingsForm.currentStorage],
    advanced: settingsForm.advanced
  });
  
  // 这里应该发送API请求保存设置
  
  ElMessage({
    type: 'success',
    message: '存储策略设置保存成功！'
  });
};

// 重置表单
const resetForm = () => {
  // 重置为初始值
  settingsForm.currentStorage = 'local';
  
  settingsForm.local.uploadDir = '/www/uploads';
  settingsForm.local.accessUrl = 'https://example.com/uploads';
  settingsForm.local.directoryStructure = 'date';
  settingsForm.local.customStructure = '{year}/{month}/{day}';
  
  // 重置其他存储设置...
  
  ElMessage({
    type: 'info',
    message: '表单已重置'
  });
};
</script>

<style lang="scss" scoped>
@use '@/assets/scss/variables.scss' as *;

.storage-settings-container {
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

.test-result {
  margin-left: 10px;
  font-size: 14px;
  
  &.success {
    color: $success-color;
  }
  
  &.error {
    color: $danger-color;
  }
}
</style> 