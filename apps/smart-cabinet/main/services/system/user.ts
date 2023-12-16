import { genResponseData } from '@smart-cabinet/utils'
import { selectRfidCardUser, selectSysUser, updateRfidCardUser, updateSysUser } from '@smart-cabinet/database'
import type { SysUserProps } from '@smart-cabinet/database'
import { genMd5EncryptedPassword } from './utils'

/**
 * @param {PasswordLoginProps} { username, password } - The login credentials provided by the user.
 * @return {Promise<ResponseData<SysUserProps | null>>} The response data indicating the success or failure of the login attempt.
 */
export async function onPasswordLogin({ username, password }: PasswordLoginProps) {
  const user = await selectSysUser({
    loginName: username,
  })

  if (user === null) return genResponseData<null>(false, '用户不存在')

  const encryptedPassword = genMd5EncryptedPassword(username, password, user.salt || '')
  if (user.password !== encryptedPassword) return genResponseData<null>(false, '密码错误')
  return genResponseData<SysUserProps>(true, '登录成功', user)
}

/**
 * @param {string} cardNumber - The card number used for login.
 * @return {Promise<ResponseData<SysUserProps> | ResponseData<null>>} The response data indicating the success or failure of the login process.
 */
export async function onCardLogin(cardNumber: string) {
  const result = await selectRfidCardUser({
    cardData: cardNumber,
  })
  if (result === null) return genResponseData<null>(false, '用户ID查找失败')

  const userId = result.userid
  if (!userId) return genResponseData<null>(false, '用户查找失败')

  const user = await selectSysUser({
    userId: BigInt(userId),
  })
  if (user === null) return genResponseData<null>(false, '用户查找失败')

  return genResponseData<SysUserProps>(true, '登录成功', user)
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
