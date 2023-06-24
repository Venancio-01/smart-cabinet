import type { PaginationType } from 'utils'
import { getSkipAndTake } from 'utils'
import type { Prisma, SysDept } from '.'
import { prisma } from '.'

export async function selectSysDeptList(condition?: Prisma.SysDeptWhereInput): Promise<SysDept[]>
export async function selectSysDeptList(
  condition: Prisma.SysDeptWhereInput,
  pagination?: PaginationType,
): Promise<{ data: SysDept[]; total: number }>
export async function selectSysDeptList(condition?: Prisma.SysDeptWhereInput, pagination?: PaginationType) {
  if (pagination) {
    const skipAndTake = getSkipAndTake(pagination)
    const [data, total] = await Promise.all([
      prisma.sysDept.findMany({
        ...skipAndTake,
        where: condition,
      }),
      prisma.sysDept.count({
        where: condition,
      }),
    ])

    return {
      data,
      total,
    }
  } else {
    return prisma.sysDept.findMany({
      where: condition,
    })
  }
}

/**
 * @description: 根据条件查询部门
 * @param {Prisma} condition
 * @return {*}
 */
export function selectSysDept(condition: Prisma.SysDeptWhereInput) {
  return prisma.sysDept.findFirst({
    where: condition,
  })
}
