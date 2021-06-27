<template>
  <div class="app-wrapper">
    <div class="sidebar-container">
      <sidebar />
    </div>
    <div class="main-container">
      <div class="header">
        <navbar @showSetting="openSetting"></navbar>
        <tags-view v-if="showTagsView"></tags-view>
      </div>
      <app-main></app-main>
    </div>
    <right-panel
      v-model="showSetting"
      title="样式风格设置"
      :size="SettingPanelWidth"
    >
      <settings />
    </right-panel>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import Sidebar from './components/Sidebar/index.vue'
import Navbar from './components/Navbar.vue'
import AppMain from './components/AppMain.vue'
import TagsView from './components/TagsView/index.vue'
import RightPanel from '@/components/RightPanel/index.vue'
import variables from '@/styles/variables.scss'
import Settings from './components/Settings/index.vue'
import { useStore } from '@/store'

export default defineComponent({
  components: {
    Sidebar,
    Navbar,
    AppMain,
    TagsView,
    RightPanel,
    Settings
  },
  setup() {
    const store = useStore()
    const showSetting = ref(false)

    const openSetting = () => {
      showSetting.value = true
    }

    const showTagsView = computed(() => store.state.settings.tagsView)

    return {
      showSetting,
      openSetting,
      SettingPanelWidth: variables.settingPanelWidth,
      showTagsView
    }
  }
})
</script>

<style lang="scss" scoped>
.app-wrapper {
  display: flex;
  width: 100%;
  height: 100%;
  .main-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .app-main {
      min-height: calc(100vh - 84px);
    }
  }
}
</style>
