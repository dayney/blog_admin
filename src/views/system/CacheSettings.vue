<template>
  <div class="cache-settings">
    <h1 class="page-title">系统缓存</h1>
    
    <el-card shadow="never">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card shadow="hover" class="cache-card">
            <div class="cache-info">
              <div class="cache-icon">
                <i class="fas fa-database"></i>
              </div>
              <div class="cache-content">
                <h3>数据缓存</h3>
                <p>缓存数据库查询结果，提高访问速度</p>
                <div class="cache-status">
                  <span class="status-label">状态：</span>
                  <el-tag type="success">已开启</el-tag>
                </div>
                <div class="cache-size">
                  <span class="size-label">缓存大小：</span>
                  <span class="size-value">24.5 MB</span>
                </div>
              </div>
            </div>
            <div class="cache-actions">
              <el-button type="primary" @click="clearDataCache">清除缓存</el-button>
              <el-button type="info" @click="refreshDataCache">刷新缓存</el-button>
            </div>
          </el-card>
        </el-col>
        
        <el-col :span="8">
          <el-card shadow="hover" class="cache-card">
            <div class="cache-info">
              <div class="cache-icon">
                <i class="fas fa-file-code"></i>
              </div>
              <div class="cache-content">
                <h3>模板缓存</h3>
                <p>缓存网站模板文件，减少文件读取</p>
                <div class="cache-status">
                  <span class="status-label">状态：</span>
                  <el-tag type="success">已开启</el-tag>
                </div>
                <div class="cache-size">
                  <span class="size-label">缓存大小：</span>
                  <span class="size-value">12.8 MB</span>
                </div>
              </div>
            </div>
            <div class="cache-actions">
              <el-button type="primary" @click="clearTemplateCache">清除缓存</el-button>
              <el-button type="info" @click="refreshTemplateCache">刷新缓存</el-button>
            </div>
          </el-card>
        </el-col>
        
        <el-col :span="8">
          <el-card shadow="hover" class="cache-card">
            <div class="cache-info">
              <div class="cache-icon">
                <i class="fas fa-images"></i>
              </div>
              <div class="cache-content">
                <h3>图片缓存</h3>
                <p>缓存网站图片的缩略图，减少图片处理</p>
                <div class="cache-status">
                  <span class="status-label">状态：</span>
                  <el-tag type="success">已开启</el-tag>
                </div>
                <div class="cache-size">
                  <span class="size-label">缓存大小：</span>
                  <span class="size-value">156.2 MB</span>
                </div>
              </div>
            </div>
            <div class="cache-actions">
              <el-button type="primary" @click="clearImageCache">清除缓存</el-button>
              <el-button type="info" @click="refreshImageCache">刷新缓存</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
      
      <el-divider />
      
      <h2 class="section-title">缓存设置</h2>
      
      <el-form :model="cacheForm" label-width="180px" label-position="left">
        <el-form-item label="启用数据缓存">
          <el-switch v-model="cacheForm.enableDataCache" />
        </el-form-item>
        
        <el-form-item label="数据缓存过期时间">
          <el-input-number 
            v-model="cacheForm.dataCacheExpire" 
            :min="1" 
            :max="1440"
            :disabled="!cacheForm.enableDataCache"
          />
          <span class="unit-label">分钟</span>
        </el-form-item>
        
        <el-form-item label="启用模板缓存">
          <el-switch v-model="cacheForm.enableTemplateCache" />
        </el-form-item>
        
        <el-form-item label="模板缓存过期时间">
          <el-input-number 
            v-model="cacheForm.templateCacheExpire" 
            :min="1" 
            :max="1440"
            :disabled="!cacheForm.enableTemplateCache"
          />
          <span class="unit-label">分钟</span>
        </el-form-item>
        
        <el-form-item label="启用图片缓存">
          <el-switch v-model="cacheForm.enableImageCache" />
        </el-form-item>
        
        <el-form-item label="图片缓存过期时间">
          <el-input-number 
            v-model="cacheForm.imageCacheExpire" 
            :min="1" 
            :max="43200"
            :disabled="!cacheForm.enableImageCache"
          />
          <span class="unit-label">分钟</span>
        </el-form-item>
        
        <el-form-item label="缓存驱动">
          <el-select v-model="cacheForm.cacheDriver" placeholder="请选择缓存驱动">
            <el-option label="文件" value="file" />
            <el-option label="Redis" value="redis" />
            <el-option label="Memcached" value="memcached" />
          </el-select>
        </el-form-item>
        
        <el-form-item 
          label="Redis 服务器" 
          v-if="cacheForm.cacheDriver === 'redis'"
        >
          <el-input v-model="cacheForm.redisServer" placeholder="Redis服务器地址，如：127.0.0.1:6379" />
        </el-form-item>
        
        <el-form-item 
          label="Memcached 服务器" 
          v-if="cacheForm.cacheDriver === 'memcached'"
        >
          <el-input v-model="cacheForm.memcachedServer" placeholder="Memcached服务器地址，如：127.0.0.1:11211" />
        </el-form-item>
        
        <el-form-item label="缓存目录" v-if="cacheForm.cacheDriver === 'file'">
          <el-input v-model="cacheForm.cacheDir" placeholder="缓存文件存储目录" />
        </el-form-item>
      </el-form>
      
      <div class="form-actions">
        <el-button type="primary" @click="saveCacheSettings">保存设置</el-button>
        <el-button @click="resetForm">重置</el-button>
        <el-button type="danger" @click="clearAllCache">清除所有缓存</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';

