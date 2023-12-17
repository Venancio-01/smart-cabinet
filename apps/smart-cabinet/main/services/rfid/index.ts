import { ipcMain } from 'electron'
import { destroyRfidConnection, initRfidConnection, startRfidReading, stopRifdReading } from '@smart-cabinet/features'
import { checkSocketConnection } from '@smart-cabinet/utils'

export function registerRfidModule() {
  ipcMain.handle('rfid:check-connection-status', async (_event, address: string, port: number) => {
    return checkSocketConnection(address, port)
  })

  ipcMain.handle('rfid:init-rfid-connection', async (_event, address: string, port: number) => {
    return initRfidConnection(address, port)
  })

  ipcMain.on('rfid:destroy-rfid-connection', (_event, address: string) => {
    destroyRfidConnection(address)
  })

  ipcMain.on('rfid:stop-rfid-reading', (_event, address: string) => {
    return stopRifdReading(address)
  })

  ipcMain.on('rfid:start-rfid-reading', (_event, address: string, antennaIds: number[]) => {
    return startRfidReading(address, antennaIds)
  })
}
