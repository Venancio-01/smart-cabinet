export default function useLogger() {
  function info(message: string) {
    window.electronApi.ipcRenderer.send('log:info', message)
  }

  function warn(message: string) {
    window.electronApi.ipcRenderer.send('log:warn', message)
  }

  function error(message: string) {
    window.electronApi.ipcRenderer.send('log:error', message)
  }

  function debug(message: string) {
    window.electronApi.ipcRenderer.send('log:debug', message)
  }

  return {
    info,
    warn,
    error,
    debug,
  }
}
