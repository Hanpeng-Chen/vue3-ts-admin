<template>
  <div>
    <el-menu
      class="sidebar-container-menu"
      mode="vertical"
    >
      <sidebar-item></sidebar-item>
    </el-menu>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SidebarItem from './SidebarItem.vue'

export default defineComponent({
  name: 'Sidebar',
  components: {
    SidebarItem
  }
})
</script>
