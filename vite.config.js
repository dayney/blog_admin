import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // 根据当前工作目录中的 `mode` 加载 .env 文件
  // 设置第三个参数为 '' 来加载所有环境变量，而不管是否有 `VITE_` 前缀。
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      port: 8080,
    },
    // 根据环境变量添加或修改配置
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
    build: {
      // 生产环境构建配置
      outDir: 'dist',
      assetsDir: 'assets',
      // 控制台输出的级别 info 或者 warn 或者 error
      logLevel: 'info',
      // 设置为 false 可以避免 vite 清屏而错过在终端中打印某些关键信息
      clearScreen: true,
    }
  };
});
