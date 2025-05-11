<template>
  <div class="content-management">
    <h1 class="page-title">内容管理</h1>
    
    <!-- 标签页导航 -->
    <el-tabs v-model="activeTab" class="content-tabs">
      <el-tab-pane label="内容列表" name="list">
        <!-- 内容列表页 -->
        <el-card shadow="never" class="content-card">
          <!-- 搜索栏 -->
          <div class="search-section">
            <el-form :inline="true" :model="searchForm" class="search-form">
              <el-form-item label="内容标题">
                <el-input v-model="searchForm.title" placeholder="请输入内容标题" clearable />
              </el-form-item>
              <el-form-item label="内容分类">
                <el-select v-model="searchForm.category" placeholder="全部" clearable>
                  <el-option v-for="cat in categories" :key="cat.id" :label="cat.name" :value="cat.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="内容状态">
                <el-select v-model="searchForm.status" placeholder="全部" clearable>
                  <el-option label="已发布" value="published" />
                  <el-option label="草稿" value="draft" />
                  <el-option label="待审核" value="pending" />
                </el-select>
              </el-form-item>
              <el-form-item label="创建日期">
                <el-date-picker
                  v-model="searchForm.createDate"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
              <el-form-item label="作者">
                <el-input v-model="searchForm.author" placeholder="请输入作者" clearable />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleSearch">查询</el-button>
                <el-button @click="resetSearch">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
          
          <!-- 操作按钮行 -->
          <div class="action-row">
            <el-button type="primary" @click="handleAdd">添加内容</el-button>
            <el-button type="danger" :disabled="!hasSelection" @click="handleBatchDelete">批量删除</el-button>
            <el-button type="info" @click="viewLogs">
              <el-icon><Document /></el-icon> 查看日志
            </el-button>
          </div>
          
          <!-- 内容表格 -->
          <el-table
            ref="contentTable"
            v-loading="loading"
            :data="contentList"
            @selection-change="handleSelectionChange"
            border
            style="width: 100%">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column label="缩略图" width="100">
              <template #default="{ row }">
                <el-image 
                  :src="row.thumbnail" 
                  :preview-src-list="[row.thumbnail]"
                  fit="cover"
                  style="width: 60px; height: 60px; border-radius: 4px;"
                />
              </template>
            </el-table-column>
            <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />
            <el-table-column prop="category" label="分类" width="120" />
            <el-table-column prop="author" label="作者" width="120" />
            <el-table-column label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="publishTime" label="发布时间" width="180" />
            <el-table-column prop="views" label="浏览量" width="100" />
            <el-table-column label="操作" width="280">
              <template #default="{ row }">
                <el-button type="info" size="small" @click="handleView(row)">查看</el-button>
                <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
                <el-button 
                  v-if="row.status !== 'published'" 
                  type="success" 
                  size="small" 
                  @click="handlePublish(row)">发布</el-button>
                <el-button 
                  v-if="row.status === 'published'" 
                  type="warning" 
                  size="small" 
                  @click="handleUnpublish(row)">下架</el-button>
                <el-button type="info" size="small" @click="handleCopy(row)">复制</el-button>
                <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          
          <!-- 分页 -->
          <div class="pagination-container">
            <el-pagination
              v-model:current-page="pagination.currentPage"
              v-model:page-size="pagination.pageSize"
              :page-sizes="[10, 20, 50, 100]"
              :total="pagination.total"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </el-card>
      </el-tab-pane>
      
      <el-tab-pane v-for="tab in openTabs" :key="tab.id" :label="tab.title" :name="tab.id" :closable="true">
        <el-card shadow="never" class="content-form-card">
          <el-form :model="tab.form" :rules="formRules" ref="contentForm" label-width="100px">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="标题" prop="title">
                  <el-input v-model="tab.form.title" placeholder="请输入内容标题" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="分类" prop="category">
                  <el-select v-model="tab.form.category" placeholder="请选择分类" style="width: 100%">
                    <el-option v-for="cat in categories" :key="cat.id" :label="cat.name" :value="cat.id" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            
            <el-form-item label="缩略图">
              <el-upload
                action="#"
                list-type="picture-card"
                :auto-upload="false"
                :limit="1"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-change="handleFileChange">
                <el-icon><Plus /></el-icon>
              </el-upload>
              <el-dialog v-model="previewVisible">
                <img w-full :src="previewImage" alt="预览图">
              </el-dialog>
            </el-form-item>
            
            <el-form-item label="内容" prop="content">
              <div class="editor-container">
                <div class="editor-toolbar">
                  <el-button-group>
                    <el-button size="small"><el-icon><Edit /></el-icon></el-button>
                    <el-button size="small"><el-icon><Share /></el-icon></el-button>
                    <el-button size="small"><el-icon><Document /></el-icon></el-button>
                    <el-button size="small"><el-icon><List /></el-icon></el-button>
                  </el-button-group>
                  <el-button-group>
                    <el-button size="small"><el-icon><Link /></el-icon></el-button>
                    <el-button size="small"><el-icon><PictureFilled /></el-icon></el-button>
                    <el-button size="small"><el-icon><VideoCamera /></el-icon></el-button>
                    <el-button size="small"><el-icon><Operation /></el-icon></el-button>
                  </el-button-group>
                </div>
                <el-input
                  v-model="tab.form.content"
                  type="textarea"
                  :rows="10"
                  placeholder="在此处输入文章内容..."
                />
              </div>
            </el-form-item>
            
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="标签">
                  <el-select
                    v-model="tab.form.tags"
                    multiple
                    filterable
                    allow-create
                    default-first-option
                    placeholder="请输入标签"
                    style="width: 100%">
                    <el-option
                      v-for="tag in tags"
                      :key="tag"
                      :label="tag"
                      :value="tag">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="状态">
                  <el-radio-group v-model="tab.form.status">
                    <el-radio :value="'published'" label="发布">发布</el-radio>
                    <el-radio :value="'draft'" label="保存为草稿">保存为草稿</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            
            <div class="form-actions">
              <el-button @click="closeTab(tab.id)">取消</el-button>
              <el-button type="primary" @click="saveContent(tab)">保存</el-button>
            </div>
          </el-form>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { 
  Plus, Edit, Link, PictureFilled, VideoCamera, 
  Operation, Document, List, Share
} from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 标签页状态
const activeTab = ref('list');
const openTabs = ref([]);
const nextTabId = ref(1);

