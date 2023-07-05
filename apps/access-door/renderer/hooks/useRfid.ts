import type { DoorRfidrecord } from 'database'
import { useStore } from '@/store'
import type { AccessDirection } from '~/enums'

let timer: number | null = null

export default function () {
  const router = useRouter()
  const store = useStore()
  const { setEquipment, setCurrentReadRecordList, setLoadingVisible } = store
  const { equipmentList } = storeToRefs(store)

  /**
   * @description: 开始获取 RFID 连接状态
   * @return {*}
   */
  async function startGetRfidConnectionStatus() {
    const getRfiRfidConnectionStatus = async () => {
      for (let index = 0; index < equipmentList.value.length; index++) {
        const equipment = toRaw(equipmentList.value[index])
        const status = await window.JSBridge.rfid.getRfidConnectionStatus(equipment)
        setEquipment(equipment.equipmentid, {
          rfidIsConnected: status,
        })
      }
    }
    getRfiRfidConnectionStatus()
    timer = window.setInterval(getRfiRfidConnectionStatus, 5000)
  }

  /**
   * @description: 停止获取 RFID 连接状态
   * @return {*}
   */
  async function stopGetRfidConnectionStatus() {
    timer && clearInterval(timer)
    timer = null
  }

  /**
   * @description: 设置 GPO
   * @param {string} address
   * @param {boolean} status
   * @return {*}
   */
  const handleSetGPO = async (status: boolean) => {
    equipmentList.value.forEach((equipment) => {
      window.JSBridge.rfid.handleSetGPO(equipment, 1, status)
    })
  }

  /**
   * @description: 注册报警监听器
   * @return {*}
   */
  const regsterAlarmsListener = () => {
    window.electron.ipcRenderer.on('go-check-page', (_: unknown, direction: AccessDirection) => {
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

    window.electron.ipcRenderer.on('get-read-data', async (_: unknown, data: DoorRfidrecord[]) => {
      console.log('🚀 ~ file: useRfid.ts:68 ~ window.electron.ipcRenderer.on ~ data:', data)
      setCurrentReadRecordList(data)
      setLoadingVisible(false)
    })
  }

  return {
    startGetRfidConnectionStatus,
    stopGetRfidConnectionStatus,
    handleSetGPO,
    regsterAlarmsListener,
  }
}
