const { SerialPort } = require('serialport')
const eventEmitter = require('./emit');
const { generateScreenCommandBody } = require('./util');

const port = new SerialPort({
  path: '/dev/ttyS3',
  baudRate: 115200,
})

port.on('open', function() {
  console.log('Screen SerialPort Open')
})

port.on('data', function(data) {
  console.log('Screen Data:' + data.toString('hex'))
})


eventEmitter.on('updateScreen', (num) => {
  const str = `检测到rfid数量：${num}`
  fun1(str)
})

function writeCommand(command) {
  port.write(command, (err) => {
    if (err) {
      console.error('Error writing to screen serial port:', err)
    }

    console.log('Command written to screen serial port', command.toString('hex'))
  })
}


function generateCommand(body) {
  const head = 'A55A';
  const prefix = '82';
  const end = 'FFFF';
  const len = ((head.length + prefix.length + end.length + body.length) / 2 - 2).toString(16).padStart(2, '0');

  const commandStr = `${head}${len}${prefix}${body}${end}`
  return Buffer.from(commandStr, 'hex')
}


const block1 = '0001'
const block2 = '0004'
const block3 = '0010'
const block4 = '0020'
const block5 = '0030'
const block6 = '0050'


function fun1(str) {
  const command = generateCommand(`${block1}${generateScreenCommandBody(str)}`)
  writeCommand(command)
}

function fun2() {
  const command = Buffer.from('A55A 11 82 0004 B2E2CAD4D1D0B7A2B0F3B6A8FFFF', 'hex')
  port.write(command)
}

function fun3() {
  const command = Buffer.from('A55A05 82 0010FFFF', 'hex')
  port.write(command)
}

function fun4() {
  const command = Buffer.from('A55A0982002031323435FFFF', 'hex')
  port.write(command)
}

function fun5() {
  const command = Buffer.from('A55A0A8200302F39383736FFFF', 'hex')
  port.write(command)
}

function fun6() {
  const command = Buffer.from('A55A05820050FFFF', 'hex')
  port.write(command)
}

