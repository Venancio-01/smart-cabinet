import type { Prisma } from '.'
import { prisma } from '.'

/**
 * @description: 查询通道门 rfid 检测记录列表
 * @param {*}
 * @return {*}
 */
export async function selectDoorRfidrecordList(condition?: Prisma.DoorRfidrecordWhereInput) {
  return prisma.doorRfidrecord.findMany({
    where: condition,
  })
}

/**
 * @description: 添加通道门 rfid 检测记录
 * @param {Prisma} data
 * @return {*}
 */
export async function insertDoorRfidrecord(data: Prisma.DoorRfidrecordCreateInput) {
  return prisma.doorRfidrecord.create({
    data,
  })
}

/**
 * @description: 添加多个通道门 rfid 检测记录
 * @param {Prisma} data
 * @return {*}
 */
export async function insertDoorRfidrecordList(data: Prisma.DoorRfidrecordCreateInput[]) {
  return prisma.doorRfidrecord.createMany({
    data,
  })
}
