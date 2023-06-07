import { useStore } from '@/store'

export default function () {
  const store = useStore()
  const { setNetworkIsOnline } = store

  // 获取网络状态
  const getNetworkStatus = async () => {
    const isConnected = await window.JSBridge.network.getConnectState()
    setNetworkIsOnline(isConnected)
  }

  onMounted(() => {
    getNetworkStatus()
  })
}
