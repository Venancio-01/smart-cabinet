import type { rfid_switch_record } from '@prisma/client'
import prisma from '@/database'

/**
 * @description: 根据柜门 id 获取柜内文件总数
 * @return {*}
 */
export async function queryDocumentCountByCabinetId(cabinetId = 1) {
  const count = await prisma.doc_document.count({
    where: {
      cabinet_door_id: cabinetId,
    },
  })

  return count
}

/**
 * @description: 获取柜内在位文件数
 * @param {*} cabinetId 柜门 id
 * @return {*}
 */
export async function queryInPlaceDocumentCount(cabinetId?: number) {
  const where = {
    loan_status: 0,
  }

  if (cabinetId)
    where.cabinet_door_id = cabinetId

  const count = await prisma.doc_document.count({
    where,
  })

  return count
}

/**
 * @description: 获取错放文件信息
 * @return {*}
 */
export async function queryMisplacedDocument(cabinetDoorID?: number) {
  const result = await prisma.rfid_switch_record.findMany({
    where: {
      operation_id: {
        not: '0',
      },
      cabinet_door_id: cabinetDoorID || undefined,
    },
  })

  return result
}

/**
 * @description: 根据 tid 获取错放文件数量
 * @param {number} tid
 * @return {*}
 */
export async function queryMisplacedDocumentCount(cabinetDoorId?: number, rfid?: string) {
  const count = await prisma.rfid_switch_record.count({
    where: {
      operation_id: rfid || undefined,
      cabinet_door_id: cabinetDoorId || undefined,
    },
  })

  return count
}

/**
 * @description: 根据文件 id 修改状态
 * @param {number} id
 * @param {number} state
 * @return {*}
 */
export async function updateDocStatusByID(id: number, state: number, userId: number) {
  const result = await prisma.doc_document.updateMany({
    where: {
      doc_id: id,
    },
    data: {
      operation_user_id: userId,
      loan_status: state,
      doc_last_time: new Date(),
    },
  })

  return result
}

/**
 * @description: 添加错放文件记录
 * @param {any} document
 * @return {*}
 */
export async function addMisPlacedDocument(document: Partial<rfid_switch_record>) {
  const result = await prisma.rfid_switch_record.create({
    data: document,
  })

  return result
}

/**
 * @description: 更新错放文件记录
 * @param {string} tid
 * @return {*}
 */
export async function updateMisPlaceDocument(id: string) {
  const result = await prisma.rfid_switch_record.updateMany({
    where: {
      operation_id: id,
    },
    data: {
      operation_id: '0',
    },
  })

  return result
}

export async function queryMisplacedDocumentCountByOperationId(id: string) {
  const result = await prisma.rfid_switch_record.findMany({
    where: {
      operation_id: id,
    },
  })

  return result?.length
}
