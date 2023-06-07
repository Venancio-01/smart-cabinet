export default function useLogger() {
  function info(message: string) {
    window.JSBridge.log.info(message)
  }

  function warn(message: string) {
    window.JSBridge.log.warn(message)
  }

  function error(message: string) {
    window.JSBridge.log.error(message)
  }

  function debug(message: string) {
    window.JSBridge.log.debug(message)
  }

  return {
    info,
    warn,
    error,
    debug,
  }
}
