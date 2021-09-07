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
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'Role',
  setup() {
    const roles = {}
    const pageNum = ref(0)
    const pageSize = ref(10)

    const handleCurrentChange = (val: number) => {
      pageNum.value = val - 1
    }
    const handleSizeChange = (val: number) => {
      pageSize.value = val
    }

    // 添加角色
    const handleAddRole = () => {
      console.log('添加角色')
    }

    // 编辑角色
    // const handleEditRole = (row: any) => {
    //   console.log('编辑角色', row)
    // }

    // const handleRoleMenu = (index: number, row: any) => {
    //   console.log('分配菜单角色', row, index)
    // }

    // const handleDeleteRole = (row: any) => {
    //   console.log('删除角色', row)
    // }

    return {
      roles,
      pageNum,
      pageSize,
      handleSizeChange,
      handleCurrentChange,
      handleAddRole
      // handleEditRole,
      // handleRoleMenu,
      // handleDeleteRole
    }
  }
})
</script>
