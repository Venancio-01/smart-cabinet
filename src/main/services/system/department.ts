import type { SysDept } from '@prisma/client'
import { prisma } from '@/database'

/**
 * @description: 获取机构列表
 * @return {*}
 */
export function getDepartments(condition?: DepartmentQueryProps): Promise<SysDept[]> {
  const query: Partial<{ [key in keyof SysDept]: any }> = {}
  if (condition?.departmentName) {
    query.deptName = {
      contains: condition.departmentName,
    }
  }

  return prisma.sysDept.findMany({
    where: query,
  })
}
