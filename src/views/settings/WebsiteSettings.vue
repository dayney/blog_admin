<template>
  <div class="website-settings">
    <h1 class="page-title">网站设置</h1>
    
    <el-card shadow="never">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="基本设置" name="basic">
          <el-form 
            :model="basicForm" 
            label-width="120px" 
            label-position="left"
            :rules="rules"
            ref="basicFormRef"
          >
            <el-form-item label="网站名称" prop="siteName">
              <el-input v-model="basicForm.siteName" placeholder="请输入网站名称" />
            </el-form-item>
            
            <el-form-item label="网站副标题" prop="siteSubtitle">
              <el-input v-model="basicForm.siteSubtitle" placeholder="请输入网站副标题" />
            </el-form-item>
            
            <el-form-item label="网站logo">
              <el-upload
                class="avatar-uploader"
                action="#"
                :show-file-list="false"
                :before-upload="beforeLogoUpload"
                :http-request="uploadLogo"
              >
                <img v-if="basicForm.siteLogo" :src="basicForm.siteLogo" class="avatar" />
                <el-icon v-else class="avatar-uploader-icon"><i class="fas fa-plus"></i></el-icon>
              </el-upload>
              <div class="upload-tip">推荐尺寸：200px * 60px，支持jpg、png格式</div>
            </el-form-item>
            
            <el-form-item label="网站图标">
              <el-upload
                class="avatar-uploader"
                action="#"
                :show-file-list="false"
                :before-upload="beforeFaviconUpload"
                :http-request="uploadFavicon"
              >
                <img v-if="basicForm.siteFavicon" :src="basicForm.siteFavicon" class="avatar-small" />
                <el-icon v-else class="avatar-uploader-icon small"><i class="fas fa-plus"></i></el-icon>
              </el-upload>
              <div class="upload-tip">推荐尺寸：32px * 32px，支持ico、png格式</div>
            </el-form-item>
            
            <el-form-item label="网站域名" prop="siteDomain">
              <el-input v-model="basicForm.siteDomain" placeholder="请输入网站域名" />
            </el-form-item>
            
            <el-form-item label="备案号" prop="beianNumber">
              <el-input v-model="basicForm.beianNumber" placeholder="请输入备案号" />
            </el-form-item>
            
            <el-form-item label="网站状态">
              <el-switch
                v-model="basicForm.siteStatus"
                active-text="开启"
                inactive-text="关闭"
              />
            </el-form-item>
            
            <el-form-item label="关闭提示" v-if="!basicForm.siteStatus">
              <el-input
                type="textarea"
                v-model="basicForm.closeMessage"
                :rows="3"
                placeholder="网站关闭时显示的提示信息"
              />
            </el-form-item>
          </el-form>
        </el-tab-pane>
        
        <el-tab-pane label="联系方式" name="contact">
          <el-form 
            :model="contactForm" 
            label-width="120px" 
            label-position="left"
            ref="contactFormRef"
          >
            <el-form-item label="联系人">
              <el-input v-model="contactForm.contactPerson" placeholder="请输入联系人" />
            </el-form-item>
            
            <el-form-item label="联系电话">
              <el-input v-model="contactForm.contactPhone" placeholder="请输入联系电话" />
            </el-form-item>
            
            <el-form-item label="联系邮箱">
              <el-input v-model="contactForm.contactEmail" placeholder="请输入联系邮箱" />
            </el-form-item>
            
            <el-form-item label="公司地址">
              <el-input v-model="contactForm.contactAddress" placeholder="请输入公司地址" />
            </el-form-item>
            
            <el-form-item label="QQ">
              <el-input v-model="contactForm.contactQQ" placeholder="请输入QQ号码" />
            </el-form-item>
            
            <el-form-item label="微信">
              <el-input v-model="contactForm.contactWeChat" placeholder="请输入微信号" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
        
        <el-tab-pane label="其他设置" name="other">
          <el-form 
            :model="otherForm" 
            label-width="120px" 
            label-position="left"
            ref="otherFormRef"
          >
            <el-form-item label="版权信息">
              <el-input
                type="textarea"
                v-model="otherForm.copyright"
                :rows="3"
                placeholder="网站底部版权信息"
              />
            </el-form-item>
            
            <el-form-item label="统计代码">
              <el-input
                type="textarea"
                v-model="otherForm.statisticsCode"
                :rows="4"
                placeholder="第三方统计代码，如百度统计、CNZZ等"
              />
            </el-form-item>
            
            <el-form-item label="自定义头部">
              <el-input
                type="textarea"
                v-model="otherForm.customHeader"
                :rows="4"
                placeholder="自定义head标签内容"
              />
            </el-form-item>
            
            <el-form-item label="自定义底部">
              <el-input
                type="textarea"
                v-model="otherForm.customFooter"
                :rows="4"
                placeholder="自定义body标签前的内容"
              />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      
      <div class="form-actions">
        <el-button type="primary" @click="handleSubmit">保存设置</el-button>
        <el-button @click="resetForm">重置</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';

// 当前激活的标签页
const activeTab = ref('basic');

