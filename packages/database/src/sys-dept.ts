import type { PaginationType } from 'utils'
import { getSkipAndTake } from 'utils'
import type { Prisma, SysDept } from '.'
import { prisma } from '.'

export async function selectSysDeptList(): Promise<SysDept[]>
export async function selectSysDeptList(condition: Partial<PaginationType & SysDept>): Promise<{ data: SysDept[]; total: number }>
export async function selectSysDeptList(condition?: Partial<PaginationType & SysDept>) {
  const pageCondition = getSkipAndTake(condition)

  const query: Prisma.SysDeptWhereInput = {
    deptName: condition?.deptName,
  }

  if (pageCondition) {
    const [data, total] = await Promise.all([
      prisma.sysDept.findMany({
        ...pageCondition,
        where: query,
      }),
      prisma.sysDept.count({
        where: query,
      }),
    ])

    return {
      data,
      total,
    }
  } else {
    return prisma.sysDept.findMany()
  }
}
