import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'

import 'virtual:uno.css'
import 'animate.css'

// import 'ant-design-vue/dist/antd.variable.min.css'
import '@smart-cabinet/ui/icons/iconfont.js'
import '@smart-cabinet/ui/styles/index.css'

const app = createApp(App)
app.use(router)
app.mount('#app').$nextTick(() => {
  postMessage({ payload: 'removeLoading' }, '*')
})
