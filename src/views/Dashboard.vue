<template>
  <div class="dashboard">
    <!-- 统计卡片 -->
    <div class="stats-row">
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-info">
            <div class="stat-title">总用户数</div>
            <div class="stat-number">{{ stats.totalUsers }}</div>
          </div>
          <el-icon class="stat-icon"><User /></el-icon>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-info">
            <div class="stat-title">总订单数</div>
            <div class="stat-number">{{ stats.totalOrders }}</div>
          </div>
          <el-icon class="stat-icon"><ShoppingCart /></el-icon>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-info">
            <div class="stat-title">总营收额</div>
            <div class="stat-number">¥{{ stats.totalRevenue }}</div>
          </div>
          <el-icon class="stat-icon"><Money /></el-icon>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-info">
            <div class="stat-title">今日访问</div>
            <div class="stat-number">{{ stats.todayVisits }}</div>
          </div>
          <el-icon class="stat-icon"><View /></el-icon>
        </div>
      </el-card>
    </div>

    <!-- 图表区域 -->
    <div class="chart-row">
      <el-card class="chart-card">
        <template #header>
          <span>月度订单趋势</span>
        </template>
        <v-chart class="chart" :option="orderChartOption" autoresize />
      </el-card>
      <el-card class="chart-card">
        <template #header>
          <span>月度用户增长</span>
        </template>
        <v-chart class="chart" :option="userChartOption" autoresize />
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from 'echarts/components'
import { User, ShoppingCart, Money, View } from '@element-plus/icons-vue'
import request from '@/utils/axios'

defineOptions({
  name: 'AppDashboard', // 多单词组件名
})

// 注册 ECharts 需要的组件
use([
  CanvasRenderer,
  LineChart,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
])

const stats = ref({
  totalUsers: 0,
  totalOrders: 0,
  totalRevenue: 0,
  todayVisits: 0,
  orderData: [],
  userData: [],
})

const months = [
  '1月',
  '2月',
  '3月',
  '4月',
  '5月',
  '6月',
  '7月',
  '8月',
  '9月',
  '10月',
  '11月',
  '12月',
]

const orderChartOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: { type: 'category', data: months, boundaryGap: false },
  yAxis: { type: 'value', name: '订单量' },
  series: [
    {
      name: '订单数量',
      type: 'line',
      data: stats.value.orderData,
      smooth: true,
      areaStyle: { opacity: 0.3 },
      lineStyle: { color: '#409eff', width: 2 },
      itemStyle: { color: '#409eff' },
    },
  ],
}))

const userChartOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: { type: 'category', data: months },
  yAxis: { type: 'value', name: '用户数' },
  series: [
    {
      name: '新增用户',
      type: 'bar',
      data: stats.value.userData,
      itemStyle: { borderRadius: [4, 4, 0, 0], color: '#67c23a' },
    },
  ],
}))

const fetchStats = async () => {
  try {
    const res = await request.get('/dashboard/stats')
    if (res.code === 200) {
      stats.value = {
        ...stats.value,
        totalUsers: res.data.totalUsers,
        totalOrders: res.data.totalOrders,
        totalRevenue: res.data.totalRevenue,
        todayVisits: res.data.todayVisits,
        orderData: res.data.orderData,
        userData: res.data.userData,
      }
    }
  } catch (error) {
    console.error('获取统计数据失败', error)
  }
}

onMounted(() => {
  fetchStats()
})
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
.stat-card {
  border-radius: 8px;
}
.stat-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.stat-info {
  display: flex;
  flex-direction: column;
}
.stat-title {
  color: #909399;
  font-size: 14px;
}
.stat-number {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-top: 8px;
}
.stat-icon {
  font-size: 48px;
  color: #409eff;
}
.chart-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}
.chart-card {
  border-radius: 8px;
}
.chart {
  height: 360px;
  width: 100%;
}
@media (max-width: 1000px) {
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }
  .chart-row {
    grid-template-columns: 1fr;
  }
}
</style>
