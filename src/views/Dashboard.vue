<template>
  <div class="dashboard">
    <div class="section-header">
      <h2>仪表盘</h2>
      <div class="subtitle">系统概览</div>
    </div>

    <!-- 数据概览区块 -->
    <div class="stats-cards">
      <div class="card stat-card" v-for="(stat, index) in statsCards" :key="index">
        <div class="stat-icon-container" :class="stat.bgColor">
          <i :class="stat.icon"></i>
        </div>
        <div class="card-info">
          <h3>{{ stat.title }}</h3>
          <p>{{ stat.value }}</p>
        </div>
      </div>
    </div>

    <!-- 图表和活动信息区 -->
    <div class="grid-row">
      <div class="card visits-trend-card">
        <div class="card-header">
          <h3>访问趋势</h3>
          <div class="chart-period-tabs">
            <el-radio-group v-model="chartTimeRange" size="small" @change="drawChart">
              <el-radio-button label="week">本周</el-radio-button>
              <el-radio-button label="month">本月</el-radio-button>
              <el-radio-button label="year">本年</el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <div class="chart-container">
          <div class="chart-legends">
            <div class="chart-legend">
              <span class="chart-legend-color" style="background-color: #0071e3;"></span>
              <span class="chart-legend-text">网站访问量</span>
            </div>
            <div class="chart-legend">
              <span class="chart-legend-color" style="background-color: #ff9500;"></span>
              <span class="chart-legend-text">移动端访问量</span>
            </div>
            <div class="chart-legend">
              <span class="chart-legend-color" style="background-color: #34c759;"></span>
              <span class="chart-legend-text">API调用量</span>
            </div>
          </div>
          <div id="traffic-chart" style="width:100%; height:280px;"></div>
        </div>
      </div>
      
      <div class="card activity-card">
        <div class="card-header">
          <h3>最近活动</h3>
          <a href="#" class="view-all">查看全部</a>
        </div>
        <div class="activity-list">
          <div class="timeline">
            <div class="timeline-item" v-for="(activity, index) in recentActivities" :key="index">
              <div class="timeline-dot" :style="{ backgroundColor: activity.color }">
                <i class="fas fa-circle"></i>
              </div>
              <div class="timeline-content">
                <p class="timeline-text">{{ activity.content }}</p>
                <span class="timeline-time">{{ activity.time }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 最新内容表格 -->
    <div class="card content-card">
      <div class="card-header">
        <h3>最新内容</h3>
        <a href="#" class="view-all">查看全部</a>
      </div>
      <el-table :data="latestContent" style="width: 100%">
        <el-table-column prop="title" label="标题" min-width="350"></el-table-column>
        <el-table-column prop="author" label="作者" width="120"></el-table-column>
        <el-table-column prop="category" label="分类" width="120"></el-table-column>
        <el-table-column prop="publishTime" label="发布时间" width="180"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import * as echarts from 'echarts';

const chartTimeRange = ref('month');
let myChart = null;

// 统计卡片数据
const statsCards = ref([
  { title: '用户总数', value: '1,254', icon: 'fas fa-users', bgColor: 'blue-bg' },
  { title: '内容总数', value: '5,678', icon: 'fas fa-file-lines', bgColor: 'green-bg' },
  { title: '本月访问', value: '24,853', icon: 'fas fa-eye', bgColor: 'orange-bg' },
  { title: '本月收入', value: '¥15,245', icon: 'fas fa-money-bill-wave', bgColor: 'purple-bg' }
]);

// 最近活动数据
const recentActivities = ref([
  { content: '新增了文章《iOS设计风格探讨》', time: '5分钟前', type: 'success', color: '#34c759' },
  { content: '新用户张小明注册了账号', time: '1小时前', type: 'primary', color: '#0071e3' },
  { content: '更新了系统设置', time: '3小时前', type: 'warning', color: '#ff9500' },
  { content: '系统检测到异常登录', time: '昨天', type: 'danger', color: '#ff3b30' },
  { content: '更新了SEO设置', time: '更早', type: '', color: '#af52de' }
]);

// 最新内容数据
const latestContent = ref([
  { title: 'iOS设计风格探讨', author: '张小明', category: '设计', publishTime: '2023-06-01 10:30:00' },
  { title: 'Vue3与Element Plus结合使用指南', author: '李四', category: '开发', publishTime: '2023-05-28 16:45:00' },
  { title: '响应式设计最佳实践', author: '王五', category: '设计', publishTime: '2023-05-25 09:20:00' },
  { title: '后台管理系统架构分析', author: '赵六', category: '技术', publishTime: '2023-05-20 14:10:00' }
]);

// 图表数据
const chartData = {
  week: {
    xAxis: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    series: [
      {
        name: '网站访问量',
        data: [800, 950, 1000, 980, 1100, 1300, 900],
        color: '#0071e3'
      },
      {
        name: '移动端访问量',
        data: [600, 700, 750, 780, 800, 950, 700],
        color: '#ff9500'
      },
      {
        name: 'API调用量',
        data: [1500, 1700, 1800, 1750, 1900, 2100, 1600],
        color: '#34c759'
      }
    ]
  },
  month: {
    xAxis: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    series: [
      {
        name: '网站访问量',
        data: [5000, 5200, 5100, 5300, 5800, 6000, 6100, 6050, 6200, 6300, 6350, 6500],
        color: '#0071e3'
      },
      {
        name: '移动端访问量',
        data: [3000, 3100, 3050, 3200, 3500, 4100, 4000, 3900, 4050, 4200, 4300, 4400],
        color: '#ff9500'
      },
      {
        name: 'API调用量',
        data: [8000, 7800, 7900, 8200, 9000, 9200, 9300, 9250, 9500, 9800, 10000, 10200],
        color: '#34c759'
      }
    ]
  },
  year: {
    xAxis: ['2019', '2020', '2021', '2022', '2023'],
    series: [
      {
        name: '网站访问量',
        data: [35000, 42000, 49000, 58000, 65000],
        color: '#0071e3'
      },
      {
        name: '移动端访问量',
        data: [25000, 32000, 39000, 45000, 52000],
        color: '#ff9500'
      },
      {
        name: 'API调用量',
        data: [60000, 70000, 82000, 91000, 102000],
        color: '#34c759'
      }
    ]
  }
};

// 初始化图表
onMounted(() => {
  drawChart();
  
  // 窗口调整大小时重绘图表
  window.addEventListener('resize', drawChart);
});

onUnmounted(() => {
  window.removeEventListener('resize', drawChart);
  // 销毁图表实例，避免内存泄漏
  if(myChart) {
    myChart.dispose();
    myChart = null;
  }
});

// 绘制图表
function drawChart() {
  const chartDom = document.getElementById('traffic-chart');
  if (!chartDom) return;
  
  if (myChart) {
    myChart.dispose();
  }
  
  myChart = echarts.init(chartDom);
  
  const currentData = chartData[chartTimeRange.value];
  
  const option = {
    color: currentData.series.map(s => s.color),
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
        label: {
          show: true
        }
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: currentData.xAxis,
      axisLine: {
        lineStyle: {
          color: '#eaeaea'
        }
      },
      axisLabel: {
        color: '#888'
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        lineStyle: {
          color: '#eaeaea',
          type: 'dashed'
        }
      },
      axisLabel: {
        color: '#888'
      }
    },
    series: currentData.series.map(series => ({
      name: series.name,
      type: 'line',
      smooth: true,
      data: series.data,
      areaStyle: {
        opacity: 0.1,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: series.color },
          { offset: 1, color: 'rgba(255, 255, 255, 0)' }
        ])
      },
      lineStyle: {
        width: 2,
        color: series.color
      },
      itemStyle: {
        color: series.color
      },
      symbol: 'circle',
      symbolSize: 6
    }))
  };
  
  option && myChart.setOption(option);
}

