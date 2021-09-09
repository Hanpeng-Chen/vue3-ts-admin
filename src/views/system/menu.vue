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
import { computed, defineComponent, onMounted, reactive, ref, watch } from 'vue'
import EditMenu from './components/editMenu.vue'
import RightPanel from '@/components/RightPanel/index.vue'
import { useReloadPage } from '@/hooks/useReload'
import { addNewMenu } from '@/api/menu'

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

    // 添加顶级菜单
    const handleCreateRootMenu = () => {
      menuType.value = 0
      panelVisible.value = true
    }
    const handleAddRootMenu = async (data: IMenuItemNotID) => {
      await addNewMenu(data).then(res => {
        if (res.code === 0) {
          reloadPage()
        }
      })
    }

    // 添加子菜单
    const parentData = ref<ITreeItemData | null>(null) // 缓存父菜单的数据
    const handleAddChildMenu = async (data: IMenuItemNotID) => {
      // const child = allocC
      await addNewMenu(data).then(res => {
        if (res.code === 0) {
          const { id } = res.data
          console.log('id', id)
          // TODO: 将新增的子菜单添加到树中，新增提示
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
      submitMenuForm
    }
  }
})
</script>

<style lang="scss" scoped>
.menu-container {
  display: flex;
  justify-content: space-between;
}
</style>
