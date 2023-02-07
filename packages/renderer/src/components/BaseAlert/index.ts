import { createVNode, render } from 'vue' //导入需要的vue函数
import Alert from './index.vue'

let instance: any = null

const createDialog = (text: string) => {
  if (instance) return
  const mountNode = document.createElement('div')
  instance = createApp(Alert, {
    visible: true,
    text,
    close: () => {
      instance.unmount()
      document.body.removeChild(mountNode)
      instance = null
    }
  })

  document.body.appendChild(mountNode)
  instance.mount(mountNode)
}

export default createDialog
