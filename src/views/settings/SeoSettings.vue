<template>
  <div class="seo-settings">
    <h1 class="page-title">SEO设置</h1>

    <el-card shadow="never">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="站点SEO" name="site">
          <el-form :model="siteForm" label-width="120px" label-position="left" ref="siteFormRef">
            <el-form-item label="首页标题">
              <el-input v-model="siteForm.homeTitle" placeholder="请输入首页标题" />
            </el-form-item>

            <el-form-item label="首页关键词">
              <el-input v-model="siteForm.homeKeywords" placeholder="请输入首页关键词，多个关键词用英文逗号分隔" />
            </el-form-item>

            <el-form-item label="首页描述">
              <el-input
                type="textarea"
                v-model="siteForm.homeDescription"
                :rows="3"
                placeholder="请输入首页描述，建议不超过200个字符"
              />
            </el-form-item>

            <el-form-item label="标题连接符">
              <el-input v-model="siteForm.titleConnector" placeholder="网站标题与页面标题之间的连接符，如 - 、 | 等" />
            </el-form-item>

            <el-form-item label="标题格式">
              <el-radio-group v-model="siteForm.titleFormat">
                <el-radio value="1" label="页面标题 + 连接符 + 网站标题">页面标题 + 连接符 + 网站标题</el-radio>
                <el-radio value="2" label="网站标题 + 连接符 + 页面标题">网站标题 + 连接符 + 页面标题</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="模块SEO" name="module">
          <el-table :data="moduleData" border style="width: 100%">
            <el-table-column prop="moduleName" label="模块名称" width="180" />
            <el-table-column prop="title" label="标题" width="280">
              <template #default="scope">
                <el-input v-model="scope.row.title" placeholder="请输入标题" />
              </template>
            </el-table-column>
            <el-table-column prop="keywords" label="关键词">
              <template #default="scope">
                <el-input v-model="scope.row.keywords" placeholder="请输入关键词" />
              </template>
            </el-table-column>
            <el-table-column prop="description" label="描述" width="320">
              <template #default="scope">
                <el-input type="textarea" v-model="scope.row.description" :rows="2" placeholder="请输入描述" />
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="栏目SEO" name="category">
          <div class="table-header">
            <el-input
              v-model="categorySearch"
              placeholder="搜索栏目名称"
              style="width: 300px"
              clearable
              @clear="getCategoryList"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
              <template #append>
                <el-button @click="getCategoryList">搜索</el-button>
              </template>
            </el-input>
          </div>

          <el-table :data="categoryData" border style="width: 100%">
            <el-table-column prop="categoryName" label="栏目名称" width="180" />
            <el-table-column prop="title" label="标题" width="280">
              <template #default="scope">
                <el-input v-model="scope.row.title" placeholder="请输入标题" />
              </template>
            </el-table-column>
            <el-table-column prop="keywords" label="关键词">
              <template #default="scope">
                <el-input v-model="scope.row.keywords" placeholder="请输入关键词" />
              </template>
            </el-table-column>
            <el-table-column prop="description" label="描述" width="320">
              <template #default="scope">
                <el-input type="textarea" v-model="scope.row.description" :rows="2" placeholder="请输入描述" />
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            class="pagination"
          />
        </el-tab-pane>

        <el-tab-pane label="URL规则" name="url">
          <div class="table-header">
            <el-button type="primary" @click="addUrlRule">添加规则</el-button>
          </div>

          <el-table :data="urlRules" border style="width: 100%">
            <el-table-column prop="name" label="规则名称" width="150" />
            <el-table-column prop="pattern" label="URL规则" />
            <el-table-column prop="example" label="URL示例" width="280" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="scope">
                <el-tag :type="scope.row.status ? 'success' : 'danger'">
                  {{ scope.row.status ? '启用' : '禁用' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
              <template #default="scope">
                <el-button size="small" type="primary" @click="editUrlRule(scope.row)">编辑</el-button>
                <el-button size="small" type="danger" @click="deleteUrlRule(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="伪静态解析" name="rewrite">
          <el-form :model="rewriteForm" label-width="120px" label-position="left" ref="rewriteFormRef">
            <el-form-item label="开启伪静态">
              <el-switch v-model="rewriteForm.enable" />
            </el-form-item>

            <el-form-item label="Apache规则">
              <el-input
                type="textarea"
                v-model="rewriteForm.apache"
                :rows="10"
                placeholder="Apache服务器的伪静态规则"
                :disabled="!rewriteForm.enable"
              />
            </el-form-item>

            <el-form-item label="Nginx规则">
              <el-input
                type="textarea"
                v-model="rewriteForm.nginx"
                :rows="10"
                placeholder="Nginx服务器的伪静态规则"
                :disabled="!rewriteForm.enable"
              />
            </el-form-item>

            <el-form-item label="IIS规则">
              <el-input
                type="textarea"
                v-model="rewriteForm.iis"
                :rows="10"
                placeholder="IIS服务器的伪静态规则"
                :disabled="!rewriteForm.enable"
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

    <!-- URL规则对话框 -->
    <el-dialog v-model="urlRuleDialogVisible" :title="urlRuleDialogTitle" width="600px">
      <el-form :model="urlRuleForm" :rules="urlRuleRules" ref="urlRuleFormRef" label-width="100px">
        <el-form-item label="规则名称" prop="name">
          <el-input v-model="urlRuleForm.name" placeholder="请输入规则名称" />
        </el-form-item>

        <el-form-item label="URL规则" prop="pattern">
          <el-input v-model="urlRuleForm.pattern" placeholder="请输入URL规则，如：/article/{id}.html" />
        </el-form-item>

        <el-form-item label="URL示例">
          <el-input v-model="urlRuleForm.example" placeholder="示例URL，如：/article/123.html" />
        </el-form-item>

        <el-form-item label="状态">
          <el-switch v-model="urlRuleForm.status" />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="urlRuleDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveUrlRule">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search } from '@element-plus/icons-vue';

// 当前激活的标签页
const activeTab = ref('site');

// 表单引用
const siteFormRef = ref(null);
const rewriteFormRef = ref(null);
const urlRuleFormRef = ref(null);

// 站点SEO表单数据
const siteForm = ref({
  homeTitle: '我的博客 - 分享技术，记录生活',
  homeKeywords: '博客,技术,程序员,开发,分享',
  homeDescription: '这是一个分享技术和生活的博客，内容涵盖前端、后端、移动端等各方面的技术分享和个人生活记录。',
  titleConnector: ' - ',
  titleFormat: '1'
});

// 模块SEO数据
const moduleData = ref([
  {
    moduleName: '文章列表',
    title: '全部文章 - 我的博客',
    keywords: '文章,技术文章,博客文章',
    description: '我的博客的全部文章列表，包含各类技术分享和生活记录。'
  },
  {
    moduleName: '标签页',
    title: '标签云 - 我的博客',
    keywords: '标签,标签云,文章分类',
    description: '我的博客的标签云，通过标签快速查找相关文章。'
  },
  {
    moduleName: '关于页',
    title: '关于我 - 我的博客',
    keywords: '关于我,博主简介,个人介绍',
    description: '关于博主的详细介绍，包括个人经历、技能特长等信息。'
  },
  {
    moduleName: '留言板',
    title: '留言板 - 我的博客',
    keywords: '留言板,反馈,交流',
    description: '欢迎在此留下你的想法、建议或问题，与博主进行交流。'
  }
]);

// 栏目SEO数据
const categoryData = ref([]);
const categorySearch = ref('');
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 模拟获取栏目列表
const getCategoryList = () => {
  // 模拟数据
  const data = [
    {
      categoryName: '前端开发',
      title: '前端开发 - 我的博客',
      keywords: '前端,JavaScript,Vue,React',
      description: '前端开发相关文章，包括JavaScript、Vue、React等技术分享。'
    },
    {
      categoryName: '后端开发',
      title: '后端开发 - 我的博客',
      keywords: '后端,Java,Python,Node.js',
      description: '后端开发相关文章，包括Java、Python、Node.js等技术分享。'
    },
    {
      categoryName: '移动开发',
      title: '移动开发 - 我的博客',
      keywords: '移动开发,Android,iOS,Flutter',
      description: '移动开发相关文章，包括Android、iOS、Flutter等技术分享。'
    },
    {
      categoryName: '数据库',
      title: '数据库 - 我的博客',
      keywords: '数据库,MySQL,MongoDB,Redis',
      description: '数据库相关文章，包括MySQL、MongoDB、Redis等技术分享。'
    },
    {
      categoryName: '服务器',
      title: '服务器 - 我的博客',
      keywords: '服务器,Linux,Docker,Kubernetes',
      description: '服务器相关文章，包括Linux、Docker、Kubernetes等技术分享。'
    }
  ];

  categoryData.value = data;
  total.value = data.length;
};

// 初始化获取栏目列表
getCategoryList();

// 处理分页
const handleSizeChange = val => {
  pageSize.value = val;
  getCategoryList();
};

const handleCurrentChange = val => {
  currentPage.value = val;
  getCategoryList();
};

// URL规则数据
const urlRules = ref([
  {
    name: '文章详情',
    pattern: '/article/{id}.html',
    example: '/article/123.html',
    status: true
  },
  {
    name: '栏目列表',
    pattern: '/category/{slug}/',
    example: '/category/frontend/',
    status: true
  },
  {
    name: '标签列表',
    pattern: '/tag/{slug}/',
    example: '/tag/javascript/',
    status: true
  }
]);

// URL规则对话框
const urlRuleDialogVisible = ref(false);
const urlRuleDialogTitle = ref('添加URL规则');
const urlRuleForm = ref({
  name: '',
  pattern: '',
  example: '',
  status: true
});
const urlRuleRules = {
  name: [{ required: true, message: '请输入规则名称', trigger: 'blur' }],
  pattern: [{ required: true, message: '请输入URL规则', trigger: 'blur' }]
};
const currentEditIndex = ref(-1);

// 添加URL规则
const addUrlRule = () => {
  urlRuleDialogTitle.value = '添加URL规则';
  urlRuleForm.value = {
    name: '',
    pattern: '',
    example: '',
    status: true
  };
  currentEditIndex.value = -1;
  urlRuleDialogVisible.value = true;
};

// 编辑URL规则
const editUrlRule = row => {
  urlRuleDialogTitle.value = '编辑URL规则';
  urlRuleForm.value = { ...row };
  currentEditIndex.value = urlRules.value.findIndex(item => item.name === row.name);
  urlRuleDialogVisible.value = true;
};

// 删除URL规则
const deleteUrlRule = row => {
  ElMessageBox.confirm(`确定要删除"${row.name}"规则吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      const index = urlRules.value.findIndex(item => item.name === row.name);
      if (index !== -1) {
        urlRules.value.splice(index, 1);
        ElMessage.success('删除成功');
      }
    })
    .catch(() => {
      // 取消删除
    });
};

// 保存URL规则
const saveUrlRule = async () => {
  await urlRuleFormRef.value.validate(valid => {
    if (valid) {
      if (currentEditIndex.value === -1) {
        // 添加新规则
        urlRules.value.push({ ...urlRuleForm.value });
      } else {
        // 更新现有规则
        urlRules.value[currentEditIndex.value] = { ...urlRuleForm.value };
      }

      urlRuleDialogVisible.value = false;
      ElMessage.success('保存成功');
    } else {
      return false;
    }
  });
};

// 伪静态规则表单
const rewriteForm = ref({
  enable: true,
  apache: `RewriteEngine On
RewriteBase /
RewriteRule ^article/([0-9]+).html$ /index.php?mod=article&id=$1 [L]
RewriteRule ^category/([^/]+)/$ /index.php?mod=category&slug=$1 [L]
RewriteRule ^tag/([^/]+)/$ /index.php?mod=tag&slug=$1 [L]`,
  nginx: `location / {
    rewrite ^/article/([0-9]+).html$ /index.php?mod=article&id=$1 last;
    rewrite ^/category/([^/]+)/$ /index.php?mod=category&slug=$1 last;
    rewrite ^/tag/([^/]+)/$ /index.php?mod=tag&slug=$1 last;
}`,
  iis: `<rewrite>
  <rules>
    <rule name="article">
      <match url="^article/([0-9]+).html$" />
      <action type="Rewrite" url="index.php?mod=article&id={R:1}" />
    </rule>
    <rule name="category">
      <match url="^category/([^/]+)/$" />
      <action type="Rewrite" url="index.php?mod=category&slug={R:1}" />
    </rule>
    <rule name="tag">
      <match url="^tag/([^/]+)/$" />
      <action type="Rewrite" url="index.php?mod=tag&slug={R:1}" />
    </rule>
  </rules>
</rewrite>`
});

// 提交表单
const handleSubmit = async () => {
  if (activeTab.value === 'site') {
    // 提交站点SEO表单
    console.log('站点SEO表单提交成功', siteForm.value);
    ElMessage.success('保存成功');
  } else if (activeTab.value === 'module') {
    // 提交模块SEO表单
    console.log('模块SEO提交成功', moduleData.value);
    ElMessage.success('保存成功');
  } else if (activeTab.value === 'category') {
    // 提交栏目SEO表单
    console.log('栏目SEO提交成功', categoryData.value);
    ElMessage.success('保存成功');
  } else if (activeTab.value === 'url') {
    // 提交URL规则
    console.log('URL规则提交成功', urlRules.value);
    ElMessage.success('保存成功');
  } else if (activeTab.value === 'rewrite') {
    // 提交伪静态规则
    console.log('伪静态规则提交成功', rewriteForm.value);
    ElMessage.success('保存成功');
  }
};

// 重置表单
const resetForm = () => {
  if (activeTab.value === 'site') {
    siteFormRef.value.resetFields();
  } else if (activeTab.value === 'rewrite') {
    rewriteFormRef.value.resetFields();
  }
};
</script>

<style lang="scss" scoped>
@use '@/assets/scss/variables.scss' as *;

.seo-settings {
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

.table-header {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
}

.pagination {
  margin-top: 20px;
  justify-content: center;
}

.hint-text {
  color: $text-secondary;
  font-size: 12px;
  margin-top: 5px;
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
