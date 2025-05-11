/**
 * 登陆相关API
 */
import RestfulAPI from './index'
import request from '@/utils/axios';

class UserAPI extends RestfulAPI {
  constructor() {
    super('users')
  }
  
  // 获取图片验证码
  getVerificationCode(params) {
    return request.get('/backend/v1/verificationCode/getVerificationCode', params);
  }

  // 注册
  userRegister(data) {
    return request.post('/backend/v1/login/userRegister', data);
  }

  // 登陆
  userLogin(data) {
    return request.post('/backend/v1/login/userLogin', data);
  }
}

export default new UserAPI();

// 注册
export function userRegister(data) {
  return request.post('/backend/v1/login/userRegister', data);
}

// 注册
export function userLogin(data) {
  return request.post('/backend/v1/login/userLogin', data);
}