// 表单引用
const basicFormRef = ref(null);
const contactFormRef = ref(null);
const otherFormRef = ref(null);

// 基本设置表单数据
const basicForm = ref({
  siteName: '我的博客',
  siteSubtitle: '分享技术，记录生活',
  siteLogo: '',
  siteFavicon: '',
  siteDomain: 'https://example.com',
  beianNumber: '粤ICP备12345678号',
  siteStatus: true,
  closeMessage: '网站维护中，请稍后再访问'
});

// 联系方式表单数据
const contactForm = ref({
  contactPerson: '',
  contactPhone: '',
  contactEmail: '',
  contactAddress: '',
  contactQQ: '',
  contactWeChat: ''
});

// 其他设置表单数据
const otherForm = ref({
  copyright: '© 2023 我的博客 All Rights Reserved.',
  statisticsCode: '',
  customHeader: '',
  customFooter: ''
});

// 表单验证规则
const rules = {
  siteName: [
    { required: true, message: '请输入网站名称', trigger: 'blur' },
    { min: 2, max: 30, message: '长度在2到30个字符', trigger: 'blur' }
  ],
  siteDomain: [
    { required: true, message: '请输入网站域名', trigger: 'blur' }
  ]
};

// 上传图片前的验证
const beforeLogoUpload = (file) => {
  const isJPG = file.type === 'image/jpeg';
  const isPNG = file.type === 'image/png';
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isJPG && !isPNG) {
    ElMessage.error('Logo只能是JPG或PNG格式!');
    return false;
  }
  if (!isLt2M) {
    ElMessage.error('Logo大小不能超过2MB!');
    return false;
  }
  return true;
};

const beforeFaviconUpload = (file) => {
  const isPNG = file.type === 'image/png';
  const isICO = file.type === 'image/x-icon';
  const isLt1M = file.size / 1024 / 1024 < 1;

  if (!isPNG && !isICO) {
    ElMessage.error('网站图标只能是ICO或PNG格式!');
    return false;
  }
  if (!isLt1M) {
    ElMessage.error('网站图标大小不能超过1MB!');
    return false;
  }
  return true;
};

// 上传图片的处理
const uploadLogo = (options) => {
  // 这里应该调用API上传文件，这里只是模拟
  const fakeUrl = URL.createObjectURL(options.file);
  basicForm.value.siteLogo = fakeUrl;
  ElMessage.success('Logo上传成功');
};

const uploadFavicon = (options) => {
  // 这里应该调用API上传文件，这里只是模拟
  const fakeUrl = URL.createObjectURL(options.file);
  basicForm.value.siteFavicon = fakeUrl;
  ElMessage.success('网站图标上传成功');
};

// 提交表单
const handleSubmit = async () => {
  if (activeTab.value === 'basic') {
    await basicFormRef.value.validate((valid) => {
      if (valid) {
        // 提交基本设置表单
        console.log('基本设置表单提交成功', basicForm.value);
        ElMessage.success('保存成功');
      } else {
        return false;
      }
    });
  } else if (activeTab.value === 'contact') {
    // 提交联系方式表单
    console.log('联系方式表单提交成功', contactForm.value);
    ElMessage.success('保存成功');
  } else if (activeTab.value === 'other') {
    // 提交其他设置表单
    console.log('其他设置表单提交成功', otherForm.value);
    ElMessage.success('保存成功');
  }
};

// 重置表单
const resetForm = () => {
  if (activeTab.value === 'basic') {
    basicFormRef.value.resetFields();
  } else if (activeTab.value === 'contact') {
    contactFormRef.value.resetFields();
  } else if (activeTab.value === 'other') {
    otherFormRef.value.resetFields();
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/variables.scss';

.website-settings {
  padding: 20px;
}

.page-title {
  margin-bottom: 20px;
  font-weight: 600;
  font-size: 24px;
  color: $text-primary;
}

.form-actions {
  margin-top: 30px;
  text-align: center;
  
  .el-button {
    padding: 12px 25px;
    font-size: 14px;
  }
}

.logo-upload-box {
  width: 200px;
  height: 100px;
  border: 1px dashed $border-color-base;
  border-radius: $border-radius-small;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  overflow: hidden;
  
  &:hover {
    border-color: $primary-color;
  }
  
  img {
    max-width: 100%;
    max-height: 100%;
  }
}

.upload-tip {
  color: $text-regular;
  font-size: 12px;
  margin-top: 5px;
}

.favicon-upload-box {
  width: 48px;
  height: 48px;
  border: 1px dashed $border-color-base;
  border-radius: $border-radius-small;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  overflow: hidden;
  
  &:hover {
    border-color: $primary-color;
  }
  
  img {
    max-width: 100%;
    max-height: 100%;
  }
}

:deep(.el-tabs__nav) {
  background-color: $bg-color;
}

:deep(.el-tabs__item) {
  color: $text-secondary;
  
  &.is-active {
    color: $primary-color;
  }
  
  &:hover {
    color: $primary-color;
  }
}

:deep(.el-form-item__label) {
  color: $text-primary;
}
</style> 