import { ipcMain } from 'electron'
import rfidService from './rfid'
import sysService from './sys'
import cabinetService from './cabinet'
import networkService from './network'
import storeService from './store'
import encryptionService from './encryption'
import logService from './log'
import accessDoorService from './access-door'

export const services = [
  rfidService,
  sysService,
  cabinetService,
  networkService,
  storeService,
  encryptionService,
  logService,
  accessDoorService,
]

export type ServiceType = typeof services

// 生成通道名称
export function makeChannelName(name, fnName) {
  return `${name}.${fnName}`
}

// 注册服务
export function registerServices() {
  services.forEach((service) => {
    Object.entries(service.fns).forEach(([apiName, apiFn]) => {
      ipcMain.handle(makeChannelName(service.name, apiName), (_, ...args) => apiFn(...args))
    })
  })
}
