import type { Prisma } from '.'
import { prisma } from '.'

/**
 * @description: 查询柜门列表
 * @return {*}
 */
export function selectRfidCabinetDoorList(condition?: Prisma.RfidCabinetdoorWhereInput) {
  return prisma.rfidCabinetdoor.findMany({
    where: condition,
  })
}
