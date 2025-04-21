import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // 根据当前工作目录加载 .env 文件
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      // 开发服务器配置
      port: 3100,
      open: true,
      cors: true,
      // 代理配置
      proxy: {
        // 如果需要代理API请求
        '/api': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, '')
        }
      }
    },
    build: {
      // 生产构建配置
      outDir: 'dist',
      assetsDir: 'assets',
      // 只在生产环境下使用terser进行代码压缩
      ...(mode === 'production'
        ? {
            minify: 'terser',
            terserOptions: {
              compress: {
                drop_console: true,
                drop_debugger: true
              }
            }
          }
        : {})
    }
  };
});
