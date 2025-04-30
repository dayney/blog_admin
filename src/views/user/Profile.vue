<template>
  <div class="profile-outer-container">
    <div class="profile-container">
      <div class="profile-page">
        <!-- 顶部头像和用户信息 -->
        <div class="profile-header">
          <div class="user-info">
            <div class="avatar-container">
              <img v-if="userInfo.avatar" :src="userInfo.avatar" alt="用户头像" class="user-avatar" />
              <div v-else class="avatar-placeholder">{{ userInitial }}</div>
            </div>
            <div class="user-details">
              <h2 class="user-name">{{ userInfo.name }} <span class="user-id">({{ userInfo.employeeId }})</span></h2>
              <p class="user-login-info">
                <span>IP: {{ userInfo.lastLoginIp }}</span>
                <span class="divider">|</span>
                <span>登录: {{ userInfo.lastLoginTime }}</span>
                <span class="divider">|</span>
                <span>角色: {{ userInfo.role }}</span>
              </p>
            </div>
          </div>
          <div class="header-actions">
            <el-button type="primary" size="small" class="edit-btn" @click="toggleEditMode">{{ isEditing ? '取消' : '编辑' }}</el-button>
            <template v-if="isEditing">
              <el-button type="primary" size="small" class="save-btn" @click="saveUserInfo">保存</el-button>
              <el-button size="small" class="return-btn" @click="toggleEditMode">返回</el-button>
            </template>
            <el-dropdown trigger="click" v-else>
              <button class="more-btn">
                <div class="list-icon">
                  <span class="list-icon-line"></span>
                  <span class="list-icon-line"></span>
                  <span class="list-icon-line"></span>
                </div>
              </button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="toggleEditMode">
                    <i class="el-icon-edit"></i> 编辑
                  </el-dropdown-item>
                  <el-dropdown-item @click="showAvatarUpload">
                    <i class="el-icon-picture"></i> 设置个人头像
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <i class="el-icon-document"></i> 日志
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>

        <!-- 导航标签栏 -->
        <div class="nav-tabs">
          <div class="tab-item active">基本信息</div>
        </div>

        <!-- 主要内容区域 -->
        <div class="main-content">
          <!-- 左侧用户信息 -->
          <div class="left-sidebar">
            <!-- 头像区域 -->
            <div class="avatar-section">
              <div class="large-avatar">
                <img v-if="userInfo.avatar" :src="userInfo.avatar" alt="用户头像" class="avatar-img" />
                <div v-else class="avatar-placeholder-large">{{ userInitial }}</div>
              </div>
              
              <!-- 联系按钮 -->
              <div class="contact-icons">
                <div class="contact-icon-btn">
                  <div class="icon-chat"></div>
                </div>
                <div class="contact-icon-btn">
                  <div class="icon-message"></div>
                </div>
                <div class="contact-icon-btn">
                  <div class="icon-mail"></div>
                </div>
                <div class="contact-icon-btn">
                  <div class="icon-calendar"></div>
                </div>
              </div>
            </div>

            <!-- 用户信息列表 -->
            <div class="user-meta-list">
              <div class="meta-item">
                <div class="meta-label">账号类型:</div>
                <div class="meta-value">主账号</div>
              </div>
              <div class="meta-item">
                <div class="meta-label">直接上级:</div>
                <div class="meta-value">周李</div>
              </div>
              <div class="meta-item">
                <div class="meta-label">状态:</div>
                <div class="meta-value">试用</div>
              </div>
              <div class="meta-item">
                <div class="meta-label">最后登录日期:</div>
                <div class="meta-value">2025-04-30</div>
              </div>
              
              <div v-show="showMoreInfo">
                <div class="meta-item">
                  <div class="meta-label">创建人:</div>
                  <div class="meta-value link">王仲资</div>
                </div>
                <div class="meta-item">
                  <div class="meta-label">创建时间:</div>
                  <div class="meta-value">2025-04-27</div>
                </div>
                <div class="meta-item">
                  <div class="meta-label">最后修改人:</div>
                  <div class="meta-value link">王仲资</div>
                </div>
                <div class="meta-item">
                  <div class="meta-label">最后修改日期:</div>
                  <div class="meta-value">2025-04-27</div>
                </div>
              </div>
              
              <div class="toggle-more" @click="toggleMoreInfo">
                <div class="arrow-icon" :class="{'is-expanded': showMoreInfo}"></div>
              </div>
            </div>
          </div>

          <!-- 右侧内容 -->
          <div class="right-content">
            <!-- 基本信息区域 -->
            <div class="info-section">
              <div class="section-header">
                <span class="section-title">基本信息</span>
                <i class="el-icon-arrow-up arrow-icon-right"></i>
              </div>
              <div class="info-content">
                <div class="info-list" v-if="!isEditing">
                  <div class="info-item">
                    <div class="item-label">用户名:</div>
                    <div class="item-value">{{ userInfo.username }}</div>
                  </div>
                  <div class="info-item">
                    <div class="item-label">姓名:</div>
                    <div class="item-value">{{ userInfo.name }}</div>
                  </div>
                  <div class="info-item">
                    <div class="item-label">部门:</div>
                    <div class="item-value">{{ userInfo.department }}</div>
                  </div>
                  <div class="info-item">
                    <div class="item-label">职位:</div>
                    <div class="item-value">{{ userInfo.position }}</div>
                  </div>
                  <div class="info-item">
                    <div class="item-label">个人简介:</div>
                    <div class="item-value">{{ userInfo.introduction || '暂无个人简介' }}</div>
                  </div>
                </div>
                <div class="info-list edit-form" v-else>
                  <div class="info-item">
                    <div class="item-label">用户名:</div>
                    <div class="item-value">
                      <el-input v-model="editForm.username" placeholder="请输入用户名" disabled />
                    </div>
                  </div>
                  <div class="info-item">
                    <div class="item-label">姓名:</div>
                    <div class="item-value">
                      <el-input v-model="editForm.name" placeholder="请输入姓名" disabled />
                    </div>
                  </div>
                  <div class="info-item">
                    <div class="item-label">部门:</div>
                    <div class="item-value">
                      <el-select v-model="editForm.department" placeholder="请选择部门">
                        <el-option label="设计部门" value="设计部门" />
                        <el-option label="产品部门" value="产品部门" />
                        <el-option label="研发部门" value="研发部门" />
                        <el-option label="市场部门" value="市场部门" />
                        <el-option label="运营部门" value="运营部门" />
                      </el-select>
                    </div>
                  </div>
                  <div class="info-item">
                    <div class="item-label">职位:</div>
                    <div class="item-value">
                      <el-select v-model="editForm.position" placeholder="请选择职位">
                        <el-option label="设计总监" value="设计总监" />
                        <el-option label="高级设计师" value="高级设计师" />
                        <el-option label="UI设计师" value="UI设计师" />
                        <el-option label="UX设计师" value="UX设计师" />
                        <el-option label="产品经理" value="产品经理" />
                      </el-select>
                    </div>
                  </div>
                  <div class="info-item">
                    <div class="item-label">个人简介:</div>
                    <div class="item-value">
                      <el-input type="textarea" v-model="editForm.introduction" placeholder="请输入个人简介" :rows="3" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 通讯信息区域 -->
            <div class="info-section">
              <div class="section-header">
                <span class="section-title">通讯信息</span>
                <i class="el-icon-arrow-up arrow-icon-right"></i>
              </div>
              <div class="info-content">
                <div class="info-list" v-if="!isEditing">
                  <div class="info-item">
                    <div class="item-label">电子邮件:</div>
                    <div class="item-value">{{ userInfo.email }}</div>
                  </div>
                  <div class="info-item">
                    <div class="item-label">手机号:</div>
                    <div class="item-value">{{ userInfo.phone }}</div>
                  </div>
                </div>
                <div class="info-list edit-form" v-else>
                  <div class="info-item">
                    <div class="item-label">电子邮件:</div>
                    <div class="item-value">
                      <el-input v-model="editForm.email" placeholder="请输入电子邮件" />
                    </div>
                  </div>
                  <div class="info-item">
                    <div class="item-label">手机号:</div>
                    <div class="item-value">
                      <el-input v-model="editForm.phone" placeholder="请输入手机号" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 头像上传弹窗 -->
    <AvatarUpload
      v-model:visible="avatarDialogVisible"
      @confirm="onAvatarConfirm"
      @cancel="onAvatarCancel"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import AvatarUpload from './components/AvatarUpload.vue';

