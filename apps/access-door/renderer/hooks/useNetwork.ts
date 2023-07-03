import { useStore } from '@/store'

let timer = null

export default function () {
  const store = useStore()
  const { setNetworkIsConnected } = store

  // 开始获取数据库连接状态
  const startGetNetworkConnectionStatus = () => {
    const getNetworkConnectionStatus = async () => {
      const status = await window.JSBridge.network.getNetworkConnectionStatus()
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
