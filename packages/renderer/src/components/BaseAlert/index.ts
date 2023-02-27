import { App } from 'vue'
import Alert from './index.vue'

let instance: App<Element> | null = null

const createDialog = (text: string) => {
  if (instance) return
  const mountNode = document.createElement('div')
  instance = createApp(Alert, {
    visible: true,
    text,
    close: () => {
      instance?.unmount()
      document.body.removeChild(mountNode)
      instance = null
    }
  })

  document.body.appendChild(mountNode)
  instance.mount(mountNode)
}

export default createDialog
