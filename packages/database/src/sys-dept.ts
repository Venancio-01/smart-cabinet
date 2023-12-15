import type { PaginationType } from '@smart-cabinet/utils'
import { getSkipAndTake } from '@smart-cabinet/utils'
import type { Prisma } from '..'
import { prisma } from '..'

/**
 * @description: 查询部门列表
 * @param {Prisma.SysDeptWhereInput} condition
 * @return {*}
 */
export async function selectSysDeptList(condition?: Prisma.SysDeptWhereInput) {
  return prisma.sysDept.findMany({
    where: condition,
  })
}

/**
 * @description: 查询部门列表伴随分页
 * @param {PaginationType} pagination
 * @param {Prisma.SysDeptWhereInput} condition
 * @return {*}
 */
export async function selectSysDeptListWithPage(pagination: PaginationType, condition?: Prisma.SysDeptWhereInput) {
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
