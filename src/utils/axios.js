/**
 * axios请求封装
 * RESTful API风格封装
 * 结合环境配置进行二次封装
 */

import axios from 'axios';
import { ElMessage, ElLoading } from 'element-plus';
import { httpConfig } from './axiosConfig.js';
import { isDev } from './tools.js';

// 创建axios实例
const service = axios.create({
  baseURL: httpConfig.baseURL,
  timeout: httpConfig.timeout,
  headers: httpConfig.headers
});

// 存储请求队列用于取消请求
const pendingRequests = new Map();

// 请求重试相关
const { retryTimes, retryDelay } = httpConfig;
// 生成请求标识
const generateRequestKey = config => {
  const { url, method, params, data } = config;
  return [url, method, JSON.stringify(params), JSON.stringify(data)].join('&');
};

// 添加请求到队列
const addPendingRequest = config => {
  const requestKey = generateRequestKey(config);
  config.cancelToken =
    config.cancelToken ||
    new axios.CancelToken(cancel => {
      if (!pendingRequests.has(requestKey)) {
        pendingRequests.set(requestKey, cancel);
      }
    });
};

// 从队列中移除请求
const removePendingRequest = config => {
  const requestKey = generateRequestKey(config);
  if (pendingRequests.has(requestKey)) {
    const cancel = pendingRequests.get(requestKey);
    cancel('取消重复请求');
    pendingRequests.delete(requestKey);
  }
};

// 调试日志
const log = (message, type = 'info', ...args) => {
  if (!httpConfig.enableLog) return;

  switch (type) {
    case 'info':
      console.info(`[HTTP] ${message}`, ...args);
      break;
    case 'warn':
      console.warn(`[HTTP] ${message}`, ...args);
      break;
    case 'error':
      console.error(`[HTTP] ${message}`, ...args);
      break;
    default:
      console.log(`[HTTP] ${message}`, ...args);
  }
};

// loading实例
let loadingInstance;
// 请求计数器
let requestCount = 0;

// 显示全屏loading
const showLoading = () => {
  if (requestCount === 0) {
    loadingInstance = ElLoading.service({
      fullscreen: true,
      text: '加载中...',
      background: 'rgba(0, 0, 0, 0.5)'
    });
  }
  requestCount++;
};

// 隐藏全屏loading
const hideLoading = () => {
  requestCount--;
  if (requestCount <= 0) {
    loadingInstance?.close();
    requestCount = 0;
  }
};

// 请求拦截器
service.interceptors.request.use(
  config => {
    log('请求开始', 'info', config);

    // 是否显示全屏loading
    if (config.showLoading !== false) {
      showLoading();
    }

    // 检查是否存在重复请求
    removePendingRequest(config);
    addPendingRequest(config);

    // 从localStorage中获取token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => {
    log('请求错误', 'error', error);
    hideLoading();
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  response => {
    log('响应成功', 'info', response);
    // 移除请求队列
    removePendingRequest(response.config);
    // 隐藏loading
    if (response.config.showLoading !== false) {
      hideLoading();
    }

    const res = response.data;

    // 根据后端API的响应格式进行调整
    // 假设后端返回格式为 { code: 200, data: {}, message: 'success' }
    if (res.code !== httpConfig.statusCodes.success) {
      const errorMessage = res.message || '请求失败';

      // 错误提示
      ElMessage({
        message: '拦截出来的错误' + errorMessage,
        type: 'error',
        duration: 5 * 1000
      });

      // 401: 未登录或token过期
      if (res.code === httpConfig.statusCodes.unauthorized) {
        // 清除token
        localStorage.removeItem('token');

        // 如果不是登录页，重定向到登录页
        const currentPath = window.location.pathname;
        if (currentPath !== '/login') {
          setTimeout(() => {
            window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
          }, 1500);
        }
      }
    } else {
      return res.data;
    }
  },
  async error => {
    log('响应错误', 'error', error);

    // 隐藏loading
    hideLoading();

    // 如果是取消请求，不进行处理
    if (axios.isCancel(error)) {
      log('请求已取消', 'warn', error.message);
      return Promise.reject(error);
    }

    // 获取响应配置
    const { config } = error;
    // 获取当前重试次数
    config.__retryCount = config.__retryCount || 0;

    // 判断是否需要重试
    if (config.__retryCount < retryTimes) {
      config.__retryCount++;

      // 延迟重试
      const delayRetry = new Promise(resolve => {
        setTimeout(() => {
          log(`重试请求: ${config.url}`, 'info', `第${config.__retryCount}次重试`);
          resolve();
        }, retryDelay);
      });

      // 返回重试请求
      return delayRetry.then(() => service(config));
    }

    // 处理错误消息
    let errorMessage = '网络错误';
    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case httpConfig.statusCodes.unauthorized:
          errorMessage = '未授权，请重新登录';
          // 清除token
          localStorage.removeItem('token');
          // 如果不是登录页，重定向到登录页
          if (window.location.pathname !== '/login') {
            setTimeout(() => {
              window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
            }, 1500);
          }
          break;
        case httpConfig.statusCodes.forbidden:
          errorMessage = '拒绝访问';
          break;
        case httpConfig.statusCodes.notFound:
          errorMessage = '请求的资源不存在';
          break;
        case httpConfig.statusCodes.serverError:
          errorMessage = '服务器错误';
          break;
        default:
          errorMessage = data?.message || `请求失败(${status})`;
      }
    } else if (error.request) {
      errorMessage = '服务器无响应';
    }

    // 显示错误消息
    ElMessage({
      message: '服务器异常：' + errorMessage,
      type: 'error',
      duration: 5 * 1000
    });

    return Promise.reject(error);
  }
);

