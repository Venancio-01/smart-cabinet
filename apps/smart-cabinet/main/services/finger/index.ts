import { ipcMain } from 'electron'
import {
  closeDevice,
  destroySDK,
  getParameter,
  handleIdentify,
  handleRegister,
  initSDK,
  openDevice,
  queryConnectState,
} from './main'

export function registerFingerprintModule() {
  ipcMain.on('fingerprint:init-sdk', () => {
    initSDK()
  })

  ipcMain.on('fingerprint:destroy-sdk', () => {
    destroySDK()
  })

  ipcMain.handle('fingerprint:query-connect-state', () => {
    return queryConnectState()
  })

  ipcMain.handle('fingerprint:open-device', () => {
    return openDevice()
  })

  ipcMain.handle('fingerprint:close-device', () => {
    return closeDevice()
  })

  ipcMain.handle('fingerprint:get-parameter', () => {
    return getParameter()
  })

  ipcMain.handle('fingerprint:handle-register', (_event, userId: bigint, order: FingerOrder) => {
    return handleRegister(userId, order)
  })

  ipcMain.handle('fingerprint:handle-identify', () => {
    return handleIdentify()
  })
}
