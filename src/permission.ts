import { ElMessage } from 'element-plus'
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'
import router from './router'
import store from './store'
import { getToken } from './utils/auth'

nProgress.configure({
  showSpinner: false
})

const whiteList = ['/login'] // 白名单
router.beforeEach(async (to) => {
  nProgress.start()
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      nProgress.done()
      return {
        path: '/',
        replace: true
      }
    } else {
      try {
        const hasRoles = store.getters.roles && store.getters.roles.length > 0
        if (hasRoles) {
          nProgress.done()
          return true
        }
        // 无用户信息和角色信息
        const roles = await store.dispatch('user/getUserInfo')
        // 该用户未分配角色，提示异常
        if (!roles || roles.length === 0) {
          throw new Error('该用户暂未分配角色')
        }

        // 获取权限路由
        const accessRoutes = await store.dispatch('permission/generateRoutes')
        // 动态注册路由
        accessRoutes.forEach(router.addRoute)
        return to.fullPath
      } catch (error) {
        await store.dispatch('user/resetToken')
        ElMessage.error('登录失败：' + (error.message || '异常'))
        nProgress.done()
        return `/login?redirect=${to.path}`
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      nProgress.done()
      return true
    }
    nProgress.done()
    return {
      path: '/login',
      query: {
        redirect: to.path,
        ...to.query
      }
    }
  }
})

router.afterEach(() => {
  nProgress.done()
})
