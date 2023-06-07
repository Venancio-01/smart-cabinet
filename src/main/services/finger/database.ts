import { prisma } from '@/database'
import { generateCurrentTime } from '@/utils'

/**
 * @description: 获取全部指纹用户数据
 * @return {*}
 */
export function queryFingerUsers() {
  return prisma.rfid_finger_user.findMany()
}

/**
 * @description: 获取指纹用户数据
 * @param {number} userId
 * @param {FingerOrder} order
 * @return {*}
 */
export function queryFingerByUserIdAndOrder(userId: number, order: FingerOrder) {
  return prisma.rfid_finger_user.findFirst({
    where: {
      Userid: userId,
      order,
    },
  })
}

/**
 * @description: 更新指纹用户数据
 * @param {number} userId
 * @param {FingerOrder} order
 * @param {string} data
 * @return {*}
 */
export function updateFingerByUserIdAndOrder(userId: number, order: FingerOrder, data: string) {
  return prisma.rfid_finger_user.updateMany({
    where: {
      Userid: userId,
      order,
    },
    data: {
      FingerData: data,
    },
  })
}

/**
 * @description: 添加指纹用户数据
 * @param {number} userId
 * @param {FingerOrder} order
 * @param {string} data
 * @return {*}
 */
export function addFinger(userId: number, order: FingerOrder, data: string) {
  return prisma.rfid_finger_user.create({
    data: {
      FingerData: data,
      order,
      Userid: userId,
      CreateDate: generateCurrentTime(),
    },
  })
}
