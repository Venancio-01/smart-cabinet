import { Prisma } from '@prisma/client'
import type { PaginationType } from '@smart-cabinet/utils'
import { getSkipAndTake } from '@smart-cabinet/utils'
import type { SysUser } from '..'
import { prisma } from '..'

const sysUserDefaultArgs = Prisma.validator<Prisma.SysUserDefaultArgs>()({
  include: {
    department: true,
    userRole: {
      include: {
        role: true,
      },
    },
  },
})

export type SysUserProps = Prisma.SysUserGetPayload<typeof sysUserDefaultArgs>

/**
 * @description: 获取用户列表
 * @return {*}
 */
export function selectSysUserList(condition?: Prisma.SysUserWhereInput): Promise<SysUserProps[]> {
  return prisma.sysUser.findMany({
    where: condition,
    ...sysUserDefaultArgs,
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
      ...sysUserDefaultArgs,
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
    include: sysUserDefaultArgs.include,
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
