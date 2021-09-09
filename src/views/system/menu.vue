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
  </div>
</template>

<script lang="ts">
import { useStore } from '@/store'
import { ITreeItemData } from '@/store/modules/menu'
import { ElForm, ElTree } from 'element-plus'
import { computed, defineComponent, ref } from 'vue'

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
  setup() {
    const store = useStore()
    const menuTreeRef = ref<IMenuTree | null>(null)
    const treeData = computed(() => store.getters.menusTree)
    const menus = ref<ITreeItemData[]>([])
  }
})
</script>

<style lang="scss" scoped>
.menu-container {
  display: flex;
  justify-content: space-between;
}
</style>