// 监听标签页切换，防止aria-hidden访问性问题
watch(activeTab, () => {
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

// 表单校验规则
const formRules = {
  title: [
    { required: true, message: '请输入内容标题', trigger: 'blur' },
    { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择内容分类', trigger: 'change' }
  ],
  content: [
    { required: true, message: '请输入内容', trigger: 'blur' }
  ]
};

// 搜索表单
const searchForm = ref({
  title: '',
  category: '',
  status: '',
  createDate: null,
  author: ''
});

// 预览图片
const previewVisible = ref(false);
const previewImage = ref('');

// 分页配置
const pagination = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0
});

// 表格相关
const contentTable = ref(null);
const loading = ref(false);
const selectedItems = ref([]);

// 示例数据
const categories = ref([
  { id: 'news', name: '新闻' },
  { id: 'announcement', name: '公告' },
  { id: 'article', name: '文章' },
  { id: 'event', name: '活动' }
]);

const tags = ref(['设计', '开发', '营销', 'iOS', 'Vue3', '后台']);

const contentList = ref([
  { 
    id: 1, 
    title: 'iOS设计风格探讨', 
    thumbnail: 'https://via.placeholder.com/100',
    category: '新闻', 
    author: '张小明', 
    status: 'published', 
    publishTime: '2023-06-01 10:30:00',
    views: 1524,
    content: '这是文章内容...',
    tags: ['设计', 'iOS']
  },
  { 
    id: 2, 
    title: 'Vue3与Element Plus结合使用指南', 
    thumbnail: 'https://via.placeholder.com/100',
    category: '文章', 
    author: '李四', 
    status: 'published', 
    publishTime: '2023-05-28 16:45:00',
    views: 982,
    content: '这是文章内容...',
    tags: ['Vue3', '开发']
  },
  { 
    id: 3, 
    title: '响应式设计最佳实践', 
    thumbnail: 'https://via.placeholder.com/100',
    category: '文章', 
    author: '王五', 
    status: 'draft', 
    publishTime: '',
    views: 0,
    content: '这是文章内容...',
    tags: ['设计', '开发']
  },
  { 
    id: 4, 
    title: '后台管理系统架构分析', 
    thumbnail: 'https://via.placeholder.com/100',
    category: '文章', 
    author: '赵六', 
    status: 'pending', 
    publishTime: '',
    views: 0,
    content: '这是文章内容...',
    tags: ['架构', '后台']
  },
  { 
    id: 5, 
    title: '即将举办的技术峰会', 
    thumbnail: 'https://via.placeholder.com/100',
    category: '活动', 
    author: '张小明', 
    status: 'published', 
    publishTime: '2023-05-15 09:20:00',
    views: 326,
    content: '这是文章内容...',
    tags: ['活动', '技术']
  }
]);

// 计算属性
const hasSelection = computed(() => selectedItems.value.length > 0);

// 生命周期钩子
onMounted(() => {
  // 通常这里会从API获取数据
  pagination.value.total = contentList.value.length;
});

// 方法定义
const handleSearch = () => {
  loading.value = true;
  // 这里应该调用API获取数据
  setTimeout(() => {
    loading.value = false;
    // 假设数据已经获取并更新
    ElMessage.success('搜索完成');
  }, 500);
};

const resetSearch = () => {
  searchForm.value = {
    title: '',
    category: '',
    status: '',
    createDate: null,
    author: ''
  };
  handleSearch();
};

const handleSelectionChange = (selection) => {
  selectedItems.value = selection;
};

const handleSizeChange = (val) => {
  pagination.value.pageSize = val;
  pagination.value.currentPage = 1;
  handleSearch();
};

const handleCurrentChange = (val) => {
  pagination.value.currentPage = val;
  handleSearch();
};

// 内容操作方法
const handleView = (row) => {
  window.open(`/content/view/${row.id}`, '_blank');
};

const handleAdd = () => {
  const tabId = `new_${nextTabId.value++}`;
  openTabs.value.push({
    id: tabId,
    title: '新建内容',
    form: {
      title: '',
      category: '',
      thumbnail: '',
      content: '',
      tags: [],
      status: 'draft'
    }
  });
  activeTab.value = tabId;
};

const handleEdit = (row) => {
  const tabId = `edit_${row.id}`;
  // 检查标签页是否已经打开
  const existingTab = openTabs.value.find(tab => tab.id === tabId);
  if (existingTab) {
    activeTab.value = tabId;
    return;
  }
  
  // 创建新标签页
  openTabs.value.push({
    id: tabId,
    title: `编辑: ${row.title}`,
    form: { ...row } // 复制一份数据
  });
  activeTab.value = tabId;
};

const closeTab = (tabId) => {
  const index = openTabs.value.findIndex(tab => tab.id === tabId);
  if (index !== -1) {
    openTabs.value.splice(index, 1);
    // 如果关闭的是当前标签页，切换到内容列表
    if (activeTab.value === tabId) {
      activeTab.value = openTabs.value.length > 0 ? openTabs.value[openTabs.value.length - 1].id : 'list';
    }
  }
};

const saveContent = (tab) => {
  // 这里应该调用API保存数据
  ElMessage.success('内容保存成功');
  closeTab(tab.id);
};

const handlePublish = (row) => {
  ElMessageBox.confirm(`确定要发布《${row.title}》吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info'
  }).then(() => {
    // 这里应该调用API发布内容
    row.status = 'published';
    row.publishTime = new Date().toLocaleString();
    ElMessage.success('内容已发布');
  }).catch(() => {});
};

const handleUnpublish = (row) => {
  ElMessageBox.confirm(`确定要下架《${row.title}》吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 这里应该调用API下架内容
    row.status = 'draft';
    ElMessage.success('内容已下架');
  }).catch(() => {});
};

