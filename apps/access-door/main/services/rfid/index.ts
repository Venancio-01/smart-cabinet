import { insertDoorAccessRecord, insertDoorAlarmrecordList, selectDoorRfidregisterList } from 'database'
import type { DoorAccessRecords, DoorAlarmrecord, DoorEquipment } from 'database'
import { sendIpcToRenderer } from 'utils/electron'
import { INTERVAL_THRESHOLD } from 'utils/config/main'
import { getCurrentEquipment, updateAccessRecord } from '../access-door'
import { generateAntennaCommand } from './utils'
import { generateCheckConnectionStatusCommand, generateSetGPOCommand, generteSetGPITriggerCommand } from './command'
import type { Message } from './message'
import { MessageQueue } from './message'
import { getInDatabaseCarrier, insertRfidRecordList } from './data'
import Socket from '@/services/rfid/socket'
import { AccessDirection, AlarmStatus, OperationStatus } from '~/enums'

type InstanceType = {
  socket: Socket
  messageQueue: MessageQueue
} | null

let instance: InstanceType = null

/**
 * @description: 连接 RFID
 * @return {*}
 */
export async function connectRfid() {
  if (instance !== null) return

  const currentEquipment = await getCurrentEquipment()
  if (currentEquipment === null) return

  const { equipmentAddr: address, equipmentPort: port, equipmentTxid: txid } = currentEquipment
  if (address === null || port === null || txid === null) return

  const messageQueue = new MessageQueue()
  const socket = new Socket({
    address,
    port: Number(port),
    message: messageQueue,
  })

  instance = {
    messageQueue,
    socket,
  }

  // 连接 RFID Socket
  await socket.connect()
  // 注册心跳检测
  registerHeartbeatCheck()
  // 设置 GPI1 触发
  handleSetGPITrigger(0, txid)
  // 设置 GPI2 触发
  handleSetGPITrigger(1, txid)
  // 注册消息监听器
  registerMessageListerner(currentEquipment, messageQueue)
}

/**
 * 断开 RFID 连接
 * @return {*}
 */
export async function disconnectRfid() {
  if (instance === null) return

  instance.socket.destroy()
  instance = null
}

function getRfidConnectionStatus() {
  return instance?.socket.connected || false
}

/**
 * @description: 注册心跳检测
 * @param {string} address
 * @param {number} count
 * @return {*}
 */
function registerHeartbeatCheck() {
  setInterval(() => {
    if (instance === null) return

    const count = instance.socket.heartbeatCount || 0
    const command = generateCheckConnectionStatusCommand(count)
    instance.socket.write(command)

    instance.socket.heartbeatCount++
  }, 5 * 1000)
}

/**
 * @description: 配置 GPO 状态
 * @param {string} address
 * @param {boolean} status
 * @return {*}
 */
export function handleSetGPO(GPOIndex: GPOIndexType, status: boolean) {
  if (!instance) return

  const command = generateSetGPOCommand(GPOIndex, status)

  instance.socket.write(command)
}

/**
 * @description: 配置 GPI 触发
 * @param {string} address
 * @param {number} antennaIds
 * @return {*}
 */
