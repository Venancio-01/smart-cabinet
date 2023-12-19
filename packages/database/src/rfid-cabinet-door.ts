import { Prisma } from '@prisma/client'
import { prisma } from '..'

const rfidCabinetdoorDefaultArgs = Prisma.validator<Prisma.RfidCabinetdoorDefaultArgs>()({
  include: {
    cabinet: true,
  },
})

export type RfidCabinetdoorProps = Prisma.RfidCabinetdoorGetPayload<typeof rfidCabinetdoorDefaultArgs>

/**
 * @description: 查询柜门列表
 * @return {*}
 */
export function selectRfidCabinetDoorList(condition?: Prisma.RfidCabinetdoorWhereInput): Promise<RfidCabinetdoorProps[]> {
  return prisma.rfidCabinetdoor.findMany({
    where: condition,
    ...rfidCabinetdoorDefaultArgs,
  })
}
