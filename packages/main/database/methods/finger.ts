import { generateCurrentTime } from '@/utils'
import prisma from '@/prisma'

export const queryFingerByUserIdAndOrder = async (userId: number, order: FingerOrder) => {
  const record = await prisma.rfid_finger_user.findFirst({
    where: {
      USERID: userId,
      FINGERORDER: order
    }
  })

  return record
}

export const updateFingerByUserIdAndOrder = async (userId: number, order: FingerOrder, data: string) => {
  const result = await prisma.rfid_finger_user.updateMany({
    where: {
      USERID: userId,
      FINGERORDER: order
    },
    data: {
      FINGERDATA: data
    }
  })
  return result
}

export const addFinger = async (userId: number, order: FingerOrder, data: string) => {
  const result = await prisma.rfid_finger_user.create({
    data: {
      FINGERDATA: data,
      FINGERORDER: order,
      USERID: userId,
      CREATEDATE: generateCurrentTime()
    }
  })
  return result
}
