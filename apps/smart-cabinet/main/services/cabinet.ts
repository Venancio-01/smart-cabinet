import type { RfidCabinetProps } from '@smart-cabinet/database'
import { getLocalIpAddress } from '@smart-cabinet/utils'
import { selectRfidCabinetDoorList, selectRfidCabinetList } from '@smart-cabinet/database'

let currentCabinet: RfidCabinetProps | null = null

/**
 * @description: 获取本机 IP 对应的柜机信息
 * @return {*}
 */
export async function getCurrentCabinet() {
  if (currentCabinet) return currentCabinet

  const devices = await selectRfidCabinetList()
  const ipList = getLocalIpAddress()

  currentCabinet = devices.find(item => item.cabAddr && ipList.includes(item.cabAddr)) || null

  return currentCabinet
}

const cabinetService = {
  name: 'cabinet' as const,
  fns: {
    getCurrentCabinet,
    selectRfidCabinetDoorList,
  },
}

export default cabinetService

export { currentCabinet }
