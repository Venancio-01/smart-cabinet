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
import { differenceBy } from 'lodash-es'
import { error } from './log'

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

const accessDoorService = {
  name: 'accessDoor' as const,
  fns: {
    getIsControlEquipment,
    getEquipmentList,
    getControlEquipment,
    selectDoorRfidrecordList,
    selectDoorRfidrecordListWithPage,
    selectDoorAlarmRecordList,
    selectDoorAlarmRecordListWithPage,
    selectDoorAlarmRecordCount,
    updateDoorAlarmrecord,
    updateManyDoorAlarmrecord,
  },
}

export default accessDoorService
