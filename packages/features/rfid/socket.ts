import { Socket } from 'net'
import type { Buffer } from 'buffer'
import { info } from '@smart-cabinet/common'

export class RfidSocket {
  private instance: Socket | null = null
  private data = ''
  private address = ''
  private port: number | null = null
  private format: 'hex' | 'utf-8' = 'hex'
  private timeout = 1000

  constructor(option: { address: string, port?: number, format?: 'hex' | 'utf-8' }) {
    this.address = option.address
    this.port = option.port || 8160
    this.format = option?.format || 'hex'
  }

  connect() {
    return new Promise<boolean>((resolve) => {
      this.instance = new Socket()

      // 设置超时时间
      this.instance.setTimeout(this.timeout)

      // 监听事件
      this.instance.on('connect', () => {
        info(`${this.address} socket 连接成功`)
        resolve(true)
      })

      this.instance.on('close', () => {
        info(`${this.address} socket 连接关闭`)
        resolve(false)
      })

      this.instance.on('timeout', () => {
        info(`${this.address} socket 连接超时`)
        this.instance?.destroy()
      })

      this.instance.on('error', (err) => {
        info(`${this.address} socket 出错 ${err}`)
        this.instance?.destroy()
      })

      this.instance.on('data', (data) => {
        this.data += data.toString(this.format)
      })

      if (this.port) this.instance?.connect(this.port, this.address)
      else this.instance?.connect(this.address)
    })
  }

  destroy() {
    this.instance?.destroy()
  }

  write(data: Buffer) {
    info(`write data ${data.toString('hex')}`)
    this.instance?.write(data)
  }

  getData() {
    return this.data
  }

  setData(source: string) {
    this.data = source
    return this.data
  }
}
