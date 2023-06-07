import type { sys_dept } from '@prisma/client'
import { prisma } from '@/database'

/**
 * @description: 获取部门列表
 * @return {*}
 */
export function getDepartments(condition?: DepartmentQueryProps): Promise<sys_dept[]> {
  const query: Partial<{ [key in keyof sys_dept]: any }> = {}
  if (condition?.departmentName) {
    query.dept_name = {
      contains: condition.departmentName,
    }
  }

  return prisma.sys_dept.findMany({
    where: query,
  })
}
