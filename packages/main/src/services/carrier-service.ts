import {
  queryInPlaceDocumentCount,
  queryMisplacedDocument,
  addMisPlacedDocument,
  queryMisplacedDocumentCount,
  updateDocStatusByID,
  updateMisPlaceDocument
} from '@/prisma/methods/document'
import prisma from '@/prisma'
import { generateCurrentTime } from '@/utils'
import { doc_document, rfid_switch_record } from '@prisma/client'
import rfidService from './rfid-service'

const getAllCarrierData = async (): Promise<doc_document[]> => {
  const result = await prisma.doc_document.findMany()
  return result
}

const getCarrierDataByCondition = async (condition: CarrierQueryProps): Promise<{
  data: doc_document[]
  total: number
}> => {
  const where = {
    cabinet_door_id: condition.cabinetId ? Number(condition.cabinetId) : undefined,
    doc_name: {
      contains: condition.title
    },
    loan_status: condition.state ?? undefined,
    binding_dept_id: condition.departmentId ? Number(condition.departmentId) : undefined
  }

  if (condition.state === 2) {
    const misPlaceDocuments = await queryMisplacedDocument()
    const rfids = misPlaceDocuments.map(item => item.operation_id)
    where.loan_status = 1
    where['doc_rfid'] = { in: rfids }
  } else if (condition.state === 1) {
    const misPlaceDocuments = await queryMisplacedDocument()
    const rfids = misPlaceDocuments.map(item => item.operation_id)
    where.loan_status = 1
    where['doc_rfid'] = { notIn: rfids }
  }

  const result = await prisma.doc_document.findMany({
    skip: (condition.page - 1) * condition.size,
    take: condition.size,
    where
  })

  const count = await prisma.doc_document.count({
    where
  })

  return {
    data: result,
    total:count
  }
}

const getCarrierDataByCabinetId = async (cabinetId: number): Promise<doc_document[]> => {
  const result = await prisma.doc_document.findMany({
    where: {
      cabinet_door_id: cabinetId
    }
  })

  return result
}

const getInPlaceCarrierCount = async (cabinetId?: number) => {
  return await queryInPlaceDocumentCount(cabinetId)
}

const getMisPlaceCarriers = async (): Promise<rfid_switch_record[]> => {
  return await queryMisplacedDocument()
}

const updateCarrier = async (cabinetDoor: CabinetDoorProps, userId?: number) => {
  const TIDList = rfidService.fns.getReportData(cabinetDoor.antenna_address)
  console.log(cabinetDoor.id, '柜门id')
  console.log('🚀 ~ file: document-service.ts:94 ~ updateCarrier ~ TIDList:', TIDList)
  console.log('🚀 ~ file: document-service.ts:94 ~ updateCarrier ~ TIDList.length:', TIDList.length)

  const documents = await getAllCarrierData()

  for (let i = 0; i < documents.length; i++) {
    const doc = documents[i]

    // 如果不是本柜门文件
    if (doc.cabinet_door_id !== cabinetDoor.id) {
      const isWarningDocument = (await queryMisplacedDocumentCount(cabinetDoor.id, doc.doc_rfid)) !== 0
      if (isWarningDocument) continue

      const data: Partial<rfid_switch_record> = {
        cabinet_door_id: cabinetDoor.id,
        cabinet_id: cabinetDoor.cabinet_id,
        content: `文件[${doc.doc_name}]错放`,
        datetime: generateCurrentTime(),
        operation_id: TIDList.includes(doc.doc_rfid) ? doc.doc_rfid : '0',
        type: '1',
        user_id: userId || null
      }
      await addMisPlacedDocument(data)
    } else {
      const isDocumentDetected = TIDList.includes(doc.doc_rfid)

      // 归还
      if (isDocumentDetected && doc.loan_status === 1) {
        await updateDocStatusByID(doc.doc_id, 0, userId)
      }
      // 借出
      else if (!isDocumentDetected && doc.loan_status === 0) {
        await updateDocStatusByID(doc.doc_id, 1, userId)
      }
    }
  }

  const misPlaceDocuments = await getMisPlaceCarriers()
  for (let i = 0; i < misPlaceDocuments.length; i++) {
    const doc = misPlaceDocuments[i]
    if (!TIDList.includes(doc.operation_id)) {
      await updateMisPlaceDocument(doc.operation_id)
    }
  }
}

const carrierService = {
  name: 'carrier' as const,
  fns: {
    getAllCarrierData,
    getCarrierDataByCondition,
    getCarrierDataByCabinetId,
    getInPlaceCarrierCount,
    getMisPlaceCarriers,
    updateCarrier
  }
}

export default carrierService

