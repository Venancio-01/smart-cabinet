import { ipcMain } from 'electron'

export function mainHandle(name, callback) {
  return ipcMain.handle(name, callback)
}

export function mainOn(name, callback) {
  return ipcMain.on(name, callback)
}

export function mainOnce(name, callback) {
  return ipcMain.once(name, callback)
}

export function mainRemoveListener(name, callback) {
  return ipcMain.removeListener(name, callback)
}

export function mainRemoveAllListeners(name) {
  return ipcMain.removeAllListeners(name)
}