const handleCopy = (row) => {
  const newContent = { ...row };
  newContent.id = Date.now();
  newContent.title = `${newContent.title} (复制)`;
  newContent.status = 'draft';
  newContent.publishTime = '';
  newContent.views = 0;
  
  // 这里应该调用API创建复制内容
  contentList.value.unshift(newContent);
  pagination.value.total++;
  ElMessage.success('内容已复制');
};

const handleDelete = (row) => {
  ElMessageBox.confirm(`确定要删除《${row.title}》吗？此操作不可逆。`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 这里应该调用API删除内容
    const index = contentList.value.findIndex(item => item.id === row.id);
    if (index !== -1) {
      contentList.value.splice(index, 1);
      pagination.value.total--;
      updatePaginationAfterDelete();
      ElMessage.success('内容已删除');
    }
  }).catch(() => {});
};

const handleBatchDelete = () => {
  if (selectedItems.value.length === 0) return;
  
  const itemNames = selectedItems.value.map(item => item.title).join('、');
  ElMessageBox.confirm(`确定要删除以下内容吗？此操作不可逆。<br/>${itemNames}`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    dangerouslyUseHTMLString: true
  }).then(() => {
    // 这里应该调用API批量删除内容
    const selectedIds = selectedItems.value.map(item => item.id);
    contentList.value = contentList.value.filter(item => !selectedIds.includes(item.id));
    pagination.value.total -= selectedIds.length;
    updatePaginationAfterDelete();
    ElMessage.success('所选内容已删除');
  }).catch(() => {});
};