// 用户信息
const userInfo = ref({
  name: '张钰浠',
  employeeId: '3179',
  company: '灵兰人工智能科技（上海）股份有限公司/灵兰科技（武汉）股份有限公司/大雄研发中心/前端开发组',
  avatar: '',
  lastLoginIp: '192.168.1.101',
  lastLoginTime: '2025-04-30 10:30:45',
  role: '系统管理员',
  username: 'zhangyuxi',
  department: '设计部门',
  position: '设计总监',
  introduction: '拥有十年设计经验，专注于用户体验设计与交互设计，参与过多个大型项目的设计工作。',
  email: 'zhangyuxi@example.com',
  phone: '13800138000',
  officePhone: '021-12345678',
  office: 'A栋512室'
});

// 编辑表单
const editForm = ref({...userInfo.value});

// 编辑模式状态
const isEditing = ref(false);

// 头像上传弹窗
const avatarDialogVisible = ref(false);

// 切换编辑模式
const toggleEditMode = () => {
  if (isEditing.value) {
    isEditing.value = false;
  } else {
    editForm.value = {...userInfo.value};
    isEditing.value = true;
  }
};

// 保存用户信息
const saveUserInfo = () => {
  userInfo.value = {...editForm.value};
  isEditing.value = false;
};

// 显示头像上传弹窗
const showAvatarUpload = () => {
  avatarDialogVisible.value = true;
};

