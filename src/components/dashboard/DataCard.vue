<template>
  <div class="card stat-card">
    <div class="card-icon" :class="color + '-bg'">
      <el-icon :size="24"><component :is="icon" /></el-icon>
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
    default: 'Odometer'
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
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  padding: 20px;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  height: 100%;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-card {
  flex-direction: row;
}

.card-icon {
  width: 56px;
  height: 56px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  color: #fff;
}

.blue-bg {
  background-color: #0077d9;
}

.green-bg {
  background-color: #4cd964;
}

.orange-bg {
  background-color: #ff9500;
}

.purple-bg {
  background-color: #bf5af2;
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
  font-size: 26px;
  font-weight: 600;
  color: #333;
  margin: 0;
}
</style> 