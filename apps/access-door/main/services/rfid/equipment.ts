import { Socket } from 'net'
import type { Buffer } from 'buffer'
import { error, info, warn } from '@smart-cabinet/common'
import { INTERVAL_THRESHOLD, sendIpcToRenderer } from '@smart-cabinet/utils'
import type { DoorAlarmrecord, DoorEquipment } from '@smart-cabinet/database'
import { insertDoorAlarmrecordList } from '@smart-cabinet/database'
import { isSingleEquipmentMode } from '../access-door'
import type { Message } from './message'
import { MessageQueue } from './message'
import { generateCheckConnectionStatusCommand, generateSetGPOCommand, generteSetGPITriggerCommand } from './command'
import { generateAntennaCommand } from './utils'
import { debouncedSelectRfidRegisterRecord, filterAbnormalCarrier, getInDatabaseCarrier, insertRfidRecordList, parseData, validateReceivedData } from '@/services/rfid/data'
import type { GPIIndex } from '~/enums'
import { AccessDirection, GPOIndex, OperationStatus } from '~/enums'

export default class Equipment {
  data: DoorEquipment
  address = ''
  port = 8160
  socket: Socket | null = null
  // 消息队列
  messageQueue: MessageQueue = new MessageQueue()
  connected = false
  heartbeatCount = 0

  GPI1StartMsg: Message | null = null
  GPI2StartMsg: Message | null = null
  GPIEndMessage: Message | null = null

  // 是进门
  isEnter = false
  // 是出门
  isDepart = false

  constructor(option: { address: string, port: number, data: DoorEquipment }) {
    this.address = option.address
    this.port = option?.port
    this.data = option.data
  }

  async connect() {
    this.socket = new Socket()

    // 设置超时时间
    this.socket.setTimeout(10 * 1000)

    await new Promise<void>((resolve, reject) => {
      this.socket!.on('connect', () => {
        info('socket 连接成功')
        this.connected = true
        resolve()
      })

      this.socket.on('timeout', () => {
        error('socket 连接超时')
        this.socket?.destroy()
        reject(new Error('socket 连接超时'))
      })

      this.socket?.on('close', () => {
        info('关闭 socket 连接')
        this.connected = false
        reject(new Error('socket 连接关闭'))
      })

      this.socket?.on('error', (err) => {
        error(`socket 出错：${err.message} | ${err.stack} | ${err.name}`)
        this.socket?.destroy()
      })

      this.socket?.on('data', (data) => {
        const toHexData = data.toString('hex')

        const { name, content, time } = parseData(toHexData)

        // 心跳包不做处理
        if (name === 'HeartBeat') return
        // 未知数据不做处理
        if (name === '未知') return

        // 是验证有效的
        const isValid = validateReceivedData(toHexData)
        if (!isValid) warn(`validate failed - name:${name} content:${toHexData}`)

        this.messageQueue?.push({ name, content, time, isValid })
        // info(`receive - name: ${name} content:${content}`)
      })

      this.socket?.connect(this.port, this.address)
    })
  }

  // 获取 socket 连接状态
  getSocketStatus() {
    return this.connected
  }

  destroy() {
    if (!this.socket) return

    this.socket.destroy()
  }

  write(data: Buffer) {
    if (!this.socket) return

    const { name, content } = parseData(data.toString('hex'))

    if (name !== 'HeartBeat' && name !== '未知') info(`send - name: ${name} content:${content}`)

    this.socket.write(data)
  }

  // 开始消息监听
  startMessageListener() {
    this.messageQueue.on<[Message]>('push', async (msg) => {
      // 开始触发红外
      if (msg.name === 'ReceiveGPITriggerStartReport') {
        this.handleReceiveGPITriggerStartReport(msg)
      }

      // 触发红外结束
      else if (msg.name === 'ReceiveGPITriggerStopReport') {
        this.handleReceiveGPITriggerStopReport(msg)
      }

      // 读到 EPC 标签
      else if (msg.name === 'ReceiveEPCReport') {
        this.handleReceiveEPCReport(msg)
      }
    })
  }

  // 处理读到 GPI 开始触发的上报
  async handleReceiveGPITriggerStartReport(msg: Message) {
    // 如果已经触发过 GPI1 或 GPI2，则跳过
    if (this.isEnter || this.isDepart) return

    console.log('handleReceiveGPITriggerStartReport')

    const command = msg.content
    const isGPI1Triggered = command.slice(14, 16) === '00'
    const isGPI2Triggered = command.slice(14, 16) === '01'

    // const isGPI1 = command.slice(14, 16) === '01'
    // const isGPI2 = command.slice(14, 16) === '00'

    // GPI1 触发
    if (isGPI1Triggered) {
      this.GPI1StartMsg = msg
      this.isDepart = true
      // 重置状态
      setTimeout(() => {
        this.isDepart = false
      }, INTERVAL_THRESHOLD)
    }

    // GPI2 触发
    if (isGPI2Triggered) {
      this.GPI2StartMsg = msg
      this.isEnter = true
      // 重置状态
      setTimeout(() => {
        this.isEnter = false
      }, INTERVAL_THRESHOLD)
    }

    // 出入方向
    const accessDirection = this.isEnter ? AccessDirection.IN : this.isDepart ? AccessDirection.OUT : null
    // 跳转到检查页面
    if (!isSingleEquipmentMode) sendIpcToRenderer('go-check-page', accessDirection)
    sendIpcToRenderer('go-check-page', accessDirection)
  }

