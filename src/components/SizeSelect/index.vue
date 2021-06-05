<template>
  <div>
    <el-dropdown trigger="click" @command="handleSize">
      <div>
        <svg-icon class-name="size-icon" icon-class="size"></svg-icon>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="item in sizeOptions"
            :key="item.value"
            :command="item.value"
            :disabled="item.value === size"
          >
            {{item.label}}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script lang="ts">
import { Size } from '@/plugins/element'
import { useStore } from '@/store'
import { ComponentInternalInstance, ComponentPublicInstance, computed, defineComponent, getCurrentInstance, nextTick, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  name: 'SizeSelect',
  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const { proxy } = getCurrentInstance() as ComponentInternalInstance

    const size = computed(() => store.getters.size)

    const sizeOptions = ref([
      { label: 'Default', value: 'default' },
      { label: 'Medium', value: 'medium' },
      { label: 'Small', value: 'small' },
      { label: 'Mini', value: 'mini' }
    ])

    const refreshView = () => {
      const { fullPath } = route
      nextTick(() => {
        router.replace({
          path: '/redirect' + fullPath
        })
      })
    }

    const handleSize = (command: Size) => {
      (proxy as ComponentPublicInstance).$ELEMENT.size = command
      store.dispatch('app/setSize', command)
      refreshView()
      proxy?.$message.success({
        type: 'success',
        message: 'Element组件样式大小切换成功'
      })
    }

    return {
      sizeOptions,
      size,
      handleSize
    }
  }
})
</script>
