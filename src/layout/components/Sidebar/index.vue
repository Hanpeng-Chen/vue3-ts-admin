<template>
  <div>
    <el-menu
      class="sidebar-container-menu"
      mode="vertical"
      :default-active="activeMenu"
      :background-color="scssVariables.menuBg"
      :text-color="scssVariables.menuText"
      :active-text-color="scssVariables.menuActiveText"
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
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import SidebarItem from './SidebarItem.vue'
import variables from '@/styles/variables.scss'
import { useRoute } from 'vue-router'
import { routes } from '@/router'
import { useStore } from '@/store'

export default defineComponent({
  name: 'Sidebar',
  components: {
    SidebarItem
  },
  setup() {
    const route = useRoute()
    const store = useStore()
    const activeMenu = computed(() => {
      const { path } = route
      return path
    })
    const scssVariables = computed(() => variables)
    const isCollapse = computed(() => !store.getters.sidebar.opened)
    const menuRoutes = computed(() => routes)
    return {
      scssVariables,
      isCollapse,
      activeMenu,
      menuRoutes
    }
  }
})
</script>
