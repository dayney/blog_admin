<template>
  <div class="media-management">
    <h1 class="page-title">媒体管理</h1>
    
    <el-card shadow="never" class="media-card">
      <div class="toolbar">
        <div class="search-section">
          <el-input v-model="searchKeyword" placeholder="搜索媒体文件..." clearable>
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-select v-model="mediaType" placeholder="媒体类型" clearable>
            <el-option label="全部" value="" />
            <el-option label="图片" value="image" />
            <el-option label="视频" value="video" />
            <el-option label="文档" value="document" />
            <el-option label="音频" value="audio" />
          </el-select>
        </div>
        <div class="action-buttons">
          <el-button type="primary" @click="handleUpload">
            <el-icon><Upload /></el-icon> 上传文件
          </el-button>
          <el-button @click="refreshList">
            <el-icon><Refresh /></el-icon> 刷新
          </el-button>
          <el-button type="info" @click="viewLogs">
            <el-icon><Document /></el-icon> 查看日志
          </el-button>
        </div>
      </div>
      
      <div class="view-controls">
        <el-radio-group v-model="viewMode">
          <el-radio-button :value="'grid'" label="网格">
            <el-icon><Grid /></el-icon>
          </el-radio-button>
          <el-radio-button :value="'list'" label="列表">
            <el-icon><List /></el-icon>
          </el-radio-button>
        </el-radio-group>
      </div>
      
      <!-- 网格视图 -->
      <div v-if="viewMode === 'grid'" class="media-grid">
        <el-card v-for="item in mediaList" :key="item.id" class="media-item" shadow="hover">
          <div class="media-preview">
            <img v-if="item.type === 'image'" :src="item.url" alt="media preview" />
            <div v-else-if="item.type === 'video'" class="video-preview">
              <el-icon><VideoCamera /></el-icon>
            </div>
            <div v-else-if="item.type === 'document'" class="document-preview">
              <el-icon><Document /></el-icon>
            </div>
            <div v-else-if="item.type === 'audio'" class="audio-preview">
              <el-icon><Microphone /></el-icon>
            </div>
          </div>
          <div class="media-info">
            <div class="media-name">{{ item.name }}</div>
            <div class="media-meta">
              <span>{{ item.size }}</span>
              <span>{{ item.date }}</span>
            </div>
            <div class="media-actions">
              <el-button type="primary" size="small" circle @click="copyUrl(item)">
                <el-icon><CopyDocument /></el-icon>
              </el-button>
              <el-button type="danger" size="small" circle @click="handleDelete(item)">
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
          </div>
        </el-card>
      </div>
      
      <!-- 列表视图 -->
      <div v-else class="media-list">
        <el-table :data="mediaList" style="width: 100%">
          <el-table-column label="预览" width="100">
            <template #default="{ row }">
              <img v-if="row.type === 'image'" :src="row.url" class="list-preview" alt="media preview" />
              <el-icon v-else-if="row.type === 'video'" class="list-icon"><VideoCamera /></el-icon>
              <el-icon v-else-if="row.type === 'document'" class="list-icon"><Document /></el-icon>
              <el-icon v-else-if="row.type === 'audio'" class="list-icon"><Microphone /></el-icon>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="文件名" />
          <el-table-column prop="type" label="类型" width="100" />
          <el-table-column prop="size" label="大小" width="100" />
          <el-table-column prop="date" label="上传时间" width="180" />
          <el-table-column label="操作" width="150">
            <template #default="{ row }">
              <el-button type="primary" size="small" @click="copyUrl(row)">复制链接</el-button>
              <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[12, 24, 48, 96]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 上传对话框 -->
    <el-dialog v-model="uploadDialogVisible" title="上传媒体文件" width="500px">
      <el-upload
        class="upload-area"
        drag
        action="#"
        multiple
        :auto-upload="false"
        :on-change="handleFileChange"
      >
        <el-icon class="upload-icon"><Upload /></el-icon>
        <div class="upload-text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="upload-tip">支持jpg, png, gif, mp4, mp3, pdf等多种格式</div>
      </el-upload>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="uploadDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitUpload">确认上传</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { 
  Search, Upload, Grid, List, Refresh, 
  VideoCamera, Document, Microphone, 
  Delete, CopyDocument 
} from '@element-plus/icons-vue';

const router = useRouter();

// 查看媒体操作日志
const viewLogs = () => {
  router.push({
    path: '/log-record',
    query: { type: 'media' }
  });
};

