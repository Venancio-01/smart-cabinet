import type { Prisma } from '.'
import { prisma } from '.'

export async function selectSysRoleList(condition?: Prisma.SysRoleWhereInput) {
  return prisma.sysRole.findMany({
    where: condition,
  })
}
