import { prisma } from "@/database";
import { generateCurrentTime } from "@/utils";

/**
 * @description: 获取全部指纹用户数据
 * @return {*}
 */
export function queryFingerUsers() {
  return prisma.rfidFingerUser.findMany();
}

/**
 * @description: 获取指纹用户数据
 * @param {number} userId
 * @param {FingerOrder} order
 * @return {*}
 */
export function queryFingerByUserIdAndOrder(
  userId: number,
  order: FingerOrder
) {
  return prisma.rfidFingerUser.findFirst({
    where: {
      userid: userId,
      order,
    },
  });
}

/**
 * @description: 更新指纹用户数据
 * @param {number} userId
 * @param {FingerOrder} order
 * @param {string} data
 * @return {*}
 */
export function updateFingerByUserIdAndOrder(
  userId: number,
  order: FingerOrder,
  data: string
) {
  return prisma.rfidFingerUser.updateMany({
    where: {
      userid: userId,
      order,
    },
    data: {
      fingerData: data,
    },
  });
}

/**
 * @description: 添加指纹用户数据
 * @param {number} userId
 * @param {FingerOrder} order
 * @param {string} data
 * @return {*}
 */
export function addFinger(userId: number, order: FingerOrder, data: string) {
  return prisma.rfidFingerUser.create({
    data: {
      fingerData: data,
      order,
      userid: userId,
      createDate: generateCurrentTime(),
    },
  });
}
