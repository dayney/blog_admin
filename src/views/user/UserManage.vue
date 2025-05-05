<template>
  <div class="user-manage">
    <!-- 搜索区域卡片 -->
    <div class="content-box search-container">
      <el-form :model="searchForm" label-width="80px" class="search-form" @keyup.enter="handleSearch" @submit.prevent>
        <!-- 基础搜索条件行，不管多少项都流式水平布局 -->
        <div class="search-row">
          <el-form-item label="用户名">
            <el-input v-model="searchForm.username" placeholder="请输入用户名" class="search-item-normal" clearable />
          </el-form-item>
          <el-form-item label="昵称">
            <el-input v-model="searchForm.nickname" placeholder="请输入昵称" class="search-item-normal" clearable />
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="searchForm.phone" placeholder="请输入手机号" class="search-item-normal" clearable />
          </el-form-item>
          
          <!-- 展开/收起按钮直接跟在第一行条件后面 -->
          <div class="inline-expand" v-if="hasMoreConditions">
            <a class="expand-text" @click="toggleExpand">
              {{ isShowMore ? '收起' : '展开' }}
              <el-icon v-if="isShowMore"><ArrowUp /></el-icon>
              <el-icon v-else><ArrowDown /></el-icon>
            </a>
          </div>
          
          <!-- 查询/重置按钮始终在最右侧 -->
          <div class="search-btns">
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="handleReset">重置</el-button>
          </div>
        </div>
        
        <!-- 展开的高级搜索条件行 -->
        <div class="search-row extra-row" v-if="isShowMore">
          <el-form-item label="邮箱">
            <el-input v-model="searchForm.email" placeholder="请输入邮箱" class="search-item-normal" clearable />
          </el-form-item>
          <el-form-item label="注册时间">
            <el-date-picker
              v-model="searchForm.registerTime"
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
      <div class="toolbar">
        <el-button type="primary" @click="openAddDialog">添加用户</el-button>
        <el-button type="danger" :disabled="!multipleSelection.length" @click="handleBatchDelete">批量删除</el-button>
      </div>
      
      <el-table :data="userList" border style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="avatar" label="头像" width="70">
          <template #default="scope">
            <el-avatar :src="scope.row.avatar" icon="el-icon-user" />
          </template>
        </el-table-column>
        <el-table-column prop="username" label="账号" width="120" />
        <el-table-column prop="nickname" label="姓名" width="120" />
        <el-table-column prop="balance" label="余额" width="100">
          <template #default="scope">
            <span style="color: red">{{ scope.row.balance.toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="points" label="积分" width="80" />
        <el-table-column prop="register_ip" label="注册IP" width="150" />
        <el-table-column prop="created_at" label="注册时间" width="*" />
        <el-table-column prop="status" label="状态" width="90">
          <template #default="scope">
            <el-tag :type="scope.row.status === 0 ? 'success' : 'info'">
              {{ statusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button size="small" @click="openEditDialog(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
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
          @current-change="fetchUsers"
        />
      </div>
    </div>

    <!-- 新增/编辑用户弹窗 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="头像" prop="avatar">
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
          >
            <img v-if="form.avatar" :src="form.avatar" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="账号" prop="username">
          <el-input v-model="form.username" autocomplete="off" :disabled="!!form.id" />
        </el-form-item>
        <el-form-item label="姓名" prop="nickname">
          <el-input v-model="form.nickname" autocomplete="off" :disabled="!!form.id" />
        </el-form-item>
        <el-form-item label="余额" prop="balance">
          <el-input-number v-model="form.balance" :min="0" :step="0.01" />
        </el-form-item>
        <el-form-item label="积分" prop="points">
          <el-input-number v-model="form.points" :min="0" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" autocomplete="off" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" autocomplete="off" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status">
            <el-option label="正常" :value="0" />
            <el-option label="禁用" :value="1" />
            <el-option label="待审核" :value="2" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue';

// 模拟用户数据 - 20条记录
const mockUsers = [
  { id: 1, avatar: 'https://randomuser.me/api/portraits/men/1.jpg', username: 'admin', nickname: '管理员', balance: 9999.99, points: 9999, register_ip: '127.0.0.1', created_at: '2023-12-01 08:30:15', status: 0, email: 'admin@example.com', phone: '13800000001' },
  { id: 2, avatar: 'https://randomuser.me/api/portraits/women/2.jpg', username: 'editor', nickname: '编辑', balance: 8888.88, points: 8000, register_ip: '192.168.1.100', created_at: '2023-12-10 10:15:30', status: 0, email: 'editor@example.com', phone: '13800000002' },
  { id: 3, avatar: 'https://randomuser.me/api/portraits/men/3.jpg', username: 'user1', nickname: '张三', balance: 350.50, points: 120, register_ip: '221.226.118.126', created_at: '2024-01-05 14:20:45', status: 0, email: 'user1@example.com', phone: '13800000003' },
  { id: 4, avatar: 'https://randomuser.me/api/portraits/women/4.jpg', username: 'user2', nickname: '李四', balance: 850.00, points: 230, register_ip: '117.136.79.101', created_at: '2024-01-08 16:45:22', status: 0, email: 'user2@example.com', phone: '13800000004' },
  { id: 5, avatar: 'https://randomuser.me/api/portraits/men/5.jpg', username: 'user3', nickname: '王五', balance: 0.00, points: 50, register_ip: '114.254.96.85', created_at: '2024-01-10 09:10:18', status: 1, email: 'user3@example.com', phone: '13800000005' },
  { id: 6, avatar: 'https://randomuser.me/api/portraits/women/6.jpg', username: 'user4', nickname: '赵六', balance: 1500.75, points: 350, register_ip: '112.10.212.230', created_at: '2024-01-15 11:30:40', status: 0, email: 'user4@example.com', phone: '13800000006' },
  { id: 7, avatar: 'https://randomuser.me/api/portraits/men/7.jpg', username: 'user5', nickname: '钱七', balance: 200.25, points: 80, register_ip: '116.30.4.119', created_at: '2024-01-18 13:25:12', status: 0, email: 'user5@example.com', phone: '13800000007' },
  { id: 8, avatar: 'https://randomuser.me/api/portraits/women/8.jpg', username: 'user6', nickname: '孙八', balance: 0.00, points: 10, register_ip: '58.60.9.168', created_at: '2024-01-20 15:45:36', status: 2, email: 'user6@example.com', phone: '13800000008' },
  { id: 9, avatar: 'https://randomuser.me/api/portraits/men/9.jpg', username: 'user7', nickname: '周九', balance: 650.00, points: 180, register_ip: '123.116.77.92', created_at: '2024-01-25 17:20:48', status: 0, email: 'user7@example.com', phone: '13800000009' },
  { id: 10, avatar: 'https://randomuser.me/api/portraits/women/10.jpg', username: 'user8', nickname: '吴十', balance: 300.50, points: 90, register_ip: '113.140.11.126', created_at: '2024-02-01 08:55:33', status: 0, email: 'user8@example.com', phone: '13800000010' },
  { id: 11, avatar: 'https://randomuser.me/api/portraits/men/11.jpg', username: 'user9', nickname: '郑十一', balance: 0.00, points: 0, register_ip: '223.104.63.139', created_at: '2024-02-05 10:40:15', status: 1, email: 'user9@example.com', phone: '13800000011' },
  { id: 12, avatar: 'https://randomuser.me/api/portraits/women/12.jpg', username: 'user10', nickname: '王十二', balance: 1200.80, points: 420, register_ip: '27.17.65.88', created_at: '2024-02-10 12:15:28', status: 0, email: 'user10@example.com', phone: '13800000012' },
  { id: 13, avatar: 'https://randomuser.me/api/portraits/men/13.jpg', username: 'user11', nickname: '张十三', balance: 450.30, points: 135, register_ip: '183.94.200.54', created_at: '2024-02-15 14:30:42', status: 0, email: 'user11@example.com', phone: '13800000013' },
  { id: 14, avatar: 'https://randomuser.me/api/portraits/women/14.jpg', username: 'user12', nickname: '李十四', balance: 800.00, points: 260, register_ip: '183.14.31.167', created_at: '2024-02-20 16:50:19', status: 0, email: 'user12@example.com', phone: '13800000014' },
  { id: 15, avatar: 'https://randomuser.me/api/portraits/men/15.jpg', username: 'user13', nickname: '刘十五', balance: 0.00, points: 30, register_ip: '101.24.128.110', created_at: '2024-02-25 18:20:53', status: 2, email: 'user13@example.com', phone: '13800000015' },
  { id: 16, avatar: 'https://randomuser.me/api/portraits/women/16.jpg', username: 'user14', nickname: '陈十六', balance: 950.45, points: 300, register_ip: '114.99.211.21', created_at: '2024-03-01 09:05:31', status: 0, email: 'user14@example.com', phone: '13800000016' },
  { id: 17, avatar: 'https://randomuser.me/api/portraits/men/17.jpg', username: 'user15', nickname: '杨十七', balance: 250.20, points: 85, register_ip: '111.20.155.196', created_at: '2024-03-05 11:35:24', status: 0, email: 'user15@example.com', phone: '13800000017' },
  { id: 18, avatar: 'https://randomuser.me/api/portraits/women/18.jpg', username: 'user16', nickname: '赵十八', balance: 0.00, points: 5, register_ip: '183.216.176.84', created_at: '2024-03-10 13:45:16', status: 1, email: 'user16@example.com', phone: '13800000018' },
  { id: 19, avatar: 'https://randomuser.me/api/portraits/men/19.jpg', username: 'user17', nickname: '钱十九', balance: 600.75, points: 170, register_ip: '117.136.45.171', created_at: '2024-03-15 15:25:47', status: 0, email: 'user17@example.com', phone: '13800000019' },
  { id: 20, avatar: 'https://randomuser.me/api/portraits/women/20.jpg', username: 'user18', nickname: '孙二十', balance: 320.30, points: 110, register_ip: '120.230.139.76', created_at: '2024-03-20 17:55:39', status: 0, email: 'user18@example.com', phone: '13800000020' }
];

const userList = ref([]);
const total = ref(0);
const page = ref(1);
const pageSize = ref(10);
const multipleSelection = ref([]);
const isShowMore = ref(false); // 控制筛选条件是否展开

const dialogVisible = ref(false);
const dialogTitle = ref('');
const form = reactive({
  id: null,
  avatar: '',
  username: '',
  nickname: '',
  balance: 0,
  points: 0,
  email: '',
  phone: '',
  status: 0
});
const rules = {
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  nickname: [{ required: true, message: '请输入姓名', trigger: 'blur' }]
};
const formRef = ref();

// 搜索表单
const searchForm = reactive({
  username: '',
  nickname: '',
  phone: '',
  email: '',
  registerTime: [] // [start, end]
});

// 判断是否有更多搜索条件（控制展开/收起按钮的显示）
const hasMoreConditions = computed(() => {
  // 如果有注册时间等更多条件，则返回true
  return true; // 当前示例固定为true，实际可根据条件动态判断
});

// 过滤后的用户数据
const filteredUsers = computed(() => {
  return mockUsers.filter(user => {
    // 用户名
    if (searchForm.username && !user.username.toLowerCase().includes(searchForm.username.toLowerCase())) {
      return false;
    }
    // 昵称
    if (searchForm.nickname && !user.nickname.toLowerCase().includes(searchForm.nickname.toLowerCase())) {
      return false;
    }
    // 手机号
    if (searchForm.phone && !user.phone.includes(searchForm.phone)) {
      return false;
    }
    // 邮箱
    if (searchForm.email && !user.email.toLowerCase().includes(searchForm.email.toLowerCase())) {
      return false;
    }
    // 注册时间
    if (searchForm.registerTime && searchForm.registerTime.length === 2) {
      const start = new Date(searchForm.registerTime[0]);
      const end = new Date(searchForm.registerTime[1]);
      const created = new Date(user.created_at);
      if (created < start || created > end) {
        return false;
      }
    }
    return true;
  });
});

function statusText(status) {
  switch (status) {
    case 0: return '正常';
    case 1: return '禁用';
    case 2: return '待审核';
    default: return '未知';
  }
}

// 获取用户列表数据(实现分页)
function fetchUsers() {
  // 计算分页
  const startIndex = (page.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  
  // 从过滤后的数据中获取当前页数据
  userList.value = filteredUsers.value.slice(startIndex, endIndex);
  
  // 更新总条数
  total.value = filteredUsers.value.length;
}

function openAddDialog() {
  dialogTitle.value = '添加用户';
  Object.assign(form, { id: null, avatar: '', username: '', nickname: '', balance: 0, points: 0, email: '', phone: '', status: 0 });
  dialogVisible.value = true;
}

function openEditDialog(row) {
  dialogTitle.value = '编辑用户';
  Object.assign(form, row);
  dialogVisible.value = true;
}

function handleSubmit() {
  // 模拟提交表单，新增或修改用户
  if (form.id) {
    // 编辑现有用户
    const index = mockUsers.findIndex(user => user.id === form.id);
    if (index !== -1) {
      mockUsers[index] = { ...form };
    }
  } else {
    // 添加新用户
    const newId = Math.max(...mockUsers.map(user => user.id)) + 1;
    mockUsers.push({
      ...form,
      id: newId,
      created_at: new Date().toLocaleString('zh-CN'),
      register_ip: '127.0.0.1'
    });
  }
  
  dialogVisible.value = false;
  ElMessage.success('操作成功');
  fetchUsers();
}

function handleDelete(row) {
  ElMessageBox.confirm('确定要删除该用户吗？', '提示', { type: 'warning' })
    .then(() => {
      // 模拟删除用户
      const index = mockUsers.findIndex(user => user.id === row.id);
      if (index !== -1) {
        mockUsers.splice(index, 1);
      }
      ElMessage.success('删除成功');
      fetchUsers();
    });
}

function handleBatchDelete() {
  ElMessageBox.confirm('确定要批量删除选中的用户吗？', '提示', { type: 'warning' })
    .then(() => {
      // 模拟批量删除
      const selectedIds = multipleSelection.value.map(item => item.id);
      for (let i = mockUsers.length - 1; i >= 0; i--) {
        if (selectedIds.includes(mockUsers[i].id)) {
          mockUsers.splice(i, 1);
        }
      }
      ElMessage.success('批量删除成功');
      fetchUsers();
    });
}

function handleSelectionChange(val) {
  multipleSelection.value = val;
}

function handleAvatarSuccess(res, file) {
  form.avatar = URL.createObjectURL(file.raw);
}

function handleSearch() {
  page.value = 1;
  fetchUsers();
}

function handleReset() {
  searchForm.username = '';
  searchForm.nickname = '';
  searchForm.phone = '';
  searchForm.email = '';
  searchForm.registerTime = [];
  handleSearch();
}

function handleSizeChange(size) {
  pageSize.value = size;
  page.value = 1;
  fetchUsers();
}

// 切换展开/收起状态
function toggleExpand() {
  isShowMore.value = !isShowMore.value;
}

// 日期变更处理函数
function handleDateChange() {
  handleSearch();
}

// 监听搜索条件变化
watch(
  () => [
    searchForm.username,
    searchForm.nickname,
    searchForm.phone,
    searchForm.email
  ],
  () => {
    // 可选: 在这里可以添加自动搜索逻辑
    // 如果希望用户输入后自动触发搜索，取消下方的注释
    // handleSearch();
  },
  { deep: true }
);

onMounted(() => {
  fetchUsers();
});
</script>

<style scoped>
.user-manage {
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
.inline-expand {
  margin-left: 16px;
  margin-right: auto;
  height: 36px;
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
.search-btns {
  margin-left: auto;
  display: flex;
  gap: 8px;
  white-space: nowrap;
}
/* 普通搜索项占1份宽度 */
.search-item-normal {
  width: 220px;
}
/* 区间搜索项占2份宽度 */
.search-item-wide {
  width: 440px;
}
.toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}
.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  line-height: 80px;
  text-align: center;
}
.avatar {
  width: 80px;
  height: 80px;
  display: block;
  border-radius: 50%;
}
</style> 