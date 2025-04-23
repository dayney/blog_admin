/**
 * 登陆相关API
 */
import http from '@/utils/axios';

// 获取图片验证码
export function getVerificationCode(params) {
  return http.get('/backend/v1/login/getVerificationCode', params);
}

// 登陆
export function verificationUserInfo(data) {
  return http.post('/backend/v1/login/verificationUserInfo', data);
}