// 处理头像上传确认
const onAvatarConfirm = (avatarUrl) => {
  if (avatarUrl) {
    userInfo.value.avatar = avatarUrl;
  }
};

// 处理头像上传取消
const onAvatarCancel = () => {
  // 可以在这里添加取消上传的处理逻辑
};

// 获取用户名首字母
const userInitial = computed(() => {
  if (userInfo.value.name) {
    return userInfo.value.name.charAt(0);
  }
  return '张';
});

// 控制更多信息的显示
const showMoreInfo = ref(false);

// 切换更多信息的显示状态
const toggleMoreInfo = () => {
  showMoreInfo.value = !showMoreInfo.value;
};
</script>

<style scoped>
.profile-outer-container {
  background-color: #f0f2f5;
  min-height: 100vh;
  padding: 20px;
}

.profile-container {
  border-radius: 4px;
  background-color: #fff;
  margin: 0 auto;
  max-width: 1200px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.profile-page {
  background-color: #fff;
  min-height: 100vh;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

/* 顶部用户信息栏 */
.profile-header {
  background-color: #f9f9f9;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e8e8e8;
}

.user-info {
  display: flex;
  align-items: center;
}

.avatar-container {
  margin-right: 15px;
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #1890ff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 500;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
}

.user-id {
  font-size: 14px;
  font-weight: normal;
  color: #999;
  margin-left: 5px;
}

.user-login-info {
  margin: 3px 0 0;
  font-size: 12px;
  color: #666;
  display: flex;
  align-items: center;
}

.user-login-info .divider {
  margin: 0 8px;
  color: #d9d9d9;
}

.header-actions {
  display: flex;
  align-items: center;
}

.edit-btn {
  margin-right: 10px;
}

.more-btn {
  width: 32px;
  height: 32px;
  border: none;
  background-color: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  border-radius: 4px;
  padding: 0;
}

.list-icon {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 18px;
  height: 18px;
}

.list-icon-line {
  width: 14px;
  height: 2px;
  background-color: #999;
  margin: 1.5px 0;
  border-radius: 1px;
}

/* 导航标签样式 */
.nav-tabs {
  display: flex;
  background-color: #fff;
  border-bottom: 1px solid #e8e8e8;
  overflow-x: auto;
  white-space: nowrap;
}

.nav-tabs::-webkit-scrollbar {
  display: none;
}

.tab-item {
  padding: 12px 16px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  position: relative;
}

.tab-item.active {
  color: #1890ff;
}

.tab-item.active:after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #1890ff;
}

/* 主内容区域布局 */
.main-content {
  display: flex;
  padding: 15px;
  position: relative;
}

.main-content:before {
  content: '';
  position: absolute;
  left: 275px;
  top: 0;
  bottom: 0;
  width: 1px;
  background-color: #e8e8e8;
}

/* 左侧边栏 */
.left-sidebar {
  width: 260px;
  display: flex;
  flex-direction: column;
  margin-right: 15px;
}

.avatar-section {
  background-color: #fff;
  border-radius: 2px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 15px;
}

.large-avatar {
  width: 120px;
  height: 120px;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 15px;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder-large {
  width: 100%;
  height: 100%;
  background-color: #e0e0e0;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  font-weight: 300;
}

.contact-icons {
  display: flex;
  justify-content: center;
  width: 100%;
}

.contact-icon-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid #e8e8e8;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin: 0 6px;
  transition: all 0.3s;
}

.contact-icon-btn:hover {
  border-color: #1890ff;
  background-color: #e6f7ff;
}

/* 聊天图标 */
.icon-chat {
  width: 16px;
  height: 16px;
  border: 2px solid #1890ff;
  border-radius: 50%;
  position: relative;
}

.icon-chat:before {
  content: '';
  position: absolute;
  bottom: -4px;
  right: -2px;
  width: 6px;
  height: 6px;
  background-color: #1890ff;
  border-radius: 0 100% 0 0;
  transform: rotate(45deg);
}

/* 消息图标 */
.icon-message {
  width: 18px;
  height: 14px;
  border: 2px solid #1890ff;
  border-radius: 2px;
  position: relative;
}

/* 邮件图标 */
.icon-mail {
  width: 20px;
  height: 14px;
  border: 2px solid #1890ff;
  border-radius: 2px;
  position: relative;
}

.icon-mail:before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  border-top: 6px solid #1890ff;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
}

