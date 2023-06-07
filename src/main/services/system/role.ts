import type { sys_role, sys_user_role } from '@prisma/client'
import { prisma } from '@/database'

/**
 * @description: 获取角色列表
 * @return {*}
 */
export function getRoleList(): Promise<sys_role[]> {
  return prisma.sys_role.findMany()
}
/**
 * @description: 获取角色列表
 * @return {*}
 */
export function getUserRoleList(): Promise<sys_user_role[]> {
  return prisma.sys_user_role.findMany()
}
