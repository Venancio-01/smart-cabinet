import { useStore } from '@/store'
import type { AccessDirection } from '~/enums'

export default function () {
  const router = useRouter()
  const store = useStore()
  const { setRfidIsConnected, setCurrentReadRecordList, setLoadingVisible } = store

  async function getRfidConnectionStatus() {
    const status = await window.JSBridge.rfid.getRfidConnectionStatus()
    setRfidIsConnected(status)
  }

  /**
   * @description: 设置 GPO
   * @param {string} address
   * @param {boolean} status
   * @return {*}
   */
  const handleSetGPO = async (status: boolean) => {
    return await window.JSBridge.rfid.handleSetGPO(1, status)
  }

  /**
   * @description: 注册报警监听器
   * @return {*}
   */
  const regsterAlarmsListener = () => {
    window.electron.ipcRenderer.on('go-check-page', (_, direction: AccessDirection) => {
      setLoadingVisible(true)
      router.replace({
        path: '/check',
        query: {
          key: new Date().getTime(),
          direction,
        },
      })
    })

    window.electron.ipcRenderer.on('go-alarm-page', () => {
      setLoadingVisible(true)
      router.replace('/alarm')
    })

    window.electron.ipcRenderer.on('get-read-data', async (_, data) => {
      setCurrentReadRecordList(data)
      setLoadingVisible(false)
    })
  }

  return {
    getRfidConnectionStatus,
    handleSetGPO,
    regsterAlarmsListener,
  }
}
