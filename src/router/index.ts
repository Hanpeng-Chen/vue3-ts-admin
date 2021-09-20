import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue'

export const asyncRoutes: Array<RouteRecordRaw> = [
  {
    path: '/documentation',
    component: Layout,
    name: 'DocumentationLayout',
    redirect: '/documentation/index',
    children: [
      {
        path: 'index',
        name: 'Documentation',
        component: () => import(/* webpackChunkName: "documentation" */ '@/views/documentation/index.vue'),
        meta: {
          title: '文档',
          icon: 'documentation',
          hidden: false, // 菜单栏不显示
          noCache: true
        }
      }
    ]
  },
  {
    path: '/async',
    component: Layout,
    redirect: '/async/index',
    name: 'AsyncLayout',
    children: [
      {
        path: 'index',
        name: 'Async',
        component: () => import(/* webpackChunkName: "async" */ '@/views/Async.vue'),
        meta: {
          title: '动态路由',
          icon: 'guide'
        }
      }
    ]
  },
  {
    path: '/guide',
    component: Layout,
    name: 'GuideLayout',
    redirect: '/guide/index',
    meta: {
      title: '引导',
      icon: 'lock',
      alwaysShow: false
    },
    children: [
      {
        path: 'index',
        name: 'Guide',
        component: () => import(/* webpackChunkName: "guide" */ '@/views/guide/index.vue'),
        meta: {
          title: '引导页',
          icon: 'guide'
          // activeMenu: '/documentation/index'
        }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    name: 'SystemLayout',
    redirect: '/system/user',
    meta: {
      title: '系统权限',
      icon: 'lock',
      alwaysShow: true // 根路由始终显示 哪怕只有一个子路由
    },
    children: [
      {
        path: 'menu',
        name: 'MenuManagement',
        component: () => import(/* webpackChunkName: "menu" */ '@/views/system/menu.vue'),
        meta: {
          title: '菜单管理',
          hidden: false,
          breadcrumb: false
        }
      },
      {
        path: 'role',
        name: 'RoleManagement',
        component: () => import(/* webpackChunkName: "role" */ '@/views/system/role.vue'),
        meta: {
          title: '角色管理',
          hidden: false
        }
      },
      {
        path: 'user',
        name: 'UserManagement',
        component: () => import(/* webpackChunkName: "user" */ '@/views/system/user.vue'),
        meta: {
          title: '用户管理'
        }
      }
    ]
  },
  {
    path: '/external-link',
    component: Layout,
    name: 'ExternalLinkLayout',
    children: [
      {
        path: 'https://www.chenhanpeng.com/',
        redirect: '/',
        meta: {
          title: '外链',
          icon: 'link',
          hidden: false
        }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    meta: {
      hidden: true
    }
  }
]

export const constantRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: Layout,
    name: 'DashboardLayout',
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/index.vue'),
        meta: {
          title: '首页',
          icon: 'dashboard',
          affix: true // 固定显示在tagsView上
        }
      }
    ]
  },
  {
    path: '/redirect',
    component: Layout,
    meta: {
      hidden: true
    },
    name: 'Redirect',
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue')
  },
  {
    path: '/profile',
    name: 'ProfileLayout',
    component: Layout,
    redirect: '/profile/index',
    children: [
      {
        path: 'index',
        name: 'Profile',
        component: () => import('@/views/profile/index.vue'),
        meta: {
          hidden: true,
          title: '个人中心'
        }
      }
    ]
  },
  {
    path: '/401',
    component: Layout,
    name: '401Layout',
    children: [
      {
        path: '',
        component: () => import('@/views/error-pages/401.vue'),
        meta: {
          title: '401',
          icon: '404',
          hidden: true
        }
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/error-pages/404.vue'),
    meta: {
      hidden: true // 404 hidden掉
    }
  }
]

export const routes = [
  ...constantRoutes,
  ...asyncRoutes
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
