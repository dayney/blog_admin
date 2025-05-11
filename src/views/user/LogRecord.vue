<template>
  <div class="log-record">
    <!-- 标题和说明 -->
    <div class="content-box search-container">
      <div class="header-section">
        <h3 class="page-title">操作日志</h3>
        <span class="description">记录用户模块的所有操作记录</span>
        <!-- 返回按钮 -->
        <el-button class="back-btn" @click="goBack">
          <el-icon><ArrowLeft /></el-icon>
          返回
        </el-button>
      </div>
      
      <!-- 搜索区域 -->
      <el-form :model="searchForm" label-width="80px" class="search-form" @keyup.enter="handleSearch" @submit.prevent>
        <div class="search-row">
          <el-form-item label="操作人">
            <el-input v-model="searchForm.operator" placeholder="请输入操作人" class="search-item-normal" clearable />
          </el-form-item>
          <el-form-item label="操作类型">
            <el-select v-model="searchForm.type" placeholder="请选择操作类型" clearable class="search-item-normal">
              <el-option label="查询" value="查询" />
              <el-option label="添加" value="添加" />
              <el-option label="修改" value="修改" />
              <el-option label="删除" value="删除" />
            </el-select>
          </el-form-item>
          <el-form-item label="操作时间">
            <el-date-picker
              v-model="searchForm.timeRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              class="search-item-wide"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
          
          <!-- 查询/重置按钮 -->
          <div class="search-btns">
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="handleReset">重置</el-button>
          </div>
        </div>
      </el-form>
    </div>
    
    <!-- 表格区域 -->
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
        <el-table-column prop="object" label="对象" width="120" />
        <el-table-column prop="details" label="修改详情" />
        <el-table-column prop="clientIp" label="客户端IP" width="150" />
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
import { useRouter } from 'vue-router';
import { ArrowLeft } from '@element-plus/icons-vue';

// 路由
const router = useRouter();

// 返回个人信息页面
const goBack = () => {
  router.push('/user/profile');
};

// 模拟日志数据 - 14条记录
const mockLogs = [
  { id: 1, operationTime: '2024-07-01 08:30:15', operator: '管理员', module: '用户', operationType: '查询', object: '用户列表', details: '查询用户列表，筛选条件: 状态=正常', clientIp: '127.0.0.1' },
  { id: 2, operationTime: '2024-07-01 09:15:30', operator: '管理员', module: '用户', operationType: '添加', object: '用户', details: '添加用户: username=user19, nickname=周新人', clientIp: '127.0.0.1' },
  { id: 3, operationTime: '2024-07-01 10:25:45', operator: '管理员', module: '用户', operationType: '修改', object: 'user19', details: '修改用户信息: nickname=周小新, balance=100.00', clientIp: '127.0.0.1' },
  { id: 4, operationTime: '2024-07-02 14:10:22', operator: '编辑', module: '用户', operationType: '查询', object: '用户资料', details: '查询用户资料: username=user10', clientIp: '192.168.1.100' },
  { id: 5, operationTime: '2024-07-02 15:30:18', operator: '编辑', module: '用户', operationType: '修改', object: 'user10', details: '修改用户积分: points=450', clientIp: '192.168.1.100' },
  { id: 6, operationTime: '2024-07-03 09:05:40', operator: '管理员', module: '用户', operationType: '删除', object: 'user19', details: '删除用户: username=user19', clientIp: '127.0.0.1' },
  { id: 7, operationTime: '2024-07-03 11:20:35', operator: '管理员', module: '用户', operationType: '查询', object: '用户列表', details: '查询用户列表，筛选条件: 注册时间>2024-01-01', clientIp: '127.0.0.1' },
  { id: 8, operationTime: '2024-07-04 13:45:12', operator: '管理员', module: '用户', operationType: '添加', object: '用户', details: '添加用户: username=user20, nickname=林新人', clientIp: '127.0.0.1' },
  { id: 9, operationTime: '2024-07-04 16:30:28', operator: '编辑', module: '用户', operationType: '修改', object: 'user5', details: '修改用户状态: status=禁用', clientIp: '192.168.1.100' },
  { id: 10, operationTime: '2024-07-05 08:50:33', operator: '编辑', module: '用户', operationType: '修改', object: 'user5', details: '修改用户状态: status=正常', clientIp: '192.168.1.100' },
  { id: 11, operationTime: '2024-07-05 10:15:47', operator: '管理员', module: '用户', operationType: '查询', object: '用户统计', details: '查询用户统计数据', clientIp: '127.0.0.1' },
  { id: 12, operationTime: '2024-07-06 09:30:15', operator: '管理员', module: '用户', operationType: '修改', object: 'user20', details: '修改用户信息: phone=13800000021', clientIp: '127.0.0.1' },
  { id: 13, operationTime: '2024-07-06 14:20:38', operator: '编辑', module: '用户', operationType: '查询', object: '用户列表', details: '查询用户列表，筛选条件: nickname=李', clientIp: '192.168.1.100' },
  { id: 14, operationTime: '2024-07-07 11:05:22', operator: '管理员', module: '用户', operationType: '删除', object: 'user20', details: '删除用户: username=user20', clientIp: '127.0.0.1' }
];

const logList = ref([]);
const total = ref(0);
const page = ref(1);
const pageSize = ref(10);

// 搜索表单
const searchForm = reactive({
  operator: '',
  type: '',
  timeRange: [] // [start, end]
});

// 过滤后的日志数据
const filteredLogs = computed(() => {
  return mockLogs.filter(log => {
    // 操作人
    if (searchForm.operator && !log.operator.includes(searchForm.operator)) {
      return false;
    }
    // 操作类型
    if (searchForm.type && log.operationType !== searchForm.type) {
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
});

// 获取操作类型对应的标签类型
const getOperationTypeTag = (type) => {
  const typeMap = {
    '查询': 'info',
    '添加': 'success',
    '修改': 'warning',
    '删除': 'danger'
  };
  return typeMap[type] || 'info';
};

// 获取分页数据
const fetchLogs = () => {
  const start = (page.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  logList.value = filteredLogs.value.slice(start, end);
  total.value = filteredLogs.value.length;
};

// 页码大小变化
const handleSizeChange = (size) => {
  pageSize.value = size;
  fetchLogs();
};

// 搜索
const handleSearch = () => {
  page.value = 1;
  fetchLogs();
};

// 重置搜索
const handleReset = () => {
  // 重置搜索表单
  searchForm.operator = '';
  searchForm.type = '';
  searchForm.timeRange = [];
  // 重新查询数据
  page.value = 1;
  fetchLogs();
};

// 初始加载
onMounted(() => {
  fetchLogs();
});
</script>

<style lang="scss" scoped>
.log-record {
  padding: 15px;
  
  .content-box {
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    margin-bottom: 20px;
    padding: 20px;
    
    &.search-container {
      margin-bottom: 20px;
    }
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
  
  .search-form {
    .search-row {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      
      .el-form-item {
        margin-bottom: 15px;
        margin-right: 15px;
      }
      
      .search-item-normal {
        width: 200px;
      }
      
      .search-item-wide {
        width: 300px;
      }
    }
    
    .search-btns {
      display: flex;
      align-items: flex-start;
      margin-left: auto;
    }
  }
  
  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }

  // 修复表格圆角显示问题
  :deep(.el-table) {
    border-radius: 4px;
    overflow: hidden;
  }

  // 修复表头样式
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
}
</style> 