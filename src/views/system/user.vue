<template>
  <div class="user-container">
    <h2>用户管理</h2>
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
      <el-button type="primary" plain icon="el-icon-plus" @click="handleAddUser">添加用户</el-button>
      <el-table :data="users" max-height="400">
        <el-table-column
          prop="username"
          label="用户名"
        ></el-table-column>
        <el-table-column
          prop="mobile"
          label="手机号"
        ></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script lang="ts">
import { useStore } from '@/store'
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

    const users = ref([])

    // 查询
    const handleSubmitQuery = () => {
      console.log('查询')
    }

    // 重置
    const handleResetFeilds = () => {
      (queryFormRef.value as ElFormInstance).resetFields()
    }

    return {
      formQuery,
      queryFormRef,
      users,
      handleSubmitQuery,
      handleResetFeilds
    }
  }
})
</script>