const updatePaginationAfterDelete = () => {
  // 如果当前页没有数据了，且不是第一页，则回到上一页
  const maxPage = Math.ceil(pagination.value.total / pagination.value.pageSize);
  if (pagination.value.currentPage > maxPage && pagination.value.currentPage > 1) {
    pagination.value.currentPage = maxPage;
    handleSearch();
  }
};

// 上传相关方法
const handleRemove = (file) => {
  console.log(file);
};

const handlePreview = (file) => {
  previewImage.value = file.url;
  previewVisible.value = true;
};

const handleFileChange = (file) => {
  console.log(file);
};

// 状态相关方法
const getStatusType = (status) => {
  switch (status) {
    case 'published': return 'success';
    case 'draft': return 'info';
    case 'pending': return 'warning';
    default: return 'info';
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'published': return '已发布';
    case 'draft': return '草稿';
    case 'pending': return '待审核';
    default: return '未知';
  }
};

// 查看内容操作日志
const viewLogs = () => {
  router.push({
    path: '/log-record',
    query: { type: 'content' }
  });
};
</script>

<style lang="scss" scoped>
.content-management {
  padding: 20px;
}

.page-title {
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: 600;
}

.content-card {
  margin-bottom: 20px;
}

.search-section {
  margin-bottom: 20px;
}

.action-row {
  margin-bottom: 16px;
  display: flex;
  gap: 10px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.content-form-card {
  margin-top: 16px;
}

.editor-container {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
}

.editor-toolbar {
  display: flex;
  padding: 8px;
  border-bottom: 1px solid #dcdfe6;
  background-color: #f5f7fa;
  gap: 8px;
}

.form-actions {
  margin-top: 20px;
  text-align: right;
}
</style> 