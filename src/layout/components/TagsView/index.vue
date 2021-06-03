<template>
  <div class="tags-view-container">
    <div class="tags-view-wrapper">
      <router-link
        class="tags-view-item"
        :class="{
          active: isActive(tag)
        }"
        v-for="(tag, index) in visitedViews"
        :key="index"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        tag="span"
      >
        {{ tag.meta.title }}
        <span
          class="el-icon-close"
          @click.prevent.stop="closeSelectedTag(tag)"
        ></span>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { useStore } from '@/store'
import { RouteLocationWithFullPath } from '@/store/modules/tagsView'
import { computed, defineComponent, onMounted, watch } from 'vue'
import { RouteRecordRaw, useRoute, useRouter } from 'vue-router'

export default defineComponent({
  name: 'TagsView',
  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()

    const visitedViews = computed(() => store.state.tagsView.visitedViews)
    const addTag = () => {
      const { name } = route
      if (name) {
        store.dispatch('tagsView/addView', route)
      }
    }

    watch(() => route.path, () => {
      addTag()
    })

    onMounted(() => {
      addTag()
    })

    const isActive = (tag: RouteRecordRaw) => {
      return tag.path === route.path
    }

    const toLastView = (visitedViews: RouteLocationWithFullPath[], view: RouteLocationWithFullPath) => {
      const lastView = visitedViews[visitedViews.length - 1]
      if (lastView) {
        router.push(lastView.fullPath as string)
      } else {
        // 如果刚刚删除的正是Dashboard 就重定向回Dashboard（首页）
        if (view.name === 'Dashboard') {
          router.replace({ path: '/redirect' + view.fullPath as string })
        } else {
          router.push('/')
        }
      }
    }

    const closeSelectedTag = (view: RouteLocationWithFullPath) => {
      store.dispatch('tagsView/delView', view).then(() => {
        if (isActive(view)) {
          toLastView(visitedViews.value, view)
        }
      })
    }

    return {
      visitedViews,
      isActive,
      closeSelectedTag
    }
  }
})
</script>

<style lang="scss" scoped>
.tags-view-container {
  width: 100%;
  height: 34px;
  background: #FFF;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);
  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      background: #FFF;
      color: #495060;
      padding: 0 8px;
      box-sizing: border-box;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;
      &:first-of-type {
        margin-left: 15px;
      }
      &:last-of-type {
        margin-right: 15px;
      }
      &.active {
        background-color: #42b983;
        color: #FFF;
        border-color: #42b983;
        &::before {
          position: relative;
          display: inline-block;
          content: '';
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-right: 5px;
          background: #FFF;
        }
      }
    }
  }
}
</style>

<style lang="scss">
.tags-view-container {
  .el-icon-close {
    width: 16px;
    height: 16px;
    position: relative;
    left: 2px;
    border-radius: 50%;
    text-align: center;
    transition: all .3s cubic-bezier(.645, .045, .355, 1);
    transform-origin: 100% 50%;
    &:before {
      transform: scale(.6);
      display: inline-block;
      vertical-align: -1px;
    }
    &:hover {
      background-color: #b4bccc;
      color: #fff;
    }
  }
}
</style>
