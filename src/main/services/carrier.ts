import type { doc_document, rfid_switch_record } from '@prisma/client'
import { getReportData } from './rfid'
import { prisma } from '@/database'
import { generateCurrentTime } from '@/utils'

/**
 * @description: 根据 tid 获取错放文件数量
 * @param {number} tid
 * @return {*}
 */
function queryMisplacedDocumentCount(cabinetDoorId?: string, rfid?: string) {
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
function updateDocStatusByID(id: number, state: number, userId: number) {
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
function addMisPlacedDocument(document: Partial<rfid_switch_record>) {
  return prisma.rfid_switch_record.create({
    data: document,
  })
}

/**
 * @description: 更新错放文件记录
 * @param {string} tid
 * @return {*}
 */
function updateMisPlaceDocument(id: string) {
  return prisma.rfid_switch_record.updateMany({
    where: {
      operationID: id,
    },
    data: {
      operationID: '0',
    },
  })
}

async function getCarriers(): Promise<doc_document[]> {
  return prisma.doc_document.findMany()
}

async function getCarriersByCondition(condition: CarrierQueryProps): Promise<{
  data: doc_document[]
  total: number
}> {
  const query: Partial<{ [key in keyof doc_document]: any }> = {
    cabinet_door_id: condition.cabinetId ? Number(condition.cabinetId) : undefined,
    doc_name: {
      contains: condition.title,
    },
    // loan_status: condition.state ?? undefined,
    dept_id: condition.departmentId ? Number(condition.departmentId) : undefined,
  }

  if (condition.state === 2) {
    const misPlaceDocuments = await getMisPlaceCarriers()
    const rfids = misPlaceDocuments.map(item => item.operationID)
    // query.loan_status = 1
    query.doc_rfid = { in: rfids }
  }
  else if (condition.state === 1) {
    const misPlaceDocuments = await getMisPlaceCarriers()
    const rfids = misPlaceDocuments.map(item => item.operationID)
    // query.loan_status = 1
    query.doc_rfid = { notIn: rfids }
  }

  const [data, total] = await Promise.all([
    prisma.doc_document.findMany({
      skip: (condition.page - 1) * condition.size,
      take: condition.size,
      where: query,
    }),
    prisma.doc_document.count({
      where: query,
    }),
  ])

  return {
    data,
    total,
  }
}

function getMisPlaceCarriers(cabinetDoorID?: string): Promise<rfid_switch_record[]> {
  return prisma.rfid_switch_record.findMany({
    where: {
      operationID: {
        not: '0',
      },
      CabinetDoorId: cabinetDoorID,
    },
  })
}

async function updateCarrier(cabinetDoor: CabinetDoorProps, userId?: number) {
  const TIDList = getReportData(cabinetDoor.txAddr)
  console.log(cabinetDoor.Id, '柜门id')
  console.log('🚀 ~ file: document-service.ts:94 ~ updateCarrier ~ TIDList:', TIDList)
  console.log('🚀 ~ file: document-service.ts:94 ~ updateCarrier ~ TIDList.length:', TIDList.length)

  const documents = await getCarriers()

  for (let i = 0; i < documents.length; i++) {
    const doc = documents[i]

    // 如果不是本柜门文件
    if (doc.cabinet_door_id !== cabinetDoor.Id) {
      const isWarningDocument = (await queryMisplacedDocumentCount(cabinetDoor.id, doc.doc_rfid)) !== 0
      if (isWarningDocument)
        continue

      const data: Partial<rfid_switch_record> = {
        CabinetDoorId: `${cabinetDoor.Id}`,
        cabinet_id: cabinetDoor.CabinetId,
        content: `文件[${doc.doc_name}]错放`,
        datetime: generateCurrentTime(),
        operationID: TIDList.includes(doc.doc_rfid) ? doc.doc_rfid : '0',
        type: '1',
        user_id: userId || null,
      }
      await addMisPlacedDocument(data)
    }
    else {
      const isDocumentDetected = TIDList.includes(doc.doc_rfid)

      // 归还
      if (isDocumentDetected && doc.loan_status === 1)
        await updateDocStatusByID(doc.doc_id, 0, userId)

      // 借出
      else if (!isDocumentDetected && doc.loan_status === 0)
        await updateDocStatusByID(doc.doc_id, 1, userId)
    }
  }

  const misPlaceDocuments = await getMisPlaceCarriers()
  for (let i = 0; i < misPlaceDocuments.length; i++) {
    const doc = misPlaceDocuments[i]
    if (!TIDList.includes(doc.operationID))
      await updateMisPlaceDocument(doc.operationID)
  }
}

const carrierService = {
  name: 'carrier' as const,
  fns: {
    getCarriers,
    getCarriersByCondition,
    getMisPlaceCarriers,
    updateCarrier,
  },
}

export default carrierService
