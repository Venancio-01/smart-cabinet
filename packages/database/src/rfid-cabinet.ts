import { prisma } from '.'

/**
 * @description: 查询柜机列表
 * @return {*}
 */
export function selectRfidCabinetList() {
  return prisma.rfidCabinet.findMany()
}
