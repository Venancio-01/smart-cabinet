import type { DoorEquipment } from '@smart-cabinet/database'
import { rendererInvoke, rendererOn } from '@smart-cabinet/utils/renderer'
import useListenAction from './useListenAction'
import { useStore } from '@/store'
import { type AccessDirection, EquipmentDetectionState, GPIIndex } from '~/enums'
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
        const status = await rendererInvoke(ipcNames.rfid.getRfidConnectionStatus, equipment)
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
    rendererOn(ipcNames.renderer.detecting, (_: unknown, equipment: DoorEquipment, direction: AccessDirection) => {
      const list = equipmentList.value.map((item) => {
        if (item.equipmentid === equipment.equipmentid) {
          return { ...item, ...equipment, direction, detectionState: EquipmentDetectionState.DETECTING }
        }
        return item
      })
      setEquipmentList(list)
    })

    rendererOn(ipcNames.renderer.detectedWithNormalCarrier, (_: unknown, equipment: DoorEquipment) => {
      const list = equipmentList.value.map((item) => {
        if (item.equipmentid === equipment.equipmentid) {
          return { ...item, ...equipment, detectionState: EquipmentDetectionState.DETECTED_WITH_NORMAL_CARRIER }
        }
        return item
      })
      setEquipmentList(list)
    })

    rendererOn(ipcNames.renderer.detectedWithIllegalCarrier, (_: unknown, equipment: DoorEquipment) => {
      const list = equipmentList.value.map((item) => {
        if (item.equipmentid === equipment.equipmentid) {
          return { ...item, ...equipment, detectionState: EquipmentDetectionState.DETECTED_WITH_ILLEGAL_CARRIER }
        }
        return item
      })
      setEquipmentList(list)
    })

    rendererOn(ipcNames.renderer.detectedNoException, async (_: unknown, equipment: DoorEquipment) => {
      const list = equipmentList.value.map((item) => {
        if (item.equipmentid === equipment.equipmentid) {
          return { ...item, ...equipment, detectionState: EquipmentDetectionState.DETECTED_NO_EXCEPTION }
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