// 搜索与筛选
const searchKeyword = ref('');
const mediaType = ref('');

// 视图模式
const viewMode = ref('grid');

// 监听视图模式变化，防止aria-hidden访问性问题
watch(viewMode, () => {
  // 使用setTimeout确保DOM更新后再执行
  setTimeout(() => {
    // 移除所有隐藏元素中的焦点
    document.querySelectorAll('[aria-hidden="true"] *').forEach(el => {
      if (el === document.activeElement) {
        el.blur();
      }
    });
  }, 0);
});

// 分页
const currentPage = ref(1);
const pageSize = ref(12);
const total = ref(100);

// 上传对话框
const uploadDialogVisible = ref(false);
const fileList = ref([]);

// 示例媒体数据
const mediaList = ref([
  {
    id: 1,
    name: 'banner.jpg',
    type: 'image',
    url: 'https://via.placeholder.com/300x200',
    size: '156KB',
    date: '2023-05-22 10:30'
  },
  {
    id: 2,
    name: 'intro.mp4',
    type: 'video',
    url: 'https://example.com/intro.mp4',
    size: '5.2MB',
    date: '2023-05-20 14:15'
  },
  {
    id: 3,
    name: 'report.pdf',
    type: 'document',
    url: 'https://example.com/report.pdf',
    size: '1.8MB',
    date: '2023-05-18 09:45'
  },
  {
    id: 4,
    name: 'background.jpg',
    type: 'image',
    url: 'https://via.placeholder.com/300x200',
    size: '245KB',
    date: '2023-05-15 16:20'
  },
  {
    id: 5,
    name: 'music.mp3',
    type: 'audio',
    url: 'https://example.com/music.mp3',
    size: '3.4MB',
    date: '2023-05-12 11:10'
  },
  {
    id: 6,
    name: 'logo.png',
    type: 'image',
    url: 'https://via.placeholder.com/300x200',
    size: '45KB',
    date: '2023-05-10 08:30'
  }
]);

// 处理分页变化
const handleSizeChange = (val) => {
  pageSize.value = val;
  // 通常这里会调用API重新获取数据
};

const handleCurrentChange = (val) => {
  currentPage.value = val;
  // 通常这里会调用API重新获取数据
};

// 刷新列表
const refreshList = () => {
  ElMessage.success('刷新成功');
  // 通常这里会调用API重新获取数据
};

// 复制URL
const copyUrl = (item) => {
  navigator.clipboard.writeText(item.url)
    .then(() => {
      ElMessage.success('文件链接已复制到剪贴板');
    })
    .catch(() => {
      ElMessage.error('复制失败，请手动复制');
    });
};

// 删除媒体
const handleDelete = (item) => {
  ElMessage.success(`${item.name} 已删除`);
  // 通常这里会调用API删除文件
  mediaList.value = mediaList.value.filter(i => i.id !== item.id);
};

// 上传相关方法
const handleUpload = () => {
  uploadDialogVisible.value = true;
};

const handleFileChange = (file) => {
  fileList.value.push(file);
};

const submitUpload = () => {
  // 通常这里会调用API上传文件
  ElMessage.success('文件上传成功');
  uploadDialogVisible.value = false;
  fileList.value = [];
};
</script>

<style lang="scss" scoped>
.media-management {
  padding: 20px;
}

.page-title {
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: 600;
}

.media-card {
  margin-bottom: 20px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-section {
  display: flex;
  gap: 10px;
  width: 50%;
}

.view-controls {
  margin-bottom: 20px;
  text-align: right;
}

.media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.media-item {
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }
}

.media-preview {
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 10px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .video-preview, .document-preview, .audio-preview {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;

    .el-icon {
      font-size: 40px;
      color: #909399;
    }
  }
}

.media-info {
  padding: 5px 0;
}

.media-name {
  font-weight: 500;
  margin-bottom: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.media-meta {
  font-size: 12px;
  color: #909399;
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.media-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.list-preview {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
}

.list-icon {
  font-size: 30px;
  color: #909399;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.upload-area {
  width: 100%;
}

.upload-icon {
  font-size: 60px;
  color: #c0c4cc;
  margin-bottom: 10px;
}

.upload-text {
  font-size: 16px;
  color: #606266;
  margin-bottom: 5px;

  em {
    color: #409eff;
    font-style: normal;
  }
}

.upload-tip {
  font-size: 12px;
  color: #909399;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style> 