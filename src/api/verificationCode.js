/**
 * 登陆相关API
 */
import http from '@/utils/axios';

// 获取图片验证码
export function getVerificationCode(params) {
  return http.get('/backend/v1/verificationCode/getVerificationCode', params);
}