/* 日历图标 */
.icon-calendar {
  width: 16px;
  height: 16px;
  border: 2px solid #1890ff;
  border-radius: 2px;
  position: relative;
}

.icon-calendar:before {
  content: '';
  position: absolute;
  top: -4px;
  left: 2px;
  width: 2px;
  height: 6px;
  background-color: #1890ff;
}

.icon-calendar:after {
  content: '';
  position: absolute;
  top: -4px;
  right: 2px;
  width: 2px;
  height: 6px;
  background-color: #1890ff;
}

.empty-circle {
  display: none;
}

.user-meta-list {
  background-color: #fff;
  border-radius: 2px;
  padding: 15px;
  margin-bottom: 15px;
  position: relative;
}

.toggle-more {
  text-align: center;
  cursor: pointer;
  margin-top: 10px;
  padding: 8px 0;
  border-top: 1px solid #eee;
  border-radius: 0 0 2px 2px;
}

.arrow-icon {
  width: 16px;
  height: 16px;
  margin: 0 auto;
  position: relative;
}

.arrow-icon:before {
  content: '';
  position: absolute;
  width: 8px;
  height: 8px;
  border-top: 1px solid #999;
  border-right: 1px solid #999;
  left: 4px;
  top: 6px;
  transform: rotate(-45deg);
  transition: transform 0.3s;
}

.arrow-icon.is-expanded:before {
  transform: rotate(135deg);
  top: 4px;
}

.more-info {
  margin-top: 10px;
}

.meta-item {
  display: flex;
  margin-bottom: 12px;
  font-size: 13px;
  line-height: 1.5;
}

.meta-label {
  color: #999;
  min-width: 90px;
}

.meta-value {
  color: #333;
  flex: 1;
}

.meta-value.link {
  color: #1890ff;
  cursor: pointer;
}

/* 右侧内容区域 */
.right-content {
  flex: 1;
}

/* 信息区域 */
.info-row {
  display: block;
}

.info-section {
  background-color: #fff;
  border-radius: 2px;
  margin-bottom: 15px;
  width: 100%;
  border: 1px solid #eee;
}

.section-header {
  padding: 12px 15px;
  background-color: #f8f9fb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: none;
  margin-bottom: 0;
}

.section-title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  position: relative;
  padding-left: 10px;
  border-left: 3px solid #1890ff;
}

.arrow-icon-right {
  color: #999;
  font-size: 16px;
  cursor: pointer;
}

.info-content {
  padding: 0;
  background-color: #fff;
}

.info-list {
  width: 100%;
}

.info-item {
  display: flex;
  padding: 14px 20px;
  border-bottom: 1px solid #f0f0f0;
  align-items: center;
}

.info-item:first-child {
  padding-top: 14px;
}

.info-item:last-child {
  border-bottom: none;
}

.info-grid {
  display: none;
}

.item-label {
  min-width: 120px;
  color: #888;
  font-size: 13px;
  line-height: 32px;
}

.item-value {
  flex: 1;
  font-size: 13px;
  color: #333;
  line-height: 32px;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
  }

  .left-sidebar {
    width: 100%;
    margin-right: 0;
    margin-bottom: 15px;
  }

  .info-row {
    flex-direction: column;
  }

  .info-col:first-child {
    border-right: none;
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 15px;
    margin-bottom: 15px;
  }
}

.save-btn, .return-btn {
  margin-right: 10px;
}

.edit-form .el-input,
.edit-form .el-select {
  width: 100%;
}

.edit-form .info-item {
  align-items: flex-start;
}

.edit-form .item-value {
  padding-top: 0;
}

.edit-form textarea {
  font-family: inherit;
}
</style> 