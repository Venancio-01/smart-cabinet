import { queryUserByUserId, updatePasswordByUserId } from '@/prisma/methods/user'
import prisma from '@/prisma'
import { genMd5EncryptedPassword } from '@/utils'
import { sys_dept, sys_user } from '@prisma/client'
import { join } from 'path'

const getUserData = async (userId: number) => {
  const user = await queryUserByUserId(userId)
  return user
}

/**
 * @description: 获取所有用户
 * @return {*}
 */
const getAllUsers = async (): Promise<sys_user[]> => {
  return await prisma.sys_user.findMany({
    include: {
      sys_user_role: {
        include: {
          sys_role: true
        }
      }
    }
  })
}

/**
 * @description: 获取用户列表
 * @param {UserQueryProps} { userName, departmentId, roleId }
 * @return {*}
 */
const getUsersByCondition = async ({ userName, departmentId, roleId }: UserQueryProps): Promise<UserWithRoleProps[]> => {
  const where = {
    user_name: {
      contains: userName
    },
    dept_id: departmentId ? Number(departmentId) : undefined
  }

  const users = await prisma.sys_user.findMany({
    where,
    include: {
      sys_user_role: {
        include: {
          sys_role: true
        }
      }
    }
  })

  return users.reduce((acc, cur) => {
    const roles = cur.sys_user_role.map(userRole => userRole.sys_role)
    if (roleId !== undefined) {
      const role = roles.find(role => role?.id === roleId)
      if (role !== undefined) {
        acc.push({
          ...cur,
          role
        })
      }
    } else {
      acc.push({
        ...cur,
        role: roles[0]
      })
    }
    return acc
  }, [] as UserWithRoleProps[])
}

/**
 * @description: 获取部门列表
 * @return {*}
 */
const getDepartmentData = async (): Promise<sys_dept[]> => {
  const departments = await prisma.sys_dept.findMany()
  return departments
}

/**
 * @description: 获取部门列表
 * @param {DepartmentQueryProps} { departmentName }
 * @return {*}
 */
const getDepartmentsByCondition = async ({ departmentName }: DepartmentQueryProps): Promise<sys_dept[]> => {
  return await prisma.sys_dept.findMany({
    where: {
      dept_name: {
        contains: departmentName
      }
    }
  })
}

const updatePassword = async (userId: number, password: string) => {
  const user = await queryUserByUserId(userId)
  const encryptedPassword = genMd5EncryptedPassword(user.login_name, password, user.salt)
  const result = await updatePasswordByUserId(userId, encryptedPassword)
  const success = result !== null
  return success
}

/**
 * @description: 校验密码
 * @param {sys_user} user
 * @param {string} password
 * @return {*}
 */
const verifyPassword = async (userString: string, password: string) => {
  const user = JSON.parse(userString) as sys_user
  
  const encryptedPassword = genMd5EncryptedPassword(user.login_name, password, user.salt)
  const success = user.password === encryptedPassword
  return success
}

/**
 * @description: 校验卡号
 * @param {sys_user} user
 * @param {string} cardNumber
 * @return {*}
 */
const verifyCard = async (userString: string, cardNumber: string) => {
  const user = JSON.parse(userString) as sys_user

  const result = await prisma.rfid_card_user.findFirst({
    where: {
      user_id: user.id,
    },
    select: {
      card_data: true
    }
  })

  const success = result.card_data === cardNumber
  return success
}

const getProductionBgImagePath = async () => {
  const path = join(process.resourcesPath, '/public/background/index.png')
  return path
}

/**
 * @description: 获取角色列表
 * @return {*}
 */
const getRoleData = async () => {
  const roles = await prisma.sys_role.findMany()
  return roles
}

/**
 * @description: 获取权限列表
 * @return {*}
 */
const getPermissionData = async () => {
  const permissions = await prisma.sys_permission.findMany()
  return permissions
}

/**
 * @description: 获取角色权限列表
 * @return {*}
 */
const getRolePermissionData = async () => {
  const rolePermissions = await prisma.sys_role_permission.findMany()
  return rolePermissions
}

const sysService = {
  name: 'sys' as const,
  fns: {
    getUserData,
    getAllUsers,
    getUsersByCondition,
    getDepartmentData,
    getDepartmentsByCondition,
    updatePassword,
    verifyPassword,
    verifyCard,
    getProductionBgImagePath,
    getRoleData,
    getPermissionData,
    getRolePermissionData
  }
}

export default sysService

