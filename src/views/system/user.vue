<template>
  <div class="app-container">
    <el-form :inline="true" :model="formQuery" ref="queryFormRef">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="formQuery.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="formQuery.mobile" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="formQuery.status" placeholder="状态">
          <el-option label="全部" value=""></el-option>
          <el-option label="禁用" :value="0"></el-option>
          <el-option label="正常" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmitQuery">查询</el-button>
        <el-button type="default" @click="handleResetFeilds">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="user-list">
      <el-button type="primary" icon="el-icon-plus" @click="handleAddUser">添加用户</el-button>
      <el-table :data="users" max-height="400" stripe>
        <el-table-column
          prop="username"
          label="用户名"
        ></el-table-column>
        <el-table-column
          prop="mobile"
          label="手机号"
        ></el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
        ></el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          :formatter="formatStatus"
        ></el-table-column>
        <el-table-column
          prop="createAt"
          label="创建时间"
        ></el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          width="150px"
        >
          <template #default="scope">
            <el-button
              type="text"
              size="mini"
              @click="handleEditUser(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              type="text"
              size="mini"
              @click="handleDeleteUser(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useStore } from '@/store'
import { Profile } from '@/store/modules/user'
import { ElForm } from 'element-plus'
import { computed, defineComponent, reactive, ref } from 'vue'

type ElFormInstance = InstanceType<typeof ElForm>

export default defineComponent({
  name: 'User',
  setup() {
    // const { proxy } = getCurrentInstance()
    const store = useStore()
    const queryFormRef = ref<ElFormInstance | null>(null)
    const formQuery = reactive({
      username: '',
      mobile: '',
      status: ''
    })

    const users = computed(() => store.state.user.users)
    const total = computed(() => store.state.user.count)

    const pageNum = ref(0)
    const pageSize = ref(20)

    // 查询
    const handleSubmitQuery = () => {
      console.log('查询')
    }

    // 重置
    const handleResetFeilds = () => {
      (queryFormRef.value as ElFormInstance).resetFields()
    }

    // 格式化status
    const formatStatus = (row: Profile) => {
      return row.status ? '正常' : '禁用'
    }

    // 分页
    const handleSizeChange = (val: number) => {
      pageSize.value = val
    }
    const handleCurrentChange = (val: number) => {
      pageNum.value = val - 1
    }

    // 编辑用户
    const handleEditUser = (index: number, row: Profile) => {
      console.log('编辑用户', index, row)
    }

    // 删除用户
    const handleDeleteUser = (index: number, row: Profile) => {
      console.log('删除用户', index, row)
    }
    return {
      formQuery,
      queryFormRef,
      users,
      total,
      pageNum,
      pageSize,
      formatStatus,
      handleSubmitQuery,
      handleResetFeilds,
      handleSizeChange,
      handleCurrentChange,
      handleEditUser,
      handleDeleteUser
    }
  }
})
</script>
