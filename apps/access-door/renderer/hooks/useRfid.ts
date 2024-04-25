import type { DoorAlarmrecord, DoorEquipment, DoorRfidrecord } from '@smart-cabinet/database'
import { rendererInvoke, rendererOn } from '@smart-cabinet/utils/renderer'
import { useStore } from '@/store'
import { GPIIndex, type AccessDirection } from '~/enums'
import ipcNames from '#/ipcNames'

let timer: number | null = null

export default function () {
  const router = useRouter()
  const store = useStore()
  const { setEquipment, setCurrentReadRecordList, setLoadingVisible, setAlarmEquipmentList, setAlarmEquipment } = store
  const { equipmentList, alarmEquipmentList } = storeToRefs(store)

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
   * @param {string} address
   * @param {boolean} status
   * @return {*}
   */
  const handleSetGPO = async (status: boolean) => {
    equipmentList.value.forEach((equipment) => {
      rendererInvoke(ipcNames.rfid.handleSetGPO, {
        equipment: toRaw(equipment),
        index: GPIIndex.ONE,
        status,
      })
    })
  }

  /**
   * @description: 注册报警监听器
   * @return {*}
   */
  const regsterAlarmsListener = () => {
    // 跳转到检查页面
    rendererOn('go-check-page', (_: unknown, direction: AccessDirection) => {
      setLoadingVisible(true)
      router.replace({
        path: '/check',
        query: {
          key: new Date().getTime(),
          direction,
        },
      })
    })

    // 跳转到报警页面
    rendererOn('go-alarm-page', () => {
      setLoadingVisible(true)
      router.replace('/alarm')
    })

    // 跳转到多设备报警页面
    rendererOn('go-alarm-multiple-page', (_: unknown, equipment: DoorEquipment, data: DoorAlarmrecord[]) => {
      const existAlarmEquipment = alarmEquipmentList.value.find(item => item.equipmentid === equipment.equipmentid)
      const isExist = !!existAlarmEquipment

      if (isExist) {
        setAlarmEquipment(equipment.equipmentid, {
          alarmRecordList: [...existAlarmEquipment.alarmRecordList, ...data],
        })
      }
      else {
        setAlarmEquipmentList([
          ...alarmEquipmentList.value,
          {
            ...equipment,
            alarmRecordList: data,
          },
        ])
      }

      const isInMultiplePage = router.currentRoute.value.path === '/alarm-multiple'
      !isInMultiplePage && router.replace('/alarm-multiple')
    })

    rendererOn('get-read-data', async (_: unknown, equipment: DoorEquipment, data: DoorRfidrecord[]) => {
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
