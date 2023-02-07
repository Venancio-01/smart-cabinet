import prisma from '@/prisma'

export const queryDepartNameByDeptId = async (deptId: number) => {
  const record = await prisma.sys_dept.findFirst({
    where: {
      DEPT_ID: deptId
    },
    select: {
      DEPT_NAME: true
    }
  })
  return record?.DEPT_NAME
}

export const queryRoleIdByUserId = async (userId: number) => {
  const record = await prisma.sys_user_role.findFirst({
    where: {
      USER_ID: userId
    },
    select: {
      ROLE_ID: true
    }
  })
  return record?.ROLE_ID
}

export const queryRoleNameByRoleId = async (roleId: number) => {
  const record = await prisma.sys_role.findFirst({
    where: {
      ROLE_ID: roleId
    },
    select: {
      ROLE_NAME: true
    }
  })
  return record?.ROLE_NAME
}

export const queryUserByUserId = async (userId: number) => {
  const record = await prisma.sys_user.findUnique({
    where: {
      USER_ID: userId
    }
  })

  if (record) {
    const roleId = await queryRoleIdByUserId(record.USER_ID)
    const roleName = await queryRoleNameByRoleId(roleId)
    const deptName = await queryDepartNameByDeptId(record.DEPT_ID)
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
      LOGIN_NAME: loginName
    }
  })

  if (record) {
    const roleId = await queryRoleIdByUserId(record.USER_ID)
    const roleName = await queryRoleNameByRoleId(roleId)
    const deptName = await queryDepartNameByDeptId(record.DEPT_ID)
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
      USER_ID: userId
    },
    data: {
      PASSWORD: password
    }
  })

  return result
}
