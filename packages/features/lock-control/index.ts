import { convertDecimalToBinary, generateLockCommand } from './utils'
import SerialPort from './serial-port'

// 串口实例
let lockControlInstance: SerialPort

/**
 * @description: 初始化锁控板连接
 * @param {string} path 串口路径
 * @return {*}
 */
export async function initLockControlConnection(path: string) {
  lockControlInstance = new SerialPort(path)

  await lockControlInstance.open()
  // 有时候串口打开后，需要关闭再打开一次
  // await lockControlInstance.close()
  // await lockControlInstance.open()
}

/**
 * @description: 销毁锁控板连接
 * @return {*}
 */
export async function destroyLockControlConnection() {
  lockControlInstance?.close()
}

/**
 * @description: 查询锁状态
 * @return {*}
 */
export function queryAllState() {
  const command = generateLockCommand('80010033')
  lockControlInstance?.write(command)
}

/**
 * @description: 开锁
 * @param {string} boardAddress 板地址，格式 01、02
 * @param {string} lockAddress 锁地址，格式 01、02
 * @return {*}
 */
export function open(boardAddress = '01', lockAddress = '01') {
  const command = generateLockCommand(`8a${boardAddress}${lockAddress}11`)
  lockControlInstance?.write(command)
}

interface LockControlStateProps {
  [x: number]: boolean
}

/**
 * @description: 获取门锁开启状态
 * @return {*}
 */
export function getOpenStatus(): null | LockControlStateProps {
  const COMMAND_HEADER = '8001'
  const MAX_LOCK_COUNT = 24
  const data = lockControlInstance?.getData()

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

  lockControlInstance?.setData('')

  return result
}
