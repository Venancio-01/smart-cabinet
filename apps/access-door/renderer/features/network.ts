import { useStore } from '@/store'

// 通过 nodejs 获取网络状态
export async function getNetworkStatus() {
  const store = useStore()

  const isConnected = await window.JSBridge.network.getConnectState()
  store.setNetworkIsOnline(isConnected)
}
