import { insertDoorAlarmrecordList } from 'database'
import type { DoorAlarmrecord, DoorEquipment } from 'database'
import { sendIpcToRenderer } from 'utils/electron'
import { INTERVAL_THRESHOLD } from 'utils/config/main'
import { isControlEquipment } from '../access-door'
import { generateAntennaCommand } from './utils'
import { generateCheckConnectionStatusCommand, generateSetGPOCommand, generteSetGPITriggerCommand } from './command'
import type { Message } from './message'
import { MessageQueue } from './message'
import { debouncedSelectRfidRegisterRecord, filterAbnormalCarrier, getInDatabaseCarrier, insertRfidRecordList } from './data'
import Socket from '@/services/rfid/socket'
import type { GPOIndex } from '~/enums'
import { AccessDirection, GPIIndex, OperationStatus } from '~/enums'

type InstanceType = {
  [k in string]: {
    socket: Socket
    messageQueue: MessageQueue
  }
}

const instance: InstanceType = {}

/**
 * @description: 连接 RFID
 * @return {*}
 */
export async function connectRfid(equipment: DoorEquipment) {
  const { equipmentAddr: address, equipmentPort: port, equipmentTxid: txid } = equipment
  if (address === null || port === null || txid === null) return

  if (instance[address]) return

  const messageQueue = new MessageQueue()
  const socket = new Socket({
    address,
    port: Number(port),
    message: messageQueue,
  })

  instance[address] = {
    messageQueue,
    socket,
  }

  // 连接 RFID Socket
  await socket.connect()
  // 注册心跳检测
  registerHeartbeatCheck(equipment)
  // 设置 GPI1 触发
  handleSetGPITrigger(equipment, GPIIndex.ONE, txid)
  // 设置 GPI2 触发
  handleSetGPITrigger(equipment, GPIIndex.TWO, txid)
  // 注册消息监听器
  registerMessageListerner(equipment, messageQueue)
}

/**
 * 断开 RFID 连接
 * @param {DoorEquipment} equipment
 * @return {*}
 */
export async function disconnectRfid(equipment: DoorEquipment) {
  instance?.[equipment.equipmentAddr ?? ''].socket.destroy()
  delete instance?.[equipment.equipmentAddr ?? '']
}

/**
 * @description: 获取 RFID 连接状态
 * @param {DoorEquipment} equipment
 * @return {*}
 */
function getRfidConnectionStatus(equipment: DoorEquipment) {
  return instance?.[equipment.equipmentAddr ?? '']?.socket.connected || false
}

/**
 * @description: 注册心跳检测
 * @param {DoorEquipment} equipment
 * @return {*}
 */
function registerHeartbeatCheck(equipment: DoorEquipment) {
  setInterval(() => {
    const socket = instance?.[equipment.equipmentAddr ?? '']?.socket

    const count = socket?.heartbeatCount || 0
    const command = generateCheckConnectionStatusCommand(count)
    socket?.write(command)

    socket && socket.heartbeatCount++
  }, 5 * 1000)
}

/**
 * @description: 配置 GPO 状态
 * @param {DoorEquipment} equipment
 * @param {GPOIndexType} GPOIndex
 * @param {boolean} status
 * @return {*}
 */
export function handleSetGPO(equipment: DoorEquipment, index: GPOIndex, status: boolean) {
  const command = generateSetGPOCommand(index, status)

  instance?.[equipment.equipmentAddr ?? '']?.socket?.write(command)
}

/**
 * @description: 配置 GPI 触发
 * @param {DoorEquipment} equipment
 * @param {GPIIndexType} GPIIndex
 * @param {number} antennaIds
 * @return {*}
 */
function handleSetGPITrigger(equipment: DoorEquipment, index: GPIIndex, antennaIds: string) {
  const antennaIdList = antennaIds.split(',').map((item) => Number(item))
  const triggerCommand = `000102100008${generateAntennaCommand(antennaIdList)}01020006`
  const command = generteSetGPITriggerCommand(index, triggerCommand)

  instance?.[equipment.equipmentAddr ?? '']?.socket?.write(command)
}

/**
 * @description: 注册消息监听器
 * @param {string} address
 * @param {MessageQueue} message
 * @return {*}
 */

let GPI1Start: Message | null = null
let GPI2Start: Message | null = null
let GPIEnd: Message | null = null
let isEntry = false
let isExit = false

