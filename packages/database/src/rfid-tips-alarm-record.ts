import type { Prisma, RfidTipsAlarmRecord } from '.'
import { prisma } from '.'

/**
 * @description: 获取 RFID 提示报警记录列表
 * @param {Partial} data
 * @return {*}
 */
export function selectRfidTipsAlarmRecordList(data: Partial<RfidTipsAlarmRecord>) {
  const where: Prisma.RfidTipsAlarmRecordWhereInput = {
    handleDate: null,
  }

  if (data.recordId) {
    where.recordId = data.recordId
  }
  if (data.type) {
    where.type = data.type
  }
  if (data.operationid) {
    where.operationid = data.operationid
  }
  if (data.handleOperationid) {
    where.handleOperationid = data.handleOperationid
  }
  if (data.handleDate) {
    where.handleDate = data.handleDate
  }
  if (data.createDate) {
    where.createDate = data.createDate
  }
  if (data.cadinetId) {
    where.cadinetId = data.cadinetId
  }
  if (data.doorid) {
    where.doorid = data.doorid
  }
  if (data.content) {
    where.content = data.content
  }
  if (data.rfid) {
    where.rfid = data.rfid
  }
  if (data.groupid) {
    where.groupid = data.groupid
  }
  return prisma.rfidTipsAlarmRecord.findMany({
    where: data,
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
export function updateRfidTipsAlarmRecord(data: Partial<RfidTipsAlarmRecord>) {
  return prisma.rfidTipsAlarmRecord.update({
    where: {
      recordId: data.recordId,
    },
    data,
  })
}
