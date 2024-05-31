const { SerialPort } = require('serialport')
const eventEmitter = require('./utils/emit');
const { generateCRC16Code, generateAntennaCommand, MessageQueue } = require('./utils/util')
const logger = require('./utils/logger');
const { parseRFIDReportData, getTIDByReportData } = require('./utils/util')

const port = new SerialPort({
  path: '/dev/ttyS1',
  baudRate: 115200,
})

const messageQueue = new MessageQueue()

port.on('open', function() {
  console.log('Rfid SerialPort Open')
})

port.on('data', function(data) {
  const hexData = data.toString('hex')
  logger.info('Rfid Data:' + hexData)
  messageQueue.add(hexData)
})

function writeCommand(command) {
  port.write(command, (err) => {
    if (err) {
      console.error('Error writing to rfid serial port:', err)
    }

    console.log('Command written to rfid serial port', command.toString('hex'))
  })
}

let countdown = 5
const readTime = 5 * 1000 // 读取时间
let timer = null
function startReading() {
  console.log('Start reading RFID...')
  const COMMAND_HEADER = '5A'
  const commandBody = `000102100008${generateAntennaCommand()}01020006`
  const checkCode = generateCRC16Code(commandBody)
  const command = COMMAND_HEADER + commandBody + checkCode

  writeCommand(Buffer.from(command, 'hex'))

  countdown = 5;

  if (timer) clearInterval(timer)
    
  eventEmitter.emit('updateCountdown', countdown)
  timer = setInterval(() => {
    countdown--
    eventEmitter.emit('updateCountdown', countdown)
    if (countdown <= 0) {
      stopReading()
    }
  }, 1000)
}

function stopReading() {
  const command = Buffer.from('5A000102FF0000885A', 'hex')
  writeCommand(command)
  getRfidTIDList()
}

function getRfidTIDList() {
  const data = messageQueue.getData()
  const reportData = parseRFIDReportData(data)
  const TIDList = [...new Set(reportData.map((item) => getTIDByReportData(item)))]

  logger.info('检测到 Rfid TID 数量:' + TIDList.length)

  eventEmitter.emit('updateScreen', TIDList.length)
}

eventEmitter.on('startRfidReading', startReading)

