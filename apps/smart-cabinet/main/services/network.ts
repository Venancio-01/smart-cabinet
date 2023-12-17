import { emitter } from '@smart-cabinet/utils'
import { ipcMain } from 'electron'

let databaseIsConnected = false
emitter.on('database-connected', () => {
  databaseIsConnected = true
})

export function registerNetworkModule() {
  ipcMain.handle('network:get-database-connect-state', () => {
    return databaseIsConnected
  })
}
