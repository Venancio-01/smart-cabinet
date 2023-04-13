import { queryUserByUserId, queryUsers, updatePasswordByUserId } from '@/prisma/methods/user'
import prisma from '@/prisma'
import { genMd5EncryptedPassword } from '@/utils'
import { sys_dept, sys_user } from '@prisma/client'
import { join } from 'path'

const getUserData = async (userId: number) => {
  const user = await queryUserByUserId(userId)
  return user
}

const getUserList = async () => {
  const users = await queryUsers()
  return users
}

const getDepartmentData = async (): Promise<sys_dept[]> => {
  const departments = await prisma.sys_dept.findMany()
  return departments
}

const updatePassword = async (userId: number, password: string) => {
  const user = await queryUserByUserId(userId)
  const encryptedPassword = genMd5EncryptedPassword(user.login_name, password, user.salt)
  const result = await updatePasswordByUserId(userId, encryptedPassword)
  const success = result !== null
  return success
}

const verifyPassword = async (user: sys_user, password: string) => {
  const encryptedPassword = genMd5EncryptedPassword(user.login_name, password, user.salt)
  const success = user.password === encryptedPassword
  return success
}

const getProductionBgImagePath = async () => {
  const path = join(process.resourcesPath, '/public/background/index.png')
  return path
}

const sysService = {
  name: 'sys' as const,
  fns: {
    getUserData,
    getUserList,
    getDepartmentData,
    updatePassword,
    verifyPassword,
    getProductionBgImagePath
  }
}

export default sysService

