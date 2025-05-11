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
          <el-icon><component :is="stat.icon"></component></el-icon>
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
              <el-radio-button label="week" value="week">本周</el-radio-button>
              <el-radio-button label="month" value="month">本月</el-radio-button>
              <el-radio-button label="year" value="year">本年</el-radio-button>
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
                <el-icon><CirclePlus /></el-icon>
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
import echarts from '@/utils/echarts';
import { 
  User, View, Money, Document, 
  CirclePlus, Check, Warning, InfoFilled, Setting 
} from '@element-plus/icons-vue';

const chartTimeRange = ref('month');
let myChart = null;

// 统计卡片数据
const statsCards = ref([
  { title: '用户总数', value: '1,254', icon: 'User', bgColor: 'blue-bg' },
  { title: '内容总数', value: '5,678', icon: 'Document', bgColor: 'green-bg' },
  { title: '本月访问', value: '24,853', icon: 'View', bgColor: 'orange-bg' },
  { title: '本月收入', value: '¥15,245', icon: 'Money', bgColor: 'purple-bg' }
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

<style scoped lang="scss">
@use '@/assets/scss/mixins.scss' as *;

.dashboard {
  padding: 20px;
  
  .section-header {
    margin-bottom: 20px;
    h2 {
      margin: 0;
      color: var(--el-text-color-primary);
      font-size: 24px;
    }
    .subtitle {
      color: var(--el-text-color-secondary);
      font-size: 14px;
      margin-top: 5px;
    }
  }
  
  .stats-cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 20px;
    
    @media (max-width: 1200px) {
      grid-template-columns: repeat(2, 1fr);
    }
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
  
  .stat-card {
    display: flex;
    align-items: center;
    padding: 20px;
    
    .stat-icon-container {
      width: 50px;
      height: 50px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 15px;
      
      .el-icon {
        font-size: 24px;
        color: white;
      }
    }
    
    .card-info {
      h3 {
        margin: 0;
        font-size: 14px;
        color: var(--el-text-color-secondary);
        font-weight: 400;
      }
      
      p {
        margin: 5px 0 0;
        font-size: 24px;
        font-weight: 600;
        color: var(--el-text-color-primary);
      }
    }
  }
  
  .blue-bg { background-color: #0071e3; }
  .green-bg { background-color: #34c759; }
  .orange-bg { background-color: #ff9500; }
  .purple-bg { background-color: #af52de; }
  
  .grid-row {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 20px;
    margin-bottom: 20px;
    
    @media (max-width: 1200px) {
      grid-template-columns: 1fr;
    }
  }
  
  .card {
    background: var(--el-bg-color);
    border-radius: 8px;
    box-shadow: var(--el-box-shadow-light);
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    border-bottom: 1px solid var(--el-border-color-lighter);
    
    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
    }
    
    .view-all {
      color: var(--el-color-primary);
      font-size: 14px;
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
  
  .visits-trend-card {
    .chart-period-tabs {
      .el-radio-button {
        height: 30px;
        line-height: 30px;
      }
    }
    
    .chart-container {
      padding: 15px 20px;
    }
    
    .chart-legends {
      display: flex;
      margin-bottom: 15px;
      flex-wrap: wrap;
      
      .chart-legend {
        display: flex;
        align-items: center;
        margin-right: 20px;
        
        .chart-legend-color {
          width: 12px;
          height: 12px;
          border-radius: 2px;
          margin-right: 5px;
        }
        
        .chart-legend-text {
          font-size: 12px;
          color: var(--el-text-color-secondary);
        }
      }
    }
  }
  
  .activity-card {
    .activity-list {
      padding: 15px 20px;
    }
    
    .timeline {
      position: relative;
      
      &:before {
        content: '';
        position: absolute;
        top: 0;
        left: 5px;
        height: 100%;
        width: 2px;
        background-color: var(--el-border-color-lighter);
      }
      
      .timeline-item {
        position: relative;
        padding-left: 25px;
        margin-bottom: 15px;
        
        &:last-child {
          margin-bottom: 0;
        }
        
        .timeline-dot {
          position: absolute;
          left: 0;
          top: 5px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          
          .el-icon {
            font-size: 12px;
            color: white;
          }
        }
        
        .timeline-content {
          .timeline-text {
            margin: 0;
            font-size: 14px;
            color: var(--el-text-color-primary);
          }
          
          .timeline-time {
            display: block;
            font-size: 12px;
            color: var(--el-text-color-secondary);
            margin-top: 3px;
          }
        }
      }
    }
  }
  
  .content-card {
    .el-table {
      --el-table-header-bg-color: var(--el-fill-color-lighter);
      
      .el-table__header th {
        font-weight: 600;
      }
    }
  }
}
</style>
