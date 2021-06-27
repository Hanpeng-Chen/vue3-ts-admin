<template>
  <div class="drawer-container">
    <div class="drawer-item">
      <span>主题色</span>
       <!-- 主题组件 -->
      <theme-picker />
    </div>
    <div class="drawer-item">
      <span>Open Tags-View</span>
      <el-switch v-model="tagsView" class="drawer-swtich"></el-switch>
    </div>
    <div class="drawer-item">
      <span>Show Sidebar Logo</span>
      <el-switch v-model="sidebarLogo" class="drawer-swtich"></el-switch>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import ThemePicker from '@/components/ThemePicker/index.vue'
import { useStore } from '@/store'

export default defineComponent({
  name: 'Settings',
  components: {
    ThemePicker
  },
  setup () {
    const store = useStore()
    const tagsView = computed({
      get() {
        return store.state.settings.tagsView
      },
      set(val) {
        store.dispatch('settings/changeSetting', {
          key: 'tagsView',
          value: val
        })
      }
    })
    const sidebarLogo = computed({
      get() {
        return store.state.settings.sidebarLogo
      },
      set(val) {
        store.dispatch('settings/changeSetting', {
          key: 'sidebarLogo',
          value: val
        })
      }
    })
    return {
      tagsView,
      sidebarLogo
    }
  }
})
</script>

<style lang="scss" scoped>
.drawer-container {
  padding: 24px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;

  .drawer-item {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
    font-size: 16px;
    color: rgba(0, 0, 0, .65);
  }
}
</style>
