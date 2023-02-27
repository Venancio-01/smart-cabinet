import { queryUserByUserId, queryUsers, updatePasswordByUserId } from '@/prisma/methods/user'
import prisma from '@/prisma'
import { genMd5EncryptedPassword } from '@/utils'
import { sys_dept } from '@prisma/client'
import { app } from 'electron'
import { join, resolve } from 'path'

const sysService = {
  name: 'sys',
  fns: {
    async getUserData(userId: number) {
      const user = await queryUserByUserId(userId)
      return user
    },
    async getUserList() {
      const users = await queryUsers()
      return users
    },
    async getDepartmentData(): Promise<sys_dept[]> {
      const departments = await prisma.sys_dept.findMany()
      return departments
    },
    async updatePassword(userId, password) {
      const user = await queryUserByUserId(userId)
      const encryptedPassword = genMd5EncryptedPassword(user.login_name, password, user.salt)
      const result = await updatePasswordByUserId(userId, encryptedPassword)
      const success = result !== null
      return success
    },
    async getProductionBgImagePath() {
      const path = join(process.resourcesPath, '/public/background/index.png')
      return path
    }
  }
}

export default sysService
