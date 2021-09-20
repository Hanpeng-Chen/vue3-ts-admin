<template>
  <div class="sidebar-wrapper">
    <logo v-if="showLogo" :collapse="isCollapse"></logo>
    <scroll-panel>
      <el-menu
        class="sidebar-container-menu"
        mode="vertical"
        :default-active="activeMenu"
        :background-color="scssVariables.menuBg"
        :text-color="scssVariables.menuText"
        :active-text-color="themeColor"
        :collapse="isCollapse"
        :collapse-transition="true"
      >
        <sidebar-item
          v-for="route in menuRoutes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        >
        </sidebar-item>
      </el-menu>
    </scroll-panel>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import SidebarItem from './SidebarItem.vue'
import variables from '@/styles/variables.scss'
import { useRoute } from 'vue-router'
import { routes } from '@/router'
import { useStore } from '@/store'
import ScrollPanel from '@/components/ScrollPanel.vue'
import Logo from './Logo.vue'

export default defineComponent({
  name: 'Sidebar',
  components: {
    SidebarItem,
    ScrollPanel,
    Logo
  },
  setup() {
    const route = useRoute()
    const store = useStore()
    const activeMenu = computed(() => {
      const { path, meta } = route
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    })
    const scssVariables = computed(() => variables)
    const isCollapse = computed(() => !store.getters.sidebar.opened)

    // 获取权限菜单
    const menuList = computed(() => store.state.menu.authMenuTreeData)
    const menuRoutes = computed(() => [...menuList.value])

    const themeColor = computed(() => store.getters.themeColor)
    const showLogo = computed(() => store.state.settings.sidebarLogo)
    return {
      scssVariables,
      isCollapse,
      activeMenu,
      menuRoutes,
      themeColor,
      showLogo
    }
  }
})
</script>

<style lang="scss" scoped>
  .sidebar-wrapper {
    .sidebar-container-menu {
      height: 100vh;
      &.sidebar-show-logo {
        height: calc(100vh - 50px);
      }
    }
  }
</style>
