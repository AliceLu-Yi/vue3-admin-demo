<template>
  <div class="user-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>用户管理</span>
          <el-button type="primary" @click="handleAdd">新增用户</el-button>
        </div>
      </template>

      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-input
          v-model="searchName"
          placeholder="请输入用户名搜索"
          style="width: 200px"
          clearable
          @clear="fetchUserList"
        />
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="resetSearch">重置</el-button>
        <el-button type="success" @click="exportCurrentPage">导出当前页</el-button>
        <el-button type="warning" @click="exportAll">导出全部</el-button>
      </div>

      <!-- 数据表格 -->
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="用户名" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="phone" label="手机号" />
        <el-table-column prop="role" label="角色" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="page"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 30, 50]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px" @close="closeDialog">
      <el-form :model="form" :rules="formRules" ref="formRef" label-width="80px">
        <el-form-item label="用户名" prop="name">
          <el-input v-model="form.name" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="form.role" placeholder="请选择角色" style="width: 100%">
            <el-option label="管理员" value="管理员" />
            <el-option label="普通用户" value="普通用户" />
            <el-option label="编辑" value="编辑" />
            <el-option label="审核员" value="审核员" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :value="1">启用</el-radio>
            <el-radio :value="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm" :loading="submitting">
            {{ isEdit ? '更新' : '创建' }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/utils/axios'

defineOptions({
  name: 'AppUser',
})

const tableData = ref([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)
const searchName = ref('')
const dialogVisible = ref(false)
const isEdit = ref(false)
const submitting = ref(false)
const formRef = ref(null)

// 表单数据，初始化为空
const form = reactive({
  id: null,
  name: '',
  email: '',
  phone: '',
  role: '',
  status: 1,
})

const dialogTitle = computed(() => (isEdit.value ? '编辑用户' : '新增用户'))

const formRules = {
  name: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度应为 2-20 个字符', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的11位手机号码', trigger: 'blur' },
  ],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
}

// 重置表单（清空所有字段，清除校验）
const resetForm = async () => {
  form.id = null
  form.name = ''
  form.email = ''
  form.phone = ''
  form.role = ''
  form.status = 1
  if (formRef.value) {
    await nextTick()
    formRef.value.resetFields()
  }
}

import * as XLSX from 'xlsx'

// 导出当前页数据（表格中展示的数据）
const exportCurrentPage = () => {
  if (tableData.value.length === 0) {
    ElMessage.warning('当前无数据可导出')
    return
  }
  // 准备导出数据（可自定义列名）
  const exportData = tableData.value.map((item) => ({
    ID: item.id,
    用户名: item.name,
    邮箱: item.email,
    手机号: item.phone,
    角色: item.role,
    状态: item.status === 1 ? '启用' : '禁用',
    创建时间: item.createTime,
  }))
  const ws = XLSX.utils.json_to_sheet(exportData)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, '用户列表')
  XLSX.writeFile(wb, `用户列表_第${page.value}页.xlsx`)
  ElMessage.success('导出成功')
}

// 导出全部用户（请求全部数据，注意分页接口支持大 pageSize）
const exportAll = async () => {
  try {
    // 请求全部数据：设置 pageSize 为一个足够大的数（如 1000）
    const res = await request.get('/user/list', {
      params: {
        page: 1,
        pageSize: 10000,
        name: '', // 不加搜索条件
      },
    })
    if (res.code === 200 && res.data.list) {
      const allData = res.data.list
      if (allData.length === 0) {
        ElMessage.warning('无数据可导出')
        return
      }
      const exportData = allData.map((item) => ({
        ID: item.id,
        用户名: item.name,
        邮箱: item.email,
        手机号: item.phone,
        角色: item.role,
        状态: item.status === 1 ? '启用' : '禁用',
        创建时间: item.createTime,
      }))
      const ws = XLSX.utils.json_to_sheet(exportData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, '全部用户')
      XLSX.writeFile(wb, `全部用户_${new Date().toISOString().slice(0, 19)}.xlsx`)
      ElMessage.success('导出全部成功')
    } else {
      ElMessage.error('获取全部数据失败')
    }
  } catch {
    ElMessage.error('导出失败')
  }
}

// 获取用户列表
const fetchUserList = async () => {
  try {
    const res = await request.get('/user/list', {
      params: {
        page: page.value,
        pageSize: pageSize.value,
        name: searchName.value,
      },
    })
    if (res.code === 200) {
      tableData.value = res.data.list
      total.value = res.data.total
    }
  } catch {
    ElMessage.error('获取用户列表失败')
  }
}

const handleSearch = () => {
  page.value = 1
  fetchUserList()
}

const resetSearch = () => {
  searchName.value = ''
  page.value = 1
  fetchUserList()
}

const handleSizeChange = (val) => {
  pageSize.value = val
  fetchUserList()
}

const handleCurrentChange = (val) => {
  page.value = val
  fetchUserList()
}

// 新增用户：打开弹窗后重置表单
const handleAdd = async () => {
  isEdit.value = false
  dialogVisible.value = true
  await nextTick() // 确保弹窗已渲染，formRef 可用
  await resetForm()
}

// 编辑用户：打开弹窗后先重置，再填充数据
const handleEdit = async (row) => {
  isEdit.value = true
  dialogVisible.value = true
  await nextTick()
  await resetForm()
  // 填充编辑数据
  form.id = row.id
  form.name = row.name
  form.email = row.email
  form.phone = row.phone
  form.role = row.role
  form.status = row.status
}

// 删除用户
const handleDelete = (row) => {
  ElMessageBox.confirm(`确定删除用户 "${row.name}" 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      const res = await request.delete('/user/delete', { data: { id: row.id } })
      if (res.code === 200) {
        ElMessage.success('删除成功')
        fetchUserList()
      }
    } catch {
      ElMessage.error('删除失败')
    }
  })
}

// 关闭对话框时重置表单
const closeDialog = async () => {
  await resetForm()
  dialogVisible.value = false
}

// 提交表单（新增或编辑）
const submitForm = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        let res
        if (isEdit.value) {
          res = await request.put('/user/edit', form)
        } else {
          res = await request.post('/user/add', form)
        }
        if (res.code === 200) {
          ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
          dialogVisible.value = false
          fetchUserList()
        }
      } catch {
        ElMessage.error(isEdit.value ? '更新失败' : '创建失败')
      } finally {
        submitting.value = false
      }
    }
  })
}

onMounted(() => {
  fetchUserList()
})
</script>

<style scoped>
.user-management {
  width: 100%;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.search-bar {
  margin-bottom: 16px;
  display: flex;
  gap: 12px;
}
.pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>
