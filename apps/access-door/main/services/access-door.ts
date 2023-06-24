import type { DoorAccessRecords, DoorAlarmrecord, DoorEquipment, DoorRfidrecord } from 'database'
import { getLocalIpAddress, getSkipAndTake } from 'utils'
import { prisma, selectDoorAlarmRecordCount, selectDoorAlarmRecordList, selectDoorEquipmentList, updateDoorAlarmrecord } from 'database'
import { AccessDirection, AccessHasAlarm, AccessTimeRange, AccessWithCarrier } from '~/enums'

// 获取当前设备
let currentAccessDoorDevice: DoorEquipment | null = null
export async function getCurrentAccessDoorDevice(): Promise<DoorEquipment | null> {
  if (currentAccessDoorDevice) return currentAccessDoorDevice

  const devices = await selectDoorEquipmentList()
  const ipList = getLocalIpAddress()

  currentAccessDoorDevice = devices.find((item) => item.addressip && ipList.includes(item.addressip)) || null

  return currentAccessDoorDevice
}

// 获取出入记录
export async function fetchAccessRecords(condition?: Partial<AccessRecordQueryProps>): Promise<{
  data: DoorAccessRecords[]
  total: number
}> {
  const query: Partial<{ [key in keyof DoorAccessRecords]: any }> = {}

  if (condition?.accessDirection === undefined || condition?.accessDirection === AccessDirection.ALL) query.accessDirection = undefined
  else query.accessDirection = condition.accessDirection

  if (condition?.hasAlarm === undefined || condition?.hasAlarm === AccessHasAlarm.ALL) query.has_alarm = undefined
  else query.has_alarm = condition.hasAlarm

  if (condition?.timeRange === undefined || condition?.timeRange === AccessTimeRange.ALL) {
    query.directionCreateTime = undefined
  } else {
    const timeRangeMap = {
      [AccessTimeRange.TODAY]: {
        lte: new Date(),
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
      },
      [AccessTimeRange.WEEK]: {
        lte: new Date(),
        gte: new Date(new Date().setDate(new Date().getDate() - 7)),
      },
      [AccessTimeRange.MONTH]: {
        lte: new Date(),
        gte: new Date(new Date().setDate(new Date().getDate() - 30)),
      },
    }
    query.directionCreateTime = timeRangeMap[condition.timeRange]
  }

  if (condition?.withCarrier === undefined || condition?.withCarrier === AccessWithCarrier.ALL) {
    query.carrier_count = undefined
  } else {
    if (condition.withCarrier === AccessWithCarrier.WITH_CARRIER) {
      query.carrier_count = {
        gt: 0,
      }
    } else {
      query.carrier_count = 0
    }
  }

  const [data, total] = await Promise.all([
    prisma.doorAccessRecords.findMany({
      ...getSkipAndTake(condition),
      where: query,
      orderBy: { directionCreateTime: 'desc' },
    }),
    prisma.doorAccessRecords.count({ where: query }),
  ])

  return {
    data,
    total,
  }
}

/**
 * @description: 更新出入记录
 * @param {number} id
 * @param {Partial} data
 * @return {*}
 */
export async function updateAccessRecord(id: number, data: Partial<DoorAccessRecords>): Promise<void> {
  await prisma.doorAccessRecords.update({
    where: { accessId: id },
    data,
  })
}

// 添加报警记录
export async function addAlarmRecord(data: Partial<DoorAlarmrecord>): Promise<void> {
  await prisma.doorAlarmrecord.create({
    data,
  })
}

/**
 * @description: 获取报警记录
 * @param {boolean} isOperation 是否已解决
 * @return {*}
 */
export async function fetchAlarmRecords(condition?: Partial<AlarmQueryProps>): Promise<{
  data: DoorAlarmrecord[]
  total: number
}> {
  const query: { [key: string]: any } = {}
  if (condition?.accessId) query.accessId = condition.accessId
  if (condition?.carrierName) query.carrierName = condition.carrierName
  if (condition?.departmentId) query.carrier_deptid = condition.departmentId
  if (condition?.startTime || condition?.endTime) {
    query.createTime = {}
    if (condition?.startTime) query.createTime.gte = condition.startTime
    if (condition?.endTime) query.createTime.lte = condition.endTime
  }

  const [data, total] = await Promise.all([
    prisma.doorAlarmrecord.findMany({
      ...getSkipAndTake(condition),
      where: query,
      orderBy: { createTime: 'desc' },
    }),
    prisma.doorAlarmrecord.count({ where: query }),
  ])

  return {
    data,
    total,
  }
}

export async function fetchReadRecords(condition?: Partial<ReadRecordQueryProps>) {
  const query: Partial<{ [key in keyof DoorRfidrecord]: any }> = {}

  if (condition?.accessId) query.accessId = condition.accessId
  if (condition?.carrierName) query.carrierName = condition.carrierName
  if (condition?.departmentId) query.carrier_deptid = condition.departmentId
  if (condition?.startTime || condition?.endTime) {
    query.createTime = {}
    if (condition?.startTime) query.createTime.gte = condition.startTime
    if (condition?.endTime) query.createTime.lte = condition.endTime
  }

  const [data, total] = await Promise.all([
    prisma.doorRfidrecord.findMany({
      ...getSkipAndTake(condition),
      where: query,
      orderBy: { createTime: 'desc' },
    }),
    prisma.doorRfidrecord.count({ where: query }),
  ])

  return {
    data,
    total,
  }
}

export function addReadRecord(data: Partial<DoorRfidrecord>) {
  return prisma.doorRfidrecord.create({
    data,
  })
}

export async function fetchRegistrationRecords() {
  return prisma.doorRfidregister.findMany()
}

const accessDoorService = {
  name: 'accessDoor' as const,
  fns: {
    getCurrentAccessDoorDevice,
    fetchAccessRecords,
    updateAccessRecord,
    updateDoorAlarmrecord,
    fetchAlarmRecords,
    selectDoorAlarmRecordList,
    selectDoorAlarmRecordCount,
    fetchReadRecords,
  },
}

export default accessDoorService
