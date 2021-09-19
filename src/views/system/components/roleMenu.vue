<template>
  <div v-if="modelValue">
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
    >
      <el-tree
        :data="treeData"
        show-checkbox
        default-expand-all
        node-key="id"
        ref="menuTree"
        highlight-current
        :check-strictly="checkStrictly"
        :props="defaultProps"
      ></el-tree>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" plain @click="handleCheckAll">全选</el-button>
          <el-button type="primary" @click="handleSubmit">提交</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { allocRoleAccess, getRoleAccess } from '@/api/roleAccess'
import { useStore } from '@/store'
import { IRole } from '@/store/modules/role'
import { ElTree } from 'element-plus'
import { computed, defineComponent, getCurrentInstance, nextTick, onMounted, PropType, ref, watch } from 'vue'

type ElTreeInstance = InstanceType<typeof ElTree>

export default defineComponent({
  name: 'RoleMenu',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    role: {
      type: Object as PropType<IRole>,
      required: true
    }
  }
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance()
    const store = useStore()
    const menuTree = ref<ElTreeInstance | null>(null)
    const role = props.role as IRole
    const dialogVisible = ref(true)
    const defaultProps = ref({
      children: 'children',
      label: 'title'
    })
    const checkStrictly = ref(false)
    const dialogTitle = computed(() => `分配 ${role.name} 菜单权限`)
    const treeData = computed(() => store.getters.menuTree)
    watch(dialogVisible, (value) => {
      emit('update:modelValue', value)
    })

    // 发送选中key与role.id关联请求
    const handleRoleWithMenu = (keys: number[], roleId: number) => {
      allocRoleAccess(roleId, keys).then(res => {
        if (res.code === 0) {
          proxy?.$message.success(res.message)
          emit('update:modelValue', false)
          reloadPage()
        }
      })
    }

    // 重新刷新
    const reloadPage = () => {
      proxy?.$confirm('菜单权限已发生变动，是否立即刷新系统?', '确认', {
        type: 'warning'
      }).then(() => {
        window.location.reload()
      }).catch(() => {
        proxy?.$message({
          type: 'info',
          message: '取消刷新'
        })
      })
    }

    const handleSubmit = () => {
      const tree = (menuTree.value as ElTreeInstance)
      const keys = tree.getCheckedKeys(false)
      const halfKeys = tree.getHalfCheckedKeys()
      const selectedKeys = [...halfKeys, ...keys]
      handleRoleWithMenu(selectedKeys as number[], role.id)
    }

    // 根据权限列表，设置选中状态
    const setTreeChecked = (access: number[]) => {
      (menuTree.value as ElTreeInstance).setCheckedKeys(access, false)
      nextTick(() => {
        checkStrictly.value = false
      })
    }

    // 获取当前角色的菜单权限列表
    const getRoleAccessList = () => {
      checkStrictly.value = true
      getRoleAccess(role.id).then(res => {
        if (res.code === 0) {
          const access = res.data.map(item => item.access_id)
          setTreeChecked(access)
        }
      }).catch(() => {
        checkStrictly.value = false
      })
    }

    const isCheckAll = ref(false)
    const handleCheckAll = () => {
      if (!isCheckAll.value) {
        (menuTree.value as ElTreeInstance).setCheckedNodes(treeData.value, false)
      } else {
        (menuTree.value as ElTreeInstance).setCheckedNodes([], false)
      }
      isCheckAll.value = !isCheckAll.value
    }

    onMounted(() => {
      getRoleAccessList()
    })

    return {
      dialogVisible,
      dialogTitle,
      treeData,
      defaultProps,
      handleSubmit,
      handleCheckAll
    }
  }
})
</script>
