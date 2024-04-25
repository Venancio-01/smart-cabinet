import type { DoorEquipment } from '@smart-cabinet/database'
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
import { error } from '@smart-cabinet/common'
import { ipcMain } from 'electron'
import ipcNames from '#/ipcNames'
import { EquipmentType } from '~/enums'

// 设备列表
export let equipmentList: DoorEquipment[] = []
// 是否是控制模式
export let isControlMode = false
// 控制设备
export let controlEquipment: DoorEquipment | null = null
// 是否是单个设备模式
export let isSingleEquipmentMode = false

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

/**
 * @description: 初始化设备
 * @return {*}
 */
export async function initEquipment() {
  const allEquipmentList = await selectDoorEquipmentList()
  const ipList = getLocalIpAddress()

  isSingleEquipmentMode = allEquipmentList.length === 1

  // 获取当前IP设备
  const currentIPEquipmentData = allEquipmentList.filter(item => item.addressip && ipList.includes(item.addressip))
  if (currentIPEquipmentData.length === 0) {
    error('请正确配置数据库中的设备IP')
    return
  }

  if (currentIPEquipmentData.length > 1) {
    const controlEquipmentList = currentIPEquipmentData.filter(item => item.type === EquipmentType.CONTROL)
    if (controlEquipmentList.length > 1) {
      error('控制设备只能有一个')
      return
    }

    controlEquipment = controlEquipmentList[0]
  }
  else {
    controlEquipment = currentIPEquipmentData[0]
  }

  isControlMode = controlEquipment?.type === EquipmentType.CONTROL
  // 获取设备列表
  equipmentList = allEquipmentList.filter(item => item.type === EquipmentType.DEVICE)
}

export function registerAccessDoorService() {
  ipcMain.handle(ipcNames.accessDoor.getIsControlEquipment, async () => {
    return isControlMode
  })

  ipcMain.handle(ipcNames.accessDoor.getEquipmentList, async () => {
    return getEquipmentList()
  })

  ipcMain.handle(ipcNames.accessDoor.getControlEquipment, async () => {
    return getControlEquipment()
  })

  ipcMain.handle(ipcNames.accessDoor.selectDoorRfidrecordList, async (_, args) => {
    return selectDoorRfidrecordList(args)
  })

  ipcMain.handle(ipcNames.accessDoor.selectDoorAlarmRecordListWithPage, async (_, { pagination, queryCondition }) => {
    return selectDoorAlarmRecordListWithPage(pagination, queryCondition)
  })

  ipcMain.handle(ipcNames.accessDoor.selectDoorAlarmRecordList, async (_, args) => {
    return selectDoorAlarmRecordList(args)
  })

  ipcMain.handle(ipcNames.accessDoor.selectDoorRfidrecordListWithPage, async (_, { pagination, queryCondition }) => {
    return selectDoorRfidrecordListWithPage(pagination, queryCondition)
  })

  ipcMain.handle(ipcNames.accessDoor.selectDoorAlarmRecordCount, async (_, args) => {
    return selectDoorAlarmRecordCount(args)
  })

  ipcMain.handle(ipcNames.accessDoor.updateDoorAlarmRecord, async (_, { condition, data }) => {
    return updateDoorAlarmrecord(condition, data)
  })

  ipcMain.handle(ipcNames.accessDoor.updateManyDoorAlarmRecord, async (_, { condition, data }) => {
    return updateManyDoorAlarmrecord(condition, data)
  })
}
