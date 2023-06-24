import type { DoorRfidregister, Prisma } from '.'
import { prisma } from '.'

/**
 * @description: 查询通道门 rfid 登记列表
 * @param {*}
 * @return {*}
 */
export async function selectDoorRfidregisterList(condition?: Prisma.DoorRfidregisterWhereInput): Promise<DoorRfidregister[]> {
  return prisma.doorRfidregister.findMany({
    where: condition,
  })
}
