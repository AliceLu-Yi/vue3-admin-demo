<template>
  <div class="app-layout">
    <!-- 侧边栏 -->
    <el-aside class="app-aside" :width="isCollapse ? '64px' : '220px'">
      <div class="logo">
        <span v-if="!isCollapse">后台管理系统</span>
        <span v-else>CMS</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        class="menu"
        :collapse="isCollapse"
        router
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409eff"
      >
        <el-menu-item index="/dashboard">
          <el-icon><PieChart /></el-icon>
          <span>数据看板</span>
        </el-menu-item>
        <el-menu-item index="/user">
          <el-icon><User /></el-icon>
          <span>用户管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 主体区域 -->
    <div class="app-main">
      <el-header class="app-header">
        <el-icon class="collapse-btn" @click="toggleCollapse">
          <Expand v-if="isCollapse" />
          <Fold v-else />
        </el-icon>
        <div class="header-right">
          <el-switch
            v-model="isDark"
            size="large"
            inline-prompt
            :active-icon="Moon"
            :inactive-icon="Sunny"
            @change="toggleDark"
          />
          <span class="username">{{ username }}</span>
          <el-button type="danger" size="small" @click="handleLogout">退出登录</el-button>
        </div>
      </el-header>
      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { PieChart, User, Expand, Fold, Moon, Sunny } from '@element-plus/icons-vue'

// 添加这一行，定义组件名为多单词
defineOptions({
  name: 'AppLayout',
})

const router = useRouter()
const route = useRoute()
const isCollapse = ref(false)
const username = ref(localStorage.getItem('username') || '管理员')

const activeMenu = computed(() => route.path)

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('username')
  router.push('/login')
}

const isDark = ref(false)

// 切换暗黑模式
const toggleDark = () => {
  const html = document.documentElement
  if (isDark.value) {
    html.classList.add('dark')
  } else {
    html.classList.remove('dark')
  }
  // 可选：保存用户偏好到 localStorage
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

// 页面初始化时读取本地存储的偏好
onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark') {
    isDark.value = true
    document.documentElement.classList.add('dark')
  }
})
</script>

<style scoped>
.app-layout {
  display: flex;
  height: 100vh;
}
.app-aside {
  height: 100vh;
  background-color: #304156;
  transition: width 0.3s;
  overflow-x: hidden;
}
.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  background-color: #263445;
}
.menu {
  border-right: none;
  height: calc(100vh - 60px);
}
.app-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.app-header {
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.collapse-btn {
  font-size: 20px;
  cursor: pointer;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}
.username {
  color: #333;
}
.content {
  flex: 1;
  padding: 20px;
  background-color: #f0f2f6;
  overflow-y: auto;
}
</style>
