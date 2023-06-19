export function info(message: string) {
  window.JSBridge.log.info(message)
}

export function warn(message: string) {
  window.JSBridge.log.warn(message)
}

export function error(message: string) {
  window.JSBridge.log.error(message)
}

export function debug(message: string) {
  window.JSBridge.log.debug(message)
}
