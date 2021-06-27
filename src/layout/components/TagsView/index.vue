<template>
  <div class="tags-view-container">
    <scroll-panel>
      <div class="tags-view-wrapper">
        <router-link
          class="tags-view-item"
          :class="{
            active: isActive(tag)
          }"
          :style="{
            backgroundColor: isActive(tag) ? themeColor : '',
            borderColor: isActive(tag) ? themeColor : ''
          }"
          v-for="(tag, index) in visitedViews"
          :key="index"
          :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
          tag="span"
        >
          <el-dropdown
            trigger="contextmenu"
            @command="command => handleTagCommand(command, tag)"
          >
            <span>
              {{ tag.meta.title }}
              <span
                v-if="!isAffix(tag)"
                class="el-icon-close"
                @click.prevent.stop="closeSelectedTag(tag)"
              ></span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="refresh">刷新</el-dropdown-item>
                <el-dropdown-item command="all">关闭所有</el-dropdown-item>
                <el-dropdown-item command="other">关闭其他</el-dropdown-item>
                <el-dropdown-item command="self">关闭</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </router-link>
      </div>
    </scroll-panel>
  </div>
</template>

<script lang="ts">
import { useStore } from '@/store'
import { RouteLocationWithFullPath } from '@/store/modules/tagsView'
import { computed, defineComponent, nextTick, onMounted, watch } from 'vue'
import { RouteRecordRaw, useRoute, useRouter } from 'vue-router'
import path from 'path'
import { routes } from '@/router'
import ScrollPanel from '@/components/ScrollPanel.vue'

enum TagCommandType {
  ALL = 'all',
  Other = 'other',
  Self = 'self',
  Refresh = 'refresh'
}

export default defineComponent({
  name: 'TagsView',
  components: {
    ScrollPanel
  },
  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()

    const visitedViews = computed(() => store.state.tagsView.visitedViews)

    // 过滤出要固定的tags
    const filterAffixTags = (routes: Array<RouteLocationWithFullPath | RouteRecordRaw>, basePath = '/') => {
      let tags: RouteLocationWithFullPath[] = []
      routes.forEach(route => {
        if (route.meta && route.meta.affix) {
          // 把路由路径解析成完整路径
          const tagPath = path.resolve(basePath, route.path)
          tags.push({
            name: route.name,
            path: tagPath,
            fullPath: tagPath,
            meta: { ...route.meta }
          } as RouteLocationWithFullPath)
        }

        // 深度优先遍历子路由
        if (route.children) {
          const childTags = filterAffixTags(route.children, route.path)
          if (childTags.length) {
            tags = [...tags, ...childTags]
          }
        }
      })
      return tags
    }

    const initTags = () => {
      const affixTags = filterAffixTags(routes)
      for (const tag of affixTags) {
        if (tag.name) {
          store.dispatch('tagsView/addVisitedView', tag)
        }
      }
    }
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
      initTags()
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

    const handleTagCommand = (command: TagCommandType, view: RouteLocationWithFullPath) => {
      switch (command) {
        case TagCommandType.Refresh:
          refreshSelectedTag(view)
          break
        case TagCommandType.ALL:
          handleCloseAllTag(view)
          break
        case TagCommandType.Other:
          handleCloseOtherTag(view)
          break
        case TagCommandType.Self:
          closeSelectedTag(view)
          break
      }
    }

    const refreshSelectedTag = (view: RouteLocationWithFullPath) => {
      store.dispatch('tagsView/delCachedView', view).then(() => {
        const { fullPath } = route
        nextTick(() => {
          router.replace('/redirect' + fullPath)
        })
      })
    }

    const handleCloseAllTag = (view: RouteLocationWithFullPath) => {
      store.dispatch('tagsView/delAllViews').then(() => {
        toLastView(visitedViews.value, view)
      })
    }

    const handleCloseOtherTag = (view: RouteLocationWithFullPath) => {
      store.dispatch('tagsView/delOtherViews', view).then(() => {
        if (!isActive(view)) {
          router.push(view.path)
        }
      })
    }

    const isAffix = (tag: RouteLocationWithFullPath) => {
      return tag.meta && tag.meta.affix
    }

    const themeColor = computed(() => store.getters.themeColor)

    return {
      visitedViews,
      isActive,
      isAffix,
      closeSelectedTag,
      handleTagCommand,
      themeColor
    }
  }
})
</script>

<style lang="scss" scoped>
.tags-view-container {
  height: 34px;
  background: #FFF;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);
  overflow: hidden;
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
        background-color: #409EFF;
        color: #FFF;
        border-color: #409EFF;
        ::v-deep {
          .el-dropdown {
            color: #FFF;
          }
        }
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
