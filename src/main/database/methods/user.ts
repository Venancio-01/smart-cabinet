import { prisma } from '@/database'

export async function queryDepartNameByDeptId(deptId: number) {
  const result = await prisma.sys_dept.findFirst({
    where: {
      id: deptId,
    },
    select: {
      dept_name: true,
    },
  })
  return result?.dept_name
}

export async function queryRoleIdByUserId(userId: number) {
  const result = await prisma.sys_user_role.findFirst({
    where: {
      user_id: userId,
    },
    select: {
      role_id: true,
    },
  })
  return result?.role_id
}

export async function queryRoleNameByRoleId(roleId: number) {
  const result = await prisma.sys_role.findFirst({
    where: {
      id: roleId,
    },
    select: {
      role_name: true,
    },
  })
  return result?.role_name
}

export async function queryUsers() {
  return await prisma.sys_user.findMany()
}

export async function queryUserByUserId(userId: number) {
  const result = await prisma.sys_user.findUnique({
    where: {
      id: userId,
    },
    include: {
      sys_dept: true,
      sys_user_role: {
        include: {
          sys_role: {
            include: {
              sys_role_permission: {
                include: {
                  sys_permission: true,
                },
              },
            },
          },
        },
      },
    },
  })

  return result
}

export async function queryUserByLoginName(loginName: string) {
  const result = await prisma.sys_user.findFirst({
    where: {
      login_name: loginName,
    },
    include: {
      sys_dept: true,
      sys_user_role: {
        include: {
          sys_role: {
            include: {
              sys_role_permission: {
                include: {
                  sys_permission: true,
                },
              },
            },
          },
        },
      },
    },
  })

  return result
}

export async function updatePasswordByUserId(userId: number, password: string) {
  const result = await prisma.sys_user.update({
    where: {
      id: userId,
    },
    data: {
      password,
    },
  })

  return result
}
