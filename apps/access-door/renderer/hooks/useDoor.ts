import type { DoorAccessRecords } from 'database'
import { useStore } from '@/store'

export default function () {
  const store = useStore()
  const { setAlarmRecordList, setCurrentAccessDoorDevice, setUnviewedAccessRecordCount } = store

  const fetchCurrentAccessDoorDevice = async () => {
    const result = await window.JSBridge.accessDoor.getCurrentAccessDoorDevice()
    setCurrentAccessDoorDevice(result)
  }

  // 获取出入记录
  const fetchAccessRecords = async (condition?: Partial<AccessRecordQueryProps>) => {
    const result = await window.JSBridge.accessDoor.fetchAccessRecords(condition)
    return result
  }

  // 获取未查看的出入记录总数
  const fetchUnviewedAccessRecordCount = async () => {
    const result = await window.JSBridge.accessDoor.selectDoorAlarmRecordCount({
      isOperation: '0',
    })
    setUnviewedAccessRecordCount(result)
  }

  const updateAccessRecord = async (id: number, data: Partial<DoorAccessRecords>) => {
    const result = await window.JSBridge.accessDoor.updateAccessRecord(id, data)
    return result
  }

  // 获取告警记录
  const fetchAlarmRecords = async (condition?: Partial<AlarmQueryProps>) => {
    const result = await window.JSBridge.accessDoor.fetchAlarmRecords(condition)
    return result
  }

  const fetchAndSetAlarmRecords = async () => {
    const { data } = await fetchAlarmRecords()
    setAlarmRecordList(data)
  }

  const fetchReadRecords = async (condition?: Partial<ReadRecordQueryProps>) => {
    const result = await window.JSBridge.accessDoor.fetchReadRecords(condition)
    return result
  }

  const init = () => {
    return Promise.all([fetchUnviewedAccessRecordCount(), fetchCurrentAccessDoorDevice(), fetchAndSetAlarmRecords()])
  }

  return {
    init,
    fetchAccessRecords,
    updateAccessRecord,
    fetchUnviewedAccessRecordCount,
    fetchAlarmRecords,
    fetchAndSetAlarmRecords,
    fetchReadRecords,
  }
}
