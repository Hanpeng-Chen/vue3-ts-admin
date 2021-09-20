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
          label="角色名称"
        >
          <template #default="scope">
            <span
              style="margin-left:5px"
              v-for="role in scope.row.roles"
              :key="role.id"
            >{{role.name}}</span>
          </template>
        </el-table-column>
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
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
      </div>
    </div>
    <right-panel v-model="panelVisible" :title="panelTitle" :size="330">
      <edit-user
        :type="editType"
        :data="editData"
        @submit="handleSubmitUser"
      />
    </right-panel>
  </div>
</template>

<script lang="ts">
import { useStore } from '@/store'
import { Profile } from '@/store/modules/user'
import { ElForm } from 'element-plus'
import { computed, defineComponent, getCurrentInstance, onMounted, reactive, ref } from 'vue'
import RightPanel from '@/components/RightPanel/index.vue'
import EditUser from './components/editUser.vue'

type ElFormInstance = InstanceType<typeof ElForm>

export default defineComponent({
  name: 'User',
  components: {
    RightPanel,
    EditUser
  },
  setup() {
    const { proxy } = getCurrentInstance()!
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

    // 用户新增/编辑数据
    const editData = ref<Profile | undefined>(undefined)
    // 控制面板显示
    const panelVisible = ref(false)
    // 操作类型 0-新增  1-编辑
    const editType = ref(0)
    const panelTitle = computed(() => editType.value === 0 ? '新增用户' : '编辑用户')

    store.dispatch('role/getRoles')

    const roles = computed(() => store.state.role.roles)

    // 格式化status
    const formatStatus = (row: Profile) => {
      return row.status ? '正常' : '禁用'
    }

    const getUserList = () => {
      store.dispatch('user/getAllUsers', {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        ...formQuery
      })
    }

    onMounted(() => {
      getUserList()
    })

    // 查询
    const handleSubmitQuery = () => {
      getUserList()
    }

    // 重置
    const handleResetFeilds = () => {
      (queryFormRef.value as ElFormInstance).resetFields()
      getUserList()
    }

    // 分页
    const handleSizeChange = (val: number) => {
      pageSize.value = val
      getUserList()
    }
    const handleCurrentChange = (val: number) => {
      pageNum.value = val - 1
      getUserList()
    }

    // 新增、编辑、删除 统一派发方法
    const dispatchAction = async(action: string, data: Partial<Profile>, message: string) => {
      await store.dispatch(action, {
        ...data,
        pageNum: pageNum.value,
        pageSize: pageSize.value
      }).then(() => {
        (queryFormRef.value as ElFormInstance).resetFields()
        proxy?.$message.success(message)
        panelVisible.value = false
      })
    }

    // 新增用户
    const addUser = (data: Profile) => {
      dispatchAction('user/addUser', data, '用户添加成功')
    }

    // 编辑用户
    const editUser = (data: Profile) => {
      dispatchAction('user/editUser', data, '编辑用户成功')
    }

    // 新增用户
    const handleAddUser = () => {
      editType.value = 0
      editData.value = {} as Profile
      editData.value.roles = roles.value
      editData.value.roleIds = []
      panelVisible.value = true
    }

    // 编辑用户
    const handleEditUser = (index: number, row: Profile) => {
      editType.value = 1
      editData.value = { ...row }
      editData.value.roles = roles.value
      editData.value.roleIds = row.roles.map(item => item.id)
      panelVisible.value = true
    }

    const handleSubmitUser = (data: Profile) => {
      if (editType.value === 0) {
        addUser(data)
      } else {
        editUser(data)
      }
    }

    // 删除用户
    const handleDeleteUser = (index: number, row: Profile) => {
      proxy?.$confirm(`您确认要删除用户${row.username}吗？`, '确认删除', {
        type: 'warning'
      }).then(async () => {
        await dispatchAction('user/removeUser', {
          id: row.id
        }, '用户删除成功')
      }).catch((err: Error) => {
        console.log(err)
        proxy?.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
    return {
      formQuery,
      queryFormRef,
      users,
      total,
      pageNum,
      pageSize,
      panelVisible,
      panelTitle,
      editType,
      editData,
      formatStatus,
      handleSubmitQuery,
      handleResetFeilds,
      handleSizeChange,
      handleCurrentChange,
      handleAddUser,
      handleEditUser,
      handleDeleteUser,
      handleSubmitUser
    }
  }
})
</script>
