import { useStore } from '@/store'
import type { AccessDirection } from '~/enums'

const router = useRouter()

/**
 * @description: 连接读写器
 * @return {*}
 */
export async function handleConnect() {
  const store = useStore()
  try {
    store.setRfidIsConnected(true)
    return await window.JSBridge.rfid.handleConnect()
  } catch (err) {
    store.setRfidIsConnected(false)
  }
}

/**
 * @description: 断连读写器
 * @param {string} address
 * @return {*}
 */
export async function handleDisConnect() {
  return await window.JSBridge.rfid.handleDisConnect()
}

/**
 * @description: 设置 GPO
 * @param {string} address
 * @param {boolean} status
 * @return {*}
 */
export async function handleSetGPO(status: boolean) {
  return await window.JSBridge.rfid.handleSetGPO(1, status)
}

/**
 * @description: 注册报警监听器
 * @return {*}
 */
export function regsterAlarmsListener() {
  const store = useStore()

  window.electron.ipcRenderer.on('go-check-page', (_, direction: AccessDirection) => {
    store.setLoadingVisible(true)
    router.replace({
      path: '/check',
      query: {
        key: new Date().getTime(),
        direction,
      },
    })
  })

  window.electron.ipcRenderer.on('go-alarm-page', () => {
    store.setLoadingVisible(true)
    router.replace('/alarm')
  })

  window.electron.ipcRenderer.on('get-read-data', async (_, data) => {
    store.setCurrentReadRecordList(data)
    store.setLoadingVisible(false)
  })
}
