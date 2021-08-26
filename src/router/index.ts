import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue'

export const asyncRoutes: Array<RouteRecordRaw> = [
  {
    path: '/documentaion',
    component: Layout,
    redirect: '/documentation/index',
    children: [
      {
        path: 'index',
        name: 'Documentation',
        component: () => import(/* webpackChunkName: "documentation" */ '@/views/documentation/index.vue'),
        meta: {
          title: '文档',
          icon: 'documentation',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/guide',
    component: Layout,
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
    redirect: '/system/user',
    meta: {
      title: '系统权限',
      icon: 'lock',
      alwaysShow: true // 根路由始终显示 哪怕只有一个子路由
    },
    children: [
      {
        path: 'menu',
        name: 'Menu Management',
        component: () => import(/* webpackChunkName: "menu" */ '@/views/system/menu.vue'),
        meta: {
          title: '菜单管理',
          hidden: false,
          breadcrumb: false
        }
      },
      {
        path: 'role',
        name: 'Role Management',
        component: () => import(/* webpackChunkName: "role" */ '@/views/system/role.vue'),
        meta: {
          title: '角色管理',
          hidden: false
        }
      },
      {
        path: 'user',
        name: 'User Management',
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
  }
]

export const constantRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: Layout,
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
