import type { DoorRfidrecord, Prisma } from '.'
import { prisma } from '.'

/**
 * @description: 查询通道门 rfid 检测记录列表
 * @param {*}
 * @return {*}
 */
export async function selectDoorRfidrecordList(condition?: Prisma.DoorRfidrecordWhereInput): Promise<DoorRfidrecord[]> {
  return prisma.doorRfidrecord.findMany({
    where: condition,
  })
}
