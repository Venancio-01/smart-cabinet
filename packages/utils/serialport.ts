import { SerialPort } from 'serialport'

// 查询串口连接状态
export function getSerialPortConnectState(path: string) {
  return new Promise<boolean>((resolve) => {
    if (path === '') {
      resolve(false)
    }
    else {
      SerialPort.list().then((list) => {
        resolve(!!list.find(item => item.path.includes(path)))
      })
    }
  })
}
