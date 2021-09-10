<template>
  <div class="menu-container">
    <el-card class="tree-card">
      <template #header>
        <el-button @click="handleCreateRootMenu">新增顶级菜单</el-button>
      </template>
      <div class="block">
        <div class="menu-tree">
          <el-tree
            ref="menuTreeRef"
            :data="menus"
            highlight-current
            node-key="id"
            :expand-on-click-node="false"
            :check-strictly="true"
            @node-click="handleNodeClick"
            :props="defaultProps"
            draggable
            :allow-drop="allowDrop"
            :allow-drag="allowDrag"
            @node-drop="handleNodeDrop"
          >
            <template #default="{ node, data }">
              <span class="custom-tree-node">
                <span>{{ node.label }}</span>
                <span>
                  <el-button type="text" @click.stop="handleCreateChildMenu(data)">添加</el-button>
                  <el-button type="text" @click.stop="handleRemoveMenu(node, data)">删除</el-button>
                </span>
              </span>
            </template>
          </el-tree>
        </div>
      </div>
    </el-card>
    <el-card class="edit-card">
      <template #header>编辑菜单</template>
      <edit-menu v-show="editData && editData.id" :data="editData"></edit-menu>
      <span v-if="editData == null">从菜单列表选择一项后，进行编辑</span>
    </el-card>

    <!-- 添加菜单 -->
    <right-panel v-model="panelVisible" :title="panelTitle">
      <div class="menu-form">
        <el-form
          ref="menuFormRef"
          :model="menuFormData"
          :rules="menuFormRules"
          label-width="100px"
        >
          <el-form-item label="菜单名称" prop="title">
            <el-input
              v-model="menuFormData.title"
              placeholder="请输入菜单名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="路径" prop="path">
            <el-input
              v-model="menuFormData.path"
              placeholder="请输入路由路径"
            ></el-input>
          </el-form-item>
          <el-form-item label="路由name" prop="name">
            <el-input
              v-model="menuFormData.name"
              placeholder="请输入路由name"
            ></el-input>
          </el-form-item>
          <el-form-item label="图标" prop="icon">
            <el-input
              v-model="menuFormData.icon"
              placeholder="请输入icon名称"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitMenuForm">创建菜单</el-button>
          </el-form-item>
        </el-form>
      </div>
    </right-panel>
  </div>
</template>

<script lang="ts">
import { useStore } from '@/store'
import { ITreeItemData, MenuData } from '@/store/modules/menu'
import { ElForm, ElTree } from 'element-plus'
import { computed, defineComponent, getCurrentInstance, onMounted, reactive, ref, watch } from 'vue'
import EditMenu from './components/editMenu.vue'
import RightPanel from '@/components/RightPanel/index.vue'
import { useReloadPage } from '@/hooks/useReload'
import { addNewMenu, deleteMenuById, updateBulkMenu } from '@/api/menu'

interface ITreeNode {
  id: number;
  title: string;
  children: ITreeNode[];
  parentId: number;
  sortId: number;
  parent: {
    data: ITreeNode
  };
  data: ITreeItemData
}

type IMenuTree = InstanceType<typeof ElTree>
type IMenuForm = InstanceType<typeof ElForm>
type IMenuItemNotID = Omit<ITreeItemData, 'id'>

