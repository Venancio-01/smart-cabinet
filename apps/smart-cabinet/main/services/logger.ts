import log from 'electron-log'

// console.log('🚀 ~ file: logger.ts:2 ~ log:', log)

// 初始化 electron-log 模块
// log.transports.file.level = 'info'
// log.transports.console.level = 'debug'
// log.transports.file.format = '{d}/{m}/{y} {h}:{i}:{s}:{ms} {text}'

export function info(message: string) {
  log.info(message)
}

export function warn(message: string) {
  log.warn(message)
}

export function error(message: string) {
  log.error(message)
}

export function debug(message: string) {
  log.debug(message)
}

const logServices = {
  name: 'log' as const,
  fns: {
    info,
    warn,
    error,
    debug,
  },
}

export default logServices
