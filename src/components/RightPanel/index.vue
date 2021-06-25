<template>
  <div class="right-panel">
    <el-drawer
      :title="title"
      :model-value="modelValue"
      :direction="direction"
      :show-close="showClose"
      :custom-class="customClass"
      :with-header="withHeader"
      :size="size"
      @close="handleClose"
    >
      <slot />
    </el-drawer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'RightPanel',
  props: {
    modelValue: {
      type: Boolean,
      default: true
    },
    direction: {
      type: String,
      validator(val: string) {
        return ['rtl', 'ltr', 'ttb', 'btt'].includes(val)
      },
      default: 'rtl'
    },
    title: {
      type: String,
      default: '自定义标题'
    },
    size: {
      type: [String, Number]
    },
    customClass: {
      type: String,
      default: 'setting-panel'
    },
    showClose: {
      type: Boolean,
      default: true
    },
    withHeader: {
      type: Boolean,
      default: true
    }
  },
  emits: ['update:modelValue', 'close'],
  setup(props, { emit }) {
    const handleClose = () => {
      emit('update:modelValue', false)
      emit('close')
    }

    return {
      handleClose
    }
  }
})
</script>

<style lang="sss" scoped>

</style>
