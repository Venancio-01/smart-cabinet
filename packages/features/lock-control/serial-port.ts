import type { Buffer } from 'buffer'
import { error, info } from '@smart-cabinet/common'
import { SerialPort as SerialPortLib } from 'serialport'

export default class SerialPort {
  private portInstance: null | SerialPortLib = null
  private data = ''

  constructor(path: string) {
    this.portInstance = new SerialPortLib({
      path: `/dev/${path}`,
      baudRate: 9600,
      autoOpen: false,
      dataBits: 8,
      stopBits: 1,
      parity: 'none',
    })

    this.portInstance.on('open', () => {
      info('串口打开成功')
    })

    this.portInstance.on('close', () => {
      info('串口关闭')
    })

    this.portInstance.on('error', (e) => {
      error(`串口出错：${e}`)
    })

    this.portInstance.on('data', (data) => {
      this.data += data.toString('hex')
    })
  }

  async open() {
    return new Promise<void>((resolve, reject) => {
      this.portInstance?.open((error) => {
        if (error) reject(error)
        else resolve()
      })
    })
  }

  // 关闭串口
  close() {
    this.portInstance?.close()
    this.data = ''
  }

  // 写入数据
  write(data: Buffer) {
    info(`锁控写入数据：${data.toString('hex')}`)
    this.portInstance?.write(data)
  }

  getData() {
    return this.data
  }

  setData(source: string) {
    this.data = source
  }
}
