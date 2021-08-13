import nProgress from 'nprogress'
import 'nprogress/nprogress.css'
import router from './router'
import { getToken } from './utils/auth'

nProgress.configure({
  showSpinner: false
})

const whiteList = ['/login'] // 白名单
router.beforeEach((to) => {
  nProgress.start()
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      nProgress.done()
      return {
        path: '/',
        replace: true
      }
    }
    nProgress.done()
    return true
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
