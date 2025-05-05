# 环境配置说明

## 配置文件

本项目使用以下环境配置文件：

- `.env`：基础环境变量，所有环境都会加载
- `.env.development`：开发环境特定配置
- `.env.test`：测试环境特定配置
- `.env.production`：生产环境特定配置

## 环境变量命名规则

Vite 只会暴露以 `VITE_` 开头的环境变量给客户端代码。例如：

```
VITE_API_BASE_URL=http://localhost:3000/api
```

## 如何使用环境变量

在 Vue 组件中，可以通过 `import.meta.env` 访问环境变量：

```js
console.log(import.meta.env.VITE_API_BASE_URL)
```

在工具函数中，我们已经将常用环境变量导出，可以直接引用：

```js
import { apiBaseUrl, isDev, isProd } from '@/utils/tools';

console.log(apiBaseUrl); // API基础路径
console.log(isDev);      // 是否为开发环境
console.log(isProd);     // 是否为生产环境
```

## 构建命令

针对不同环境的构建命令：

```bash
# 开发环境构建
npm run build:dev

# 测试环境构建
npm run build:test

# 生产环境构建
npm run build:prod
```

## 预览命令

针对不同环境的预览命令：

```bash
# 默认预览（通常是生产环境）
npm run preview

# 测试环境预览
npm run preview:test

# 生产环境预览
npm run preview:prod
```

## 自定义环境

如需添加自定义环境，请：

1. 创建对应的 `.env.[环境名]` 文件
2. 在 `package.json` 中添加对应的构建和预览命令
3. 使用 `--mode [环境名]` 参数运行 