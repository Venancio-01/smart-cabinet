import type { SysUser } from 'database'
import { genResponseData } from 'utils'
import { prisma } from 'database'
import { genMd5EncryptedPassword } from './utils'

/**
 * @description: 获取用户信息
 * @param {number} userId
 * @return {*}
 */
export function getUserData(userId: number) {
  return prisma.sysUser.findUnique({
    where: {
      userId,
    },
  })
}

/**
 * @description: 获取所有用户
 * @return {*}
 */
export async function getUsers(): Promise<SysUser[]> {
  return await prisma.sysUser.findMany()
}

/**
 * @description: 根据条件获取用户
 * @param {UserQueryProps} { userName, departmentId, roleId }
 * @return {*}
 */
export async function getUsersByCondition({ userName, departmentId, roleId }: UserQueryProps): Promise<SysUser[]> {
  const query: Partial<{ [key in keyof SysUser]: any }> = {
    userName: {
      contains: userName,
    },
    deptId: departmentId ? Number(departmentId) : undefined,
  }

  if (roleId) {
    const userRoleList = await prisma.sysUserRole.findMany()
    const userIds = userRoleList.filter((item) => Number(item.roleId) === roleId).map((item) => item.userId)

    query.userId = {
      in: userIds,
    }
  }

  return prisma.sysUser.findMany({
    where: query,
  })
}

export async function onPasswordLogin({ username, password }: PasswordLoginProps) {
  const user = await prisma.sysUser.findFirst({
    where: {
      loginName: username,
    },
  })

  if (user === null) return genResponseData(false, '用户不存在')

  const encryptedPassword = genMd5EncryptedPassword(username, password, user.salt || '')
  if (user.password !== encryptedPassword) return genResponseData(false, '密码错误')
  return genResponseData(true, '登录成功', user)
}

export async function onCardLogin(cardNumber: string) {
  const result = await prisma.rfidCardUser.findFirst({
    where: {
      cardData: cardNumber,
    },
  })
  if (result === null) return genResponseData(false, '用户ID查找失败')

  const userId = result.userid
  if (!userId) return genResponseData(false, '用户查找失败')

  const user = await getUserData(userId)
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
  const user = await getUserData(userId)
  const encryptedPassword = genMd5EncryptedPassword(user.loginName, password, user.salt)
  const result = await prisma.sysUser.update({
    where: {
      userId,
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
export async function verifyCard(userString: string, cardNumber: string) {
  const user = JSON.parse(userString) as SysUser

  const result = await prisma.rfidCardUser.findFirst({
    where: {
      userid: Number(user.userId),
    },
    select: {
      cardData: true,
    },
  })

  const success = result.cardData === cardNumber
  return success
}

/**
 * @description: 更新卡号
 * @param {number} userId
 * @param {string} cardNumber
 * @return {*}
 */
export function updateCardNumber(userId: bigint, cardNumber: string) {
  return prisma.rfidCardUser.updateMany({
    where: {
      userid: Number(userId),
    },
    data: {
      cardData: cardNumber,
    },
  })
}
