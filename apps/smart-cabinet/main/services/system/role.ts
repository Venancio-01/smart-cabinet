import type { SysRole, SysUserRole } from 'database'
import { prisma } from 'database'

/**
 * @description: 获取角色列表
 * @return {*}
 */
export function getRoleList(): Promise<SysRole[]> {
  return prisma.sysRole.findMany()
}
/**
 * @description: 获取角色列表
 * @return {*}
 */
export function getUserRoleList(): Promise<SysUserRole[]> {
  return prisma.sysUserRole.findMany()
}
