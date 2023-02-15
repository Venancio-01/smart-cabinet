import loginService from './login-service'
import lockControlService from './lock-control-service'
import rfidService from './rfid-service'
import fingerService from './finger-service'
import sysService from './sys-service'
import cabinetService from './cabinet-service'
import documentService from './document-service'
import cardService from './card-service'
import networkService from './network-status'

export type LoginServiceType = typeof loginService.fns

export const services: [
  typeof loginService,
  typeof lockControlService,
  typeof rfidService,
  typeof fingerService,
  typeof sysService,
  typeof cabinetService,
  typeof documentService,
  typeof cardService,
  typeof networkService
] = [
  loginService,
  lockControlService,
  rfidService,
  fingerService,
  sysService,
  cabinetService,
  documentService,
  cardService,
  networkService
]

export function makeChannelName(name, fnName) {
  return `${name}.${fnName}`
}
