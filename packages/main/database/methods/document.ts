import prisma from '@/prisma'
import { generateCurrentTime } from '@/utils'

/**
 * @description: 根据柜门 id 获取柜内文件总数
 * @return {*}
 */
export const queryDocumentCountByCabinetId = async (cabinetId = 1) => {
  const count = await prisma.doc_document.count({
    where: {
      CABINET_DOOR_ID: cabinetId
    }
  })

  return count
}

/**
 * @description: 根据柜门 id 获取柜内在位文件数
 * @param {*} cabinetId 柜门 id
 * @return {*}
 */
export const queryInPlaceDocumentCountByCabinetId = async (cabinetId = 1) => {
  const count = await prisma.doc_document.count({
    where: {
      CABINET_DOOR_ID: cabinetId,
      DOC_REISSUENUMBER: 0
    }
  })

  return count
}

/**
 * @description: 获取错放文件数量
 * @return {*}
 */
export const queryMisplacedDocumentCount = async () => {
  const count = await prisma.rfid_switch_record.count({
    where: {
      OPERATIONID: {
        not: '0'
      }
    }
  })

  return count
}

/**
 * @description: 获取错放文件信息
 * @return {*}
 */
export const queryMisplacedDocument = async () => {
  const records = await prisma.rfid_switch_record.findMany({
    where: {
      OPERATIONID: {
        not: '0'
      }
    }
  })

  return records
}

/**
 * @description: 根据 tid 获取错放文件数量
 * @param {number} tid
 * @return {*}
 */
export const queryMisplacedDocumentCountByTid = async (id: string) => {
  const records = await prisma.rfid_switch_record.findMany({
    where: {
      OPERATIONID: id
    }
  })

  const count = Number(records?.length)
  return count
}

/**
 * @description: 根据文件 id 修改状态
 * @param {number} id
 * @param {number} state
 * @return {*}
 */
export const updateDocStatusByID = async (id: number, state: number) => {
  const result = await prisma.doc_document.updateMany({
    where: {
      DOC_ID: id
    },
    data: {
      DOC_REISSUENUMBER: state,
      DOC_LAST_TIME: new Date()
    }
  })

  return result
}

/**
 * @description: 添加错放文件记录
 * @param {any} document
 * @return {*}
 */
export const addMisPlacedDocument = async (document: any) => {
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
      OPERATIONID: id
    },
    data: {
      OPERATIONID: '0'
    }
  })

  return result
}

export const queryMisplacedDocumentCountByOperationId = async (id: string) => {
  const records = await prisma.rfid_switch_record.findMany({
    where: {
      OPERATIONID: id
    }
  })

  return records?.length
}
