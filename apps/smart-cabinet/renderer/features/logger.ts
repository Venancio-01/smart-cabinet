export function info(message: string) {
  window.electronApi.ipcRenderer.send('log:info', message)
}

export function warn(message: string) {
  window.electronApi.ipcRenderer.send('log:warn', message)
}

export function error(message: string) {
  window.electronApi.ipcRenderer.send('log:error', message)
}

export function debug(message: string) {
  window.electronApi.ipcRenderer.send('log:debug', message)
}
