import Mock from 'mockjs'

// ---------- 初始化用户数据（只生成一次）----------
const INITIAL_TOTAL = 58
let allUsers = Mock.mock({
  [`list|${INITIAL_TOTAL}`]: [
    {
      'id|+1': 1,
      name: '@cname',
      email: '@email',
      role: '@pick(["管理员", "普通用户", "编辑", "审核员"])',
      status: '@pick([0, 1])',
      createTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
      phone: /^1[3-9]\d{9}$/,
    },
  ],
}).list

// 辅助函数：获取下一个可用 ID（基于当前所有用户的最大 id +1）
function getNextId() {
  const maxId = allUsers.reduce((max, user) => Math.max(max, user.id), 0)
  return maxId + 1
}

// 辅助函数：根据名称过滤
function filterUsers(users, searchName) {
  if (!searchName) return users
  const lowerName = searchName.toLowerCase()
  return users.filter((user) => user.name.toLowerCase().includes(lowerName))
}

// 辅助函数：分页
function paginate(users, page, pageSize) {
  const start = (page - 1) * pageSize
  const end = start + pageSize
  return users.slice(start, end)
}

// 模拟接口
export default [
  {
    url: '/api/login',
    method: 'post',
    response: ({ body }) => {
      const { username, password } = body
      if (username === 'admin' && password === '123456') {
        return {
          code: 200,
          msg: '登录成功',
          data: {
            token: 'mock-token-' + Date.now(),
            username: 'admin',
            nickname: '管理员',
          },
        }
      } else {
        return {
          code: 401,
          msg: '用户名或密码错误',
          data: null,
        }
      }
    },
  },
  {
    url: '/api/user/list',
    method: 'get',
    response: ({ query }) => {
      let page = parseInt(query.page) || 1
      let pageSize = parseInt(query.pageSize) || 10
      let searchName = (query.name || '').trim()

      let filtered = filterUsers(allUsers, searchName)
      const total = filtered.length
      const list = paginate(filtered, page, pageSize)

      return {
        code: 200,
        msg: 'success',
        data: {
          list: list,
          total: total,
          page: page,
          pageSize: pageSize,
        },
      }
    },
  },
  {
    url: '/api/user/add',
    method: 'post',
    response: ({ body }) => {
      const newId = getNextId()
      const newUser = {
        id: newId,
        name: body.name,
        email: body.email,
        phone: body.phone,
        role: body.role,
        status: body.status,
        createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      }
      allUsers.push(newUser)
      return {
        code: 200,
        msg: '添加成功',
        data: null,
      }
    },
  },
  {
    url: '/api/user/edit',
    method: 'put',
    response: ({ body }) => {
      const index = allUsers.findIndex((u) => u.id === body.id)
      if (index !== -1) {
        allUsers[index] = { ...allUsers[index], ...body }
      }
      return {
        code: 200,
        msg: '修改成功',
        data: null,
      }
    },
  },
  {
    url: '/api/user/delete',
    method: 'delete',
    response: ({ body }) => {
      const index = allUsers.findIndex((u) => u.id === body.id)
      if (index !== -1) {
        allUsers.splice(index, 1)
      }
      return {
        code: 200,
        msg: '删除成功',
        data: null,
      }
    },
  },
  {
    url: '/api/dashboard/stats',
    method: 'get',
    response: () => {
      return {
        code: 200,
        msg: 'success',
        data: {
          totalUsers: 2846,
          totalOrders: 1278,
          totalRevenue: 89234,
          todayVisits: 234,
          orderData: [42, 58, 73, 88, 95, 102, 120, 98, 85, 76, 65, 70],
          userData: [35, 42, 58, 66, 72, 88, 95, 102, 95, 88, 79, 82],
        },
      }
    },
  },
]
