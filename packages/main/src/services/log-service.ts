import log from 'electron-log'

// 初始化 electron-log 模块
log.transports.file.level = 'info'
log.transports.console.level = 'debug'
log.transports.file.format = '{d}/{m}/{y} {h}:{i}:{s}:{ms} {text}'

const info = (message: string) => {
  log.info(message)
}

const warn = (message: string) => {
  log.warn(message)
}

const error = (message: string) => {
  log.error(message)
}

const debug = (message: string) => {
  log.debug(message)
}

const logServices = {
  name: 'log' as const,
  fns: {
    info,
    warn,
    error,
    debug
  }
}

export default logServices
