import type { Prisma, RfidCardUser } from '.'
import { prisma } from '.'

/**
 * @description: 获取卡片用户列表
 * @return {*}
 */
export function selectRfidCardUserList() {
  return prisma.rfidCardUser.findMany()
}

/**
 * @description: 获取卡片用户
 * @param {Partial} condition
 * @return {*}
 */
export function selectRfidCardUser(condition: Prisma.RfidCardUserWhereInput) {
  return prisma.rfidCardUser.findFirst({
    where: condition,
  })
}

/**
 * @description: 更新卡片用户
 * @param {Partial} condition
 * @param {Partial} data
 * @return {*}
 */
export function updateRfidCardUser(condition: Prisma.RfidCardUserWhereInput, data: Partial<RfidCardUser>) {
  return prisma.rfidCardUser.updateMany({
    where: condition,
    data,
  })
}
