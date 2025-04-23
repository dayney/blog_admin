/**
 * 文章相关API
 */

import http from '@/utils/axios';

// API前缀
const API_PREFIX = '/api/articles';

/**
 * 文章API
 */
export default {
  /**
   * 获取文章列表
   * @param {object} params - 查询参数 { page, pageSize, categoryId, tag, keyword }
   * @returns {Promise}
   */
  getList(params) {
    return http.get(API_PREFIX, params);
  },

  /**
   * 获取文章详情
   * @param {string|number} id - 文章ID
   * @returns {Promise}
   */
  getDetail(id) {
    return http.get(`${API_PREFIX}/${id}`);
  },

  /**
   * 创建文章
   * @param {object} data - 文章数据
   * @returns {Promise}
   */
  create(data) {
    return http.post(API_PREFIX, data);
  },

  /**
   * 更新文章
   * @param {string|number} id - 文章ID
   * @param {object} data - 文章数据
   * @returns {Promise}
   */
  update(id, data) {
    return http.put(`${API_PREFIX}/${id}`, data);
  },

  /**
   * 部分更新文章
   * @param {string|number} id - 文章ID
   * @param {object} data - 需要更新的字段
   * @returns {Promise}
   */
  patch(id, data) {
    return http.patch(`${API_PREFIX}/${id}`, data);
  },

  /**
   * 删除文章
   * @param {string|number} id - 文章ID
   * @returns {Promise}
   */
  delete(id) {
    return http.delete(`${API_PREFIX}/${id}`);
  },

  /**
   * 批量删除文章
   * @param {Array} ids - 文章ID数组
   * @returns {Promise}
   */
  batchDelete(ids) {
    return http.delete(`${API_PREFIX}/batch`, { ids });
  },

  /**
   * 上传文章封面图
   * @param {FormData} formData - 表单数据，需包含file字段
   * @param {Function} onProgress - 上传进度回调
   * @returns {Promise}
   */
  uploadCover(formData, onProgress) {
    return http.upload(`${API_PREFIX}/upload/cover`, formData, onProgress);
  }
};
