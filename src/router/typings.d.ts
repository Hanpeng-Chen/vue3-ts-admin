import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string;
    icon?: string;
    hidden?: boolean;
    noCache?: boolean;
    activeMenu?: string; // 指定菜单激活
    breadcrumb?: boolean; // 是否显示面包屑
    affix?: boolean; // 固定显示在tagview中
    alwaysShow?: boolean; // 菜单是否一直显示根路由
  }
}