// 缓存表单数据
const cacheForm = ref({
  enableDataCache: true,
  dataCacheExpire: 30,
  enableTemplateCache: true,
  templateCacheExpire: 60,
  enableImageCache: true,
  imageCacheExpire: 1440, // 24小时
  cacheDriver: 'file',
  redisServer: '127.0.0.1:6379',
  memcachedServer: '127.0.0.1:11211',
  cacheDir: '/storage/cache'
});

// 清除数据缓存
const clearDataCache = () => {
  ElMessageBox.confirm(
    '确定要清除数据缓存吗？这可能会导致暂时的性能下降。',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(() => {
      // 这里应该调用API清除缓存
      ElMessage.success('数据缓存清除成功');
    })
    .catch(() => {
      // 取消清除
    });
};

// 刷新数据缓存
const refreshDataCache = () => {
  ElMessageBox.confirm(
    '确定要刷新数据缓存吗？系统将重新生成所有缓存数据。',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info'
    }
  )
    .then(() => {
      // 这里应该调用API刷新缓存
      ElMessage.success('数据缓存刷新成功');
    })
    .catch(() => {
      // 取消刷新
    });
};

// 清除模板缓存
const clearTemplateCache = () => {
  ElMessageBox.confirm(
    '确定要清除模板缓存吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(() => {
      // 这里应该调用API清除缓存
      ElMessage.success('模板缓存清除成功');
    })
    .catch(() => {
      // 取消清除
    });
};

// 刷新模板缓存
const refreshTemplateCache = () => {
  ElMessageBox.confirm(
    '确定要刷新模板缓存吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info'
    }
  )
    .then(() => {
      // 这里应该调用API刷新缓存
      ElMessage.success('模板缓存刷新成功');
    })
    .catch(() => {
      // 取消刷新
    });
};

// 清除图片缓存
const clearImageCache = () => {
  ElMessageBox.confirm(
    '确定要清除图片缓存吗？这可能会导致网站图片加载变慢。',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(() => {
      // 这里应该调用API清除缓存
      ElMessage.success('图片缓存清除成功');
    })
    .catch(() => {
      // 取消清除
    });
};

// 刷新图片缓存
const refreshImageCache = () => {
  ElMessageBox.confirm(
    '确定要刷新图片缓存吗？这可能需要一些时间来完成。',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info'
    }
  )
    .then(() => {
      // 这里应该调用API刷新缓存
      ElMessage.success('图片缓存刷新成功');
    })
    .catch(() => {
      // 取消刷新
    });
};

// 清除所有缓存
const clearAllCache = () => {
  ElMessageBox.confirm(
    '确定要清除所有缓存吗？这将会清除数据缓存、模板缓存和图片缓存。',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(() => {
      // 这里应该调用API清除所有缓存
      ElMessage.success('所有缓存清除成功');
    })
    .catch(() => {
      // 取消清除
    });
};

// 保存缓存设置
const saveCacheSettings = () => {
  // 这里应该调用API保存设置
  console.log('缓存设置：', cacheForm.value);
  ElMessage.success('缓存设置保存成功');
};

// 重置表单
const resetForm = () => {
  cacheForm.value = {
    enableDataCache: true,
    dataCacheExpire: 30,
    enableTemplateCache: true,
    templateCacheExpire: 60,
    enableImageCache: true,
    imageCacheExpire: 1440,
    cacheDriver: 'file',
    redisServer: '127.0.0.1:6379',
    memcachedServer: '127.0.0.1:11211',
    cacheDir: '/storage/cache'
  };
};
</script>

<style lang="scss" scoped>
@use '@/assets/scss/variables.scss' as *;

// 系统配置模块样式
.cache-settings {
  width: 100%;
  padding: 0;
  
  .page-title {
    font-size: $font-size-xxl;
    font-weight: $font-weight-semibold;
    margin: 0 0 20px 0;
    color: $dark-color;
  }
  
  .section-title {
    font-size: $font-size-large;
    font-weight: $font-weight-semibold;
    margin: 20px 0;
    color: $dark-color;
  }
}

/* 确保内容区域填满 */
.content-wrapper {
  width: 100% !important;
}

/* 内容管理器样式 */
.content-manager {
  width: 100%;
  padding: 0;
}

/* 标签页导航样式 */
.tab-nav {
  margin-bottom: 1rem;
}

.tab-item {
  cursor: pointer;
  padding: 0.5rem 1rem;
  margin-right: 0.25rem;
  border-top-left-radius: $border-radius-mini;
  border-top-right-radius: $border-radius-mini;
  display: flex;
  align-items: center;
  transition: all $transition-time;
  
  i {
    margin-right: 0.5rem;
  }
  
  &.active,
  &:hover {
    background-color: rgba($primary-color, 0.1);
  }
}

/* 卡片样式 */
.card {
  background-color: white;
  border-radius: $border-radius-base;
  padding: 1.5rem;
  box-shadow: $box-shadow-light;
  margin-bottom: 1.5rem;
  width: 100%;
  animation: fadeIn 0.5s ease;
  border: 1px solid $border-color-lighter;
}

/* 卡片标题 */
.card-header {
  margin-bottom: 20px;
  
  h3 {
    font-size: $font-size-large;
    font-weight: $font-weight-semibold;
    margin: 0 0 8px 0;
    color: $dark-color;
  }
  
  p {
    font-size: $font-size-base;
    color: $gray-color;
    margin: 0;
  }
}

/* 表单控件样式 */
.el-form {
  width: 100%;
}

.el-form-item {
  margin-bottom: 1.25rem;
  
  &__label {
    font-weight: $font-weight-medium !important;
    color: $text-regular !important;
  }
}

.el-input, 
.el-textarea, 
.el-select, 
.el-input-number {
  width: 100% !important;
}

/* 表单提示文本 */
.form-tip {
  font-size: $font-size-mini;
  color: $text-secondary;
  line-height: 1.5;
  margin-top: 5px;
}

/* 按钮样式 */
.el-button {
  border-radius: $border-radius-mini;
  font-weight: $font-weight-medium;
  transition: all $transition-time;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: none;
  }
  
  & + .el-button {
    margin-left: 10px;
  }
}

