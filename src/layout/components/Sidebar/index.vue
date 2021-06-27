<template>
  <div>
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

export default defineComponent({
  name: 'Sidebar',
  components: {
    SidebarItem,
    ScrollPanel
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
    const menuRoutes = computed(() => routes)

    const themeColor = computed(() => store.getters.themeColor)
    return {
      scssVariables,
      isCollapse,
      activeMenu,
      menuRoutes,
      themeColor
    }
  }
})
</script>
