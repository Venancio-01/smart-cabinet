import type { DoorAccessRecords } from 'database'
import { useStore } from '@/store'

export async function fetchCurrentAccessDoorDevice() {
  const store = useStore()

  const result = await window.JSBridge.accessDoor.getCurrentAccessDoorDevice()
  store.setCurrentAccessDoorDevice(result)
}

/**
 * @description: 获取出入记录
 * @param {Partial} condition
 * @return {*}
 */
export async function fetchAccessRecords(condition?: Partial<AccessRecordQueryProps>) {
  const result = await window.JSBridge.accessDoor.fetchAccessRecords(condition)
  return result
}

/**
 * @description: 获取未查看的出入记录总数
 * @return {*}
 */
export async function fetchUnviewedAccessRecordCount() {
  const store = useStore()

  const result = await window.JSBridge.accessDoor.fetchUnviewedAccessRecordCount()
  store.setUnviewedAccessRecordCount(result)
}

export async function updateAccessRecord(id: number, data: Partial<DoorAccessRecords>) {
  const result = await window.JSBridge.accessDoor.updateAccessRecord(id, data)
  return result
}

/**
 * @description: 获取告警记录
 * @param {Partial} condition
 * @return {*}
 */
export async function fetchAlarmRecords(condition?: Partial<AlarmQueryProps>) {
  const result = await window.JSBridge.accessDoor.fetchAlarmRecords(condition)
  return result
}

export async function fetchAndSetAlarmRecords() {
  const store = useStore()

  const { data } = await fetchAlarmRecords()
  store.setAlarmRecordList(data)
}

export async function fetchReadRecords(condition?: Partial<ReadRecordQueryProps>) {
  const result = await window.JSBridge.accessDoor.fetchReadRecords(condition)
  return result
}

export function init() {
  return Promise.all([fetchUnviewedAccessRecordCount(), fetchCurrentAccessDoorDevice(), fetchAndSetAlarmRecords()])
}
