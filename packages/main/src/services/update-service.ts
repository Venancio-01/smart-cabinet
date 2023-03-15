import Socket from '@/utils/socket'
import { UPDATE_SERVICE_SOCKET_PATH } from '@/config'
import { getAppVersion } from '@/utils'

let instance = null
let isConnected = false

/**
 * @description: 关闭更新服务
 * @return {*}
 */
const handleExitUpdateService = () => {
  if (!isConnected) return

  const message = {
    type: 'exit' as const
  }

  handleSendData(message)
}

/**
 * @description: 发送数据
 * @param {MessageType} data
 * @return {*}
 */
const handleSendData = (data: MessageType) => {
  const stringifyData = JSON.stringify(data)
  instance.write(stringifyData)
}

const updateService = {
  name: 'update' as const,
  fns: {
    /**
     * @description: 初始化 socket 连接
     * @return {*}
     */
    async init() {
      instance = new Socket({
        address: UPDATE_SERVICE_SOCKET_PATH,
        format: 'utf-8'
      })

      try {
        await instance.init()
        return (isConnected = true)
      } catch (e) {
        console.log(e, 'update service socket 连接失败')
        return isConnected
      }
    },

    /**
     * @description: 处理接收的数据，返回解析后的数据
     * @return {*}
     */
    handleReceiveData(): ReceiveData | null {
      if (!isConnected) return

      const data = instance.getData()
      if (data === '') return null

      instance.setData('')
      try {
        const parseData = JSON.parse(data) as ReceiveData
        return parseData
      } catch (e) {
        console.log(e)
        return null
      }
    },
    handleSendCheckVersionMessage() {
      if (!isConnected) return

      const data = {
        type: 'version' as const,
        content: getAppVersion(),
        path: 'https://service.qingshan.ltd/version.json'
      }
      handleSendData(data)
    },
    handleSendDownloadMessage() {
      if (!isConnected) return

      const data = {
        type: 'download' as const
      }
      handleSendData(data)
    },
    handleExitUpdateService
  }
}

export default updateService
