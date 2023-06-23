import type { Prisma, RfidTipsAlarmRecord } from '.'
import { prisma } from '.'

/**
 * @description: 获取 RFID 提示报警记录列表
 * @param {Prisma.RfidTipsAlarmRecordWhereInput} condition
 * @return {*}
 */
export function selectRfidTipsAlarmRecordList(condition: Prisma.RfidTipsAlarmRecordWhereInput) {
  return prisma.rfidTipsAlarmRecord.findMany({
    where: condition,
  })
}

/**
 * @description: 获取 RFID 提示报警记录列表数量
 * @param {Prisma.RfidTipsAlarmRecordWhereInput} condition
 * @return {*}
 */
export function selectRfidTipsAlarmRecordListCount(condition: Prisma.RfidTipsAlarmRecordWhereInput) {
  return prisma.rfidTipsAlarmRecord.count({
    where: condition,
  })
}

/**
 * @description: 新增 RFID 提示报警记录
 * @param {Partial} data
 * @return {*}
 */
export function insertRfidTipsAlarmRecord(data: Partial<RfidTipsAlarmRecord>) {
  return prisma.rfidTipsAlarmRecord.create({
    data,
  })
}

/**
 * @description: 更新 RFID 提示报警记录
 * @param {Partial} data
 * @return {*}
 */
export function updateRfidTipsAlarmRecord(condition: Prisma.RfidTipsAlarmRecordWhereInput, data: Partial<RfidTipsAlarmRecord>) {
  return prisma.rfidTipsAlarmRecord.updateMany({
    where: condition,
    data,
  })
}
