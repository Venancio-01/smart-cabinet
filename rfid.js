const { SerialPort, ReadlineParser } = require('serialport')
const eventEmitter = require('./emit');
const { generateCRC16Code, generateAntennaCommand, MessageQueue } = require('./util')
const logger = require('./logger');

const port = new SerialPort({
  path: '/dev/ttyS1',
  baudRate: 115200,
})
const parser = new ReadlineParser()
port.pipe(parser)

const messageQueue = new MessageQueue()

port.on('open', function() {
  console.log('Rfid SerialPort Open')
})

port.on('data', function(data) {
  logger.info('Rfid Data:' + data.toString('hex'))
  messageQueue.add(data)
})

function writeCommand(command) {
  port.write(command, (err) => {
    if (err) {
      console.error('Error writing to rfid serial port:', err)
    }

    console.log('Command written to rfid serial port', command.toString('hex'))
  })
}

const readTime = 2 * 1000 // 10s
let timer = null
function startReading() {
  const COMMAND_HEADER = '5A'
  const commandBody = `000102100008${generateAntennaCommand()}01020006`
  const checkCode = generateCRC16Code(commandBody)
  const command = COMMAND_HEADER + commandBody + checkCode

  writeCommand(Buffer.from(command, 'hex'))

  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    stopReading()
  }, readTime)
}


function stopReading() {
  const command = Buffer.from('5A000102FF0000885A', 'hex')
  writeCommand(command)
}


eventEmitter.on('startRfidReading', startReading)

startReading()