/**
 * RESTful风格的API封装
 */
export default {
  /**
   * GET请求
   * @param {string} url - 请求路径
   * @param {object} params - 查询参数
   * @param {object} config - 自定义配置
   * @returns {Promise}
   */
  get(url, params = {}, config = {}) {
    return service.get(url, { params, ...config });
  },

  /**
   * POST请求 - 创建资源
   * @param {string} url - 请求路径
   * @param {object} data - 请求体
   * @param {object} config - 自定义配置
   * @returns {Promise}
   */
  post(url, data = {}, config = {}) {
    return service.post(url, data, config);
  },

  /**
   * PUT请求 - 更新资源(全量)
   * @param {string} url - 请求路径
   * @param {object} data - 请求体
   * @param {object} config - 自定义配置
   * @returns {Promise}
   */
  put(url, data = {}, config = {}) {
    return service.put(url, data, config);
  },

  /**
   * PATCH请求 - 更新资源(部分)
   * @param {string} url - 请求路径
   * @param {object} data - 请求体
   * @param {object} config - 自定义配置
   * @returns {Promise}
   */
  patch(url, data = {}, config = {}) {
    return service.patch(url, data, config);
  },

  /**
   * DELETE请求 - 删除资源
   * @param {string} url - 请求路径
   * @param {object} params - 查询参数
   * @param {object} config - 自定义配置
   * @returns {Promise}
   */
  delete(url, params = {}, config = {}) {
    return service.delete(url, { params, ...config });
  },

  /**
   * 上传文件
   * @param {string} url - 上传路径
   * @param {FormData} formData - 表单数据
   * @param {Function} onProgress - 上传进度回调
   * @param {object} config - 自定义配置
   * @returns {Promise}
   */
  upload(url, formData, onProgress = null, config = {}) {
    return service.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: onProgress
        ? e => {
            const progress = Math.round((e.loaded * 100) / e.total);
            onProgress(progress);
          }
        : undefined,
      ...config
    });
  },

  /**
   * 下载文件
   * @param {string} url - 下载路径
   * @param {object} params - 查询参数
   * @param {string} filename - 保存的文件名
   * @param {object} config - 自定义配置
   * @returns {Promise}
   */
  download(url, params = {}, filename = '', config = {}) {
    return service
      .get(url, {
        params,
        responseType: 'blob',
        ...config
      })
      .then(response => {
        // 创建a标签下载
        const blob = new Blob([response]);
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename || this.getFilenameFromResponse(response);
        link.click();
        URL.revokeObjectURL(link.href);
        return response;
      });
  },

  /**
   * 从响应头中获取文件名
   * @param {object} response - axios响应对象
   * @returns {string} 文件名
   */
  getFilenameFromResponse(response) {
    const contentDisposition = response.headers['content-disposition'];
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
      if (filenameMatch && filenameMatch.length === 2) {
        return filenameMatch[1];
      }
    }
    return Date.now().toString();
  },

  /**
   * 取消所有请求
   */
  cancelAllRequests() {
    for (const [key, cancel] of pendingRequests.entries()) {
      cancel('用户取消请求');
      pendingRequests.delete(key);
    }
  }
};
