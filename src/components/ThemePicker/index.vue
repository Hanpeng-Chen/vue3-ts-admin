<template>
  <el-color-picker
    v-model="theme"
    class="theme-picker"
    :predefine="themeColor"
    popper-class="theme-picker-dropdown"
  ></el-color-picker>
</template>

<script lang="ts">
import { useStore } from '@/store'
import { computed, defineComponent, ref, watch } from 'vue'

export default defineComponent({
  name: 'ThemePicker',
  setup() {
    const store = useStore()

    const themeColor = ['#409EFF', '#1890ff', '#304156', '#212121', '#11a983', '#13c2c2', '#6959CD', '#f5222d']
    // 获取默认主题色
    const defaultTheme = computed(() => store.state.settings.theme)

    const theme = ref('')

    watch(defaultTheme, value => {
      theme.value = value
    }, {
      immediate: true
    })

    return {
      themeColor,
      theme
    }
  }
})
</script>

<style lang="scss">
.theme-picker {
  height: 26px !important;
  margin-right: 8px;
  .el-color-picker__trigger {
    height: 26px !important;
    width: 26px !important;
    padding: 2px;
  }
}

.theme-message,
.theme-picker-dropdown {
  z-index: 99999 !important;
}

.theme-picker-dropdown .el-color-dropdown__link-btn {
  display: none;
}
</style>
