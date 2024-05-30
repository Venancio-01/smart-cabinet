const { SerialPort } = require('serialport')
const eventEmitter = require('./emit');

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


eventEmitter.on('close-door', () => {
  fun0()
})


function generateCommand(body) {
  const head = 'A55A';
  const prefix = '82';
  const end = 'FFFF';
  const len = ((head.length + prefix.length + end.length + body.length) / 2).toString('hex').padStart(2, '0');
  console.log('🚀 - generateCommand - len:', len)

  const commandStr = `${head}${prefix}${len}${body}${end}`
  return Buffer.from(commandStr, 'hex')
  console.log('🚀 - generateCommand - commandStr:', commandStr)
}


function fun0() {
  const command = Buffer.from('A55A03810001', 'hex')
  port.write(command, (err) => {
    if (err) {
      console.error('Error writing to serial port:', err)
    }

    console.log('Command written to serial port', command.toString('hex'))
  })
}

function fun1() {
  // const command = Buffer.from('A55A 09 82 0001 31323334 FFFF', 'hex')
  const command = generateCommand('31323334')
  port.write(command)
}

function fun2() {
  const command = Buffer.from('A55A11820004B2E2CAD4D1D0B7A2B0F3B6A8FFFF', 'hex')
  port.write(command)
}

function fun3() {
  const command = Buffer.from('A55A05820010FFFF', 'hex')
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

fun1()
