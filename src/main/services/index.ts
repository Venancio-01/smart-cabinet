import loginService from './login-service'
import lockControlService from './lock-control-service'
import rfidService from './rfid-service'
import fingerService from './finger-service'
import sysService from './sys-service'
import cabinetService from './cabinet-service'
import carrierService from './carrier-service'
import cardService from './card-service'
import networkService from './network-status'
import updateService from './update-service'
import storeService from './store-service'
import encryptionService from './encryption-service'
import logService from './log-service'

export const services = [
  loginService,
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
