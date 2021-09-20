<template>
  <div>
    <h1>dashboard page</h1>
    <svg-icon icon-class="bug"></svg-icon>
    <el-button @click="handleClick" v-permission="['super_admin']">按钮</el-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance } from 'vue'
export default defineComponent({
  name: 'Dashboard',
  setup() {
    const { proxy } = getCurrentInstance()!
    const handleClick = () => {
      proxy?.$message.success('success message')
    }
    return {
      handleClick
    }
  }
})
</script>
