import loginService from './login-service'
import lockControlService from './lock-control-service'
import rfidService from './rfid-service'
import fingerService from './finger-service'
import sysService from './sys-service'
import cabinetService from './cabinet-service'
import documentService from './document-service'
import cardService from './card-service'
import networkService from './network-status'
import updateService from './update-service'

export type LoginServiceType = typeof loginService.fns

export const services = [
  loginService,
  lockControlService,
  rfidService,
  fingerService,
  sysService,
  cabinetService,
  documentService,
  cardService,
  networkService,
  updateService
]

export type ServiceType = typeof services

export function makeChannelName(name, fnName) {
  return `${name}.${fnName}`
}
