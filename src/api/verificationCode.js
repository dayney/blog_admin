/**
 * 登陆相关API
 */
import request from '@/utils/request';

// 获取图片验证码
export function getVerificationCode(params) {
  return request.get('/backend/v1/verificationCode/getVerificationCode', params);
}
