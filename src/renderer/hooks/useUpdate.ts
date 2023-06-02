import { Modal, message } from 'ant-design-vue'
import 'ant-design-vue/es/modal/style/css'
import 'ant-design-vue/es/message/style/css'

const timer = ref<null | number>(null)
const isConnected = ref(false)
let hideFn: (() => void) | null = null

export default function () {
  const startService = async () => {
    isConnected.value = await window.JSBridge.update.init()
  }

  const exitService = () => {
    window.JSBridge.update.handleExitUpdateService()
  }

  const handleSendCheckVersionMessage = () => {
    window.JSBridge.update.handleSendCheckVersionMessage()
  }
  const handleSendDownloadMessage = () => {
    window.JSBridge.update.handleSendDownloadMessage()
  }

  const pullingGetReceiveData = () => {
    timer.value = window.setInterval(async () => {
      const data = await window.JSBridge.update.handleReceiveData()
      if (data) {
        handleReceiveData(data)
        console.log(data)
      }
    }, 1000)
  }

  const stopPullingGetReceiveData = () => {
    if (timer.value) {
      window.clearInterval(timer.value)
      timer.value = null
    }
  }

  async function handleReceiveData(data: ReceiveData) {
    const map = {
      version: () => {
        Modal.confirm({
          title: '检测到新版本',
          content: '是否立即更新？',
          cancelText: '取消',
          onOk: () => {
            handleSendDownloadMessage()
            hideFn = message.loading('新版本安装包下载中，请稍后', 0)
          },
        })
      },
      download: () => {
        hideFn && hideFn()
        Modal.success({
          title: '更新成功',
          content: '请重启应用',
        })
      },
      error: () => {
        hideFn && hideFn()
        message.error('更新失败，请重试', 1500)
      },
    }

    map[data.type] && map[data.type]()
  }

  const initUpdateService = async () => {
    await startService()
    console.log(isConnected.value, 'isConnected.value')
    if (!isConnected.value)
      return

    pullingGetReceiveData()
    handleSendCheckVersionMessage()
  }

  const destroyUpdateService = () => {
    stopPullingGetReceiveData()
  }

  return {
    initUpdateService,
    destroyUpdateService,
    exitService,
  }
}
