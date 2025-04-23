/**
 * 登陆相关API
 */
import http from '@/utils/axios';

// 注册
export function userRegister(data) {
  return http.post('/backend/v1/login/userRegister', data);
}

// 注册
export function userLogin(data) {
  return http.post('/backend/v1/login/userLogin', data);
}
