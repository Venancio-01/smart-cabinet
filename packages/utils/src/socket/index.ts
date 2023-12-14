import { Socket } from 'net'
import type { Buffer } from 'buffer'

export default class {
  private instance: Socket | null = null
  private data = ''
  private address = ''
  private port: number | null = null
  private format: 'hex' | 'utf-8' = 'hex'
  private timer: NodeJS.Timeout | null = null

  constructor(option: { address: string, port: number, format?: 'hex' | 'utf-8' }) {
    this.address = option.address
    this.port = option.port
    this.format = option?.format || 'hex'
  }

  init() {
    return new Promise<void>((resolve, reject) => {
      // 如果已经有实例，直接抛出错误
      if (this.instance) throw new Error('Instance already exists')

      // 创建新的实例
      this.instance = new Socket()

      // 监听各种事件
      this.instance.on('connect', () => {
        console.log('socket 连接成功')
        resolve()
        this.timer && clearTimeout(this.timer)
      })

      this.instance.on('close', () => {
        console.log('关闭 socket 连接')
        reject(new Error('socket 连接关闭'))
      })

      this.instance.on('error', (err) => {
        console.log('socket 出错', err)
        this.instance?.destroy()
      })

      this.instance.on('data', (data) => {
        this.data += data.toString(this.format)
      })

      const MAX_CONNECT_DURATION = 3000
      this.timer = setTimeout(() => {
        this.instance?.destroy()
      }, MAX_CONNECT_DURATION)

      this.connect()
    })
  }

  connect() {
    if (!this.instance) return
    if (this.port) this.instance.connect(this.port, this.address)
    else this.instance.connect(this.address)
  }

  destroy() {
    if (!this.instance) return

    this.instance.destroy()
  }

  write(data: Buffer | string) {
    if (!this.instance) return

    console.log('写入数据', data)
    this.instance.write(data)
  }

  getData() {
    if (!this.instance) return

    return this.data
  }

  setData(source: string) {
    if (!this.instance) return

    this.data = source
    return this.data
  }
}
