import type { RfidCabinet } from '.'
import { prisma } from '.'

/**
 * @description: 查询柜机列表
 * @return {*}
 */
export function selectRfidCabinetList(): Promise<RfidCabinet[]> {
  return prisma.rfidCabinet.findMany()
}
