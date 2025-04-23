/**
 * Axios 配置工具
 */

// 当前环境
import { isDev, isProd, apiBaseUrl } from './tools.js';

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