/* 表格样式 */
.el-table {
  width: 100% !important;
  margin-bottom: 1.5rem;
  border-radius: $border-radius-mini;
  overflow: hidden;
}

.cache-settings-container {
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

.header-actions {
  display: flex;
  align-items: center;
}

.form-actions {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  padding-top: 20px;
  border-top: 1px solid $border-color-lighter;
  
  .el-button {
    padding: 12px 25px;
    font-size: 14px;
    border-radius: $border-radius-mini;
    font-weight: $font-weight-medium;
    transition: all $transition-time;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    &:active {
      transform: translateY(0);
      box-shadow: none;
    }
  }
}

.cache-card {
  height: 100%;
  animation: fadeIn 0.5s ease;
  
  .cache-info {
    display: flex;
    margin-bottom: 20px;
  }
  
  .cache-icon {
    width: 50px;
    height: 50px;
    border-radius: $border-radius-base;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba($primary-color, 0.1);
    color: $primary-color;
    margin-right: 15px;
    font-size: 24px;
  }
  
  .cache-content {
    flex: 1;
    
    h3 {
      font-size: 18px;
      font-weight: $font-weight-semibold;
      margin: 0 0 5px 0;
      color: $text-primary;
    }
    
    p {
      font-size: 14px;
      color: $text-secondary;
      margin: 0 0 10px 0;
    }
  }
  
  .cache-status, .cache-size {
    font-size: 14px;
    margin-top: 5px;
    display: flex;
    align-items: center;
    
    .status-label, .size-label {
      color: $text-secondary;
      margin-right: 5px;
    }
    
    .size-value {
      font-weight: $font-weight-medium;
      color: $text-primary;
    }
  }
  
  .cache-actions {
    display: flex;
    justify-content: center;
    
    .el-button + .el-button {
      margin-left: 10px;
    }
  }
}

.stat-item {
  margin-bottom: 15px;
  border-bottom: 1px dashed $border-color-lighter;
  padding-bottom: 10px;
  
  &:last-child {
    border-bottom: none;
  }
  
  .label {
    font-size: 14px;
    color: $text-secondary;
    margin-bottom: 5px;
  }
  
  .value {
    font-size: 16px;
    font-weight: 500;
    color: $text-primary;
  }
}

.cache-progress {
  margin-top: 20px;
  margin-bottom: 10px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: $text-secondary;
  margin-top: 5px;
}

.test-result {
  margin-top: 15px;
  padding: 12px 16px;
  border-radius: $border-radius-mini;
  font-size: $font-size-base;
  line-height: 1.5;
  transition: all $transition-time;
  display: flex;
  align-items: center;
  animation: fadeInUp 0.5s ease;
  
  i {
    font-size: $font-size-medium;
    margin-right: 8px;
  }
  
  &.success {
    background-color: #f0f9eb;
    border: 1px solid #e1f3d8;
    color: $success-color;
  }
  
  &.error {
    background-color: #fef0f0;
    border: 1px solid #fde2e2;
    color: $danger-color;
  }
}

/* 淡入动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 清除个别宽度限制 */
.el-select[style*="width"],
.el-input-number[style*="width"] {
  width: 100% !important;
}

/* 响应式调整 - 只针对PC */
@media screen and (min-width: 992px) {
  .form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  
  .el-input-number {
    max-width: 300px;
  }
}

.unit-label {
  margin-left: 10px;
  color: $text-secondary;
}
</style> 