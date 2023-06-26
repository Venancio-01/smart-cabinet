import { useStore } from '@/store'

export default function () {
  const store = useStore()
  const { setNetworkIsConnected } = store

  // 获取数据库连接状态
  const getNetworkConnectionStatus = async () => {
    const status = await window.JSBridge.network.getNetworkConnectionStatus()
    setNetworkIsConnected(status)
  }

  return {
    getNetworkConnectionStatus,
  }
}
