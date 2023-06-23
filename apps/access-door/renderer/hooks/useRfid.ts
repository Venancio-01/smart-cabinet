// import { ipcRenderer } from 'electron'
import { useStore } from '@/store'
import type { AccessDirection } from '~/enums'

export default function () {
  const router = useRouter()
  const store = useStore()
  const { setRfidIsConnected, setCurrentReadRecordList, setLoadingVisible } = store

  /**
   * @description: 连接读写器
   * @return {*}
   */
  const handleConnect = async () => {
    try {
      setRfidIsConnected(true)
      return await window.JSBridge.rfid.handleConnect()
    } catch (err) {
      setRfidIsConnected(false)
    }
  }

  /**
   * @description: 断连读写器
   * @param {string} address
   * @return {*}
   */
  const handleDisConnect = async () => {
    return await window.JSBridge.rfid.handleDisConnect()
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
    // ipcRenderer.on('go-check-page', (_, direction: AccessDirection) => {
    //   setLoadingVisible(true)
    //   router.replace({
    //     path: '/check',
    //     query: {
    //       key: new Date().getTime(),
    //       direction,
    //     },
    //   })
    // })

    // ipcRenderer.on('go-alarm-page', () => {
    //   setLoadingVisible(true)
    //   router.replace('/alarm')
    // })

    // ipcRenderer.on('get-read-data', async (_, data) => {
    //   setCurrentReadRecordList(data)
    //   setLoadingVisible(false)
    // })
  }

  return {
    handleConnect,
    handleDisConnect,
    handleSetGPO,
    regsterAlarmsListener,
  }
}