export default defineComponent({
  name: 'menu',
  components: {
    EditMenu,
    RightPanel
  },
  setup() {
    const store = useStore()
    const { proxy } = getCurrentInstance()!
    const menuTreeRef = ref<IMenuTree | null>(null)
    const treeData = computed(() => store.getters.menusTree)
    const menus = ref<ITreeItemData[]>([])

    const editData = ref<MenuData|null>()

    watch(treeData, (value: ITreeItemData[]) => {
      menus.value = JSON.parse(JSON.stringify(value))
      editData.value = null
    })

    onMounted(() => {
      store.dispatch('menu/getAllMenuList')
    })

    const defaultProps = ref({
      children: 'children',
      label: 'title'
    })

    // 重新刷新整个系统
    const { reloadPage } = useReloadPage()

    // 添加菜单
    const panelVisible = ref(false)
    watch(panelVisible, val => {
      if (!val) {
        (menuFormRef.value as IMenuForm).resetFields()
      }
    })

    const menuType = ref(0) // 添加菜单类型 0顶级 1子级
    const panelTitle = computed(() => {
      return menuType.value === 0 ? '添加顶级菜单' : '添加子菜单'
    })
    const menuFormRef = ref<IMenuForm|null>(null)
    const menuFormData = reactive<IMenuItemNotID>({
      title: '',
      path: '',
      name: '',
      icon: '',
      parent_id: '',
      sort_id: 0
    })

    const menuFormRules = {
      title: {
        required: true,
        message: '请输入菜单名称',
        trigger: 'blur'
      },
      path: {
        required: true,
        message: '请输入路由路径',
        trigger: 'blur'
      },
      name: {
        required: true,
        message: '请输入路由名称',
        trigger: 'blur'
      }
    }

    // 重置添加菜单状态
    const resetStatus = () => {
      panelVisible.value = false
      menuFormRef.value?.resetFields()
      parentData.value = null
    }

    // 分配sortId
    const getMenuNodeSortId = (list: ITreeItemData[]) => {
      if (list && list.length > 0) {
        return list[list.length - 1].sort_id + 1
      }
      return 0
    }

    // 添加顶级菜单
    const handleCreateRootMenu = () => {
      menuType.value = 0
      panelVisible.value = true
    }
    // 顶级菜单分配parent_id和sort_id
    const allocRootMenuId = (data: IMenuItemNotID) => {
      const sortId = getMenuNodeSortId(menus.value)
      data.sort_id = sortId
      data.parent_id = '0'
    }
    // 将顶级菜单添加到菜单树种
    const appendRootMenu = (id: number, data: IMenuItemNotID) => {
      const node = { id, ...data, children: [] }
      menus.value.push(node)
      menus.value = [...menus.value]
    }
    const handleAddRootMenu = async (data: IMenuItemNotID) => {
      allocRootMenuId(data)
      await addNewMenu(data).then(res => {
        if (res.code === 0) {
          const { id } = res.data
          appendRootMenu(id, data)
          proxy?.$message.success('顶级菜单创建成功')
          reloadPage()
        }
      })
    }

    // 添加子菜单
    const parentData = ref<ITreeItemData | null>(null) // 缓存父菜单的数据
    const allocChildMenuId = (data: IMenuItemNotID, parentData: ITreeItemData): IMenuItemNotID => {
      const pid = parentData.id as number
      let sortId = 0
      if (!parentData.children) {
        parentData.children = []
      }
      if (parentData.children.length > 0) {
        sortId = getMenuNodeSortId(parentData.children)
      }
      data.sort_id = sortId
      data.parent_id = pid
      return data
    }
    const appendChildMenu = (child: ITreeItemData, parentData: ITreeItemData) => {
      (parentData.children!).push(child)
      menus.value = [...menus.value]
    }
    const handleAddChildMenu = async (data: IMenuItemNotID) => {
      const child = allocChildMenuId(data, parentData.value!)
      await addNewMenu(data).then(res => {
        if (res.code === 0) {
          const { id } = res.data
          ;(child as ITreeItemData).id = id
          appendChildMenu(child as ITreeItemData, parentData.value!)
          proxy?.$message.success('子菜单创建成功')
          reloadPage()
        }
      })
    }
    const handleCreateChildMenu = (data: ITreeItemData) => {
      menuType.value = 1
      parentData.value = data
      panelVisible.value = true
    }

    // 点击编辑菜单
    const handleNodeClick = (data: MenuData) => {
      editData.value = { ...data }
    }

    // 提交menuForm
    const submitMenuForm = () => {
      (menuFormRef.value as IMenuForm).validate(async valid => {
        if (valid) {
          if (menuType.value === 0) {
            await handleAddRootMenu({ ...menuFormData })
          } else if (menuType.value === 1) {
            await handleAddChildMenu({ ...menuFormData })
          }
          resetStatus()
        }
      })
    }

    // 移除节点
    const removeNode = (node: ITreeNode, childId: number) => {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === childId)
      children.splice(index, 1)
      menus.value = [...menus.value]
    }

    const handleRemoveMenu = (node: ITreeNode, menuData: ITreeItemData) => {
      proxy?.$confirm(`您确认要删除菜单${menuData.title}？`, '确认删除', {
        type: 'warning'
      }).then(() => {
        deleteMenuById(menuData.id).then(res => {
          if (res.code === 0) {
            proxy?.$message.success('删除成功')
            removeNode(node, menuData.id)
            // 如果删除的是正在编辑的菜单，重置编辑表单
            if (editData.value && menuData.id === editData.value.id) {
              editData.value = null
            }
            reloadPage()
          }
        })
      }).catch(() => {
        proxy?.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }

    // 拖拽排序
    // 拖拽一级节点
    const allowDrag = (draggingNode: ITreeNode) => {
      const data = draggingNode.data
      return data.parent_id === 0 || data.parent_id == null
    }

    // 拖放一级节点
    type DropType = 'before' | 'after' | 'inner'
    const allowDrop = (draggingNode: ITreeNode, dropNode: ITreeNode, type: DropType) => {
      if (dropNode.data.parent_id === 0 || dropNode.data.parent_id == null) {
        return type !== 'inner'
      }
    }

    // 拖放完成事件
    const handleNodeDrop = () => {
      menus.value.forEach((menu, index) => {
        menu.sort_id = index
      })

      // 批量更新菜单sort_id
      const menuList = menus.value.map(menu => {
        const temp = { ...menu }
        delete menu.children
        return temp
      })
      updateBulkMenu(menuList).then(res => {
        if (res.code === 0) {
          store.dispatch('permission/generateRoutes', 1)
        }
      })
    }

    return {
      menuTreeRef,
      menus,
      editData,
      panelVisible,
      panelTitle,
      menuFormRef,
      menuFormData,
      menuFormRules,
      defaultProps,
      handleCreateRootMenu,
      handleCreateChildMenu,
      handleNodeClick,
      submitMenuForm,
      handleRemoveMenu,
      allowDrag,
      allowDrop,
      handleNodeDrop
    }
  }
})
</script>

<style lang="scss" scoped>
.menu-container {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  .menu-tree {
    height: 400px;
    overflow-y: scroll;
  }
  .tree-card {
    min-width: 500px;
    padding-bottom: 30px;
  }
  .edit-card {
    flex: 1;
    margin-left: 20px;
  }
  >>> .el-form-item__content {
    min-width: 220px;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .menu-form {
    padding: 20px 10px 20px 0;
    box-sizing: border-box;
  }
}
</style>
