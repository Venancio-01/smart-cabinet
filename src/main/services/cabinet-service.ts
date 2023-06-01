import type { rfid_cabinet_door } from '@prisma/client'
import prisma from '@/database'

async function getCabinetData() {
  const result = await prisma.rfid_cabinet.findFirst()
  return result
}

async function getCabinetDoorList(): Promise<rfid_cabinet_door[]> {
  const result = await prisma.rfid_cabinet_door.findMany()
  return result
}

const cabinetService = {
  name: 'cabinet' as const,
  fns: {
    getCabinetData,
    getCabinetDoorList,
  },
}

export default cabinetService
