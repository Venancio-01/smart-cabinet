import prisma from '@/prisma'

export const queryDepartNameByDeptId = async (deptId: number) => {
  const record = await prisma.sys_dept.findFirst({
    where: {
      id: deptId
    },
    select: {
      dept_name: true
    }
  })
  return record?.dept_name
}

export const queryRoleIdByUserId = async (userId: number) => {
  const record = await prisma.sys_user_role.findFirst({
    where: {
      user_id: userId
    },
    select: {
      role_id: true
    }
  })
  return record?.role_id
}

export const queryRoleNameByRoleId = async (roleId: number) => {
  const record = await prisma.sys_role.findFirst({
    where: {
      id: roleId
    },
    select: {
      role_name: true
    }
  })
  return record?.role_name
}

export const queryUserByUserId = async (userId: number) => {
  const record = await prisma.sys_user.findUnique({
    where: {
      id: userId
    }
  })

  if (record) {
    const roleId = await queryRoleIdByUserId(record.id)
    const roleName = await queryRoleNameByRoleId(roleId)
    const deptName = await queryDepartNameByDeptId(record.dept_id)
    return {
      ...record,
      roleName,
      deptName
    }
  } else return null
}

export const queryUserByLoginName = async (loginName: string) => {
  const record = await prisma.sys_user.findFirst({
    where: {
      login_name: loginName
    }
  })

  if (record) {
    const roleId = await queryRoleIdByUserId(record.id)
    const roleName = await queryRoleNameByRoleId(roleId)
    const deptName = await queryDepartNameByDeptId(record.dept_id)
    return {
      ...record,
      roleName,
      deptName
    }
  } else return null
}

export const updatePasswordByUserId = async (userId: number, password: string) => {
  const result = await prisma.sys_user.update({
    where: {
      id: userId
    },
    data: {
      password: password
    }
  })

  return result
}
