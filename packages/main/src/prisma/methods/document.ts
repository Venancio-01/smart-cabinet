import prisma from '@/prisma'
import { rfid_switch_record } from '@prisma/client'

/**
 * @description: 根据柜门 id 获取柜内文件总数
 * @return {*}
 */
export const queryDocumentCountByCabinetId = async (cabinetId = 1) => {
  const count = await prisma.doc_document.count({
    where: {
      cabinet_door_id: cabinetId
    }
  })

  return count
}

/**
 * @description: 获取柜内在位文件数
 * @param {*} cabinetId 柜门 id
 * @return {*}
 */
export const queryInPlaceDocumentCount = async (cabinetId?: number) => {
  const where = {
    loan_status: 0
  }

  if (cabinetId) {
    where['cabinet_door_id'] = cabinetId
  }

  const count = await prisma.doc_document.count({
    where
  })

  return count
}

/**
 * @description: 获取错放文件信息
 * @return {*}
 */
export const queryMisplacedDocument = async (cabinetDoorID?: number) => {
  const records = await prisma.rfid_switch_record.findMany({
    where: {
      operation_id: {
        not: '0'
      },
      cabinet_door_id: cabinetDoorID || undefined
    }
  })

  return records
}

/**
 * @description: 根据 tid 获取错放文件数量
 * @param {number} tid
 * @return {*}
 */
export const queryMisplacedDocumentCount = async (cabinetDoorId?: number, rfid?: string) => {
  const count = await prisma.rfid_switch_record.count({
    where: {
      operation_id: rfid || undefined,
      cabinet_door_id: cabinetDoorId || undefined
    }
  })

  return count
}

/**
 * @description: 根据文件 id 修改状态
 * @param {number} id
 * @param {number} state
 * @return {*}
 */
export const updateDocStatusByID = async (id: number, state: number, userId: number) => {
  const result = await prisma.doc_document.updateMany({
    where: {
      doc_id: id
    },
    data: {
      operation_user_id: userId,
      loan_status: state,
      doc_last_time: new Date()
    }
  })

  return result
}

/**
 * @description: 添加错放文件记录
 * @param {any} document
 * @return {*}
 */
export const addMisPlacedDocument = async (document: Partial<rfid_switch_record>) => {
  const result = await prisma.rfid_switch_record.create({
    data: document
  })

  return result
}

/**
 * @description: 更新错放文件记录
 * @param {string} tid
 * @return {*}
 */
export const updateMisPlaceDocument = async (id: string) => {
  const result = await prisma.rfid_switch_record.updateMany({
    where: {
      operation_id: id
    },
    data: {
      operation_id: '0'
    }
  })

  return result
}

export const queryMisplacedDocumentCountByOperationId = async (id: string) => {
  const records = await prisma.rfid_switch_record.findMany({
    where: {
      operation_id: id
    }
  })

  return records?.length
}
