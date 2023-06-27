import { Prisma } from '@prisma/client'
import { prisma } from '.'

const rfidCabinetdoorArgs = Prisma.validator<Prisma.RfidCabinetdoorArgs>()({
  include: {
    cabinet: true,
  },
})

export type RfidCabinetdoorProps = Prisma.RfidCabinetdoorGetPayload<typeof rfidCabinetdoorArgs>

/**
 * @description: 查询柜门列表
 * @return {*}
 */
export function selectRfidCabinetDoorList(condition?: Prisma.RfidCabinetdoorWhereInput): Promise<RfidCabinetdoorProps[]> {
  return prisma.rfidCabinetdoor.findMany({
    where: condition,
    ...rfidCabinetdoorArgs,
  })
}
