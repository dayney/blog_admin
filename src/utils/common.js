/**
 * 通用工具函数
 */

/**
 * 深拷贝对象
 * @param {Object} obj 要拷贝的对象
 * @returns {Object} 拷贝后的新对象
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  // 处理日期对象
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  
  // 处理数组
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item));
  }
  
  // 处理对象
  const cloned = {};
  Object.keys(obj).forEach(key => {
    cloned[key] = deepClone(obj[key]);
  });
  
  return cloned;
}

/**
 * 防抖函数
 * @param {Function} fn 要执行的函数
 * @param {number} delay 延迟时间(毫秒)
 * @returns {Function} 防抖处理后的函数
 */
export function debounce(fn, delay = 300) {
  let timer = null;
  return function(...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

/**
 * 节流函数
 * @param {Function} fn 要执行的函数
 * @param {number} limit 限制时间(毫秒)
 * @returns {Function} 节流处理后的函数
 */
export function throttle(fn, limit = 300) {
  let inThrottle = false;
  return function(...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * 格式化日期
 * @param {Date|number|string} date 日期对象、时间戳或日期字符串
 * @param {string} format 格式模板，如 'YYYY-MM-DD HH:mm:ss'
 * @returns {string} 格式化后的日期字符串
 */
export function formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const padZero = num => String(num).padStart(2, '0');
  
  const map = {
    YYYY: d.getFullYear(),
    MM: padZero(d.getMonth() + 1),
    DD: padZero(d.getDate()),
    HH: padZero(d.getHours()),
    mm: padZero(d.getMinutes()),
    ss: padZero(d.getSeconds()),
  };
  
  return format.replace(/YYYY|MM|DD|HH|mm|ss/g, matched => map[matched]);
}

/**
 * 检查URL是否有效
 * @param {string} url 要检查的URL
 * @returns {boolean} 是否为有效URL
 */
export function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * 将查询参数对象转换为URL查询字符串
 * @param {Object} params 查询参数对象
 * @returns {string} URL查询字符串
 */
export function objectToQueryString(params) {
  return Object.keys(params)
    .filter(key => params[key] != null && params[key] !== '')
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
}

/**
 * 解析URL查询字符串为对象
 * @param {string} queryString 查询字符串
 * @returns {Object} 解析后的对象
 */
export function parseQueryString(queryString) {
  if (!queryString || typeof queryString !== 'string') {
    return {};
  }
  
  const query = {};
  const pairs = queryString.replace(/^\?/, '').split('&');
  
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i].split('=');
    if (pair[0]) {
      query[decodeURIComponent(pair[0])] = pair[1] 
        ? decodeURIComponent(pair[1].replace(/\+/g, ' ')) 
        : '';
    }
  }
  
  return query;
}

/**
 * 生成指定范围内的随机整数
 * @param {number} min 最小值
 * @param {number} max 最大值
 * @returns {number} 随机整数
 */
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 从数组中随机获取一个元素
 * @param {Array} array 源数组
 * @returns {*} 随机元素
 */
export function randomItem(array) {
  if (!Array.isArray(array) || array.length === 0) {
    return null;
  }
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * 数组去重
 * @param {Array} array 要去重的数组
 * @returns {Array} 去重后的新数组
 */
export function uniqueArray(array) {
  return [...new Set(array)];
}

/**
 * 将数组按指定大小分组
 * @param {Array} array 源数组
 * @param {number} size 每组大小
 * @returns {Array} 分组后的二维数组
 */
export function chunkArray(array, size) {
  if (!Array.isArray(array) || size <= 0) {
    return [];
  }
  
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  
  return result;
}

/**
 * 获取本地存储
 * @param {string} key 键名
 * @param {*} defaultValue 默认值
 * @returns {*} 存储值或默认值
 */
export function getLocalStorage(key, defaultValue = null) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
  } catch (error) {
    console.error('获取本地存储失败:', error);
    return defaultValue;
  }
}

/**
 * 设置本地存储
 * @param {string} key 键名
 * @param {*} value 值
 */
export function setLocalStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('设置本地存储失败:', error);
  }
}

/**
 * 删除本地存储
 * @param {string} key 键名
 */
export function removeLocalStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('删除本地存储失败:', error);
  }
}

/**
 * 复制文本到剪贴板
 * @param {string} text 要复制的文本
 * @returns {Promise} 返回Promise，成功或失败
 */
export function copyToClipboard(text) {
  return navigator.clipboard.writeText(text)
    .then(() => {
      return true;
    })
    .catch(err => {
      console.error('复制到剪贴板失败:', err);
      return false;
    });
}

/**
 * 获取文件扩展名
 * @param {string} filename 文件名
 * @returns {string} 文件扩展名（小写）
 */
export function getFileExtension(filename) {
  if (!filename || typeof filename !== 'string') {
    return '';
  }
  
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2).toLowerCase();
}

/**
 * 格式化文件大小
 * @param {number} bytes 字节数
 * @param {number} decimals 小数位数
 * @returns {string} 格式化后的文件大小
 */
export function formatFileSize(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
} 