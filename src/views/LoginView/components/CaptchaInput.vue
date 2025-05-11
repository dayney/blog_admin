<template>
  <div class="captcha-container">
    <div class="input-with-icon">
      <el-icon><InfoFilled /></el-icon>
      <div class="captcha-wrapper">
        <el-input 
          v-model="inputValue" 
          :placeholder="placeholder" 
          class="custom-input captcha-input" 
          @input="handleInput"
        />
        <div class="captcha-img" @click="handleRefresh">
          <img :src="getImageUrl(captchaUrl)" alt="验证码" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue';
import { getImageUrl } from '@/utils/tools';
import { InfoFilled } from '@element-plus/icons-vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  captchaUrl: {
    type: String,
    required: true
  },
  placeholder: {
    type: String,
    default: '请输入验证码'
  }
});

const emit = defineEmits(['update:modelValue', 'refresh']);

const inputValue = ref(props.modelValue);

// 监听外部 modelValue 变化
watch(
  () => props.modelValue,
  newValue => {
    inputValue.value = newValue;
  }
);

// 监听内部 inputValue 变化
const handleInput = () => {
  emit('update:modelValue', inputValue.value);
};

// 处理刷新验证码
const handleRefresh = () => {
  emit('refresh');
};
</script>

<style lang="scss" scoped>
@use 'sass:math';
@use '@/styles/variables.scss' as *;
@use '@/styles/mixins.scss' as *;

/* 验证码样式 */
.captcha-container {
  width: 100%;
}

.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  
  i {
    position: absolute;
    left: 12px;
    color: $text-placeholder;
    font-size: 16px;
    z-index: 1;
  }
}

.captcha-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  gap: 10px;
}

.captcha-input {
  width: calc(100% - 130px);
  flex-shrink: 1;
  
  :deep(.el-input__inner) {
    padding-left: 40px;
    height: 44px;
    font-size: 14px;
    border-radius: $border-radius-mini;
  }
}

.captcha-img {
  width: 120px;
  height: 44px;
  border-radius: $border-radius-mini;
  overflow: hidden;
  cursor: pointer;
  background-color: #f2f3f5;
  border: 1px solid $border-color-light;
  padding: 0;
  flex-shrink: 0;
  position: relative;
  
  img {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    object-fit: fill;
  }
}

/* Element UI 自定义样式 */
:deep(.custom-input) {
  --el-input-height: 44px;
}

:deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px $border-color-light inset;
  
  &.is-focus {
    box-shadow: 0 0 0 1px $primary-color inset;
  }
}
</style>