function handleSetGPITrigger(GPIIndex: GPIIndexType, antennaIds: string) {
  if (!instance) return

  const antennaIdList = antennaIds.split(',').map((item) => Number(item))
  const triggerCommand = `000102100008${generateAntennaCommand(antennaIdList)}01020006`
  const command = generteSetGPITriggerCommand(GPIIndex, triggerCommand)

  instance.socket.write(command)
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
let currentAccessRecord: DoorAccessRecords | null = null

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
          currentAccessRecord = null
        }, INTERVAL_THRESHOLD)
      }

      if (isGPI2) {
        GPI2Start = msg
        isEntry = true
        // 重置状态
        setTimeout(() => {
          isEntry = false
          currentAccessRecord = null
        }, INTERVAL_THRESHOLD)
      }

      // 出入方向
      const accessDirection = isEntry ? AccessDirection.IN : isExit ? AccessDirection.OUT : null

      const record: Partial<DoorAccessRecords> = {
        accessDirection,
        directionCreateTime: new Date(),
        equipmentId: equipment.equipmentid,
        equipmentName: equipment.equipmentName,
        remark: '',
      }

      // 新增出入记录
      currentAccessRecord = await insertDoorAccessRecord(record)

      // 跳转到检查页面
      sendIpcToRenderer('go-check-page', accessDirection)
    }
    // 触发红外结束
    else if (msg.name === 'ReceiveGPITriggerStopReport') {
      if (!isEntry && !isExit) return

      // 如果没有出入记录数据，则跳过
      if (currentAccessRecord === null) return

      GPIEnd = msg

      // 获取在红外触发期间读到的数据
      const recentMessages = isExit
        ? message.getMessages('ReceiveEPCReport').filter((item) => item.time > GPI1Start!.time && item.time < GPIEnd!.time)
        : message.getMessages('ReceiveEPCReport').filter((item) => item.time > GPI2Start!.time && item.time < GPIEnd!.time)

      // 获取在数据库中登记的载体
      const carriers = await getInDatabaseCarrier(recentMessages)

      // 如果没有读到数据库中登记过的载体，则跳过
      if (carriers.length === 0) {
        sendIpcToRenderer('get-read-data', [])
        return
      }
      // 获取载体登记记录
      const registrationCarrierRecordList = await selectDoorRfidregisterList()

      // 如果是外出状态
      if (isExit) {
        const dataList = await insertRfidRecordList(carriers, registrationCarrierRecordList, AccessDirection.OUT, AlarmStatus.UNALARMED)
        sendIpcToRenderer('get-read-data', dataList)

        // 筛选未登记的载体
        const unregisteredCarrierList = carriers.filter(
          (carrier) => !registrationCarrierRecordList.some((item) => item.docRfid === carrier.docRfid),
        )
        // 是否有未登记的载体
        const hasUnregisteredCarrier = unregisteredCarrierList.length > 0

        if (hasUnregisteredCarrier) {
          const list: Partial<DoorAlarmrecord>[] = unregisteredCarrierList.map((carrier) => {
            return {
              equipmentId: `${equipment.equipmentid}`,
              equipmentName: equipment.equipmentName,
              carrierId: `${carrier.docId}`,
              carrierRfid: carrier.docRfid,
              carrierName: carrier.docName,
              carrierDeptid: `${carrier.deptId}`,
              carrierDeptname: carrier.department.deptName,
              carrierType: `${carrier.docType}`,
              isOperation: `${OperationStatus.UNPROCESSED}`,
              remark: '',
              createTime: new Date(),
            }
          })
          insertDoorAlarmrecordList(list)
        }
      }

      // 如果是进入状态
      if (isEntry) {
        const dataList = await insertRfidRecordList(carriers, registrationCarrierRecordList, AccessDirection.IN, AlarmStatus.UNALARMED)
        sendIpcToRenderer('get-read-data', dataList)

        const updateData = {
          ...currentAccessRecord,
          carrier_count: carriers.length,
        }
        updateAccessRecord(currentAccessRecord.accessId, updateData)
      }
    }
    // 读到 EPC 标签
    else if (msg.name === 'ReceiveEPCReport') {
      // 如果是进入状态，则跳过
      if (!isExit) return

      // 获取在数据库中登记的载体以及登记记录
      const [carriers, registrationCarrierRecordList] = await Promise.all([getInDatabaseCarrier([msg]), selectDoorRfidregisterList()])
      if (carriers.length === 0 || registrationCarrierRecordList.length === 0) return

      const registerCarrierList = registrationCarrierRecordList.map((item) => item.docRfid)
      const hasUnregistered = carriers.some((carrier) => !registerCarrierList.includes(carrier.docRfid))

      if (hasUnregistered) sendIpcToRenderer('go-alarm-page')
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
