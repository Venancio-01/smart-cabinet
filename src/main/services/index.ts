import { ipcMain } from 'electron'
import lockControlService from './lock-control'
import rfidService from './rfid'
import fingerService from './finger'
import sysService from './system'
import cabinetService from './cabinet-service'
import carrierService from './carrier-service'
import cardService from './card-service'
import networkService from './network-status'
import updateService from './update-service'
import storeService from './store-service'
import encryptionService from './encryption-service'
import logService from './logger'

export const services = [
  lockControlService,
  rfidService,
  fingerService,
  sysService,
  cabinetService,
  carrierService,
  cardService,
  networkService,
  updateService,
  storeService,
  encryptionService,
  logService,
]

export type ServiceType = typeof services

export function makeChannelName(name, fnName) {
  return `${name}.${fnName}`
}

/**
 * @description: 注册服务
 * @return {*}
 */
export function installService() {
  services.forEach((service) => {
    Object.entries(service.fns).forEach(([apiName, apiFn]) => {
      ipcMain.handle(makeChannelName(service.name, apiName), (ev, ...args) => apiFn(...args))
    })
  })
}
