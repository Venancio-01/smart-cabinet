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
  logger.info('Rfid SerialPort Open')
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

    logger.info('Command written to rfid serial port', command.toString('hex'))
  })
}

let countdown = 5
let timer = null

function startReading() {
  logger.info('Start reading RFID...')

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


function cleanup() {
  stopReading()
}

function handleExit(options, exitCode) {
  if (options.cleanup) cleanup();
  if (exitCode || exitCode === 0) console.log(exitCode);
  if (options.exit) process.exit();
}

// 当进程即将退出时
process.on('exit', (code) => {
  handleExit({ cleanup: true }, code);
});

// 捕捉 Ctrl+C 事件
process.on('SIGINT', () => {
  console.log('Received SIGINT. Exiting...');
  handleExit({ cleanup: true, exit: true });
});

// 捕捉终止信号
process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Exiting...');
  handleExit({ cleanup: true, exit: true });
});

// 捕捉未捕获的异常
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  handleExit({ cleanup: true, exit: true }, 1);
});

