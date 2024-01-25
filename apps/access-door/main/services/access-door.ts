import type { DoorAlarmrecord, DoorEquipment, Prisma } from '@smart-cabinet/database'
import { getLocalIpAddress } from '@smart-cabinet/utils'
import {
  selectDoorAlarmRecordCount,
  selectDoorAlarmRecordList,
  selectDoorAlarmRecordListWithPage,
  selectDoorEquipmentList,
  selectDoorRfidrecordList,
  selectDoorRfidrecordListWithPage,
  updateDoorAlarmrecord,
  updateManyDoorAlarmrecord,
} from '@smart-cabinet/database'
import differenceBy from 'lodash/differenceBy'
import { error } from '@smart-cabinet/common'
import { ipcMain } from 'electron'

// 设备列表
export let equipmentList: DoorEquipment[] = []
// 是否是控制设备
export let isControlEquipment = false
// 控制设备
export let controlEquipment: DoorEquipment | null = null

/**
 * @description: 获取是否为控制设备
 * @return {*}
 */
export async function getIsControlEquipment() {
  return isControlEquipment
}

/**
 * @description: 获取控制设备
 * @return {*}
 */
export async function getControlEquipment() {
  return controlEquipment
}

/**
 * @description: 获取设备列表
 * @return {*}
 */
export async function getEquipmentList() {
  return equipmentList
}

export async function initEquipment() {
  const allEquipmentList = await selectDoorEquipmentList()
  const ipList = getLocalIpAddress()

  // 获取当前设备
  const currentEquipment = allEquipmentList.find(item => item.addressip && ipList.includes(item.addressip)) || null
  if (currentEquipment === null) {
    error('数据库设备 IP 配置错误，找不到对应设备')
    return
  }

  // 获取是否为控制设备
  const otherEquipmentList = differenceBy(allEquipmentList, [currentEquipment], 'equipmentid')
  isControlEquipment = currentEquipment?.fid === null && otherEquipmentList.some(item => item.fid === currentEquipment?.equipmentid)
  if (isControlEquipment) controlEquipment = currentEquipment

  // 获取设备列表
  equipmentList = isControlEquipment ? allEquipmentList.filter(item => item.fid === currentEquipment?.equipmentid) : [currentEquipment]
}

export function registerAccessDoorService() {
  ipcMain.handle('access-door:get-is-control-equipment', async () => {
    return getIsControlEquipment()
  })

  ipcMain.handle('access-door:get-equipment-list', async () => {
    return getEquipmentList()
  })

  ipcMain.handle('access-door:get-control-equipment', async () => {
    return getControlEquipment()
  })

  ipcMain.handle('access-door:select-door-rfidrecord-list', async (_, args) => {
    return selectDoorRfidrecordList(args)
  })

  ipcMain.handle('access-door:select-door-rfidrecord-list-with-page', async (_, args) => {
    return selectDoorRfidrecordListWithPage(args)
  })

  ipcMain.handle('access-door:select-door-alarm-record-list', async (_, args) => {
    return selectDoorAlarmRecordList(args)
  })

  ipcMain.handle('access-door:select-door-alarm-record-list-with-page', async (_, args) => {
    return selectDoorAlarmRecordListWithPage(args)
  })

  ipcMain.handle('access-door:select-door-alarm-record-count', async (_, args) => {
    return selectDoorAlarmRecordCount(args)
  })

  ipcMain.handle('access-door:update-door-alarm-record', async (_, args: [Prisma.DoorAlarmrecordWhereUniqueInput, Partial<DoorAlarmrecord>]) => {
    return updateDoorAlarmrecord(...args)
  })

  ipcMain.handle('access-door:update-many-door-alarm-record', async (_, args: [Prisma.DoorAlarmrecordWhereUniqueInput, data: Partial<DoorAlarmrecord>]) => {
    return updateManyDoorAlarmrecord(...args)
  })
}
