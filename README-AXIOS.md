# Axios 封装与使用指南

本文档介绍了项目中 Axios 的封装方式及使用方法，通过结合环境配置文件实现了不同环境下的 API 请求配置。

## 环境配置文件

项目使用了不同的环境配置文件来管理各环境下的 API 请求配置：

### `.env.development` (开发环境)

```
# 开发环境配置
NODE_ENV = development

# API基础路径
VITE_API_BASE_URL = 'http://localhost:3000/backend'

# 图片基础路径
VITE_IMAGE_BASE_URL = 'http://localhost:3000/uploads'

# 标题
VITE_APP_TITLE = '博客管理系统 - 开发环境'
```

### `.env.test` (测试环境)

```
# 测试环境配置
NODE_ENV = test

# API基础路径
VITE_API_BASE_URL = 'http://test-api.example.com/api'

# 图片基础路径
VITE_IMAGE_BASE_URL = 'http://test-api.example.com/uploads'

# 标题
VITE_APP_TITLE = '博客管理系统 - 测试环境'
```

### `.env.production` (生产环境)

```
# 生产环境配置
NODE_ENV = production

# API基础路径
VITE_API_BASE_URL = 'https://api.example.com/api'

# 图片基础路径
VITE_IMAGE_BASE_URL = 'https://api.example.com/uploads'

# 标题
VITE_APP_TITLE = '博客管理系统'
```

## Axios 配置

### `/src/utils/axiosConfig.js`

此文件定义了 HTTP 请求的基础配置，根据不同环境提供不同的参数：

```javascript
/**
 * Axios 配置工具
 */

// 当前环境
export const isDev = import.meta.env.MODE === 'development';
export const isTest = import.meta.env.MODE === 'test';
export const isProd = import.meta.env.MODE === 'production';

// 环境名称
export const envName = import.meta.env.VITE_APP_TITLE;

// API基础路径
export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

// 图片基础路径
export const imageBaseUrl = import.meta.env.VITE_IMAGE_BASE_URL;

// HTTP请求配置
export const httpConfig = {
  // 基础请求路径
  baseURL: apiBaseUrl,
  // 超时时间 (毫秒) - 开发环境允许更长的超时时间
  timeout: isDev ? 60000 : 15000,
  // 请求头
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  },
  // 是否开启调试日志 - 仅在开发环境
  enableLog: isDev,
  // 重试次数 - 生产环境更多重试次数
  retryTimes: isProd ? 3 : 1,
  // 重试延迟 (毫秒)
  retryDelay: 1000,
  // 状态码配置
  statusCodes: {
    success: 200, // 成功状态码
    unauthorized: 401, // 未授权状态码
    forbidden: 403, // 禁止访问状态码
    notFound: 404, // 资源不存在状态码
    serverError: 500 // 服务器错误状态码
  }
};

export default {
  isDev,
  isTest,
  isProd,
  envName,
  apiBaseUrl,
  imageBaseUrl,
  httpConfig
};
```

## Axios 封装

### `/src/utils/axios.js`

Axios 封装提供了 RESTful 风格的 API 调用方法，支持请求/响应拦截、错误处理、请求重试等功能：

```javascript
import http from '@/utils/axios';

// 发起GET请求
http.get('/user', { id: 1 });

// 发起POST请求
http.post('/user', { name: '张三', age: 30 });

// 发起PUT请求
http.put('/user/1', { name: '张三', age: 31 });

// 发起PATCH请求
http.patch('/user/1', { age: 32 });

// 发起DELETE请求
http.delete('/user/1');
```

## 高级功能

### 文件上传

```javascript
const formData = new FormData();
formData.append('file', file);

// 上传文件并监控进度
http.upload(
  '/upload',
  formData,
  progress => {
    console.log(`上传进度: ${progress}%`);
  },
  {
    showLoading: false // 禁用全局loading
  }
);
```

### 文件下载

```javascript
// 下载文件
http.download('/download', { fileId: 123 }, 'filename.pdf');
```

### 取消请求

```javascript
// 取消所有进行中的请求
http.cancelAllRequests();
```

## API 模块化

项目使用模块化的方式组织 API 请求，例如 `/src/api/article.js`：

```javascript
import http from '@/utils/axios';

const API_PREFIX = '/api/articles';

export default {
  getList(params) {
    return http.get(API_PREFIX, params);
  },

  getDetail(id) {
    return http.get(`${API_PREFIX}/${id}`);
  },

  create(data) {
    return http.post(API_PREFIX, data);
  },

  update(id, data) {
    return http.put(`${API_PREFIX}/${id}`, data);
  },

  delete(id) {
    return http.delete(`${API_PREFIX}/${id}`);
  }
};
```

通过 `/src/api/index.js` a 统一导出：

```javascript
import article from './article';

export { article };

export default {
  article
};
```

## 在组件中使用

```vue
<script setup>
import { ref, onMounted } from 'vue';
import { article } from '@/api';

const articles = ref([]);
const loading = ref(false);

// 获取文章列表
const fetchArticles = async () => {
  try {
    loading.value = true;
    articles.value = await article.getList({ page: 1, pageSize: 10 });
  } catch (error) {
    console.error('获取文章失败', error);
  } finally {
    loading.value = false;
  }
};

// 创建文章
const createArticle = async formData => {
  try {
    const result = await article.create(formData);
    // 处理成功结果
    return result;
  } catch (error) {
    // 错误已由axios拦截器处理，这里可以执行额外操作
    return false;
  }
};

onMounted(() => {
  fetchArticles();
});
</script>
```

## 环境变量的使用

启动不同环境的命令：

```bash
# 开发环境
npm run dev

# 测试环境构建
npm run build:test

# 生产环境构建
npm run build:prod
```

这些命令在 `package.json` 中配置：

```json
{
  "scripts": {
    "dev": "vite --mode development",
    "build:test": "vite build --mode test",
    "build:prod": "vite build --mode production"
  }
}
```
