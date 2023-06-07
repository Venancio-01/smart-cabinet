import type { rfid_switch_record } from '@prisma/client'
import { prisma } from '@/database'

/**
 * @description: 根据 tid 获取错放文件数量
 * @param {number} tid
 * @return {*}
 */
export function queryMisplacedDocumentCount(cabinetDoorId?: string, rfid?: string) {
  return prisma.rfid_switch_record.count({
    where: {
      operationID: rfid || undefined,
      CabinetDoorId: cabinetDoorId || undefined,
    },
  })
}

/**
 * @description: 根据文件 id 修改状态
 * @param {number} id
 * @param {number} state
 * @return {*}
 */
export function updateDocStatusByID(id: number, state: number, userId: number) {
  return prisma.doc_document.updateMany({
    where: {
      doc_id: id,
    },
    data: {
      operation_user_id: userId,
      loan_status: state,
      doc_last_time: new Date(),
    },
  })
}

/**
 * @description: 添加错放文件记录
 * @param {any} document
 * @return {*}
 */
export function addMisPlacedDocument(document: Partial<rfid_switch_record>) {
  return prisma.rfid_switch_record.create({
    data: document,
  })
}

/**
 * @description: 更新错放文件记录
 * @param {string} tid
 * @return {*}
 */
export function updateMisPlaceDocument(id: string) {
  return prisma.rfid_switch_record.updateMany({
    where: {
      operationID: id,
    },
    data: {
      operationID: '0',
    },
  })
}
