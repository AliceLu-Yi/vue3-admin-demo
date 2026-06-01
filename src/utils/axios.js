import axios from 'axios'

// 创建 axios 实例
const request = axios.create({
  baseURL: '/api', // 所有请求都加上 /api 前缀
  timeout: 10000, // 请求超时时间
})

// 请求拦截器——在发送请求前做点什么
request.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 响应拦截器——在收到响应后做点什么
request.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res.code !== 200) {
      // 处理业务错误
      console.error(res.msg || '请求失败')
      return Promise.reject(new Error(res.msg || '请求失败'))
    }
    return res
  },
  (error) => {
    console.error('请求错误：', error.message)
    return Promise.reject(error)
  },
)

export default request
