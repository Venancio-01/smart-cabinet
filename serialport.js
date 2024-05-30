const { SerialPort } = require('serialport')

const port = new SerialPort({
  path: '/dev/ttyS3',
  baudRate: 115200,
})

port.on('open', function() {
  console.log('SerialPort Open')
})

port.on('data', function(data) {
  console.log('Data:' + data)
})


const command = Buffer.from('A55A03810001', 'hex')
port.write(command)
