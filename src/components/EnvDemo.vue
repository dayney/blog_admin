<template>
  <div class="env-demo">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>环境配置演示</span>
        </div>
      </template>

      <div class="env-info">
        <p><strong>当前环境：</strong> {{ currentEnv }}</p>
        <p><strong>环境名称：</strong> {{ envName }}</p>
        <p><strong>API地址：</strong> {{ apiBaseUrl }}</p>
        <p><strong>图片基础地址：</strong> {{ imageBaseUrl }}</p>
      </div>

      <div class="image-demo" v-if="demoImage">
        <h3>图片示例：</h3>
        <div class="img-container">
          <img :src="demoImage" alt="示例图片" />
          <p class="img-path">路径: avatar/demo.jpg</p>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { isDev, isTest, isProd, envName, apiBaseUrl, imageBaseUrl, getImageUrl } from '../utils/env';

// 当前环境名称
const currentEnv = computed(() => {
  if (isDev) return '开发环境';
  if (isTest) return '测试环境';
  if (isProd) return '生产环境';
  return '未知环境';
});

// 示例图片
const demoImage = computed(() => {
  return getImageUrl('avatar/demo.jpg');
});
</script>

<style scoped>
.env-demo {
  max-width: 800px;
  margin: 20px auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.env-info {
  margin-bottom: 20px;
}

.env-info p {
  margin: 10px 0;
  font-size: 16px;
}

.image-demo {
  border-top: 1px solid #ebeef5;
  padding-top: 20px;
}

.img-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.img-container img {
  max-width: 200px;
  max-height: 200px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.img-path {
  margin-top: 10px;
  color: #909399;
}
</style>
