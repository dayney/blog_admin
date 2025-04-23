// 当前环境
export const isDev = import.meta.env.MODE === 'development';
export const isTest = import.meta.env.MODE === 'test';
export const isProd = import.meta.env.MODE === 'production';

// API基础路径
export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

// 图片基础路径
export const imageBaseUrl = import.meta.env.VITE_IMAGE_BASE_URL;

// 项目名称
export const envName = import.meta.env.VITE_APP_TITLE;

/**
 * 获取图片完整路径
 * @param {string} path - 图片路径
 * @returns {string} - 完整的图片URL
 */
export function getImageUrl(path) {
  if (!path) return '';

  // 如果是完整URL或base64，直接返回
  if (path.startsWith('http') || path.startsWith('data:')) {
    return path;
  }

  // 确保路径以/开头
  const imgPath = path.startsWith('/') ? path : `/${path}`;
  return `${imageBaseUrl}${imgPath}`;
}

/**
 * 获取当前环境信息
 * @returns {Object} 环境信息
 */
export function getEnvInfo() {
  return {
    mode: import.meta.env.MODE,
    isProd,
    isDev,
    isTest,
    apiBaseUrl,
    imageBaseUrl,
    title: envName
  };
}
