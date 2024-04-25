import type { DoorAlarmrecord, DoorEquipment, DoorRfidrecord } from '@smart-cabinet/database'
import { rendererInvoke, rendererOn } from '@smart-cabinet/utils/renderer'
import { useStore } from '@/store'
import { type AccessDirection, ActiveEquipmentState, GPIIndex } from '~/enums'
import ipcNames from '#/ipcNames'

let timer: number | null = null

export default function () {
  const router = useRouter()
  const store = useStore()
  const { setEquipment, setCurrentReadRecordList, setLoadingVisible, setAlarmRecordList, setAlarmEquipmentList, setAlarmEquipment, setActiveEquipmentList } = store
  const { equipmentList, alarmEquipmentList, alarmRecordList, activeEquipmentList } = storeToRefs(store)

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
      equipment: toRaw(equipment),
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
            return { ...equipment, direction, state: ActiveEquipmentState.CHECKING }
          }
          return item
        })
        setActiveEquipmentList(equipmentList)
      }
      else {
        const equipmentList = [...activeEquipmentList.value, { ...equipment, direction, state: ActiveEquipmentState.CHECKING }]
        setActiveEquipmentList(equipmentList)
      }

      setLoadingVisible(true)
      router.replace({
        path: '/multiple-alarm',
      })
    })

    // 监听检测到报警
    rendererOn(ipcNames.renderer.detectAlarm, (_: unknown, equipment: DoorEquipment, alarmRecordList: DoorAlarmrecord[]) => {
      const existActiveEquipmentIndex = activeEquipmentList.value.findIndex(item => item.equipmentid === equipment.equipmentid)
      const isExist = existActiveEquipmentIndex > -1

      if (isExist) {
        const equipmentList = activeEquipmentList.value.map((item) => {
          if (item.equipmentid === equipment.equipmentid) {
            return { ...equipment, alarmRecordList }
          }
          return item
        })
        setActiveEquipmentList(equipmentList)
      }
      else {
        const equipmentList = [...activeEquipmentList.value, { ...equipment, alarmRecordList }]
        setActiveEquipmentList(equipmentList)
      }

      router.replace({
        path: '/multiple-alarm',
      })
    })

    // 监听读取数据
    rendererOn(ipcNames.renderer.readData, async (_: unknown, equipment: DoorEquipment, data: DoorRfidrecord[]) => {
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
