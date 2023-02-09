import { genMd5EncryptedPassword, genResponseData } from '@/utils'
import { queryUserByLoginName, queryUserByUserId } from '@/database/methods/user'
import prisma from '@/prisma'

const loginService = {
  name: 'login' as 'login',
  fns: {
    async onPasswordLogin({ username, password }: PasswordLoginProps) {
      const user = await queryUserByLoginName(username)
      if (user === null) return genResponseData(false, '用户不存在')
      const encryptedPassword = genMd5EncryptedPassword(username, password, user.SALT)
      if (user.PASSWORD !== encryptedPassword) return genResponseData(false, '密码错误')
      return genResponseData(true, '登录成功', user)
    },

    async onCardLogin(cardNumber: string) {
      const targetUser = await prisma.rfid_card_user.findFirst({
        where: {
          CARDDATA: cardNumber
        },
        select: {
          USERID: true
        }
      })
      if (targetUser === null) return genResponseData(false, '用户ID查找失败')

      const userId = targetUser?.USERID
      const user = await queryUserByUserId(userId)
      if (user === null) return genResponseData(false, '用户查找失败')
      
      return genResponseData(true, '登录成功', user)
    }
  }
}

export default loginService
