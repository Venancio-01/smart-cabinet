import { QUERY_NETWORK_INTERVAL } from '@/config'
import { useStore } from '@/store'

export default function () {
  const store = useStore()
  const { setNetworkIsOnline } = store
  const timer = ref<number | null>(null)

  // 通过 nodejs 获取网络状态
  const getNetworkStatus = async () => {
    const isConnected = await window.JSBridge.network.getConnectState()
    setNetworkIsOnline(isConnected)
  }

  onMounted(() => {
    getNetworkStatus()
    timer.value = window.setInterval(getNetworkStatus, QUERY_NETWORK_INTERVAL)
  })

  onBeforeMount(() => {
    if (timer.value) clearInterval(timer.value)
  })
}
