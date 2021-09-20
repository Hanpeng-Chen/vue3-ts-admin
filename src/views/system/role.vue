<template>
  <div class="app-container">
    <div class="role-list">
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="handleAddRole"
      >添加角色</el-button>
      <el-table
        :data="roles"
        max-height="400"
      >
        <el-table-column
          prop="name"
          label="角色名称"
        ></el-table-column>
        <el-table-column
          prop="description"
          label="说明"
        ></el-table-column>
        <el-table-column
          prop="is_default"
          label="是否默认角色"
          :formatter="formatterIsDefault"
        ></el-table-column>
        <el-table-column
          prop="createAt"
          label="创建时间"
        ></el-table-column>
        <el-table-column
          prop="updateAt"
          label="更新时间"
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
              @click="handleRoleMenu(scope.$index, scope.row)"
            >菜单权限</el-button>
            <el-button
              type="text"
              size="mini"
              @click="handleEditRole(scope.row)"
            >编辑</el-button>
            <el-button
              type="text"
              size="mini"
              @click="handleDeleteRole(scope.row)"
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
      <edit-role
        :type="editType"
        :data="editData"
        @submit="handleSubmitRole"
      ></edit-role>
    </right-panel>
    <role-menu
      v-if="roleData && roleMenuVisible"
      v-model="roleMenuVisible"
      :role="roleData"
    ></role-menu>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, getCurrentInstance, onMounted, ref, watchEffect } from 'vue'
import EditRole from './components/editRole.vue'
import RightPanel from '@/components/RightPanel/index.vue'
import RoleMenu from './components/roleMenu.vue'
import { useStore } from '@/store'
import { IRole } from '@/store/modules/role'

export default defineComponent({
  name: 'Role',
  components: {
    EditRole,
    RightPanel,
    RoleMenu
  },
  setup() {
    const { proxy } = getCurrentInstance()!
    const store = useStore()
    const roles = computed(() => store.state.role.roles)
    const total = computed(() => store.state.role.count)
    const pageNum = ref(0)
    const pageSize = ref(10)
    const editData = ref<IRole | undefined>(undefined)
    const panelVisible = ref(false)
    const editType = ref(1) // 1-编辑 0-新增

    const panelTitle = computed(() => editType.value === 1 ? '编辑角色' : '新增角色')

    // 获取角色列表
    const getRoleList = () => {
      store.dispatch('role/getRoles', {
        pageNum: pageNum.value,
        pageSize: pageSize.value
      })
    }

    onMounted(() => {
      store.dispatch('menu/getAllMenuList')
    })

    // 自动追踪相关依赖属性变动获取数据
    watchEffect(() => {
      getRoleList()
    })

    const handleCurrentChange = (val: number) => {
      pageNum.value = val - 1
    }
    const handleSizeChange = (val: number) => {
      pageSize.value = val
    }

    // 添加角色
    const handleAddRole = () => {
      editType.value = 0
      editData.value = {} as IRole
      panelVisible.value = true
    }

    // 编辑角色
    const handleEditRole = (row: IRole) => {
      editType.value = 1
      editData.value = { ...row }
      panelVisible.value = true
    }

    const handleDeleteRole = (row: IRole) => {
      proxy?.$confirm(`您确认要删除角色${row.name}吗？`, '删除确认', {
        type: 'warning'
      }).then(() => {
        store.dispatch('role/deleteRole', {
          id: row.id,
          pageSize: pageSize.value,
          pageNum: pageNum.value
        }).then(() => {
          proxy?.$message.success('角色删除成功')
        })
      }).catch(() => {
        proxy?.$message({
          type: 'info',
          message: '删除已取消'
        })
      })
    }

    const dispatchAction = (action: string, data: IRole, message: string) => {
      store.dispatch(action, {
        ...data,
        pageNum: pageNum.value,
        pageSize: pageSize.value
      }).then(() => {
        proxy?.$message.success(message)
        panelVisible.value = false
      })
    }

    const addNewRole = (data: IRole) => {
      dispatchAction('role/addRole', data, '角色添加成功')
    }

    const editRole = (data: IRole) => {
      dispatchAction('role/editRole', data, '角色编辑成功')
    }

    const handleSubmitRole = (data: IRole) => {
      if (editType.value === 1) {
        editRole(data)
      } else {
        addNewRole(data)
      }
    }

    const formatterIsDefault = (row: IRole) => {
      return row.is_default ? '是' : '否'
    }

    // 权限菜单
    const roleMenuVisible = ref(false)
    const roleData = ref<IRole | null>(null)
    const handleRoleMenu = (index: number, row: IRole) => {
      roleData.value = row
      roleMenuVisible.value = true
    }

    return {
      roles,
      pageNum,
      pageSize,
      total,
      editType,
      editData,
      panelVisible,
      panelTitle,
      roleData,
      roleMenuVisible,
      formatterIsDefault,
      handleSizeChange,
      handleCurrentChange,
      handleAddRole,
      handleEditRole,
      handleRoleMenu,
      handleDeleteRole,
      handleSubmitRole
    }
  }
})
</script>
