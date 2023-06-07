import type { rfid_cabinet, rfid_cabinetdoor } from '@prisma/client'
import { prisma } from '@/database'
import { getLocalIpAddress } from '@/utils'

let currentCabinet: rfid_cabinet | null = null

async function getCurrentCabinet() {
  if (currentCabinet)
    return currentCabinet

  const devices = await getCabinetData()
  const ipList = getLocalIpAddress()

  currentCabinet = devices.find(item => item.cabAddr && ipList.includes(item.cabAddr)) || null

  return currentCabinet
}

function getCabinetData(): Promise<rfid_cabinet[]> {
  return prisma.rfid_cabinet.findMany()
}

function getCabinetDoors(): Promise<rfid_cabinetdoor[]> {
  return prisma.rfid_cabinetdoor.findMany({
    where: {
      CabinetId: currentCabinet.ID,
    },
  })
}

const cabinetService = {
  name: 'cabinet' as const,
  fns: {
    getCabinetData,
    getCabinetDoors,
    getCurrentCabinet,
  },
}

export default cabinetService
