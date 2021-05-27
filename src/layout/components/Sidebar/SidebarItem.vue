<template>
  <div
    class="sidebar-item-container"
    v-if="!item.meta || !item.meta.hidden"
  >
    <template v-if="theOnlyOneChildRoute && !theOnlyOneChildRoute.children">
      <sidebar-item-link
        v-if="theOnlyOneChildRoute.meta"
        :to="resolvePath(theOnlyOneChildRoute.path)"
      >
        <el-menu-item
          :index="resolvePath(theOnlyOneChildRoute.path)"
        >
          <i v-if="icon && icon.includes('el-icon')" :class="icon"></i>
          <svg-icon
            v-else-if="icon"
            class="menu-icon"
            :icon-class="icon"
          ></svg-icon>
          <template #title>
            <span>{{theOnlyOneChildRoute.meta.title}}</span>
          </template>
        </el-menu-item>
      </sidebar-item-link>
    </template>
    <el-submenu
      v-else
      :index="resolvePath(item.path)"
      popper-append-to-body
    >
      <template #title>
        <i v-if="item.meta && item.meta.icon.includes('el-icon')" :class="icon"></i>
        <svg-icon
          v-else-if="item.meta.icon"
          class="menu-icon"
          :icon-class="item.meta.icon"
        ></svg-icon>
        <span v-if="item.meta" class="submenu-title">{{item.meta.title}}</span>
      </template>
      <template v-if="item.children">
        <sidebar-item
          v-for="child in item.children"
          :key="child.path"
          :is-nest="true"
          :item="child"
          :base-path="resolvePath(child.path)"
        ></sidebar-item>
      </template>
    </el-submenu>
  </div>
</template>

<script lang="ts">
import { RouteRecordRaw } from 'node_modules/vue-router/dist/vue-router'
import { computed, defineComponent, PropType, toRefs } from 'vue'
import path from 'path'
import SidebarItemLink from './SidebarItemLink.vue'
import { isExternal } from '@/utils/validate'

export default defineComponent({
  name: 'SidebarItem',
  components: {
    SidebarItemLink
  },
  props: {
    item: {
      type: Object as PropType<RouteRecordRaw>,
      required: true
    },
    basePath: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const { item } = toRefs(props)

    const showChildCount = computed(() => {
      const children = (props.item.children || []).filter(child => {
        if (child.meta && child.meta.hidden) return false
        return true
      })
      return children.length
    })

    const theOnlyOneChildRoute = computed(() => {
      if (showChildCount.value > 1) {
        return null
      }

      if (item.value.children) {
        for (const child of item.value.children) {
          if (!child.meta || !child.meta.hidden) {
            return child
          }
        }
      }

      return {
        ...props.item,
        path: ''
      }
    })

    const icon = computed(() => {
      return theOnlyOneChildRoute.value?.meta?.icon || (props.item.meta && props.item.meta.icon)
    })

    const resolvePath = (childPath: string) => {
      if (isExternal(childPath)) {
        return childPath
      }
      return path.resolve(props.basePath, childPath)
    }
    return {
      resolvePath,
      theOnlyOneChildRoute,
      icon
    }
  }
})
</script>

<style lang="scss">
.sidebar-item-container {
  .menu-icon {
    margin-right: 16px;
    margin-left: 5px;
    vertical-align: middle;
  }
}
</style>
