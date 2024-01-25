import { Prisma } from '@prisma/client'
import { prisma } from '..'

const rfidCabinetArgs = Prisma.validator<Prisma.RfidCabinetArgs>()({
  include: {
    cabinetDoorList: true,
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
