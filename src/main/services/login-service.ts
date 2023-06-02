import { genMd5EncryptedPassword, genResponseData } from '@/utils'
import { queryUserByLoginName, queryUserByUserId } from '@/database/methods/user'
import { prisma } from '@/database'

async function onPasswordLogin({ username, password }: PasswordLoginProps) {
  const user = await queryUserByLoginName(username)
  if (user === null)
    return genResponseData(false, '用户不存在')
  const encryptedPassword = genMd5EncryptedPassword(username, password, user.salt)
  if (user.password !== encryptedPassword)
    return genResponseData(false, '密码错误')
  return genResponseData(true, '登录成功', user)
}

async function onCardLogin(cardNumber: string) {
  const result = await prisma.rfid_card_user.findFirst({
    where: {
      card_data: cardNumber,
    },
    select: {
      user_id: true,
    },
  })
  if (result === null)
    return genResponseData(false, '用户ID查找失败')

  const userId = result?.user_id
  const user = await queryUserByUserId(userId)
  if (user === null)
    return genResponseData(false, '用户查找失败')

  return genResponseData(true, '登录成功', user)
}

const loginService = {
  name: 'login' as const,
  fns: {
    onPasswordLogin,
    onCardLogin,
  },
}

export default loginService
