import { App } from 'vue'
import {
  locale,
  ElButton,
  ElMessage,
  ElNotification,
  ElMessageBox,
  ElMenu,
  ElMenuItem,
  ElSubmenu,
  ElBreadcrumb,
  ElBreadcrumbItem
} from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import lang from 'element-plus/lib/locale/lang/zh-cn'
// Element Plus 直接使用了 Day.js 项目的时间日期国际化设置, 并且会自动全局设置已经导入的 Day.js 国际化配置。
import 'dayjs/locale/zh-cn'

// size属性类型
export type size = 'default' | 'medium' | 'small' | 'mini'

export default (app: App): void => {
  locale(lang)

  // 按需导入组件列表
  const components = [
    ElButton,
    ElMessage,
    ElNotification,
    ElMessageBox,
    ElMenu,
    ElMenuItem,
    ElSubmenu,
    ElBreadcrumb,
    ElBreadcrumbItem
  ]

  components.forEach(component => {
    app.component(component.name, component)
  })

  app.config.globalProperties.$message = ElMessage
  app.config.globalProperties.$notify = ElNotification
  app.config.globalProperties.$alert = ElMessageBox.alert
  app.config.globalProperties.$confirm = ElMessageBox.confirm
  app.config.globalProperties.$prompt = ElMessageBox.prompt

  app.config.globalProperties.$ELEMENT = {
    size: 'medium'
  }
}
