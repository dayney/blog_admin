<template>
  <div class="sms-settings-container">
    <div class="page-header">
      <h2>短信设置</h2>
      <p class="description">配置短信发送服务和短信模板</p>
    </div>

    <el-card class="settings-card">
      <template #header>
        <div class="card-header">
          <span>服务商设置</span>
        </div>
      </template>
      
      <el-form :model="serviceForm" label-width="140px" label-position="left">
        <el-form-item label="短信服务商">
          <el-radio-group v-model="serviceForm.provider" @change="handleProviderChange">
            <el-radio label="aliyun">阿里云短信</el-radio>
            <el-radio label="tencent">腾讯云短信</el-radio>
            <el-radio label="huawei">华为云短信</el-radio>
            <el-radio label="smschinese">短信宝</el-radio>
            <el-radio label="custom">自定义接口</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 阿里云短信设置 -->
    <el-card v-if="serviceForm.provider === 'aliyun'" class="settings-card">
      <template #header>
        <div class="card-header">
          <span>阿里云短信设置</span>
        </div>
      </template>
      
      <el-form :model="serviceForm.aliyun" label-width="140px" label-position="left">
        <el-form-item label="AccessKey ID">
          <el-input v-model="serviceForm.aliyun.accessKeyId" placeholder="请输入AccessKey ID" />
        </el-form-item>

        <el-form-item label="AccessKey Secret">
          <el-input v-model="serviceForm.aliyun.accessKeySecret" placeholder="请输入AccessKey Secret" type="password" show-password />
        </el-form-item>

        <el-form-item label="短信签名">
          <el-input v-model="serviceForm.aliyun.signName" placeholder="例如：博客系统" />
          <div class="form-tip">短信签名需要在阿里云短信服务中申请并审核通过</div>
        </el-form-item>

        <el-form-item label="连接测试">
          <el-button type="primary" @click="testSmsConnection('aliyun')">测试连接</el-button>
          <span v-if="testResults.aliyun.status" class="test-result" :class="testResults.aliyun.success ? 'success' : 'error'">
            {{ testResults.aliyun.message }}
          </span>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 腾讯云短信设置 -->
    <el-card v-if="serviceForm.provider === 'tencent'" class="settings-card">
      <template #header>
        <div class="card-header">
          <span>腾讯云短信设置</span>
        </div>
      </template>
      
      <el-form :model="serviceForm.tencent" label-width="140px" label-position="left">
        <el-form-item label="SecretId">
          <el-input v-model="serviceForm.tencent.secretId" placeholder="请输入SecretId" />
        </el-form-item>

        <el-form-item label="SecretKey">
          <el-input v-model="serviceForm.tencent.secretKey" placeholder="请输入SecretKey" type="password" show-password />
        </el-form-item>

        <el-form-item label="应用ID(SDKAppID)">
          <el-input v-model="serviceForm.tencent.sdkAppId" placeholder="请输入SDKAppID" />
        </el-form-item>

        <el-form-item label="短信签名">
          <el-input v-model="serviceForm.tencent.sign" placeholder="例如：博客系统" />
          <div class="form-tip">短信签名需要在腾讯云短信服务中申请并审核通过</div>
        </el-form-item>

        <el-form-item label="连接测试">
          <el-button type="primary" @click="testSmsConnection('tencent')">测试连接</el-button>
          <span v-if="testResults.tencent.status" class="test-result" :class="testResults.tencent.success ? 'success' : 'error'">
            {{ testResults.tencent.message }}
          </span>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 短信宝设置 -->
    <el-card v-if="serviceForm.provider === 'smschinese'" class="settings-card">
      <template #header>
        <div class="card-header">
          <span>短信宝设置</span>
        </div>
      </template>
      
      <el-form :model="serviceForm.smschinese" label-width="140px" label-position="left">
        <el-form-item label="用户名">
          <el-input v-model="serviceForm.smschinese.username" placeholder="请输入用户名" />
        </el-form-item>

        <el-form-item label="密码">
          <el-input v-model="serviceForm.smschinese.password" placeholder="请输入密码" type="password" show-password />
        </el-form-item>

        <el-form-item label="连接测试">
          <el-button type="primary" @click="testSmsConnection('smschinese')">测试连接</el-button>
          <span v-if="testResults.smschinese.status" class="test-result" :class="testResults.smschinese.success ? 'success' : 'error'">
            {{ testResults.smschinese.message }}
          </span>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 短信模板设置 -->
    <el-card class="settings-card">
      <template #header>
        <div class="card-header">
          <span>短信模板设置</span>
          <el-button type="primary" size="small" @click="addTemplate">添加模板</el-button>
        </div>
      </template>
      
      <el-table :data="templateList" style="width: 100%">
        <el-table-column prop="name" label="模板名称" width="150" />
        <el-table-column prop="code" label="模板编码" width="150" />
        <el-table-column prop="templateId" label="模板ID" width="200" />
        <el-table-column prop="content" label="模板内容">
          <template #default="scope">
            <div class="template-content">{{ scope.row.content }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button type="primary" link @click="editTemplate(scope.row)">编辑</el-button>
            <el-button type="danger" link @click="deleteTemplate(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 发送限制设置 -->
    <el-card class="settings-card">
      <template #header>
        <div class="card-header">
          <span>发送限制设置</span>
        </div>
      </template>
      
      <el-form :model="limitForm" label-width="140px" label-position="left">
        <el-form-item label="同一手机号日发送限制">
          <div class="size-input">
            <el-input-number v-model="limitForm.dailyLimit" :min="0" :step="1" />
            <span class="unit">条/天</span>
          </div>
          <div class="form-tip">设置同一手机号每天最多可以发送的短信数量，0表示不限制</div>
        </el-form-item>

        <el-form-item label="同一IP日发送限制">
          <div class="size-input">
            <el-input-number v-model="limitForm.ipLimit" :min="0" :step="1" />
            <span class="unit">条/天</span>
          </div>
          <div class="form-tip">设置同一IP每天最多可以发送的短信数量，0表示不限制</div>
        </el-form-item>

        <el-form-item label="验证码有效期">
          <div class="size-input">
            <el-input-number v-model="limitForm.codeExpire" :min="1" :step="1" />
            <span class="unit">分钟</span>
          </div>
          <div class="form-tip">设置验证码的有效期，超过有效期后验证码失效</div>
        </el-form-item>

        <el-form-item label="验证码重发间隔">
          <div class="size-input">
            <el-input-number v-model="limitForm.resendInterval" :min="0" :step="1" />
            <span class="unit">秒</span>
          </div>
          <div class="form-tip">设置同一手机号两次发送验证码的最小时间间隔</div>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 短信发送日志 -->
    <el-card class="settings-card">
      <template #header>
        <div class="card-header">
          <span>短信发送日志</span>
          <div class="header-actions">
            <el-select v-model="logFilter.type" placeholder="短信类型" style="width: 120px" clearable>
              <el-option label="验证码" value="verify" />
              <el-option label="通知" value="notice" />
              <el-option label="营销" value="marketing" />
            </el-select>
            <el-select v-model="logFilter.status" placeholder="发送状态" style="width: 120px; margin-left: 10px" clearable>
              <el-option label="成功" value="success" />
              <el-option label="失败" value="fail" />
            </el-select>
            <el-button type="primary" @click="searchLogs" style="margin-left: 10px">搜索</el-button>
          </div>
        </div>
      </template>
      
      <el-table :data="smsLogs" style="width: 100%">
        <el-table-column prop="phone" label="手机号" width="120" />
        <el-table-column prop="type" label="短信类型" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.type === 'verify' ? 'success' : (scope.row.type === 'notice' ? 'info' : 'warning')">
              {{ scope.row.type === 'verify' ? '验证码' : (scope.row.type === 'notice' ? '通知' : '营销') }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="template" label="使用模板" width="150" />
        <el-table-column prop="content" label="内容" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'success' ? 'success' : 'danger'">
              {{ scope.row.status === 'success' ? '成功' : '失败' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="发送时间" width="180" />
      </el-table>
      
      <div class="pagination-container">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="100"
          :current-page="currentPage"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- 模板表单对话框 -->
    <el-dialog 
      v-model="templateDialog.visible" 
      :title="templateDialog.isNew ? '添加短信模板' : '编辑短信模板'" 
      width="500px"
    >
      <el-form :model="templateDialog.form" label-width="100px">
        <el-form-item label="模板名称">
          <el-input v-model="templateDialog.form.name" placeholder="例如：注册验证码" />
        </el-form-item>
        <el-form-item label="模板编码">
          <el-input v-model="templateDialog.form.code" placeholder="例如：register_code" />
          <div class="form-tip">用于在代码中调用该模板的唯一标识</div>
        </el-form-item>
        <el-form-item label="模板ID">
          <el-input v-model="templateDialog.form.templateId" placeholder="请输入服务商提供的模板ID" />
          <div class="form-tip">短信服务商提供的模板ID，需要在服务商平台申请</div>
        </el-form-item>
        <el-form-item label="模板类型">
          <el-select v-model="templateDialog.form.type" placeholder="请选择模板类型">
            <el-option label="验证码" value="verify" />
            <el-option label="通知" value="notice" />
            <el-option label="营销" value="marketing" />
          </el-select>
        </el-form-item>
        <el-form-item label="模板内容">
          <el-input
            v-model="templateDialog.form.content"
            type="textarea"
            :rows="4"
            placeholder="例如：您的验证码是{code}，有效期{time}分钟，请勿泄露给他人。"
          />
          <div class="form-tip">模板变量使用{variable}格式</div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="templateDialog.visible = false">取消</el-button>
          <el-button type="primary" @click="saveTemplate">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <div class="form-actions">
      <el-button type="primary" @click="saveSettings">保存设置</el-button>
      <el-button @click="resetForm">重置</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';

// 服务商设置表单
const serviceForm = reactive({
  provider: 'aliyun',
  
  // 阿里云短信设置
  aliyun: {
    accessKeyId: '',
    accessKeySecret: '',
    signName: ''
  },
  
  // 腾讯云短信设置
  tencent: {
    secretId: '',
    secretKey: '',
    sdkAppId: '',
    sign: ''
  },
  
  // 短信宝设置
  smschinese: {
    username: '',
    password: ''
  },
  
  // 华为云短信设置
  huawei: {
    appKey: '',
    appSecret: '',
    channelNo: '',
    signature: ''
  },
  
  // 自定义接口
  custom: {
    apiUrl: '',
    method: 'POST',
    headers: '',
    params: ''
  }
});

// 发送限制设置
const limitForm = reactive({
  dailyLimit: 10,
  ipLimit: 20,
  codeExpire: 10,
  resendInterval: 60
});

// 连接测试结果
const testResults = reactive({
  aliyun: { status: false, success: false, message: '' },
  tencent: { status: false, success: false, message: '' },
  smschinese: { status: false, success: false, message: '' },
  huawei: { status: false, success: false, message: '' }
});

// 模板列表
const templateList = ref([
  {
    id: 1,
    name: '注册验证码',
    code: 'register_code',
    templateId: 'SMS_123456789',
    type: 'verify',
    content: '您的注册验证码是{code}，有效期{time}分钟，请勿泄露给他人。'
  },
  {
    id: 2,
    name: '登录验证码',
    code: 'login_code',
    templateId: 'SMS_987654321',
    type: 'verify',
    content: '您的登录验证码是{code}，有效期{time}分钟，请勿泄露给他人。'
  },
  {
    id: 3,
    name: '订单通知',
    code: 'order_notice',
    templateId: 'SMS_567891234',
    type: 'notice',
    content: '您的订单{order_no}已支付成功，感谢您的购买。'
  }
]);

// 模板对话框
const templateDialog = reactive({
  visible: false,
  isNew: true,
  editIndex: -1,
  form: {
    name: '',
    code: '',
    templateId: '',
    type: 'verify',
    content: ''
  }
});

// 短信日志
const smsLogs = ref([
  {
    id: 1,
    phone: '138****1234',
    type: 'verify',
    template: '注册验证码',
    content: '您的注册验证码是123456，有效期10分钟，请勿泄露给他人。',
    status: 'success',
    time: '2023-06-01 14:30:45'
  },
  {
    id: 2,
    phone: '139****5678',
    type: 'notice',
    template: '订单通知',
    content: '您的订单DD20230601001已支付成功，感谢您的购买。',
    status: 'success',
    time: '2023-06-01 15:12:23'
  },
  {
    id: 3,
    phone: '137****9012',
    type: 'marketing',
    template: '促销活动',
    content: '618大促开始了，全场商品5折起，赶快来抢购吧！',
    status: 'success',
    time: '2023-06-01 16:05:11'
  },
  {
    id: 4,
    phone: '135****3456',
    type: 'verify',
    template: '登录验证码',
    content: '您的登录验证码是654321，有效期10分钟，请勿泄露给他人。',
    status: 'fail',
    time: '2023-06-01 17:45:32'
  }
]);

// 日志筛选条件
const logFilter = reactive({
  type: '',
  status: ''
});

// 分页
const currentPage = ref(1);

// 处理服务商变更
const handleProviderChange = (value) => {
  console.log('短信服务商变更为:', value);
};

// 测试短信连接
const testSmsConnection = (type) => {
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
    //   const response = await api.testSmsConnection(type, serviceForm[type]);
    //   testResults[type].success = response.success;
    //   testResults[type].message = response.message;
    // } catch (error) {
    //   testResults[type].success = false;
    //   testResults[type].message = '连接失败: ' + error.message;
    // }
  }, 1000);
};

// 添加模板
const addTemplate = () => {
  templateDialog.isNew = true;
  templateDialog.editIndex = -1;
  templateDialog.form = {
    name: '',
    code: '',
    templateId: '',
    type: 'verify',
    content: ''
  };
  templateDialog.visible = true;
};

// 编辑模板
const editTemplate = (row) => {
  templateDialog.isNew = false;
  templateDialog.editIndex = templateList.value.findIndex(item => item.id === row.id);
  templateDialog.form = { ...row };
  templateDialog.visible = true;
};

// 保存模板
const saveTemplate = () => {
  if (templateDialog.isNew) {
    // 添加新模板
    templateList.value.push({
      id: Date.now(), // 模拟生成ID
      ...templateDialog.form
    });
  } else {
    // 更新现有模板
    templateList.value[templateDialog.editIndex] = {
      ...templateList.value[templateDialog.editIndex],
      ...templateDialog.form
    };
  }
  
  templateDialog.visible = false;
  ElMessage({
    type: 'success',
    message: templateDialog.isNew ? '模板添加成功！' : '模板更新成功！'
  });
};

// 删除模板
const deleteTemplate = (index) => {
  ElMessageBox.confirm('确定要删除这个模板吗？', '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    templateList.value.splice(index, 1);
    ElMessage({
      type: 'success',
      message: '删除成功！'
    });
  }).catch(() => {
    // 取消删除
  });
};

// 搜索日志
const searchLogs = () => {
  console.log('搜索日志:', logFilter);
  // 实际应用中需要发送API请求获取日志数据
};

// 分页切换
const handlePageChange = (page) => {
  currentPage.value = page;
  // 实际应用中需要发送API请求获取日志数据
};

// 保存设置
const saveSettings = () => {
  console.log('保存设置', {
    service: serviceForm,
    limit: limitForm,
    templates: templateList.value
  });
  
  // 这里应该发送API请求保存设置
  
  ElMessage({
    type: 'success',
    message: '短信设置保存成功！'
  });
};

// 重置表单
const resetForm = () => {
  // 重置为初始值
  serviceForm.provider = 'aliyun';
  serviceForm.aliyun.accessKeyId = '';
  serviceForm.aliyun.accessKeySecret = '';
  serviceForm.aliyun.signName = '';
  
  limitForm.dailyLimit = 10;
  limitForm.ipLimit = 20;
  limitForm.codeExpire = 10;
  limitForm.resendInterval = 60;
  
  ElMessage({
    type: 'info',
    message: '表单已重置'
  });
};
</script>

<style lang="scss" scoped>
@import '@/assets/variables.scss';

.sms-settings-container {
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

.template-content {
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
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