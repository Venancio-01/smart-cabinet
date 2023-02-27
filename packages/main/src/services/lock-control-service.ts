import { convertDecimalToBinary, generateLockCommand } from '@/utils'
import SerialPort from '@/utils/serial-port'
import { SerialPort as SerialPortLib } from 'serialport'

// 串口实例
let instance: SerialPort | null = null
let connected = false

const lockControlService = {
  name: 'lockControl' as const,
  fns: {
    async getConnectState(path: string) {
      const list = await SerialPortLib.list()
      connected = Boolean(list.find(item => item.path === path))
      return connected
    },

    async init(path: string, baudRate: number) {
      if (instance) return

      if (!connected) {
        console.log('未连接锁控板，初始化失败')
        return
      }

      instance = new SerialPort({ path, baudRate })
      await instance.open()
      instance.close()
      await instance.open()
    },

    async close() {
      if (!instance) return

      instance.close()
    },

    /**
     * @description: 查询锁状态
     * @return {*}
     */
    queryAllState() {
      if (!instance) return false

      const command = generateLockCommand('80010033')
      instance.write(command)
    },

    /**
     * @description: 开锁
     * @param {string} boardAddress 板地址，格式 01、02
     * @param {string} lockAddress 锁地址，格式 01、02
     * @return {*}
     */
    open(boardAddress = '01', lockAddress = '01') {
      if (!instance) return false

      const command = generateLockCommand(`8a${boardAddress}${lockAddress}11`)
      instance.write(command)
    },

    /**
     * @description: 开启全部锁
     * @return {*}
     */
    openAll() {
      if (!instance) return false

      const command = generateLockCommand('8a010011')
      instance.write(command)
    },

    /**
     * @description: 获取门锁开启状态
     * @return {*}
     */
    getOpenStatus(): null | LockControlStateProps {
      if (!instance) {
        console.log('实例未初始化')
        return null
      }

      const COMMAND_HEADER = '8001'
      const MAX_LOCK_COUNT = 24
      const data = instance.getData()

      // 找出命令的返回结果
      const commandHeaderIndex = data.indexOf(COMMAND_HEADER)
      const commandBody = data.slice(commandHeaderIndex + COMMAND_HEADER.length, commandHeaderIndex + COMMAND_HEADER.length + 10)

      // 锁控板命令未接收完整
      if (commandBody.length < 10) return null

      // 最多一次查询 24 个锁的状态，分三组，每组 8 个锁，转化为 2 进制后格式为 00000001 ，0 代表开启，1 代表关闭
      //17 - 24 锁控状态
      const lockGroup_3 = convertDecimalToBinary(Number(commandBody.slice(0, 2)))
      // 9 - 16 锁控状态
      const lockGroup_2 = convertDecimalToBinary(Number(commandBody.slice(2, 4)))
      // 1 - 8 锁控状态
      const lockGroup_1 = convertDecimalToBinary(Number(commandBody.slice(4, 6)))

      const result = new Array(MAX_LOCK_COUNT).fill(0).reduce((acc, cur, index) => {
        const group = index < 8 ? lockGroup_1 : index < 16 ? lockGroup_2 : lockGroup_3
        const lockIndex = index < 8 ? index : index < 16 ? index - 8 : index - 16
        acc[index + 1] = group[lockIndex] === '0'

        return acc
      }, {})

      instance.setData('')

      return result
    }
  }
}

export default lockControlService
