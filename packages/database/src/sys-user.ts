import type { SysUser } from '.'
import { prisma } from '.'

/**
 * @description: 获取用户列表
 * @return {*}
 */
export function selectSysUserList() {
  return prisma.sysUser.findMany()
}

/**
 * @description: 获取用户
 * @param {Partial} condition
 * @return {*}
 */
export function selectSysUser(condition: Partial<SysUser>) {
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
export function updateSysUser(condition: Partial<SysUser>, data: Partial<SysUser>) {
  return prisma.sysUser.updateMany({
    where: condition,
    data,
  })
}
