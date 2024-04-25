import { rendererInvoke } from '@smart-cabinet/utils/renderer'
import { useStore } from '@/store'
import ipcNames from '#/ipcNames'

let timer: number | null = null

export default function () {
  const store = useStore()
  const { setNetworkIsConnected } = store

  // 开始获取数据库连接状态
  const startGetNetworkConnectionStatus = () => {
    const getNetworkConnectionStatus = async () => {
      const status = await rendererInvoke(ipcNames.network.getDatabaseConnectState)
      setNetworkIsConnected(status)
    }
    getNetworkConnectionStatus()
    timer = window.setInterval(getNetworkConnectionStatus, 5000)
  }

  // 停止获取数据库连接状态
  const stopGetNetworkConnectionStatus = () => {
    timer && clearInterval(timer)
    timer = null
  }

  return {
    startGetNetworkConnectionStatus,
    stopGetNetworkConnectionStatus,
  }
}
