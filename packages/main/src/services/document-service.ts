import { queryInPlaceDocumentCountByCabinetId, queryMisplacedDocument } from '@/database/methods/document'
import prisma from '@/prisma'
import { doc_document, rfid_switch_record } from '@prisma/client'

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
    }
  }
}

export default documentService
