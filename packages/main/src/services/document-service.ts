import {
  queryInPlaceDocumentCountByCabinetId,
  queryMisplacedDocument,
  addMisPlacedDocument,
  queryMisplacedDocumentCountByTid,
  updateDocStatusByID,
  updateMisPlaceDocument
} from '@/database/methods/document'
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
        where['CABINET_DOOR_ID'] = condition.cabinetId
      }

      if (condition.title) {
        where['DOC_NAME'] = {
          contains: condition.title
        }
      }

      if (condition.state !== null) {
        where['DOC_REISSUENUMBER'] = condition.state
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
          CABINET_DOOR_ID: cabinetId
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
    async updateDocumentStateAfterCheck(cabinetDoorData: rfid_cabinet_door, userId?: number) {
      const TIDList = rfidService.fns.getReportData(cabinetDoorData.TXADDR)
      console.log(cabinetDoorData.ID, 'ID')
      console.log('🚀 ~ file: rfid-service.ts:105 ~ updateDocumentStateAfterCheck ~ TIDList', TIDList)
      const documents = await documentService.fns.getAllDocumentData()
      const misPlaceDocuments = await queryMisplacedDocument()

      for (let i = 0; i < documents.length; i++) {
        const doc = documents[i]

        // 如果不是本柜门文件
        if (doc.CABINET_DOOR_ID !== cabinetDoorData.ID) {
          const isWarningDocument = (await queryMisplacedDocumentCountByTid(doc.DOC_RFID)) !== 0
          if (isWarningDocument) continue

          const data = {
            CABINETDOORID: String(cabinetDoorData.ID),
            CABINETID: String(cabinetDoorData.CABINETID),
            CONTENT: `文件[${doc.DOC_NAME}]错放`,
            DATETIME: generateCurrentTime(),
            OPERATIONID: TIDList.includes(doc.DOC_RFID) ? doc.DOC_RFID : '0',
            TYPE: '1',
            USERID: userId || null
          }
          await addMisPlacedDocument(data)
        } else {
          // 归还
          if (TIDList.includes(doc.DOC_RFID) && doc.DOC_REISSUENUMBER == 1) {
            await updateDocStatusByID(doc.DOC_ID, 0)
          }
          // 借出
          else if (!TIDList.includes(doc.DOC_RFID) && doc.DOC_REISSUENUMBER == 0) {
            await updateDocStatusByID(doc.DOC_ID, 1)
          }
        }
      }

      // 清除错放记录
      for (let i = 0; i < misPlaceDocuments.length; i++) {
        const doc = misPlaceDocuments[i]
        if (!TIDList.includes(doc.OPERATIONID)) {
          await updateMisPlaceDocument(doc.OPERATIONID)
        }
      }
    }
  }
}

export default documentService
