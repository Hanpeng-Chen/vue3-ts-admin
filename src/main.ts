import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'normalize.css/normalize.css'
import installElementPlus from './plugins/element'
import '@/styles/index.scss'
import initSvgIcon from '@/icons/index'

const app = createApp(App)

app.use(store)
  .use(router)
  .use(installElementPlus)
  .use(initSvgIcon)
  .mount('#app')
