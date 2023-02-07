import { queryUserByUserId, updatePasswordByUserId } from '@/database/methods/user'
import prisma from '@/prisma'
import { genMd5EncryptedPassword } from '@/utils'
import { sys_dept } from '@prisma/client'

const sysService = {
  name: 'sys' as 'sys',
  fns: {
    async getUserData(userId: number) {
      const user = await queryUserByUserId(userId)
      return user
    },
    async getDepartmentData(): Promise<sys_dept[]> {
      const departments = await prisma.sys_dept.findMany()
      return departments
    },
    async updatePassword(userId, password) {
      const user = await queryUserByUserId(userId)
      const encryptedPassword = genMd5EncryptedPassword(user.LOGIN_NAME, password, user.SALT)
      const result = await updatePasswordByUserId(userId, encryptedPassword)
      const success = result !== null
      return success
    }
  }
}

export default sysService