// 十六进制颜色转RGBA
function hexToRgba(hex, opacity) {
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
</script>

<style lang="scss">
@import '@/assets/variables.scss';

// 混合器(Mixins)
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin responsive-grid($columns) {
  display: grid;
  grid-template-columns: repeat($columns, 1fr);
  gap: 20px;
}

// 主容器样式
.dashboard {
  padding: 20px;
  background-color: $bg-color;
  min-height: calc(100vh - 60px);

  // 标题部分
  .section-header {
    margin-bottom: 24px;
    border-bottom: 1px solid $border-color-lighter;
    padding: 20px 0 12px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;

    h2 {
      font-size: 24px;
      font-weight: 600;
      color: $text-primary;
      margin: 0;
    }

    .subtitle {
      font-size: 14px;
      color: $text-secondary;
    }
  }

  // 统计卡片区域
  .stats-cards {
    @include responsive-grid(4);
    margin-bottom: 24px;

    // 响应式调整
    @media (max-width: 1200px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  // 图表和活动信息区域
  .grid-row {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 20px;
    margin-bottom: 24px;

    // 响应式调整
    @media (max-width: 1200px) {
      grid-template-columns: 1fr;
    }
  }

  // 卡片公共样式
  .card {
    background-color: $bg-color;
    border-radius: $border-radius-base;
    box-shadow: $box-shadow-base;
    padding: 20px;
    transition: all $transition-time;

    &-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      h3 {
        font-size: 18px;
        font-weight: 600;
        color: $text-primary;
        margin: 0;
      }
    }

    // 内容卡片样式
    &.content-card {
      margin-bottom: 24px;
    }
  }

  // 图表相关样式
  .chart {
    &-period-tabs {
      margin-bottom: 15px;
    }

    &-legends {
      display: flex;
      margin-bottom: 15px;
      padding-left: 20px;
    }

    &-legend {
      display: flex;
      align-items: center;
      margin-right: 20px;

      &-color {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        margin-right: 8px;
      }

      &-text {
        font-size: 12px;
        color: $text-secondary;
      }
    }
  }

  // 链接样式
  .view-all {
    color: $primary-color;
    font-size: 14px;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  // 活动列表样式
  .activity-list {
    padding: 0 10px;
    height: 310px;
    overflow-y: auto;
  }

  // 时间线样式
  .timeline {
    position: relative;
    padding-left: 15px;

    &::before {
      content: '';
      position: absolute;
      left: 5px;
      top: 0;
      bottom: 0;
      width: 1px;
      background-color: $border-color-lighter;
    }

    &-item {
      position: relative;
      margin-bottom: 20px;
      padding-left: 20px;
    }

    &-dot {
      position: absolute;
      left: 0;
      top: 0;
      width: 12px;
      height: 12px;
      border-radius: $border-radius-circle;
      font-size: 0;
      line-height: 0;
      @include flex-center;

      i {
        font-size: 6px;
        color: $text-white;
      }
    }

    &-content {
      position: relative;
    }

    &-text {
      margin: 0 0 5px;
      font-size: 14px;
      color: $text-primary;
    }

    &-time {
      font-size: 12px;
      color: $text-secondary;
    }
  }

  // 统计卡片样式
  .stat-card {
    display: flex;
    align-items: center;
    background-color: $bg-color;
    box-shadow: $box-shadow-light;
    border-radius: $border-radius-base;
    padding: 20px;

    .stat-icon-container {
      width: 60px;
      height: 60px;
      border-radius: 10px;
      @include flex-center;
      margin-right: 20px;
      color: $text-white;
      font-size: 28px;

      &.blue-bg {
        background-color: $primary-color;
      }

      &.green-bg {
        background-color: $success-color;
      }

      &.orange-bg {
        background-color: $warning-color;
      }

      &.purple-bg {
        background-color: $info-color;
      }
    }

    .card-info {
      h3 {
        font-size: 14px;
        color: $text-secondary;
        margin-bottom: 8px;
        font-weight: normal;
      }

      p {
        font-size: 26px;
        font-weight: 600;
        color: $text-primary;
        margin: 0;
      }
    }
  }

  // 自定义Element Plus样式
  :deep(.el-timeline-item__node) {
    top: 4px;
  }

  :deep(.el-timeline-item__content) {
    font-size: 14px;
    color: $text-primary;
  }

  :deep(.el-timeline-item__timestamp) {
    color: $text-secondary;
    font-size: 12px;
    margin-top: 4px;
  }

  :deep(.el-radio-group) {
    border-radius: $border-radius-small;
  }

  :deep(.el-radio-button__inner) {
    background-color: $hover-bg-color;
    border-color: $border-color-base;
    color: $text-secondary;
    border-radius: $border-radius-small;
    margin: 0 2px;
    padding: 5px 15px;
    font-size: 12px;
    height: 28px;
  }

  :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
    background-color: $primary-color;
    border-color: $primary-color;
    color: $text-white;
    box-shadow: none;
  }

  :deep(.el-table) {
    --el-table-border-color: $border-color-base;
    --el-table-header-bg-color: $hover-bg-color;
    --el-table-row-hover-bg-color: $hover-bg-color;

    th {
      font-weight: 600;
      color: $text-primary;
      background-color: $hover-bg-color;
    }
  }
}
</style>
