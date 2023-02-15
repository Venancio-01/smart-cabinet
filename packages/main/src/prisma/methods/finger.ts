import { generateCurrentTime } from '@/utils'
import prisma from '@/prisma'

export const queryFingerByUserIdAndOrder = async (userId: number, order: FingerOrder) => {
  const record = await prisma.rfid_finger_user.findFirst({
    where: {
      user_id: userId,
      order: order
    }
  })

  return record
}

export const updateFingerByUserIdAndOrder = async (userId: number, order: FingerOrder, data: string) => {
  const result = await prisma.rfid_finger_user.updateMany({
    where: {
      user_id: userId,
      order: order
    },
    data: {
      data: data
    }
  })
  return result
}

export const addFinger = async (userId: number, order: FingerOrder, data: string) => {
  const result = await prisma.rfid_finger_user.create({
    data: {
      data: data,
      order: order,
      user_id: userId,
      createdate: generateCurrentTime()
    }
  })
  return result
}
