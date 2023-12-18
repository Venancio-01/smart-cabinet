import { useGlobalState } from '@/store'

const { setNetworkConnectionStatus } = useGlobalState()

// 获取网络状态
export async function getNetworkConnectStatus() {
  const isConnected = await window.electronApi.ipcRenderer.invoke('network:get-database-connect-state')
  setNetworkConnectionStatus(isConnected)
}
