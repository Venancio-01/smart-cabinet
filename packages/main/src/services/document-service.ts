import {
  queryInPlaceDocumentCountByCabinetId,
  queryMisplacedDocument,
  addMisPlacedDocument,
  queryMisplacedDocumentCountByTid,
  updateDocStatusByID,
  updateMisPlaceDocument
} from '@/prisma/methods/document'
import prisma from '@/prisma'
import { generateCurrentTime } from '@/utils'
import { doc_document, rfid_cabinet_door, rfid_switch_record } from '@prisma/client'
import rfidService from './rfid-service'

const documentService = {
  name: 'document',
  fns: {
    async getAllDocumentData(): Promise<doc_document[]> {
      const records = await prisma.doc_document.findMany()
      return records
    },

    async getAllDocumentCount(): Promise<number> {
      const count = await prisma.doc_document.count()

      return count
    },

    async getDocumentData(condition: DocumentQueryProps) {
      const where = {}

      if (condition.cabinetId) {
        where['cabinet_door_id'] = condition.cabinetId
      }

      if (condition.title) {
        where['doc_name'] = {
          contains: condition.title
        }
      }

      if (condition.state !== null) {
        where['doc_reissue_number'] = condition.state
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
    },

    /**
     * @description: 根据柜门 ID 获取文件数据
     * @param {number} cabinetId
     * @return {*}
     */
    async getDocumentByCabinetId(cabinetId: number): Promise<doc_document[]> {
      const records = await prisma.doc_document.findMany({
        where: {
          cabinet_door_id: cabinetId
        }
      })

      return records
    },

    async getInPlaceDocumentCountByCabinetId(cabinetId: number) {
      const count = await queryInPlaceDocumentCountByCabinetId(cabinetId)
      return count
    },

    async getMisPlaceDocuments(): Promise<rfid_switch_record[]> {
      return await queryMisplacedDocument()
    },

    /**
     * @description: 盘点之后更新文件状态
     * @return {*}
     */
    async updateDocumentStateAfterCheck(cabinetDoorData: CabinetDoorProps, userId?: number) {
      const TIDList = rfidService.fns.getReportData(cabinetDoorData.antenna_address)
      console.log('🚀 ~ file: rfid-service.ts:105 ~ updateDocumentStateAfterCheck ~ TIDList', TIDList)
      const documents = await documentService.fns.getAllDocumentData()
      const misPlaceDocuments = await queryMisplacedDocument()

      for (let i = 0; i < documents.length; i++) {
        const doc = documents[i]

        // 如果不是本柜门文件
        if (doc.cabinet_door_id !== cabinetDoorData.id) {
          const isWarningDocument = (await queryMisplacedDocumentCountByTid(doc.doc_rfid)) !== 0
          if (isWarningDocument) continue

          const data = {
            CABINETDOORID: String(cabinetDoorData.id),
            cabinet_id: String(cabinetDoorData.cabinet_id),
            CONTENT: `文件[${doc.doc_name}]错放`,
            DATETIME: generateCurrentTime(),
            operation_id: TIDList.includes(doc.doc_rfid) ? doc.doc_rfid : '0',
            TYPE: '1',
            user_id: userId || null
          }
          await addMisPlacedDocument(data)
        } else {
          // 归还
          if (TIDList.includes(doc.doc_rfid) && doc.doc_reissue_number == 1) {
            await updateDocStatusByID(doc.doc_id, 0)
          }
          // 借出
          else if (!TIDList.includes(doc.doc_rfid) && doc.doc_reissue_number == 0) {
            await updateDocStatusByID(doc.doc_id, 1)
          }
        }
      }

      // 清除错放记录
      for (let i = 0; i < misPlaceDocuments.length; i++) {
        const doc = misPlaceDocuments[i]
        if (!TIDList.includes(doc.operation_id)) {
          await updateMisPlaceDocument(doc.operation_id)
        }
      }
    }
  }
}

export default documentService
