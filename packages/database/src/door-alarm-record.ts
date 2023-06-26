import { getSkipAndTake } from 'utils'
import type { PaginationType } from 'utils'
import type { DoorAlarmrecord, Prisma } from '.'
import { prisma } from '.'

export async function selectDoorAlarmRecordList(): Promise<DoorAlarmrecord[]>
export async function selectDoorAlarmRecordList(
  condition: PaginationType & Prisma.DoorAlarmrecordWhereInput,
): Promise<{ data: DoorAlarmrecord[]; total: number }>
/**
 * @description: 查询通道门报警记录列表
 * @param {*}
 * @return {*}
 */
export async function selectDoorAlarmRecordList(
  condition?: PaginationType & Prisma.DoorAlarmrecordWhereInput,
): Promise<DoorAlarmrecord[] | { data: DoorAlarmrecord[]; total: number }> {
  const pageCondition = getSkipAndTake(condition)

  const query: Prisma.DoorAlarmrecordWhereInput = {}

  if (pageCondition) {
    const [data, total] = await Promise.all([
      prisma.doorAlarmrecord.findMany({
        ...pageCondition,
        where: query,
      }),
      prisma.doorAlarmrecord.count({
        where: query,
      }),
    ])

    return {
      data,
      total,
    }
  } else {
    return prisma.doorAlarmrecord.findMany({
      where: query,
    })
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
