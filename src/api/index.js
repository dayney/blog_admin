import request from '@/utils/request'

/**
 * RESTful API 封装
 * @param {string} resource - API资源路径
 */
export default class RestfulAPI {
  constructor(resource) {
    this.resource = resource
  }

  /**
   * 获取列表
   * @param {Object} params - 查询参数
   * @returns {Promise}
   */
  list(params = {}) {
    return request({
      url: `/${this.resource}`,
      method: 'get',
      params
    })
  }

  /**
   * 获取详情
   * @param {string|number} id - 资源ID
   * @returns {Promise}
   */
  get(id) {
    return request({
      url: `/${this.resource}/${id}`,
      method: 'get'
    })
  }

  /**
   * 创建资源
   * @param {Object} data - 资源数据
   * @returns {Promise}
   */
  create(data) {
    return request({
      url: `/${this.resource}`,
      method: 'post',
      data
    })
  }

  /**
   * 更新资源
   * @param {string|number} id - 资源ID
   * @param {Object} data - 更新数据
   * @returns {Promise}
   */
  update(id, data) {
    return request({
      url: `/${this.resource}/${id}`,
      method: 'put',
      data
    })
  }

  /**
   * 部分更新资源
   * @param {string|number} id - 资源ID
   * @param {Object} data - 更新数据
   * @returns {Promise}
   */
  patch(id, data) {
    return request({
      url: `/${this.resource}/${id}`,
      method: 'patch',
      data
    })
  }

  /**
   * 删除资源
   * @param {string|number} id - 资源ID
   * @returns {Promise}
   */
  delete(id) {
    return request({
      url: `/${this.resource}/${id}`,
      method: 'delete'
    })
  }

  /**
   * 自定义请求
   * @param {Object} config - axios配置
   * @returns {Promise}
   */
  request(config) {
    return request(config)
  }
} 