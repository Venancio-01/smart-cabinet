import type { DoorEquipment } from 'database'
import { getLocalIpAddress } from 'utils'
import {
  selectDoorAlarmRecordCount,
  selectDoorAlarmRecordList,
  selectDoorAlarmRecordListWithPage,
  selectDoorEquipmentList,
  selectDoorRfidrecordList,
  selectDoorRfidrecordListWithPage,
  updateDoorAlarmrecord,
} from 'database'
import { differenceBy } from 'lodash-es'

// 当前设备
export let currentEquipment: DoorEquipment | null = null
// 是否是控制设备
export let isControlEquipment = false
// 全部设备列表
export let allEquipmentList: DoorEquipment[] = []
// 控制的设备列表
export let equipmentList: DoorEquipment[] = []

/**
 * @description: 获取是否为控制设备
 * @return {*}
 */
export async function getIsControlEquipment() {
  if (!currentEquipment) return false

  const otherEquipmentList = differenceBy(allEquipmentList, [currentEquipment], 'equipmentid')
  isControlEquipment = currentEquipment.fid === null && otherEquipmentList.some((item) => item.fid === currentEquipment?.equipmentid)

  return isControlEquipment
}

/**
 * @description: 获取当前设备
 * @return {*}
 */
export async function getCurrentEquipment() {
  if (currentEquipment) return currentEquipment

  allEquipmentList = await selectDoorEquipmentList()
  const ipList = getLocalIpAddress()

  currentEquipment = allEquipmentList.find((item) => item.addressip && ipList.includes(item.addressip)) || null

  return currentEquipment
}

/**
 * @description: 获取受控制的设备列表
 * @return {*}
 */
export async function getEquipmentList() {
  if (!currentEquipment) return []
  if (!isControlEquipment) return [currentEquipment]

  equipmentList = allEquipmentList.filter((item) => item.fid === currentEquipment?.equipmentid)

  return equipmentList
}

const accessDoorService = {
  name: 'accessDoor' as const,
  fns: {
    getIsControlEquipment,
    getEquipmentList,
    getCurrentEquipment,
    selectDoorRfidrecordList,
    selectDoorRfidrecordListWithPage,
    selectDoorAlarmRecordList,
    selectDoorAlarmRecordListWithPage,
    selectDoorAlarmRecordCount,
    updateDoorAlarmrecord,
  },
}

export default accessDoorService
