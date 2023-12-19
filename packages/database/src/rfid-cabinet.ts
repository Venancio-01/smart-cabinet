import { Prisma } from '@prisma/client'
import { prisma } from '..'

const rfidCabinetDefaultArgs = Prisma.validator<Prisma.RfidCabinetDefaultArgs>()({
  include: {
    cabinetDoorList: true,
    department: {
      select: {
        deptName: true,
      },
    },
  },
})

export type RfidCabinetProps = Prisma.RfidCabinetGetPayload<typeof rfidCabinetDefaultArgs>

/**
 * @description: 查询柜机列表
 * @return {*}
 */
export function selectRfidCabinetList(): Promise<RfidCabinetProps[]> {
  return prisma.rfidCabinet.findMany({
    ...rfidCabinetDefaultArgs,
  })
}
