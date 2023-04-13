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

const getAllDocumentData = async (): Promise<doc_document[]> => {
  const records = await prisma.doc_document.findMany()
  return records
}

const getDocumentData = async (condition: DocumentQueryProps): Promise<{
  data: doc_document[]
  total: number
}> => {
  const where = {
    cabinet_door_id: condition.cabinetId ? Number(condition.cabinetId) : undefined,
    doc_name: {
      contains: condition.title
    },
    doc_reissue_number: condition.state ?? undefined,
    binding_dept_id: condition.departmentId ? Number(condition.departmentId) : undefined
  }

  if (condition.state === 2) {
    const misPlaceDocuments = await queryMisplacedDocument()
    const rfids = misPlaceDocuments.map(item => item.operation_id)
    where.doc_reissue_number = 1
    where['doc_rfid'] = { in: rfids }
  } else if (condition.state === 1) {
    const misPlaceDocuments = await queryMisplacedDocument()
    const rfids = misPlaceDocuments.map(item => item.operation_id)
    where.doc_reissue_number = 1
    where['doc_rfid'] = { notIn: rfids }
  }

  const records = await prisma.doc_document.findMany({
    skip: (condition.page - 1) * condition.size,
    take: condition.size,
    where
  })

  const total = await prisma.doc_document.count({
    where
  })

  return {
    data: records,
    total
  }
}

const getDocumentByCabinetId = async (cabinetId: number): Promise<doc_document[]> => {
  const records = await prisma.doc_document.findMany({
    where: {
      cabinet_door_id: cabinetId
    }
  })

  return records
}

const getInPlaceDocumentCount = async (cabinetId?: number) => {
  return await queryInPlaceDocumentCount(cabinetId)
}

const getMisPlaceDocuments = async (): Promise<rfid_switch_record[]> => {
  return await queryMisplacedDocument()
}

const updateDocumentStateAfterCheck = async (cabinetDoor: CabinetDoorProps, userId?: number) => {
  const TIDList = rfidService.fns.getReportData(cabinetDoor.antenna_address)
  console.log(cabinetDoor.id, '柜门id')
  console.log('🚀 ~ file: document-service.ts:94 ~ updateDocumentStateAfterCheck ~ TIDList:', TIDList)
  console.log('🚀 ~ file: document-service.ts:94 ~ updateDocumentStateAfterCheck ~ TIDList.length:', TIDList.length)

  const documents = await getAllDocumentData()

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
      const data: Partial<doc_document> = {
        doc_in_place_number: await getInPlaceDocumentCount(cabinetDoor.id),
        doc_status: 1
      }
      await updateDocStatusByID(doc.id, data)
    }
  }

  const misPlaceDocuments = await getMisPlaceDocuments()
  for (let i = 0; i < misPlaceDocuments.length; i++) {
    const item = misPlaceDocuments[i]
    if (TIDList.includes(item.operation_id)) {
      await updateMisPlaceDocument(item.id, {
        type: '2'
      })
    }
  }
}

const documentService = {
  name: 'document' as const,
  fns: {
    getAllDocumentData,
    getDocumentData,
    getDocumentByCabinetId,
    getInPlaceDocumentCount,
    getMisPlaceDocuments,
    updateDocumentStateAfterCheck
  }
}

export default documentService

