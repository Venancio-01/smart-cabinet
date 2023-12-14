import { Prisma } from '@prisma/client'
import type { PaginationType } from 'utils'
import { getSkipAndTake } from 'utils'
import type { SysUser } from '.'
import { prisma } from '.'

const sysUserArgs = Prisma.validator<Prisma.SysUserArgs>()({
  include: {
    department: true,
    userRole: {
      include: {
        role: true,
      },
    },
  },
})

export type SysUserProps = Prisma.SysUserGetPayload<typeof sysUserArgs>

/**
 * @description: 获取用户列表
 * @return {*}
 */
export function selectSysUserList(condition?: Prisma.SysUserWhereInput): Promise<SysUserProps[]> {
  return prisma.sysUser.findMany({
    where: condition,
    ...sysUserArgs,
  })
}

/**
 * @description: 查询用户列表伴随分页
 * @return {*}
 */
export async function selectSysUserListWithPage(
  pagination: PaginationType,
  condition?: Prisma.SysUserWhereInput,
): Promise<{ data: SysUserProps[], total: number }> {
  const skipAndTake = getSkipAndTake(pagination)

  const [data, total] = await Promise.all([
    prisma.sysUser.findMany({
      ...skipAndTake,
      where: condition,
      ...sysUserArgs,
    }),
    prisma.sysUser.count({
      where: condition,
    }),
  ])

  return {
    data,
    total,
  }
}

/**
 * @description: 获取用户
 * @param {Partial} condition
 * @return {*}
 */
export function selectSysUser(condition: Prisma.SysUserWhereInput): Promise<SysUserProps | null> {
  return prisma.sysUser.findFirst({
    where: condition,
    include: sysUserArgs.include,
  })
}

/**
 * @description: 更新用户
 * @param {Partial} condition
 * @param {Partial} data
 * @return {*}
 */
export function updateSysUser(condition: Prisma.SysUserWhereInput, data: Partial<SysUser>) {
  return prisma.sysUser.updateMany({
    where: condition,
    data,
  })
}
