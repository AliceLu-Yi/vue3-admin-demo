# Vue3 企业级后台管理系统

> 本项目是为前端开发实习岗位面试精心准备的实战作品，包含数据看板、用户管理、导出Excel、暗黑主题等核心功能。

## 🚀 线上体验

🔗 **访问地址**：[https://alicelu-yi.github.io/vue3-admin-demo/](https://alicelu-yi.github.io/vue3-admin-demo/)

> 测试账号：`admin` / `123456`

## 📦 部署说明

本项目使用 GitHub Pages 部署，静态 Mock 数据已打包进前端代码中，无需后端服务即可完整演示所有功能。

## ✨ 技术栈

- **前端框架**：Vue 3 (Composition API)
- **构建工具**：Vite
- **UI 组件库**：Element Plus
- **路由管理**：Vue Router
- **状态管理**：Pinia
- **HTTP 请求**：Axios
- **数据模拟**：Mock.js
- **数据可视化**：ECharts + vue-echarts
- **Excel 导出**：xlsx
- **代码规范**：ESLint + Prettier

## 📄 项目结构

```plaintext
vue3-admin-demo/
├── mock/              # Mock 数据（开发环境用）
├── public/            # 静态资源
├── src/
│   ├── assets/        # 资源文件
│   ├── layout/        # 布局组件
│   ├── router/        # 路由配置
│   ├── utils/         # 工具函数（axios 封装）
│   ├── views/         # 页面组件（Login, Dashboard, User）
│   ├── App.vue
│   ├── main.js
│   └── mock.js        # 前端 Mock 拦截（生产环境用）
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🎯 主要功能

- ✅ 登录/退出（演示账号）
- ✅ 数据看板（统计卡片 + ECharts 图表）
- ✅ 用户管理（增删改查、分页、模糊搜索、表单校验）
- ✅ 导出 Excel（当前页 / 全部数据）
- ✅ 暗黑主题切换（支持本地存储）
- ✅ 响应式布局（手机、平板、桌面自适应）

## 🛠 本地运行

```bash
# 克隆项目
git clone https://github.com/AliceLu-Yi/vue3-admin-demo.git

# 进入目录
cd vue3-admin-demo

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```
