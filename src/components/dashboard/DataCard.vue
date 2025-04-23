<template>
  <div class="card stat-card">
    <div class="card-icon" :class="color + '-bg'">
      <i :class="iconClass"></i>
    </div>
    <div class="card-info">
      <h3>{{ title }}</h3>
      <p>{{ value }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  icon: {
    type: String,
    default: 'tachometer-alt'
  },
  color: {
    type: String,
    default: 'blue',
    validator: (value) => ['blue', 'green', 'orange', 'purple', 'red'].includes(value)
  }
});

// 计算图标类名
const iconClass = computed(() => {
  return `fas fa-${props.icon}`;
});
</script>

<style scoped>
.card {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 20px;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  margin-bottom: 20px;
  height: 100%;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.stat-card {
  flex-direction: row;
}

.card-icon {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  color: #fff;
  font-size: 20px;
}

.blue-bg {
  background-color: #3a7afe;
}

.green-bg {
  background-color: #36c46e;
}

.orange-bg {
  background-color: #ff9500;
}

.purple-bg {
  background-color: #af52de;
}

.red-bg {
  background-color: #ff3b30;
}

.card-info {
  flex-grow: 1;
}

.card-info h3 {
  font-size: 14px;
  color: #888;
  margin-bottom: 8px;
  font-weight: normal;
}

.card-info p {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
}
</style> 