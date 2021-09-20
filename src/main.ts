import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store, { key } from './store'
import 'normalize.css/normalize.css'
import installElementPlus, { Size } from './plugins/element'
// 用户验证
import './permission'
import '@/styles/index.scss'
import initSvgIcon from '@/icons/index'

import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'

const app = createApp(App)

const size = store.getters.size

app.use(store, key)
  .use(router)
  .use(installElementPlus, {
    size
  })
  .use(initSvgIcon)
  .mount('#app')

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $message: typeof ElMessage;
    $notify: typeof ElNotification;
    $alert: typeof ElMessageBox.alert;
    $confirm: typeof ElMessageBox.confirm;
    $prompt: typeof ElMessageBox.prompt;
    $ELEMENT: {
      size: Size
    }
  }
}
