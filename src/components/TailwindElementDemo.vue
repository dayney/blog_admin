<template>
  <div class="tailwind-element-demo p-8 max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold text-blue-600 mb-6">Tailwind CSS 和 Element Plus 演示</h1>
    
    <div class="bg-white shadow-md rounded-lg p-6 mb-8">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Tailwind CSS 部分</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-blue-100 p-4 rounded-lg hover:bg-blue-200 transition-colors duration-300">
          <p class="text-blue-800">Tailwind 卡片 1</p>
        </div>
        <div class="bg-green-100 p-4 rounded-lg hover:bg-green-200 transition-colors duration-300">
          <p class="text-green-800">Tailwind 卡片 2</p>
        </div>
        <div class="bg-purple-100 p-4 rounded-lg hover:bg-purple-200 transition-colors duration-300">
          <p class="text-purple-800">Tailwind 卡片 3</p>
        </div>
      </div>
      
      <div class="mt-6">
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" @click="showMessage">
          Tailwind 按钮 (点击显示消息)
        </button>
      </div>
    </div>
    
    <div class="bg-white shadow-md rounded-lg p-6 mb-8">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Element Plus 部分</h2>
      
      <div class="mb-4">
        <el-button type="primary" @click="openDialog">打开对话框</el-button>
        <el-button type="success">成功按钮</el-button>
        <el-button type="warning">警告按钮</el-button>
        <el-button type="danger">危险按钮</el-button>
      </div>
      
      <div class="mb-4">
        <el-slider v-model="sliderValue" :step="10"></el-slider>
        <p>滑块值: {{ sliderValue }}</p>
      </div>
      
      <div class="mb-4">
        <el-date-picker v-model="date" type="date" placeholder="选择日期"></el-date-picker>
      </div>
      
      <div class="mb-4">
        <el-rate v-model="rating"></el-rate>
        <p>评分: {{ rating }}</p>
      </div>
    </div>
    
    <div class="bg-white shadow-md rounded-lg p-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Tailwind CSS + Element Plus 组合</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-gray-50 p-4 rounded-lg">
          <el-input v-model="input" placeholder="请输入内容" class="mb-2"></el-input>
          <el-button type="primary" class="w-full">
            <span class="flex justify-center items-center">
              <el-icon class="mr-2"><el-icon-search /></el-icon>
              搜索
            </span>
          </el-button>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg">
          <h3 class="text-lg font-medium text-gray-700 mb-2">通知面板</h3>
          <el-alert
            title="这是一个成功提示的文案"
            type="success"
            class="mb-2"
          />
          <el-alert
            title="这是一个警告提示的文案"
            type="warning"
            class="mb-2"
          />
          <div class="text-right mt-4">
            <el-button type="info" size="small" class="hover:bg-gray-200">查看更多</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <el-dialog v-model="dialogVisible" title="Element Plus 对话框" width="30%">
    <span>这是一个 Element Plus 对话框</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Search as ElIconSearch } from '@element-plus/icons-vue'

const sliderValue = ref(50)
const date = ref('')
const rating = ref(3)
const input = ref('')
const dialogVisible = ref(false)

const openDialog = () => {
  dialogVisible.value = true
}

const showMessage = () => {
  ElMessage({
    message: '这是一条来自Tailwind按钮的消息',
    type: 'success'
  })
}
</script>

<style scoped>
.tailwind-element-demo {
  background-color: #f9fafb;
}
</style> 