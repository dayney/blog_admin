import axios from 'axios';
import { ElMessage } from 'element-plus';
import { getLocalStorage, removeLocalStorage } from './common';

// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
});

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 从本地存储获取token
    const token = getLocalStorage('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  error => {
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data;
    
    // 根据后端约定的状态码进行处理
    if (res.code !== 200 && res.code !== 0) {
      ElMessage({
        message: res.message || '请求失败',
        type: 'error',
        duration: 5 * 1000
      });
      
      // 处理特定错误码
      if (res.code === 401) {
        // token失效，清除用户信息并重定向到登录页
        removeLocalStorage('token');
        removeLocalStorage('userInfo');
        
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      }
      
      return Promise.reject(new Error(res.message || '请求失败'));
    } else {
      return res;
    }
  },
  error => {
    let message = '请求失败';
    
    if (error.response) {
      const { status } = error.response;
      
      switch (status) {
        case 400:
          message = '请求参数错误';
          break;
        case 401:
          message = '未授权，请重新登录';
          // 清除用户信息并重定向到登录页
          removeLocalStorage('token');
          removeLocalStorage('userInfo');
          
          setTimeout(() => {
            window.location.href = '/login';
          }, 1500);
          break;
        case 403:
          message = '拒绝访问';
          break;
        case 404:
          message = '请求的资源不存在';
          break;
        case 500:
          message = '服务器内部错误';
          break;
        default:
          message = `请求失败(${status})`;
      }
    } else if (error.message.includes('timeout')) {
      message = '请求超时，请重试';
    } else if (error.message.includes('Network Error')) {
      message = '网络错误，请检查网络连接';
    }
    
    ElMessage({
      message,
      type: 'error',
      duration: 5 * 1000
    });
    
    return Promise.reject(error);
  }
);

/**
 * GET请求
 * @param {string} url 请求地址
 * @param {Object} params 请求参数
 * @param {Object} config 额外配置
 * @returns {Promise} 请求Promise
 */
export function get(url, params = {}, config = {}) {
  return service.get(url, {
    params,
    ...config
  });
}

/**
 * POST请求
 * @param {string} url 请求地址
 * @param {Object} data 请求数据
 * @param {Object} config 额外配置
 * @returns {Promise} 请求Promise
 */
export function post(url, data = {}, config = {}) {
  return service.post(url, data, config);
}

/**
 * PUT请求
 * @param {string} url 请求地址
 * @param {Object} data 请求数据
 * @param {Object} config 额外配置
 * @returns {Promise} 请求Promise
 */
export function put(url, data = {}, config = {}) {
  return service.put(url, data, config);
}

/**
 * DELETE请求
 * @param {string} url 请求地址
 * @param {Object} params 请求参数
 * @param {Object} config 额外配置
 * @returns {Promise} 请求Promise
 */
export function del(url, params = {}, config = {}) {
  return service.delete(url, {
    params,
    ...config
  });
}

/**
 * 上传文件
 * @param {string} url 上传地址
 * @param {FormData} formData 表单数据
 * @param {Function} onProgress 进度回调函数
 * @returns {Promise} 上传Promise
 */
export function upload(url, formData, onProgress = null) {
  return service.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: onProgress ? e => {
      if (e.total > 0) {
        const progress = Math.round((e.loaded * 100) / e.total);
        onProgress(progress);
      }
    } : undefined
  });
}

/**
 * 下载文件
 * @param {string} url 下载地址
 * @param {Object} params 请求参数
 * @param {string} filename 保存的文件名
 * @param {Function} onProgress 进度回调函数
 * @returns {Promise} 下载Promise
 */
export function download(url, params = {}, filename = '', onProgress = null) {
  return service.get(url, {
    params,
    responseType: 'blob',
    onDownloadProgress: onProgress ? e => {
      if (e.total > 0) {
        const progress = Math.round((e.loaded * 100) / e.total);
        onProgress(progress);
      }
    } : undefined
  }).then(response => {
    // 创建Blob对象
    const blob = new Blob([response.data]);
    
    // 创建下载链接
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    
    // 设置下载文件名
    if (filename) {
      link.download = filename;
    } else {
      // 尝试从响应头获取文件名
      const disposition = response.headers['content-disposition'];
      if (disposition && disposition.includes('filename=')) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(disposition);
        if (matches && matches[1]) {
          link.download = matches[1].replace(/['"]/g, '');
        }
      }
    }
    
    // 触发下载
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // 释放URL对象
    URL.revokeObjectURL(link.href);
    
    return response;
  });
}

export default service; 