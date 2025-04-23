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

<style scoped>
.cache-settings {
  padding: 20px;
}

.page-title {
  margin-bottom: 20px;
  font-weight: 600;
  font-size: 24px;
}

.section-title {
  margin: 20px 0;
  font-weight: 600;
  font-size: 18px;
}

.cache-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.cache-info {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
  flex: 1;
}

.cache-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #f0f9ff;
  color: #409EFF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-right: 15px;
}

.cache-content {
  flex: 1;
}

.cache-content h3 {
  margin-top: 0;
  margin-bottom: 8px;
  font-size: 16px;
  font-weight: 600;
}

.cache-content p {
  margin-top: 0;
  margin-bottom: 10px;
  color: #606266;
  font-size: 14px;
}

.cache-status, .cache-size {
  margin-bottom: 5px;
  font-size: 14px;
}

.status-label, .size-label {
  color: #909399;
  margin-right: 5px;
}

.size-value {
  font-weight: 600;
  color: #606266;
}

.cache-actions {
  display: flex;
  justify-content: space-between;
  margin-top: auto;
}

.unit-label {
  margin-left: 10px;
  color: #606266;
}

.form-actions {
  margin-top: 30px;
  text-align: center;
}
</style> 