import type { Prisma, SysUser } from '.'
import { prisma } from '.'

/**
 * @description: 获取用户列表
 * @return {*}
 */
export function selectSysUserList(condition?: Prisma.SysUserWhereInput) {
  return prisma.sysUser.findMany({
    where: condition,
  })
}

/**
 * @description: 获取用户
 * @param {Partial} condition
 * @return {*}
 */
export function selectSysUser(condition: Prisma.SysUserWhereInput) {
  return prisma.sysUser.findFirst({
    where: condition,
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
