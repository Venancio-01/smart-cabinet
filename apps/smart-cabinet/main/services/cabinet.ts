import type { RfidCabinet } from 'database'
import { getLocalIpAddress } from 'utils'
import { selectRfidCabinetDoorList, selectRfidCabinetList } from 'database'

let currentCabinet: RfidCabinet | null = null

/**
 * @description: 获取本机 IP 对应的柜机信息
 * @return {*}
 */
export async function getCurrentCabinet() {
  if (currentCabinet) return currentCabinet

  const devices = await selectRfidCabinetList()
  const ipList = getLocalIpAddress()

  currentCabinet = devices.find((item) => item.cabAddr && ipList.includes(item.cabAddr)) || null

  return currentCabinet
}

/**
 * @description: 获取当前柜机所属的柜门信息
 * @return {*}
 */
function getCabinetDoors() {
  return selectRfidCabinetDoorList({
    cabinetId: currentCabinet?.id,
  })
}

const cabinetService = {
  name: 'cabinet' as const,
  fns: {
    getCabinetDoors,
    getCurrentCabinet,
  },
}

export default cabinetService

export { currentCabinet }
