import type { RfidCabinet } from 'database'
import { getLocalIpAddress } from 'utils'
import { prisma } from 'database'

let currentCabinet: RfidCabinet | null = null

/**
 * @description: 获取本机 IP 对应的柜机信息
 * @return {*}
 */
async function getCurrentCabinet() {
  if (currentCabinet) return currentCabinet

  const devices = await getCabinetData()
  const ipList = getLocalIpAddress()

  currentCabinet = devices.find((item) => item.cabAddr && ipList.includes(item.cabAddr)) || null

  return currentCabinet
}

/**
 * @description: 获取所有柜机信息
 * @return {*}
 */
function getCabinetData() {
  return prisma.rfidCabinet.findMany()
}

/**
 * @description: 获取当前柜机所属的柜门信息
 * @return {*}
 */
function getCabinetDoors() {
  return prisma.rfidCabinetdoor.findMany({
    where: {
      cabinetId: currentCabinet?.id,
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

export { currentCabinet }
