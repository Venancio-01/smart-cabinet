import type { Prisma } from '.'
import { prisma } from '.'

export async function selectSysUserRoleList(condition?: Prisma.SysUserRoleWhereInput) {
  return prisma.sysUserRole.findMany({
    where: condition,
  })
}
