import { generateCurrentTime } from '@/utils'
import prisma from '@/database'

export async function queryFingerByUserIdAndOrder(userId: number, order: FingerOrder) {
  const result = await prisma.rfid_finger_user.findFirst({
    where: {
      user_id: userId,
      order,
    },
  })
  return result
}

export async function updateFingerByUserIdAndOrder(userId: number, order: FingerOrder, data: string) {
  const result = await prisma.rfid_finger_user.updateMany({
    where: {
      user_id: userId,
      order,
    },
    data: {
      data,
    },
  })
  return result
}

export async function addFinger(userId: number, order: FingerOrder, data: string) {
  const result = await prisma.rfid_finger_user.create({
    data: {
      data,
      order,
      user_id: userId,
      createdate: generateCurrentTime(),
    },
  })
  return result
}
