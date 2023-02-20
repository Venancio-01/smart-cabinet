import { SerialPort as SerialPortLib } from 'serialport'

export default class SerialPort {
  private portInstance: null | SerialPortLib = null
  private data = ''

  constructor({ path, baudRate = 9600 }: { path: string; baudRate?: number }) {
    this.init({ path, baudRate })
    this.addDataListener()
  }

  private init({ path, baudRate = 9600 }: { path: string; baudRate?: number }) {
    if (this.portInstance) return

    this.portInstance = new SerialPortLib({ path, baudRate }, err => {
      if (err) {
        console.log(`串口打开失败,${err}`)
      }
    })
  }

  // 写入数据
  write(data) {
    if (!this.portInstance) return

    this.portInstance.write(data)
  }

  getData() {
    if (!this.portInstance) return

    return this.data
  }

  setData(source: string) {
    if (!this.portInstance) return

    this.data = source
  }

  // 添加数据返回的监听器
  addDataListener() {
    if (!this.portInstance) return

    this.portInstance.on('open', () => {
      console.log('串口打开成功')
    })

    this.portInstance.on('close', () => {
      console.log('串口关闭')
    })

    this.portInstance.on('error', error => {
      console.log('串口出错：', error)
    })

    this.portInstance.on('data', data => {
      this.data += data.toString('hex')
    })
  }

  // 关闭串口
  destroy() {
    if (!this.portInstance) return

    this.portInstance.close()
    this.portInstance = null
    this.data = ''
  }
}
