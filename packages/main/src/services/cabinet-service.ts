import prisma from '@/prisma'
import { rfid_cabinet_door } from '@prisma/client'

const getCabinetData = async () => {
  const result = await prisma.rfid_cabinet.findFirst()
  return result
}

const getCabinetDoorList = async (): Promise<rfid_cabinet_door[]> => {
  const result = await prisma.rfid_cabinet_door.findMany()
  return result
}

const cabinetService = {
  name: 'cabinet' as const ,
  fns: {
    getCabinetData,
    getCabinetDoorList
  }
}

export default cabinetService

