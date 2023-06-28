import { useStore } from '@/store'

export default function () {
  const store = useStore()
  const { setNetworkConnectionStatus } = store

  // 获取网络状态
  const getNetworkConnectStatus = async () => {
    const isConnected = await window.JSBridge.network.getConnectState()
    setNetworkConnectionStatus(isConnected)
  }

  return {
    getNetworkConnectStatus,
  }
}
