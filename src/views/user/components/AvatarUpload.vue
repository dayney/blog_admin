<template>
  <el-dialog 
    v-model="dialogVisible" 
    width="440px"
    class="avatar-upload-dialog"
    header-class="avatar-dialog-header"
    body-class="avatar-dialog-body"
    footer-class="avatar-dialog-footer"
    :close-on-click-modal="false"
    :show-close="true"
    @close="handleClose">
    <template #header>
      <div class="dialog-header">
        <div class="header-icon">
          <i class="el-icon-user"></i>
        </div>
        <span class="header-title">上传头像</span>
      </div>
    </template>
    <div class="dialog-content">
      <div class="upload-container">
        <div class="upload-box" @click="triggerFileInput">
          <img v-if="avatarUrl" :src="avatarUrl" alt="预览图" class="preview-image" />
          <div v-else class="placeholder-image"></div>
          <div class="upload-hint">点击上传</div>
        </div>
        <div class="preview-area">
          <div class="preview-circle">
            <img v-if="avatarUrl" :src="avatarUrl" alt="头像预览" class="preview-image" />
            <div v-else class="placeholder-image"></div>
          </div>
          <div class="preview-label">头像预览</div>
        </div>
      </div>
      <input type="file" class="file-input" ref="fileInput" @change="handleAvatarUpload" accept="image/*" />
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" class="confirm-btn" @click="confirmUpload">确认</el-button>
        <el-button class="cancel-btn" @click="handleClose">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:visible', 'confirm', 'cancel']);

const avatarUrl = ref('');
const dialogVisible = ref(false);
const fileInput = ref(null);

// 监听visible属性变化
watch(() => props.visible, (val) => {
  dialogVisible.value = val;
  if (!val) {
    resetUploader();
  }
});

// 处理弹窗关闭
const handleClose = () => {
  emit('update:visible', false);
  emit('cancel');
  resetUploader();
};

// 触发文件选择
const triggerFileInput = () => {
  fileInput.value.click();
};

// 处理头像上传
const handleAvatarUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      avatarUrl.value = event.target.result;
    };
    reader.readAsDataURL(file);
  }
};

// 确认上传
const confirmUpload = () => {
  if (avatarUrl.value) {
    emit('confirm', avatarUrl.value);
  }
  emit('update:visible', false);
  resetUploader();
};

// 重置上传器
const resetUploader = () => {
  avatarUrl.value = '';
};
</script>

<style>
.avatar-upload-dialog {
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.avatar-dialog-header {
  padding: 15px 20px !important;
  border-bottom: 1px solid #ebeef5 !important;
  background-color: #f9f9f9 !important;
  margin-right: 0 !important;
}

.avatar-dialog-body {
  padding: 20px !important;
}

.avatar-dialog-footer {
  padding: 15px 20px !important;
  border-top: 1px solid #ebeef5 !important;
}

.dialog-header {
  display: flex;
  align-items: center;
}

.header-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #009944;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  color: white;
  font-size: 14px;
}

.header-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

/* 调整关闭按钮位置和样式 */
.el-dialog__headerbtn {
  top: 16px !important;
  right: 0 !important;
  height: 24px !important;
}

.el-dialog__headerbtn .el-dialog__close {
  color: #909399 !important;
}

.dialog-content {
  padding: 0;
}

.upload-container {
  display: flex;
  align-items: center;
}

.upload-box {
  width: 240px;
  height: 240px;
  border: 1px dashed #d9d9d9;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  overflow: hidden;
  background-color: #fafafa;
  position: relative;
  margin-right: 25px;
  transition: border-color 0.3s;
}

.upload-box:hover {
  border-color: #409EFF;
}

.preview-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.preview-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05);
}

.preview-label {
  margin-top: 10px;
  color: #606266;
  font-size: 14px;
}

.upload-hint {
  position: absolute;
  bottom: 12px;
  width: 100%;
  text-align: center;
  color: #409EFF;
  font-size: 14px;
}

.placeholder-image {
  width: 32px;
  height: 32px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23d9d9d9"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>');
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.file-input {
  display: none;
}

.dialog-footer {
  display: flex;
  justify-content: center;
}

.confirm-btn, .cancel-btn {
  padding: 8px 20px;
  font-size: 14px;
  min-width: 90px;
}

.confirm-btn {
  background-color: #409EFF;
  border-color: #409EFF;
  margin-right: 12px;
}

.cancel-btn {
  border-color: #dcdfe6;
  color: #606266;
}
</style> 