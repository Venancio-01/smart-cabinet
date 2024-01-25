import { ipcMain } from 'electron'
import { debug, error, info, initLogger, warn } from '@smart-cabinet/common'

export function registerLogModule() {
  initLogger()

  ipcMain.on('log:info', (_event, message: string) => {
    info(message)
  })

  ipcMain.on('log:warn', (_event, message: string) => {
    warn(message)
  })

  ipcMain.on('log:error', (_event, message: string) => {
    error(message)
  })

  ipcMain.on('log:debug', (_event, message: string) => {
    debug(message)
  })
}
