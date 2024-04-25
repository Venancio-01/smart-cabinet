import type { DoorEquipment, DoorRfidrecord } from '@smart-cabinet/database'
import { rendererInvoke, rendererOn } from '@smart-cabinet/utils/renderer'
import useListenAction from './useListenAction'
import { useStore } from '@/store'
import { type AccessDirection, ActiveEquipmentState, GPIIndex } from '~/enums'
import ipcNames from '#/ipcNames'

let timer: number | null = null

export default function () {
  const router = useRouter()
  const store = useStore()
  const { setEquipment, setActiveEquipmentList } = store
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
    // 监听红外开始触发
    rendererOn(ipcNames.renderer.triggerStart, (_: unknown, equipment: DoorEquipment, direction: AccessDirection) => {
      const existActiveEquipmentIndex = activeEquipmentList.value.findIndex(item => item.equipmentid === equipment.equipmentid)
      const isExist = existActiveEquipmentIndex > -1

      if (isExist) {
        const equipmentList = activeEquipmentList.value.map((item) => {
          if (item.equipmentid === equipment.equipmentid) {
            return { ...equipment, direction, state: ActiveEquipmentState.CHECKING, loading: true }
          }
          return item
        })
        setActiveEquipmentList(equipmentList)
      }
      else {
        const equipmentList = [...activeEquipmentList.value, { ...equipment, direction, state: ActiveEquipmentState.CHECKING, loading: true }]
        setActiveEquipmentList(equipmentList)
      }

      // 重置操作倒计时
      resetCountdown()

      router.replace({
        path: '/multiple-alarm',
      })
    })

    // 监听检测到报警
    rendererOn(ipcNames.renderer.detectAlarm, (_: unknown, equipment: DoorEquipment) => {
      const existActiveEquipment = activeEquipmentList.value.find(item => item.equipmentid === equipment.equipmentid)
      const isExist = !!existActiveEquipment

      if (isExist) {
        const equipmentList = activeEquipmentList.value.map((item) => {
          if (item.equipmentid === equipment.equipmentid) {
            return { ...equipment, state: ActiveEquipmentState.ALARMING, loading: true }
          }
          return item
        })
        setActiveEquipmentList(equipmentList)
      }
      else {
        const equipmentList = [...activeEquipmentList.value, { ...equipment, state: ActiveEquipmentState.ALARMING, loading: true }]
        setActiveEquipmentList(equipmentList)
      }

      // 重置操作倒计时
      resetCountdown()

      router.replace({
        path: '/multiple-alarm',
      })
    })

    // 监听读取完成数据
    rendererOn(ipcNames.renderer.readData, async (_: unknown, equipment: DoorEquipment, data: DoorRfidrecord[]) => {
      const existActiveEquipment = activeEquipmentList.value.find(item => item.equipmentid === equipment.equipmentid)
      const isExist = !!existActiveEquipment

      if (isExist) {
        const isCheckingState = existActiveEquipment.state === ActiveEquipmentState.CHECKING
        const state = isCheckingState ? ActiveEquipmentState.CHECKED : existActiveEquipment.state

        const equipmentList = activeEquipmentList.value.map((item) => {
          if (item.equipmentid === equipment.equipmentid) {
            return { ...equipment, readRecordList: data, state, loading: false }
          }
          return item
        })
        setActiveEquipmentList(equipmentList)
      }
      else {
        const equipmentList = [...activeEquipmentList.value, { ...equipment, readRecordList: data, state: ActiveEquipmentState.CHECKED, loading: false }]
        setActiveEquipmentList(equipmentList)
      }

      // 重置操作倒计时
      resetCountdown()

      router.replace({
        path: '/multiple-alarm',
      })
    })
  }

  return {
    startGetRfidConnectionStatus,
    stopGetRfidConnectionStatus,
    handleSetGPO,
    regsterAlarmsListener,
  }
}
