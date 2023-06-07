import type { sys_user } from '@prisma/client'
import { genMd5EncryptedPassword } from './utils'
import { prisma } from '@/database'
import { genResponseData } from '@/utils/index'

/**
 * @description: 获取用户信息
 * @param {number} userId
 * @return {*}
 */
export function getUserData(userId: number) {
  return prisma.sys_user.findUnique({
    where: {
      user_id: userId,
    },
  })
}

/**
 * @description: 获取所有用户
 * @return {*}
 */
export async function getUsers(): Promise<sys_user[]> {
  return await prisma.sys_user.findMany()
}

/**
 * @description: 根据条件获取用户
 * @param {UserQueryProps} { userName, departmentId, roleId }
 * @return {*}
 */
export async function getUsersByCondition({ userName, departmentId, roleId }: UserQueryProps): Promise<sys_user[]> {
  const query: Partial<{ [key in keyof sys_user]: any }> = {
    user_name: {
      contains: userName,
    },
    dept_id: departmentId ? Number(departmentId) : undefined,
  }

  if (roleId) {
    const userRoleList = await prisma.sys_user_role.findMany()
    const userIds = userRoleList.filter(item => item.role_id === roleId).map(item => item.user_id)

    query.user_id = {
      in: userIds,
    }
  }

  return prisma.sys_user.findMany({
    where: query,
  })
}

export async function onPasswordLogin({ username, password }: PasswordLoginProps) {
  const user = await prisma.sys_user.findFirst({
    where: {
      login_name: username,
    },
  })

  if (user === null)
    return genResponseData(false, '用户不存在')

  const encryptedPassword = genMd5EncryptedPassword(username, password, user.salt)
  if (user.password !== encryptedPassword)
    return genResponseData(false, '密码错误')
  return genResponseData(true, '登录成功', user)
}

export async function onCardLogin(cardNumber: string) {
  const result = await prisma.rfid_card_user.findFirst({
    where: {
      CardData: cardNumber,
    },
  })
  if (result === null)
    return genResponseData(false, '用户ID查找失败')

  const userId = result.Userid
  const user = await getUserData(userId)
  if (user === null)
    return genResponseData(false, '用户查找失败')

  return genResponseData(true, '登录成功', user)
}

/**
 * @description: 更新密码
 * @param {number} userId
 * @param {string} password
 * @return {*}
 */
export async function updatePassword(userId: number, password: string) {
  const user = await getUserData(userId)
  const encryptedPassword = genMd5EncryptedPassword(user.login_name, password, user.salt)
  const result = await prisma.sys_user.update({
    where: {
      user_id: userId,
    },
    data: {
      password: encryptedPassword,
    },
  })
  const success = result !== null
  return success
}

/**
 * @description: 校验密码
 * @param {sys_user} user
 * @param {string} password
 * @return {*}
 */
export function verifyPassword(userString: string, password: string) {
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
export async function verifyCard(userString: string, cardNumber: string) {
  const user = JSON.parse(userString) as sys_user

  const result = await prisma.rfid_card_user.findFirst({
    where: {
      // @ts-expect-error bigint
      Userid: user.user_id,
    },
    select: {
      CardData: true,
    },
  })

  const success = result.CardData === cardNumber
  return success
}
