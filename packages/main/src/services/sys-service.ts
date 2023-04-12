import { queryUserByUserId, queryUsers, updatePasswordByUserId } from '@/prisma/methods/user'
import prisma from '@/prisma'
import { genMd5EncryptedPassword } from '@/utils'
import { sys_dept, sys_user } from '@prisma/client'
import { join } from 'path'

const sysService = {
  name: 'sys' as const,
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
    async updatePassword(userId: number, password: string) {
      const user = await queryUserByUserId(userId)
      const encryptedPassword = genMd5EncryptedPassword(user.login_name, password, user.salt)
      const result = await updatePasswordByUserId(userId, encryptedPassword)
      const success = result !== null
      return success
    },
    async verifyPassword(user: sys_user, password: string) {
      const encryptedPassword = genMd5EncryptedPassword(user.login_name, password, user.salt)
      const success = user.password
        === encryptedPassword
      return success
    },
    async getProductionBgImagePath() {
      const path = join(process.resourcesPath, '/public/background/index.png')
      return path
    }
  }
}

export default sysService
