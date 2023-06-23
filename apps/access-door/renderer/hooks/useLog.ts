export default () => {
  const saveLog = (log: string, type = 'info') => {
    const map = {
      info: message => window.JSBridge.log.info(message),
      warn: message => window.JSBridge.log.warn(message),
      error: message => window.JSBridge.log.error(message),
      debug: message => window.JSBridge.log.debug(message),
    }
    map[type] && map[type](log)
  }

  return {
    saveLog,
  }
}