export async function registerMessageListerner(equipment: DoorEquipment, message: MessageQueue) {
  message.on<[Message]>('push', async (msg) => {
    // 开始触发红外
    if (msg.name === 'ReceiveGPITriggerStartReport') {
      // 如果已经触发过 GPI1 或 GPI2，则跳过
      if (isEntry || isExit) return

      const command = msg.content
      const isGPI1 = command.slice(14, 16) === '00'
      const isGPI2 = command.slice(14, 16) === '01'

      if (isGPI1) {
        GPI1Start = msg
        isExit = true
        // 重置状态
        setTimeout(() => {
          isExit = false
        }, INTERVAL_THRESHOLD)
      }

      if (isGPI2) {
        GPI2Start = msg
        isEntry = true
        // 重置状态
        setTimeout(() => {
          isEntry = false
        }, INTERVAL_THRESHOLD)
      }

      // 出入方向
      const accessDirection = isEntry ? AccessDirection.IN : isExit ? AccessDirection.OUT : null

      // 跳转到检查页面
      if (!isControlEquipment) sendIpcToRenderer('go-check-page', accessDirection)
    }
    // 触发红外结束
    else if (msg.name === 'ReceiveGPITriggerStopReport') {
      if (!isEntry && !isExit) return

      GPIEnd = msg

      // 获取在红外触发期间读到的数据
      const recentMessages = isExit
        ? message.getMessages('ReceiveEPCReport').filter((item) => item.time > GPI1Start!.time && item.time < GPIEnd!.time)
        : message.getMessages('ReceiveEPCReport').filter((item) => item.time > GPI2Start!.time && item.time < GPIEnd!.time)

      // 获取在数据库中登记的载体
      const carriers = await getInDatabaseCarrier(recentMessages)

      // 如果没有读到数据库中登记过的载体，则跳过
      if (carriers.length === 0) {
        if (!isControlEquipment) sendIpcToRenderer('get-read-data', equipment, [])
        return
      }
      // 获取载体登记记录
      const registrationCarrierRecordList = await debouncedSelectRfidRegisterRecord()

      // 如果是外出状态
      if (isExit) {
        // 筛选登记状态异常的载体
        const { unregisteredCarrierList, approvalFailedCarrierList, expiredCarrier } = filterAbnormalCarrier(
          carriers,
          registrationCarrierRecordList,
        )
        const abnormalCarrierList = [...unregisteredCarrierList, ...approvalFailedCarrierList, ...expiredCarrier]

        // 生成报警记录
        const alarmRecordList: Partial<DoorAlarmrecord>[] = abnormalCarrierList.map((carrier) => {
          return {
            equipmentId: `${equipment.equipmentid}`,
            equipmentName: equipment.equipmentName,
            carrierId: `${carrier.docId}`,
            carrierRfid: carrier.docRfid,
            carrierName: carrier.docName,
            carrierDeptid: carrier.deptId,
            carrierDeptName: carrier?.department?.deptName,
            carrierType: `${carrier.docType}`,
            isOperation: `${OperationStatus.UNPROCESSED}`,
            remark: '',
            createTime: new Date(),
          }
        })

        // 是否有状态异常的载体
        const hasUnregisteredCarrier = abnormalCarrierList.length > 0
        hasUnregisteredCarrier && (await insertDoorAlarmrecordList(alarmRecordList))

        const dataList = await insertRfidRecordList(
          equipment,
          carriers,
          registrationCarrierRecordList,
          AccessDirection.OUT,
          alarmRecordList,
        )
        if (isControlEquipment) sendIpcToRenderer('go-alarm-multiple-page', equipment, alarmRecordList)
        else sendIpcToRenderer('get-read-data', equipment, dataList)
      }

      // 如果是进入状态
      if (isEntry) {
        const dataList = await insertRfidRecordList(equipment, carriers, registrationCarrierRecordList, AccessDirection.IN, [])
        if (!isControlEquipment) sendIpcToRenderer('get-read-data', equipment, dataList)
      }
    }
    // 读到 EPC 标签
    else if (msg.name === 'ReceiveEPCReport') {
      // 如果是进入状态，则跳过
      if (!isExit) return

      // 获取在数据库中登记的载体以及登记记录
      const [carriers, registrationCarrierRecordList] = await Promise.all([
        getInDatabaseCarrier([msg]),
        debouncedSelectRfidRegisterRecord(),
      ])
      if (carriers.length === 0 || registrationCarrierRecordList.length === 0) return

      const registerCarrierList = registrationCarrierRecordList.map((item) => item.docRfid)
      const hasUnregistered = carriers.some((carrier) => !registerCarrierList.includes(carrier.docRfid))

      if (hasUnregistered) {
        handleSetGPO(equipment, 1, true)
        if (!isControlEquipment) sendIpcToRenderer('go-alarm-page')
      }
    }
  })
}

const rfidService = {
  name: 'rfid' as const,
  fns: {
    getRfidConnectionStatus,
    handleSetGPO,
  },
}

export default rfidService
