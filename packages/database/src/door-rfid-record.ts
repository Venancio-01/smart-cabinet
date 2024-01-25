import type { PaginationType } from '@smart-cabinet/utils'
import { getSkipAndTake } from '@smart-cabinet/utils'
import { Prisma } from '@prisma/client'
import { prisma } from '..'

const doorRfidRecordArgs = Prisma.validator<Prisma.DoorRfidrecordArgs>()({
  include: {
    department: true,
  },
})

export type DoorRfidrecordProps = Prisma.DoorRfidrecordGetPayload<typeof doorRfidRecordArgs>

/**
 * @description: 查询通道门 rfid 检测记录列表
 * @param {*}
 * @return {*}
 */
export async function selectDoorRfidrecordList(condition?: Prisma.DoorRfidrecordWhereInput): Promise<DoorRfidrecordProps[]> {
  return prisma.doorRfidrecord.findMany({
    where: condition,
    orderBy: {
      creatorTime: 'desc',
    },
    ...doorRfidRecordArgs,
  })
}

/**
 * @description: 查询通道门 rfid 检测记录列表伴随分页
 * @param {PaginationType} pagination
 * @param {Prisma} condition
 * @return {*}
 */
export async function selectDoorRfidrecordListWithPage(
  pagination: PaginationType,
  condition?: Prisma.DoorRfidrecordWhereInput,
): Promise<{ data: DoorRfidrecordProps[], total: number }> {
  const skipAndTake = getSkipAndTake(pagination)
  const [data, total] = await Promise.all([
    prisma.doorRfidrecord.findMany({
      ...skipAndTake,
      where: condition,
      orderBy: {
        creatorTime: 'desc',
      },
      ...doorRfidRecordArgs,
    }),
    prisma.doorRfidrecord.count({
      where: condition,
    }),
  ])

  return {
    data,
    total,
  }
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
