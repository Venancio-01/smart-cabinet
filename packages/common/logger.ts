import log from 'electron-log'

// 初始化 electron-log 模块
export function initLogger() {
  log.transports.file.level = 'info'
  log.transports.console.level = 'debug'
  log.transports.file.format = '{d}/{m}/{y} {h}:{i}:{s}:{ms} {text}'
}

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