  // 处理读到 GPI 停止触发的上报
  async handleReceiveGPITriggerStopReport(msg: Message) {
    if (!this.isEnter && !this.isDepart) return

    console.log('handleReceiveGPITriggerStopReport')

    this.GPIEndMessage = msg

    // 获取在红外触发期间读到的数据
    const recentMessages = this.isDepart ? this.messageQueue.getMessagesByTimeRange(this.GPI1StartMsg!.time, this.GPIEndMessage!.time) : this.messageQueue.getMessagesByTimeRange(this.GPI2StartMsg!.time, this.GPIEndMessage!.time)

    // 获取在数据库中登记的载体
    const carriers = await getInDatabaseCarrier(recentMessages)

    // 如果没有读到数据库中登记过的载体，则跳过
    if (carriers.length === 0) {
      if (isSingleEquipmentMode) sendIpcToRenderer('get-read-data', this.data, [])
      return
    }

    // 获取载体登记记录
    const registrationCarrierRecordList = await debouncedSelectRfidRegisterRecord()

    // 如果是外出状态
    if (this.isDepart) {
      // 筛选登记状态异常的载体
      const { unregisteredCarrierList, approvalFailedCarrierList, expiredCarrier } = filterAbnormalCarrier(
        carriers,
        registrationCarrierRecordList,
      )

      // 获取状态异常的载体
      const abnormalCarrierList = [...unregisteredCarrierList, ...approvalFailedCarrierList, ...expiredCarrier]

      // 生成报警记录
      const alarmRecordList: Partial<DoorAlarmrecord>[] = abnormalCarrierList.map((carrier) => {
        return {
          equipmentId: `${this.data.equipmentid}`,
          equipmentName: this.data.equipmentName,
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
      console.log('🚀 - Equipment - handleReceiveGPITriggerStopReport - hasUnregisteredCarrier:', hasUnregisteredCarrier)
      hasUnregisteredCarrier && (await insertDoorAlarmrecordList(alarmRecordList))

      const dataList = await insertRfidRecordList(
        this.data,
        carriers,
        registrationCarrierRecordList,
        AccessDirection.OUT,
        alarmRecordList,
      )

      if (isSingleEquipmentMode) sendIpcToRenderer('get-read-data', this.data, dataList)
      else sendIpcToRenderer('go-alarm-multiple-page', this.data, alarmRecordList)
    }

    // 如果是进入状态
    if (this.isEnter) {
      const dataList = await insertRfidRecordList(this.data, carriers, registrationCarrierRecordList, AccessDirection.IN, [])
      if (!isSingleEquipmentMode) sendIpcToRenderer('get-read-data', this.data, dataList)
    }
  }

  // 处理读到 EPC 标签的上报
  async handleReceiveEPCReport(msg: Message) {
    // 如果是进入状态，则跳过
    if (this.isEnter) return

    console.log('handleReceiveEPCReport')

    // 获取在数据库中登记的载体以及登记记录
    const [carriers, registrationCarrierRecordList] = await Promise.all([
      getInDatabaseCarrier([msg]),
      debouncedSelectRfidRegisterRecord(),
    ])

    // 如果没有读到数据库中登记过的载体，则跳过
    if (carriers.length === 0 || registrationCarrierRecordList.length === 0) return

    // 获取已登记的载体
    const registerCarrierList = registrationCarrierRecordList.map(item => item.docRfid)
    // 是否有未登记的载体
    const hasUnregistered = carriers.some(carrier => !registerCarrierList.includes(carrier.docRfid))

    if (hasUnregistered) {
      this.handleSetGPO(GPOIndex.ONE, true)
      if (isSingleEquipmentMode) sendIpcToRenderer('go-alarm-page')
    }
  }

  // 心跳检测
  startHeartBeat() {
    const maxCount = 10000
    setInterval(() => {
      const count = this.heartbeatCount || 0
      const command = generateCheckConnectionStatusCommand(count)
      this.write(command)

      if (count >= maxCount) {
        this.heartbeatCount = 0
      }
      else {
        this.heartbeatCount++
      }
    }, 5 * 1000)
  }

  // 设置 GPO 触发
  handleSetGPO(index: GPOIndex, status: boolean) {
    const command = generateSetGPOCommand(index, status)
    this.write(command)
  }

  // 设置 GPI 触发
  handleSetGPITrigger(index: GPIIndex, antennaIds: string) {
    const antennaIdList = antennaIds.split(',').map(item => Number(item))
    const triggerCommand = `000102100008${generateAntennaCommand(antennaIdList)}01020006`
    const command = generteSetGPITriggerCommand(index, triggerCommand)

    this.write(command)
  }
}
