<template>
  <div class="log-record">
    <!-- 搜索区域卡片 -->
    <div class="content-box search-container">
      <div class="header-section">
        <h3 class="page-title">{{ getModuleTitle }}</h3>
        <span class="description">记录{{ getModuleTitle }}的所有操作记录</span>
        <!-- 返回按钮 -->
        <el-button class="back-btn" @click="goBack">
          <el-icon><ArrowLeft /></el-icon>
          返回
        </el-button>
      </div>
      
      <!-- 搜索区域 -->
      <el-form :model="searchForm" label-width="80px" class="search-form" @keyup.enter="handleSearch" @submit.prevent>
        <!-- 基础搜索条件行，不管多少项都流式水平布局 -->
        <div class="search-row">
          <el-form-item label="操作人">
            <el-input v-model="searchForm.operator" placeholder="请输入操作人" class="search-item-normal" clearable />
          </el-form-item>
          <el-form-item label="操作类型">
            <el-select v-model="searchForm.operationType" placeholder="请选择操作类型" clearable class="search-item-normal">
              <el-option label="查询" value="查询" />
              <el-option label="添加" value="添加" />
              <el-option label="修改" value="修改" />
              <el-option label="删除" value="删除" />
            </el-select>
          </el-form-item>
          <el-form-item label="客户端IP">
            <el-input v-model="searchForm.clientIp" placeholder="请输入客户端IP" class="search-item-normal" clearable />
          </el-form-item>
          
          <!-- 查询/重置按钮始终在最右侧 -->
          <div class="search-btns">
            <!-- 展开/收起按钮放在查询按钮左边 -->
            <div class="inline-expand" v-if="hasMoreConditions">
              <a class="expand-text" @click="toggleExpand">
                {{ isShowMore ? '收起' : '展开' }}
                <el-icon v-if="isShowMore"><ArrowUp /></el-icon>
                <el-icon v-else><ArrowDown /></el-icon>
              </a>
            </div>
            
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="handleReset">重置</el-button>
          </div>
        </div>
        
        <!-- 展开的高级搜索条件行 -->
        <div class="search-row extra-row" v-if="isShowMore">
          <el-form-item label="操作时间">
            <el-date-picker
              v-model="searchForm.timeRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              class="search-item-wide"
              value-format="YYYY-MM-DD"
              @change="handleDateChange"
            />
          </el-form-item>
        </div>
      </el-form>
    </div>
    
    <!-- 表格区域卡片 -->
    <div class="content-box">
      <el-table :data="logList" border style="width: 100%">
        <el-table-column prop="operationTime" label="操作时间" width="180" />
        <el-table-column prop="operator" label="操作者" width="120" />
        <el-table-column prop="module" label="模块" width="100" />
        <el-table-column prop="operationType" label="操作类型" width="100">
          <template #default="scope">
            <el-tag :type="getOperationTypeTag(scope.row.operationType)">
              {{ scope.row.operationType }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="clientIp" label="客户端IP" width="150" />
        <el-table-column prop="object" label="对象" width="120" />
        <el-table-column prop="details" label="修改详情" min-width="200" show-overflow-tooltip />
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="pageSize"
          v-model:current-page="page"
          v-model:page-size="pageSize"
          @size-change="handleSizeChange"
          @current-change="fetchLogs"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import { ArrowLeft, ArrowDown, ArrowUp } from '@element-plus/icons-vue';

// 路由
const router = useRouter();
const route = useRoute();

// 获取日志类型
const logType = computed(() => route.query.type || 'system');

// 根据日志类型获取标题
const getModuleTitle = computed(() => {
  const typeMap = {
    user: '用户操作日志',
    content: '内容操作日志',
    media: '媒体操作日志',
    system: '系统操作日志'
  };
  return typeMap[logType.value] || '操作日志';
});

// 返回对应列表页面
const goBack = () => {
  const typeUrlMap = {
    user: '/user/manage',
    content: '/content',
    media: '/media',
    system: '/dashboard'
  };
  router.push(typeUrlMap[logType.value] || '/dashboard');
};

// 根据类型获取模拟日志数据
const getMockLogs = (type) => {
  // 用户日志
  const userLogs = [
    { id: 1, operationTime: '2024-07-01 08:30:15', operator: '管理员', module: '用户', operationType: '查询', object: '用户列表', details: '查询用户列表，筛选条件: 状态=正常', clientIp: '127.0.0.1' },
    { id: 2, operationTime: '2024-07-01 09:15:30', operator: '管理员', module: '用户', operationType: '添加', object: '用户', details: '添加用户: username=user19, nickname=周新人', clientIp: '127.0.0.1' },
    { id: 3, operationTime: '2024-07-01 10:25:45', operator: '管理员', module: '用户', operationType: '修改', object: 'user19', details: '修改用户信息: nickname=周小新, balance=100.00', clientIp: '127.0.0.1' },
    { id: 4, operationTime: '2024-07-02 14:10:22', operator: '编辑', module: '用户', operationType: '查询', object: '用户资料', details: '查询用户资料: username=user10', clientIp: '192.168.1.100' },
    { id: 5, operationTime: '2024-07-02 15:30:18', operator: '编辑', module: '用户', operationType: '修改', object: 'user10', details: '修改用户积分: points=450', clientIp: '192.168.1.100' },
    { id: 6, operationTime: '2024-07-03 09:05:40', operator: '管理员', module: '用户', operationType: '删除', object: 'user19', details: '删除用户: username=user19', clientIp: '127.0.0.1' }
  ];
  
  // 内容日志
  const contentLogs = [
    { id: 1, operationTime: '2024-07-01 08:45:20', operator: '管理员', module: '内容', operationType: '查询', object: '内容列表', details: '查询内容列表，筛选条件: 状态=已发布', clientIp: '127.0.0.1' },
    { id: 2, operationTime: '2024-07-01 09:30:45', operator: '编辑', module: '内容', operationType: '添加', object: '内容', details: '添加文章: title=Vue3与Element Plus结合使用指南', clientIp: '192.168.1.100' },
    { id: 3, operationTime: '2024-07-01 11:15:10', operator: '编辑', module: '内容', operationType: '修改', object: '文章#2', details: '修改文章内容、添加标签: Vue3, Element Plus', clientIp: '192.168.1.100' },
    { id: 4, operationTime: '2024-07-02 10:25:30', operator: '管理员', module: '内容', operationType: '发布', object: '文章#2', details: '发布文章: title=Vue3与Element Plus结合使用指南', clientIp: '127.0.0.1' },
    { id: 5, operationTime: '2024-07-03 14:40:22', operator: '管理员', module: '内容', operationType: '查询', object: '内容统计', details: '查询内容统计数据: 总数=256, 已发布=198', clientIp: '127.0.0.1' },
    { id: 6, operationTime: '2024-07-05 16:20:15', operator: '编辑', module: '内容', operationType: '删除', object: '文章#5', details: '删除文章: title=即将举办的技术峰会', clientIp: '192.168.1.100' }
  ];
  
  // 媒体日志
  const mediaLogs = [
    { id: 1, operationTime: '2024-07-01 09:10:15', operator: '管理员', module: '媒体', operationType: '查询', object: '媒体列表', details: '查询媒体列表，筛选条件: 类型=图片', clientIp: '127.0.0.1' },
    { id: 2, operationTime: '2024-07-01 10:30:25', operator: '编辑', module: '媒体', operationType: '上传', object: '媒体', details: '上传图片: banner.jpg (156KB)', clientIp: '192.168.1.100' },
    { id: 3, operationTime: '2024-07-02 11:45:40', operator: '编辑', module: '媒体', operationType: '上传', object: '媒体', details: '上传视频: intro.mp4 (5.2MB)', clientIp: '192.168.1.100' },
    { id: 4, operationTime: '2024-07-03 13:20:10', operator: '管理员', module: '媒体', operationType: '删除', object: 'logo.png', details: '删除图片: logo.png (45KB)', clientIp: '127.0.0.1' },
    { id: 5, operationTime: '2024-07-04 15:05:30', operator: '管理员', module: '媒体', operationType: '查询', object: '媒体统计', details: '查询媒体统计: 总数=128, 图片=98, 视频=15, 文档=10, 音频=5', clientIp: '127.0.0.1' },
    { id: 6, operationTime: '2024-07-05 16:50:20', operator: '编辑', module: '媒体', operationType: '上传', object: '媒体', details: '上传文档: report.pdf (1.8MB)', clientIp: '192.168.1.100' }
  ];
  
  // 系统日志
  const systemLogs = [
    { id: 1, operationTime: '2024-07-01 00:15:10', operator: '系统', module: '系统', operationType: '备份', object: '数据库', details: '自动备份数据库: blog_db (25MB)', clientIp: '127.0.0.1' },
    { id: 2, operationTime: '2024-07-01 08:00:20', operator: '管理员', module: '系统', operationType: '配置', object: '缓存', details: '清除系统缓存: 数据缓存, 模板缓存', clientIp: '127.0.0.1' },
    { id: 3, operationTime: '2024-07-02 09:30:45', operator: '管理员', module: '系统', operationType: '配置', object: '站点设置', details: '修改站点信息: 站点名称=小兵CMS', clientIp: '127.0.0.1' },
    { id: 4, operationTime: '2024-07-03 12:10:30', operator: '管理员', module: '系统', operationType: '查询', object: '系统日志', details: '查询系统日志，筛选条件: 最近7天', clientIp: '127.0.0.1' },
    { id: 5, operationTime: '2024-07-04 14:25:15', operator: '系统', module: '系统', operationType: '安全', object: '登录', details: '检测到5次失败登录尝试，IP: 123.45.67.89', clientIp: '123.45.67.89' },
    { id: 6, operationTime: '2024-07-05 23:55:00', operator: '系统', module: '系统', operationType: '维护', object: '定时任务', details: '执行定时任务: 更新文章阅读量统计', clientIp: '127.0.0.1' }
  ];
  
  const typeMap = {
    user: userLogs,
    content: contentLogs,
    media: mediaLogs,
    system: systemLogs
  };
  
  return typeMap[type] || systemLogs;
};

const logList = ref([]);
const total = ref(0);
const page = ref(1);
const pageSize = ref(10);
const isShowMore = ref(false); // 控制筛选条件是否展开

// 搜索表单
const searchForm = reactive({
  operator: '',
  operationType: '',
  timeRange: [], // [start, end]
  clientIp: ''
});

// 是否有更多条件
const hasMoreConditions = computed(() => true);

// 获取操作类型对应的标签类型
const getOperationTypeTag = (type) => {
  const typeMap = {
    '查询': 'info',
    '添加': 'success',
    '修改': 'warning',
    '删除': 'danger',
    '发布': 'success',
    '上传': 'success',
    '配置': 'warning',
    '备份': 'info',
    '安全': 'danger',
    '维护': 'info'
  };
  return typeMap[type] || 'info';
};

// 过滤器：根据搜索条件过滤日志
const filterLogs = (logs) => {
  return logs.filter(log => {
    // 操作人
    if (searchForm.operator && !log.operator.includes(searchForm.operator)) {
      return false;
    }
    // 操作类型
    if (searchForm.operationType && log.operationType !== searchForm.operationType) {
      return false;
    }
    // 客户端IP
    if (searchForm.clientIp && !log.clientIp.includes(searchForm.clientIp)) {
      return false;
    }
    // 操作时间
    if (searchForm.timeRange && searchForm.timeRange.length === 2) {
      const start = new Date(searchForm.timeRange[0]);
      const end = new Date(searchForm.timeRange[1]);
      end.setHours(23, 59, 59); // 设置为当天结束时间
      const opTime = new Date(log.operationTime);
      if (opTime < start || opTime > end) {
        return false;
      }
    }
    return true;
  });
};

// 获取日志数据
const fetchLogs = () => {
  // 根据当前类型获取模拟数据
  const typedLogs = getMockLogs(logType.value);
  
  // 过滤数据
  const filteredLogs = filterLogs(typedLogs);
  
  // 分页
  const start = (page.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  logList.value = filteredLogs.slice(start, end);
  total.value = filteredLogs.length;
};

// 处理搜索
const handleSearch = () => {
  page.value = 1;
  fetchLogs();
};

// 重置搜索
const handleReset = () => {
  searchForm.operator = '';
  searchForm.operationType = '';
  searchForm.timeRange = [];
  searchForm.clientIp = '';
  page.value = 1;
  fetchLogs();
};

// 切换展开/收起状态
const toggleExpand = () => {
  isShowMore.value = !isShowMore.value;
};

// 处理分页大小变化
const handleSizeChange = (val) => {
  pageSize.value = val;
  fetchLogs();
};

// 处理日期变化
const handleDateChange = () => {
  handleSearch();
};

// 初始加载
onMounted(() => {
  fetchLogs();
});
</script>

<style lang="scss" scoped>
.log-record {
  padding: 24px;
  background: #f8f8f8;
  min-height: 100vh;
}

.content-box {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  padding: 24px;
  margin-bottom: 24px;
}

.header-section {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
  
  .page-title {
    font-size: 18px;
    font-weight: 500;
    margin: 0;
    margin-right: 15px;
  }
  
  .description {
    color: #909399;
    font-size: 14px;
    flex: 1;
  }
  
  .back-btn {
    margin-left: auto;
  }
}

.search-container {
  padding: 20px;
}

.search-form {
  width: 100%;
}

.search-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 0;
}

.extra-row {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px dashed #eee;
}

.search-btns {
  margin-left: auto;
  display: flex;
  gap: 8px;
  white-space: nowrap;
  align-items: center;
}

/* 普通搜索项占1份宽度 */
.search-item-normal {
  width: 220px;
}

/* 区间搜索项占2份宽度 */
.search-item-wide {
  width: 440px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

/* 修复表格圆角显示问题 */
:deep(.el-table) {
  border-radius: 4px;
  overflow: hidden;
}

/* 修复表头样式 */
:deep(.el-table__header) {
  th {
    background-color: #f5f7fa;
    color: #606266;
    font-weight: 500;
    padding: 12px 0;
    &:first-child {
      border-top-left-radius: 4px;
    }
    &:last-child {
      border-top-right-radius: 4px;
    }
  }
}

.inline-expand {
  margin-left: 16px;
  display: flex;
  align-items: center;
}

.expand-text {
  color: #1890ff;
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
}
</style> 