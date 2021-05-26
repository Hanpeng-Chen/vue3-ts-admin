import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'normalize.css/normalize.css'
import installElementPlus from './plugins/element'
import '@/styles/index.scss'
import initSvgIcon from '@/icons/index'

import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'

const app = createApp(App)

app.use(store)
  .use(router)
  .use(installElementPlus)
  .use(initSvgIcon)
  .mount('#app')

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $message: typeof ElMessage;
    $notify: typeof ElNotification;
    $alert: typeof ElMessageBox.alert;
    $confirm: typeof ElMessageBox.confirm;
    $prompt: typeof ElMessageBox.prompt;
  }
}
