import type { PaginationType } from 'utils'
import { getSkipAndTake } from 'utils'
import { Prisma } from '@prisma/client'
import type { DoorAlarmrecord } from '.'
import { prisma } from '.'

const doorAlarmrecordArgs = Prisma.validator<Prisma.DoorAlarmrecordArgs>()({
  include: {
    department: true,
  },
})

export type DoorAlarmrecordProps = Prisma.DoorAlarmrecordGetPayload<typeof doorAlarmrecordArgs>

/**
 * @description: 查询通道门报警记录列表
 * @param {Prisma} condition
 * @return {*}
 */
export async function selectDoorAlarmRecordList(condition?: Prisma.DoorAlarmrecordWhereInput): Promise<DoorAlarmrecordProps[]> {
  return prisma.doorAlarmrecord.findMany({
    where: condition,
    orderBy: {
      createTime: 'desc',
    },
    ...doorAlarmrecordArgs,
  })
}

/**
 * @description: 查询通道门报警记录列表伴随分页
 * @param {PaginationType} pagination
 * @param {Prisma} condition
 * @return {*}
 */
export async function selectDoorAlarmRecordListWithPage(
  pagination: PaginationType,
  condition?: Prisma.DoorAlarmrecordWhereInput,
): Promise<{ data: DoorAlarmrecordProps[]; total: number }> {
  const skipAndTake = getSkipAndTake(pagination)
  const [data, total] = await Promise.all([
    prisma.doorAlarmrecord.findMany({
      ...skipAndTake,
      where: condition,
      orderBy: {
        createTime: 'desc',
      },
      ...doorAlarmrecordArgs,
    }),
    prisma.doorAlarmrecord.count({
      where: condition,
    }),
  ])

  return {
    data,
    total,
  }
}

/**
 * @description: 查询通道门报警记录数量
 * @param {Prisma.DoorAlarmrecordWhereInput} condition
 * @return {*}
 */
export function selectDoorAlarmRecordCount(condition: Prisma.DoorAlarmrecordWhereInput) {
  return prisma.doorAlarmrecord.count({
    where: condition,
  })
}

/**
 * @description: 更新载体
 * @param {Partial} condition
 * @param {Partial} data
 * @return {*}
 */
export function updateDoorAlarmrecord(
  condition: Prisma.DoorAlarmrecordWhereUniqueInput,
  data: Partial<DoorAlarmrecord>,
): Promise<DoorAlarmrecord> {
  return prisma.doorAlarmrecord.update({
    where: condition,
    data,
  })
}

/**
 * @description: 插入通道门报警记录
 * @param {Prisma.DoorAlarmrecordCreateInput} data
 * @return {*}
 */
export function insertDoorAlarmrecord(data: Prisma.DoorAlarmrecordCreateInput) {
  return prisma.doorAlarmrecord.create({
    data,
  })
}

/**
 * @description: 插入通道门报警记录列表
 * @param {Prisma.DoorAlarmrecordCreateInput[]} data
 * @return {*}
 */
export function insertDoorAlarmrecordList(data: Prisma.DoorAlarmrecordCreateInput[]) {
  return prisma.doorAlarmrecord.createMany({
    data,
  })
}
