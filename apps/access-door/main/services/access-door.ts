import type { DoorAlarmrecord, DoorEquipment, DoorRfidrecord } from 'database'
import { getLocalIpAddress } from 'utils'
import {
  prisma,
  selectDoorAccessRecordList,
  selectDoorAlarmRecordCount,
  selectDoorAlarmRecordList,
  selectDoorAlarmRecordListWithPage,
  selectDoorEquipmentList,
  selectDoorRfidrecordList,
  selectDoorRfidrecordListWithPage,
  updateDoorAccessRecord,
  updateDoorAlarmrecord,
} from 'database'
import { differenceBy } from 'lodash-es'

// 当前设备
export let currentEquipment: DoorEquipment | null = null
// 是否是控制设备
export let isControlEquipment = false
// 全部设备列表
export let equipmentList: DoorEquipment[] = []
// 控制的设备列表
export let controlEquipmentList: DoorEquipment[] = []

/**
 * @description: 获取是否为控制设备
 * @return {*}
 */
export async function getIsControlApp() {
  const otherEquipmentList = differenceBy(equipmentList, [currentEquipment], 'id')
  isControlEquipment = currentEquipment.fid === null || otherEquipmentList.every((item) => item.fid !== currentEquipment.equipmentid)

  return isControlEquipment
}

/**
 * @description: 获取当前设备
 * @return {*}
 */
export async function getCurrentEquipment(): Promise<DoorEquipment | null> {
  if (currentEquipment) return currentEquipment

  equipmentList = await selectDoorEquipmentList()
  const ipList = getLocalIpAddress()

  currentEquipment = equipmentList.find((item) => item.addressip && ipList.includes(item.addressip)) || null

  return currentEquipment
}

/**
 * @description: 获取受控制的设备列表
 * @return {*}
 */
export async function getControlEquipmentList() {
  if (!isControlEquipment) return []

  controlEquipmentList = equipmentList.filter((item) => item.fid === currentEquipment.equipmentid)
  return controlEquipmentList
}

/**
 * @description: 添加报警记录
 * @param {Partial} data
 * @return {*}
 */
export async function addAlarmRecord(data: Partial<DoorAlarmrecord>): Promise<void> {
  await prisma.doorAlarmrecord.create({
    data,
  })
}

export function addReadRecord(data: Partial<DoorRfidrecord>) {
  return prisma.doorRfidrecord.create({
    data,
  })
}

const accessDoorService = {
  name: 'accessDoor' as const,
  fns: {
    getIsControlApp,
    getControlEquipmentList,
    getCurrentEquipment,
    selectDoorRfidrecordList,
    selectDoorRfidrecordListWithPage,
    selectDoorAccessRecordList,
    updateDoorAccessRecord,
    selectDoorAlarmRecordList,
    selectDoorAlarmRecordListWithPage,
    selectDoorAlarmRecordCount,
    updateDoorAlarmrecord,
  },
}

export default accessDoorService
