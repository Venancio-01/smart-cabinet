import type { PaginationType } from 'utils'
import { getSkipAndTake } from 'utils'
import type { DoorAccessRecords, Prisma } from '.'
import { prisma } from '.'

/**
 * @description: 查询出入记录列表
 * @return {*}
 */
export async function selectDoorAccessRecordList(condition?: Prisma.SysDeptWhereInput): Promise<DoorAccessRecords[]>
export async function selectDoorAccessRecordList(
  condition: Prisma.SysDeptWhereInput,
  pagination?: PaginationType,
): Promise<{ data: DoorAccessRecords[], total: number }>
export async function selectDoorAccessRecordList(condition?: Prisma.DoorAccessRecordsWhereInput, pagination?: PaginationType) {
  if (pagination) {
    const pageCondition = getSkipAndTake(pagination)
    const [data, total] = await Promise.all([
      prisma.doorAccessRecords.findMany({
        ...pageCondition,
        where: condition,
      }),
      prisma.doorAccessRecords.count({
        where: condition,
      }),
    ])

    return {
      data,
      total,
    }
  }
  else {
    return prisma.doorAccessRecords.findMany({
      where: condition,
    })
  }
}

/**
 * @description: 插入出入记录
 * @param {Prisma.DoorAccessRecordsCreateInput} data
 * @return {*}
 */
export function insertDoorAccessRecord(data: Prisma.DoorAccessRecordsCreateInput) {
  return prisma.doorAccessRecords.create({
    data,
  })
}

/**
 * @description: 更新出入记录
 * @param {Prisma.DoorAccessRecordsWhereInput} condition
 * @param {Prisma.DoorAccessRecordsUpdateInput} data
 * @return {*}
 */
export function updateDoorAccessRecord(condition: Prisma.DoorAccessRecordsWhereInput, data: Prisma.DoorAccessRecordsUpdateInput) {
  return prisma.doorAccessRecords.updateMany({
    where: condition,
    data,
  })
}
