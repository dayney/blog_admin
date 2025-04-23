<template>
  <div class="dashboard">
    <div class="section-header">
      <h2>仪表盘</h2>
      <p>系统概览</p>
    </div>

    <!-- 数据概览区块 -->
    <div class="stats-cards">
      <div class="stats-card-wrapper" v-for="(card, index) in statsCards" :key="index">
        <data-card :title="card.title" :value="card.value" :icon="card.icon" :color="card.color" />
      </div>
    </div>

    <!-- 图表和活动信息区 -->
    <div class="grid-row">
      <div class="card visits-trend-card">
        <div class="card-header">
          <h3>访问趋势</h3>
        </div>
        <div class="chart-period-tabs">
          <el-radio-group v-model="chartTimeRange" size="small" @change="drawChart">
            <el-radio-button value="week">本周</el-radio-button>
            <el-radio-button value="month">本月</el-radio-button>
            <el-radio-button value="year">本年</el-radio-button>
          </el-radio-group>
        </div>
        <div class="chart-container">
          <div class="chart-legends">
            <div class="chart-legend">
              <span class="chart-legend-color" style="background-color: #3a7afe;"></span>
              <span class="chart-legend-text">网站访问量</span>
            </div>
            <div class="chart-legend">
              <span class="chart-legend-color" style="background-color: #ff9500;"></span>
              <span class="chart-legend-text">移动端访问量</span>
            </div>
            <div class="chart-legend">
              <span class="chart-legend-color" style="background-color: #36c46e;"></span>
              <span class="chart-legend-text">API调用量</span>
            </div>
          </div>
          <div id="traffic-chart" style="width:100%; height:240px;"></div>
        </div>
      </div>
      
      <div class="card activity-card">
        <div class="card-header">
          <h3>最近活动</h3>
          <a href="#" class="view-all">查看全部</a>
        </div>
        <div class="activity-list">
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in recentActivities"
              :key="index"
              :type="activity.type"
              :color="activity.color"
              :timestamp="activity.time">
              {{ activity.content }}
            </el-timeline-item>
          </el-timeline>
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
import DataCard from '@/components/dashboard/DataCard.vue';

const chartTimeRange = ref('month');
let myChart = null;

// 统计卡片数据
const statsCards = ref([
  { title: '用户总数', value: '1,254', icon: 'users', color: 'blue' },
  { title: '内容总数', value: '5,678', icon: 'file-alt', color: 'green' },
  { title: '本月访问', value: '24,853', icon: 'eye', color: 'orange' },
  { title: '本月收入', value: '¥15,245', icon: 'wallet', color: 'purple' }
]);

// 最新活动数据
const recentActivities = ref([
  { content: '新增了文章《iOS设计风格探讨》', time: '5分钟前', type: 'success', color: '#36c46e' },
  { content: '新用户张小明注册了账号', time: '1小时前', type: 'primary', color: '#3a7afe' },
  { content: '更新了系统设置', time: '3小时前', type: 'warning', color: '#ff9500' },
  { content: '系统检测到异常登录', time: '昨天', type: 'danger', color: '#ff3b30' },
  { content: '更新了SEO设置', time: '2天前', type: '', color: '#af52de' }
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
        data: [70, 65, 63, 62, 60, 68, 65],
        color: '#3a7afe'
      },
      {
        name: '移动端访问量',
        data: [75, 70, 68, 70, 72, 75, 80],
        color: '#ff9500'
      },
      {
        name: 'API调用量',
        data: [68, 75, 70, 68, 70, 75, 82],
        color: '#36c46e'
      }
    ]
  },
  month: {
    xAxis: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    series: [
      {
        name: '网站访问量',
        data: [320, 332, 301, 334, 390, 330, 320, 350, 340, 360, 390, 420],
        color: '#3a7afe'
      },
      {
        name: '移动端访问量',
        data: [120, 132, 101, 134, 90, 230, 210, 180, 190, 210, 230, 245],
        color: '#ff9500'
      },
      {
        name: 'API调用量',
        data: [220, 182, 191, 234, 290, 330, 310, 320, 315, 350, 370, 380],
        color: '#36c46e'
      }
    ]
  },
  year: {
    xAxis: ['2019', '2020', '2021', '2022', '2023'],
    series: [
      {
        name: '网站访问量',
        data: [1100, 1290, 1330, 1320, 1500],
        color: '#3a7afe'
      },
      {
        name: '移动端访问量',
        data: [980, 1090, 1130, 1120, 1200],
        color: '#ff9500'
      },
      {
        name: 'API调用量',
        data: [260, 290, 340, 390, 450],
        color: '#36c46e'
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
        type: 'shadow',
        label: {
          show: true
        }
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
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
        opacity: 0.1
      },
      lineStyle: {
        width: 2
      },
      itemStyle: {
        color: series.color
      }
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

<style scoped>
.dashboard {
  padding: 20px;
}

.section-header {
  margin-bottom: 24px;
}

.section-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.section-header p {
  font-size: 14px;
  color: #888;
  margin: 0;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.grid-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
}

.card {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 20px;
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.chart-period-tabs {
  margin-bottom: 15px;
}

.chart-legends {
  display: flex;
  margin-bottom: 15px;
}

.chart-legend {
  display: flex;
  align-items: center;
  margin-right: 20px;
}

.chart-legend-color {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  margin-right: 8px;
}

.chart-legend-text {
  font-size: 12px;
  color: #666;
}

.view-all {
  color: #3a7afe;
  font-size: 14px;
  text-decoration: none;
}

.view-all:hover {
  text-decoration: underline;
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .grid-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .stats-cards {
    grid-template-columns: 1fr;
  }
}
</style>
