import type { Prisma } from '.'
import { prisma } from '.'

/**
 * @description: 查询指纹用户列表
 * @return {*}
 */
export function selectRfidFingerUserList() {
  return prisma.rfidFingerUser.findMany()
}

/**
 * @description: 查询指纹用户列表
 * @return {*}
 */
export function selectRfidFingerUser(condition?: Prisma.RfidFingerUserWhereInput) {
  return prisma.rfidFingerUser.findFirst({
    where: condition,
  })
}

/**
 * @description: 新增指纹用户
 * @param {Partial} data
 * @return {*}
 */
export function insertRfidFingerUser(data: Prisma.RfidFingerUserCreateInput) {
  return prisma.rfidFingerUser.create({
    data,
  })
}

/**
 * @description: 更新指纹用户
 * @param {Partial} condition
 * @param {Partial} data
 * @return {*}
 */
export function updateRfidFingerUser(condition: Prisma.RfidFingerUserWhereInput, data: Prisma.RfidFingerUserCreateInput) {
  return prisma.rfidFingerUser.updateMany({
    where: condition,
    data,
  })
}
