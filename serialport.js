const { SerialPort } = require('serialport')
const eventEmitter = require('./emit');

console.log('starting serialport')

const port = new SerialPort({
  path: '/dev/ttyS3',
  baudRate: 115200,
})

port.on('open', function() {
  console.log('SerialPort Open')
})

port.on('data', function(data) {
  console.log('Data:' + data.toString('hex'))
})

// const command = Buffer.from('A55A03810001', 'hex')

eventEmitter.on('close-door', () => {
  // port.write(command)
})


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
  const command = Buffer.from('A5 5A 09 82 00 01 31 32 33 34 FF FF', 'hex')
  port.write(command)
}

function fun2() {
  const command = Buffer.from('A5 5A 11 82 00 04 B2 E2 CA D4 D1 D0 B7 A2 B0 F3 B6 A8 FF FF', 'hex')
  port.write(command)
}

function fun3() {
  const command = Buffer.from('A5 5A 05 82 00 10 FF FF', 'hex')
  port.write(command)
}

function fun4() {
  const command = Buffer.from('A5 5A 09 82 00 20 31 32 34 35 FF FF', 'hex')
  port.write(command)
}

function fun5() {
  const command = Buffer.from('A5 5A 0A 82 00 30 2F 39 38 37 36 FF FF', 'hex')
  port.write(command)
}

function fun6() {
  const command = Buffer.from('A5 5A 05 82 00 50 FF FF', 'hex')
  port.write(command)
}



fun0()
