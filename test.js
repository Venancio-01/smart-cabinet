const { SerialPort } = require('serialport')

const path = '/dev/ttyUSB0'
const baudRate = 9600

const portInstance = new SerialPort({ path, baudRate }, err => {
  if (err) {
    console.log(`串口打开失败,${err}`)
  }
})

const buf = Buffer.from('8A01021198', 'hex')

portInstance.write(buf)
