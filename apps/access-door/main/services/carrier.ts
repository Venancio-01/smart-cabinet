import type { DocDocument, rfid_switch_record } from 'database'
import { queryMisplacedCarrier, updateCarrierByID } from '@/database/methods/carrier'
import prisma from '@/database'

/**
 * 获取所有载体数据
 * @returns {Promise<DocDocument[]>}
 */
export async function getCarriers(): Promise<DocDocument[]> {
  const records = await prisma.DocDocument.findMany()
  return records
}

/**
 * @description: 获取在库载体数据
 * @return {*}
 */
async function getInboundCarrierData(): Promise<DocDocument[]> {
  const records = await prisma.DocDocument.findMany({
    where: {
      stock_status: 1,
    },
  })
  return records
}

const carrierService = {
  name: 'carrier' as const,
  fns: {
    getCarriers,
    getInboundCarrierData,
  },
}

export default carrierService
