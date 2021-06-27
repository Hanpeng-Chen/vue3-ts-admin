<template>
  <div class="drawer-container">
    <div class="drawer-item">
      <span>主题色</span>
       <!-- 主题组件 -->
      <theme-picker />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ThemePicker from '@/components/ThemePicker/index.vue'

export default defineComponent({
  name: 'Settings',
  components: {
    ThemePicker
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
