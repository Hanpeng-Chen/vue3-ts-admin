<template>
  <el-breadcrumb
    class="app-breadcrumb breadcrumb-container"
    separator="/"
  >
    <el-breadcrumb-item
      v-for="(item, index) in levelList"
      :key="index"
    >
      <span
        v-if="index === levelList.length - 1"
        class="no-redirect"
      >
        {{item.meta.title}}
      </span>
      <a v-else @click.prevent="handleLink(item)">{{item.meta.title}}</a>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script lang="ts">
import { RouteLocationMatched, RouteLocationRaw, useRoute, useRouter } from 'vue-router'
import { defineComponent, onBeforeMount, ref, watch } from 'vue'
import { compile } from 'path-to-regexp'

type PartialRouteLocationMatched = Partial<RouteLocationMatched>

export default defineComponent({
  name: 'Breadcrumb',
  setup() {
    const route = useRoute()
    const router = useRouter()
    // 导航列表 存放matched里筛选的路由记录
    const levelList = ref<Array<PartialRouteLocationMatched>>([])

    const isDashboard = (route?: PartialRouteLocationMatched) => {
      const name = route && route.name
      if (!name) {
        return false
      }
      return (name as string).trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase()
    }

    // 获取面包屑导航
    const getBreadcrumb = () => {
      // 过滤掉没有title属性的路由
      let matched = route.matched.filter(item => item.meta && item.meta.title) as PartialRouteLocationMatched[]
      // 获取第一个匹配路由记录
      const first = matched[0]
      if (!isDashboard(first)) {
        matched = ([{
          path: '/dashboard',
          meta: {
            title: 'Dashboard'
          }
        }] as PartialRouteLocationMatched[]).concat(matched)
      }
      levelList.value = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
    }

    onBeforeMount(() => {
      getBreadcrumb()
    })

    watch(() => route.path, () => {
      getBreadcrumb()
    })

    // 主要是针对 动态路由 /user/:id 进行动态参数填充
    const pathCompile = (path: string) => {
      const toPath = compile(path)
      const params = route.params
      return toPath(params)
    }

    // 点击面包屑导航跳转
    const handleLink = (route: RouteLocationMatched) => {
      const { path, redirect } = route
      if (redirect) {
        router.push(redirect as RouteLocationRaw)
        return
      }
      router.push(pathCompile(path))
    }

    return {
      levelList,
      handleLink
    }
  }
})
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  line-height: 50px;
  font-size: 14px;
  margin-left: 10px;
}
.no-redirect {
  color: #97a8be;
  cursor: text;
}
</style>

<style lang="scss">
.breadcrumb-enter-active,
.breadcrumb-leave-active {
  transition: all .5s;
}

.breadcrumb-enter,
.breadcrumb-leave-active {
  opacity: 0;
  transform: translateX(20px);
}

.breadcrumb-leave-active {
  position: absolute;
}

.breadcrumb-move {
  transition: all .5s;
}
</style>
