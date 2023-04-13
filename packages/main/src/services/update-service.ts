import Socket from '@/utils/socket'
import { UPDATE_SERVICE_SOCKET_PATH } from '@/config'
import { getAppVersion } from '@/utils'

let instance = null
let isConnected = false

const handleExitUpdateService = () => {
  if (!isConnected) return

  const message = {
    type: 'exit' as const
  }

  handleSendData(message)
}

const handleSendData = (data: MessageType) => {
  const stringifyData = JSON.stringify(data)
  instance.write(stringifyData)
}

const handleReceiveData = () => {
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
}

const handleSendCheckVersionMessage = () => {
  if (!isConnected) return

  const data = {
    type: 'version' as const,
    content: getAppVersion(),
    path: 'https://service.qingshan.ltd/version.json'
  }
  handleSendData(data)
}

const handleSendDownloadMessage = () => {
  if (!isConnected) return

  const data = {
    type: 'download' as const
  }
  handleSendData(data)
}

const updateService = {
  name: 'update' as const,
  fns: {
    init: async () => {
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
    handleReceiveData,
    handleSendCheckVersionMessage,
    handleSendDownloadMessage,
    handleExitUpdateService
  }
}

export default updateService

