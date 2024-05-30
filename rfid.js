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
  console.log('Rfid Data:' + data.toString('hex'))
  logger.info('Rfid Data:' + data.toString('hex'))
  messageQueue.add(data)
})

const readTime = 10 * 1000 // 10s
let timer = null
function startReading() {
  const COMMAND_HEADER = '5A'
  const commandBody = `000102100008${generateAntennaCommand()}01020006`
  const checkCode = generateCRC16Code(commandBody)
  const command = COMMAND_HEADER + commandBody + checkCode

  port.write(Buffer.from(command, 'hex'))

  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    stopReading()
  }, readTime)
}


function stopReading() {
  const command = Buffer.from('5A000102FF0000885A', 'hex')
  port.write(command)
}


eventEmitter.on('startRfidReading', startReading)
