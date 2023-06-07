import { generateCurrentTime } from '@/utils'
import { prisma } from '@/database'

export function queryFingerByUserIdAndOrder(userId: number, order: FingerOrder) {
  return prisma.rfid_finger_user.findFirst({
    where: {
      Userid: userId,
      order,
    },
  })
}

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
