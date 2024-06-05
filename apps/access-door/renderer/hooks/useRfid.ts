import type { DoorEquipment, DoorRfidrecord } from '@smart-cabinet/database'
import { rendererInvoke, rendererOn } from '@smart-cabinet/utils/renderer'
import useListenAction from './useListenAction'
import { useStore } from '@/store'
import { type AccessDirection, EquipmentDetectionResult, EquipmentDetectionState, GPIIndex } from '~/enums'
import ipcNames from '#/ipcNames'

let timer: number | null = null

export default function () {
  const router = useRouter()
  const store = useStore()
  const { setEquipment, setEquipmentList, setActiveEquipmentList } = store
  const { equipmentList, activeEquipmentList } = storeToRefs(store)
  const { resetCountdown } = useListenAction()

  /**
   * @description: 开始获取 RFID 连接状态
   * @return {*}
   */
  async function startGetRfidConnectionStatus() {
    const getRfiRfidConnectionStatus = async () => {
      for (let index = 0; index < equipmentList.value.length; index++) {
        const equipment = toRaw(equipmentList.value[index])
        const status = await rendererInvoke(ipcNames.rfid.getRfidConnectionStatus, equipment.equipmentAddr)
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
   * @return {*}
   */
  const handleSetGPO = async (equipment: DoorEquipment, status: boolean) => {
    rendererInvoke(ipcNames.rfid.handleSetGPO, {
      addr: equipment.equipmentAddr,
      index: GPIIndex.ONE,
      status,
    })
  }

  /**
   * @description: 注册报警监听器
   * @return {*}
   */
  const regsterAlarmsListener = () => {
    // 检测开始触发
    rendererOn(ipcNames.renderer.detectionStart, (_: unknown, equipment: DoorEquipment, direction: AccessDirection) => {
      console.log('detectionStart', equipment, direction)
      const list = equipmentList.value.map((item) => {
        if (item.equipmentid === equipment.equipmentid) {
          return { ...item, ...equipment, direction, detectionState: EquipmentDetectionState.DETECTION_START }
        }
        return item
      })
      setEquipmentList(list)
    })

    // 检测结束触发
    rendererOn(ipcNames.renderer.detectionComplete, (_: unknown, equipment: DoorEquipment, rfidRecordList: DoorRfidrecord[]) => {
      console.log('detectionComplete', equipment, rfidRecordList)
      const list = equipmentList.value.map((item) => {
        if (item.equipmentid === equipment.equipmentid) {
          let detectionResult = rfidRecordList.length === 0 ? EquipmentDetectionResult.EMPTY : EquipmentDetectionResult.NORMAL
          if (item.detectionResult === EquipmentDetectionResult.ILLEGAL) {
            detectionResult = EquipmentDetectionResult.ILLEGAL
          }

          return { ...item, ...equipment, detectionState: EquipmentDetectionState.DETECTION_COMPLETE, detectionResult, rfidRecordList }
        }
        return item
      })
      setEquipmentList(list)
    })

    // 检测异常触发
    rendererOn(ipcNames.renderer.detectionException, (_: unknown, equipment: DoorEquipment) => {
      console.log('detectionException', equipment)
      const list = equipmentList.value.map((item) => {
        if (item.equipmentid === equipment.equipmentid) {
          return { ...item, ...equipment, detectionResult: EquipmentDetectionResult.ILLEGAL, isAlerting: true }
        }
        return item
      })
      setEquipmentList(list)
    })

    // 重置 UI
    rendererOn(ipcNames.renderer.resetUI, (_: unknown, equipment: DoorEquipment) => {
      const list = equipmentList.value.map((item) => {
        if (item.equipmentid === equipment.equipmentid) {
          return { ...item, ...equipment, detectionState: null, detectionResult: null }
        }
        return item
      })
      setEquipmentList(list)
    })
  }

  return {
    startGetRfidConnectionStatus,
    stopGetRfidConnectionStatus,
    handleSetGPO,
    regsterAlarmsListener,
  }
}
