import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from '@/router'

import 'virtual:uno.css'
import 'animate.css'

import '@smart-cabinet/ui/icons/iconfont.js'
import '@smart-cabinet/ui/styles/index.css'

const pinia = createPinia()
const app = createApp(App)
app.use(router)
app.use(pinia)
app.mount('#app').$nextTick(() => {
  postMessage({ payload: 'removeLoading' }, '*')
})