import type { DoorEquipment } from '@smart-cabinet/database'
import { ipcMain } from 'electron'
import { equipmentList } from '@/services/access-door'
import Equipment from '@/services/rfid/equipment'
import { GPIIndex } from '~/enums'
import ipcNames from '#/ipcNames'

// RFID 连接实例
const equipmentMap: {
  [k in string]: Equipment
} = {}

/**
 * @description: 连接 RFID
 * @return {*}
 */
export async function connectRfid(equipment: DoorEquipment) {
  const { equipmentAddr: address, equipmentPort: port, equipmentTxid: txid } = equipment
  if (equipmentMap[address]) return

  const equipmentInstance = new Equipment({
    address,
    port: Number(port),
    data: equipment,
  })

  equipmentMap[address] = equipmentInstance

  // 连接 RFID Socket
  await equipmentInstance.connect()

  // 注册消息监听器
  equipmentInstance.startMessageListener()
  // 注册心跳检测
  equipmentInstance.startHeartBeat()
  // 设置 GPI1 触发
  equipmentInstance.handleSetGPITrigger(GPIIndex.ONE, txid)
  // 设置 GPI2 触发
  equipmentInstance.handleSetGPITrigger(GPIIndex.TWO, txid)
}

// 全部设备连接 RFID
export async function connectAllRfid() {
  equipmentList.forEach((equipment) => {
    connectRfid(equipment)
  })
}

/**
 * 断开 RFID 连接
 * @param {DoorEquipment} equipment
 * @return {*}
 */
export async function disconnectRfid(equipment: DoorEquipment) {
  equipmentMap?.[equipment.equipmentAddr ?? ''].socket.destroy()
  delete equipmentMap?.[equipment.equipmentAddr ?? '']
}

export function disconnectAllRfid() {
  equipmentList.forEach((equipment) => {
    disconnectRfid(equipment)
  })
}

/**
 * @description: 获取 RFID 连接状态
 * @param {DoorEquipment} equipment
 * @return {*}
 */
function getRfidConnectionStatus(equipmentAddr: string) {
  return equipmentMap?.[equipmentAddr ?? '']?.getSocketStatus() || false
}

export function registerRfidService() {
  ipcMain.handle(ipcNames.rfid.getRfidConnectionStatus, async (_, equipmentAddr: string) => {
    return getRfidConnectionStatus(equipmentAddr)
  })

  ipcMain.handle(ipcNames.rfid.handleSetGPO, (_, { addr, index, status }) => {
    equipmentMap[addr].handleSetGPO(index, status)
  })
}
