<template>
  <div>
    <svg-icon
      :icon-class="isFullScreen ? 'exit-fullscreen' : 'fullscreen'"
      @click="handleClick"
    ></svg-icon>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, onMounted, ref } from 'vue'
import screenfull, { Screenfull } from 'screenfull'

export default defineComponent({
  name: 'ScreenFull',
  setup() {
    const { proxy } = getCurrentInstance()!
    const isFullScreen = ref(false)
    const handleClick = () => {
      if (screenfull.isEnabled) {
        // 浏览器支持全屏
        screenfull.toggle()
        return
      }
      return proxy?.$message({
        message: '浏览器不支持全屏',
        type: 'warning'
      })
    }
    const change = () => {
      // 更新当前全屏状态 根据状态切换对应图标
      isFullScreen.value = (screenfull as Screenfull).isFullscreen
    }

    const init = () => {
      if (screenfull.isEnabled) {
        screenfull.on('change', change)
      }
    }

    onMounted(() => {
      init()
    })

    return {
      isFullScreen,
      handleClick
    }
  }
})
</script>
