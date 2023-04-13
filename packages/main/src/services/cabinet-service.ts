import prisma from '@/prisma'
import { rfid_cabinet_door } from '@prisma/client'

const getCabinetData = async () => {
  const data = await prisma.rfid_cabinet.findFirst()
  return data
}

const getCabinetDoorList = async (): Promise<rfid_cabinet_door[]> => {
  const data = await prisma.rfid_cabinet_door.findMany()
  return data
}

const cabinetService = {
  name: 'cabinet' as const ,
  fns: {
    getCabinetData,
    getCabinetDoorList
  }
}

export default cabinetService

