const { SerialPort } = require('serialport')

const path = '/dev/ttyUSB0'
const baudRate = 9600

const instance = new SerialPort({ path, baudRate, autoOpen: false })

instance.open(err => {
  if (err) console.log(err, '串口打开失败')
})

instance.on('open', () => {
  console.log('open')
})

instance.on('data', data => {
  this.data += data.toString('hex')
})

const generateLockCommand = source => {
  const arr = []
  for (let index = 0; index < source.length; index++) {
    if (index % 2 === 0) {
      arr.push('0x' + source.slice(index, index + 2))
    }
  }

  const result = arr.reduce((acc, cur, index) => {
    if (index === 0) acc = cur
    else {
      acc = '0x' + (acc ^ cur).toString(16)
    }

    return acc
  }, '')

  const command = [...arr, result]
    .map(item => item.slice(2, 4))
    .join('')
    .toLocaleUpperCase()

  console.log('🚀 ~ file: index.ts:170 ~ generateLockCommand ~ command', command)

  return Buffer.from(command, 'hex')
}

instance.write(generateLockCommand('8a010111'))
