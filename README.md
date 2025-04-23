# 博客管理系统

这是一个使用 Vue 3、Vite、Element Plus 和 Tailwind CSS 开发的博客管理系统前端项目。

## 项目技术栈

- **核心框架**: Vue 3
- **构建工具**: Vite 4
- **UI 组件库**: Element Plus
- **CSS 框架**: Tailwind CSS
- **状态管理**: Pinia
- **路由管理**: Vue Router
- **HTTP 客户端**: Axios
- **图标库**:
  - Element Plus Icons
  - FontAwesome
- **代码规范**: ESLint + Prettier
- **提交规范**: Commitizen + cz-git

## 项目结构

```
├── src/                # 源代码目录
│   ├── api/            # API 接口定义
│   ├── assets/         # 静态资源
│   ├── components/     # 公共组件
│   ├── router/         # 路由配置
│   ├── stores/         # Pinia 状态管理
│   ├── utils/          # 工具函数
│   ├── views/          # 页面视图
│   ├── App.vue         # 根组件
│   └── main.js         # 入口文件
├── .env.*              # 环境配置文件
├── vite.config.js      # Vite 配置
├── tailwind.config.js  # Tailwind CSS 配置
└── eslint.config.js    # ESLint 配置
```

## 环境配置

项目支持多环境部署:

- 开发环境: `.env.development`
- 测试环境: `.env.test`
- 生产环境: `.env.production`

有关环境变量的详细使用，请参考 [Axios 封装与使用指南](./README-AXIOS.md#环境变量的使用)。

## Axios 封装

项目对 Axios 进行了全面封装，支持以下功能：

- RESTful 风格的 API 调用
- 请求/响应拦截
- 错误统一处理
- 请求重试机制
- 文件上传/下载
- 取消请求
- API 模块化

详细文档请参考 [Axios 封装与使用指南](./README-AXIOS.md)。

## 开发指南

### 安装依赖

```sh
npm install
# 或
pnpm install
```

### 启动开发服务器

```sh
npm run dev
# 或
pnpm dev
```

### 构建项目

```sh
# 测试环境构建
npm run build:test
# 或
pnpm build:test

# 生产环境构建
npm run build
# 或
pnpm build
```

### 代码检查

```sh
npm run lint
# 或
pnpm lint
```

## 代码规范

项目使用 ESLint 和 Prettier 进行代码规范检查和格式化。遵循以下规则:

- Vue 组件使用 PascalCase 命名
- CSS 类名使用 kebab-case 命名
- 使用 `<script setup>` 语法
- 组件结构遵循 `<template>`、`<script>` 和 `<style>` 顺序
- Element Plus 组件使用 el- 前缀

## 浏览器支持

- Chrome
- Firefox
- Safari
- Edge
