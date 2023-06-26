import { genResponseData } from 'utils'
import { selectRfidCardUser, selectSysUser, updateRfidCardUser, updateSysUser } from 'database'
import { genMd5EncryptedPassword } from './utils'

export async function onPasswordLogin({ username, password }: PasswordLoginProps) {
  const user = await selectSysUser({
    loginName: username,
  })

  if (user === null) return genResponseData(false, '用户不存在')

  const encryptedPassword = genMd5EncryptedPassword(username, password, user.salt || '')
  if (user.password !== encryptedPassword) return genResponseData(false, '密码错误')
  return genResponseData(true, '登录成功', user)
}

export async function onCardLogin(cardNumber: string) {
  const result = await selectRfidCardUser({
    cardData: cardNumber,
  })
  if (result === null) return genResponseData(false, '用户ID查找失败')

  const userId = result.userid
  if (!userId) return genResponseData(false, '用户查找失败')

  const user = await selectSysUser({
    userId: BigInt(userId),
  })
  if (user === null) return genResponseData(false, '用户查找失败')

  return genResponseData(true, '登录成功', user)
}

/**
 * @description: 更新密码
 * @param {number} userId
 * @param {string} password
 * @return {*}
 */
export async function updatePassword(userId: number, password: string) {
  const user = await selectSysUser({
    userId: BigInt(userId),
  })
  if (!user) return false

  const encryptedPassword = genMd5EncryptedPassword(user.loginName, password, user.salt || '')
  const result = await updateSysUser(
    {
      userId,
    },
    {
      password: encryptedPassword,
    },
  )
  const success = result !== null
  return success
}

/**
 * @description: 校验密码
 * @param {SysUser} user
 * @param {string} password
 * @return {*}
 */
export function verifyPassword({
  loginName,
  salt,
  password,
  newPassword,
}: {
  loginName: string
  salt: string
  password: string
  newPassword: string
}) {
  const encryptedPassword = genMd5EncryptedPassword(loginName, newPassword, salt)
  const success = password === encryptedPassword
  return success
}

/**
 * @description: 校验卡号
 * @param {SysUser} user
 * @param {string} cardNumber
 * @return {*}
 */
export async function verifyCard(userId: bigint, cardNumber: string) {
  const cardUser = await selectRfidCardUser({
    userid: Number(userId),
  })

  const success = cardUser?.cardData === cardNumber
  return success
}

/**
 * @description: 更新卡号
 * @param {number} userId
 * @param {string} cardNumber
 * @return {*}
 */
export function updateCardNumber(userId: bigint, cardNumber: string) {
  return updateRfidCardUser(
    {
      userid: Number(userId),
    },
    {
      cardData: cardNumber,
    },
  )
}
