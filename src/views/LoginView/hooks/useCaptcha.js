import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { getVerificationCode } from '@/api/verificationCode';

export default function useCaptcha() {
  const captchaImageUrl = ref('');
  const uuid = ref('');

  // 获取验证码
  const fetchCaptcha = async () => {
    try {
      const res = await getVerificationCode();
      uuid.value = res.uuid;
      captchaImageUrl.value = res.image_path;
      return { uuid: res.uuid, captchaImageUrl: res.image_path };
    } catch (err) {
      ElMessage.error('获取验证码失败');
      return { uuid: '', captchaImageUrl: '' };
    }
  };

  // 刷新验证码
  const refreshCaptcha = async () => {
    try {
      const res = await getVerificationCode();
      uuid.value = res.uuid;
      captchaImageUrl.value = res.image_path;
      ElMessage.success('验证码已刷新');
      return { uuid: res.uuid, captchaImageUrl: res.image_path };
    } catch (err) {
      ElMessage.error('刷新验证码失败');
      return { uuid: '', captchaImageUrl: '' };
    }
  };

  return {
    captchaImageUrl,
    uuid,
    fetchCaptcha,
    refreshCaptcha
  };
}
