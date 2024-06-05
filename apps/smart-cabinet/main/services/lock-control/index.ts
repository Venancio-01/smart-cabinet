import { SerialPort as SerialPortLib } from 'serialport'
import { ipcMain } from 'electron'
import { info } from '@smart-cabinet/common'
import { currentCabinet } from '../cabinet'
import { convertDecimalToBinary, generateLockCommand, setPermissions } from './utils'
import SerialPort from './serial-port'

// 串口实例
let instance: SerialPort
let connected = false

/**
 * @description: 获取串口连接状态
 * @param {string} path
 * @return {*}
 */
async function getConnectState() {
  const COMPort = currentCabinet?.openDoor || ''
  if (COMPort === '') {
    connected = false
  }
  else {
    const list = await SerialPortLib.list()
    connected = !!list.find(item => item.path.includes(COMPort))
  }

  return connected
}

async function init(path: string) {
  if (instance) return

  await setPermissions()

  if (!connected) {
    info('未连接锁控板')
    return
  }

  instance = new SerialPort(path)
  await instance.open()
  await instance.close()
  await instance.open()
}

async function close() {
  instance?.close()
}

/**
 * @description: 查询锁状态
 * @return {*}
 */
function queryAllState() {
  const command = generateLockCommand('80010033')
  instance?.write(command)
}

/**
 * @description: 开锁
 * @param {string} boardAddress 板地址，格式 01、02
 * @param {string} lockAddress 锁地址，格式 01、02
 * @return {*}
 */
function open(boardAddress = '01', lockAddress = '01') {
  const command = generateLockCommand(`8a${boardAddress}${lockAddress}11`)
  // instance?.write(command)
  console.log('🚀 - open - command:', command)
}

open()

/**
 * @description: 获取门锁开启状态
 * @return {*}
 */
function getOpenStatus(): null | LockControlStateProps {
  const COMMAND_HEADER = '8001'
  const MAX_LOCK_COUNT = 24
  const data = instance?.getData()

  // 找出命令的返回结果
  const commandHeaderIndex = data.indexOf(COMMAND_HEADER)
  const commandBody = data.slice(commandHeaderIndex + COMMAND_HEADER.length, commandHeaderIndex + COMMAND_HEADER.length + 10)

  // 锁控板命令未接收完整
  if (commandBody.length < 10) return null

  // 最多一次查询 24 个锁的状态，分三组，每组 8 个锁，转化为 2 进制后格式为 00000001 ，0 代表开启，1 代表关闭
  // 17 - 24 锁控状态
  const lockGroup_3 = convertDecimalToBinary(Number(commandBody.slice(0, 2)))
  // 9 - 16 锁控状态
  const lockGroup_2 = convertDecimalToBinary(Number(commandBody.slice(2, 4)))
  // 1 - 8 锁控状态
  const lockGroup_1 = convertDecimalToBinary(Number(commandBody.slice(4, 6)))

  const result = Array.from({ length: MAX_LOCK_COUNT }).fill(0).reduce<LockControlStateProps>((acc, cur, index) => {
    const group = index < 8 ? lockGroup_1 : index < 16 ? lockGroup_2 : lockGroup_3
    const lockIndex = index < 8 ? index : index < 16 ? index - 8 : index - 16
    acc[index + 1] = group[lockIndex] === '0'

    return acc
  }, {})

  instance?.setData('')

  return result
}

export function registerLockControlModule() {
  ipcMain.handle('lock-control:get-connection-state', async () => {
    return await getConnectState()
  })

  ipcMain.on('lock-control:init', async (_event, path: string) => {
    await init(path)
  })

  ipcMain.handle('lock-control:close', async () => {
    await close()
  })

  ipcMain.on('lock-control:query-all-state', () => {
    queryAllState()
  })

  ipcMain.on('lock-control:open', (_event, boardAddress: string, lockAddress: string) => {
    open(boardAddress, lockAddress)
  })

  ipcMain.handle('lock-control:get-open-status', async () => {
    return await getOpenStatus()
  })
}
