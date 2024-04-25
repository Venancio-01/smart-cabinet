import { emitter } from '@smart-cabinet/utils'
import { ipcMain } from 'electron'
import ipcNames from '#/ipcNames'

let databaseIsConnected = false
emitter.on('database-connected', () => {
  databaseIsConnected = true
})

export function registerNetworkModule() {
  ipcMain.handle(ipcNames.network.getDatabaseConnectState, () => {
    return databaseIsConnected
  })
}
