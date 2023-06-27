import { prisma } from '.'
import { Prisma } from '@prisma/client'

const rfidCabinetArgs = Prisma.validator<Prisma.RfidCabinetArgs>()({
  include: {
    cabinetDoorList:true,
    department: {
      select: {
        deptName: true,
      },
    },
  },
})

export type RfidCabinetProps = Prisma.RfidCabinetGetPayload<typeof rfidCabinetArgs>

/**
 * @description: 查询柜机列表
 * @return {*}
 */
export function selectRfidCabinetList(): Promise<RfidCabinetProps[]> {
  return prisma.rfidCabinet.findMany({
    ...rfidCabinetArgs,
  })
}
