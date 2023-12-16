import { generateIPCInvoke, registerIPCHandle } from '@smart-cabinet/utils'
import lockControlService from './lock-control'
import rfidService from './rfid'
import fingerService from './finger'
import sysService from './system'
import cabinetService from './cabinet'
import carrierService from './carrier'
import networkService from './network'
import updateService from './update'
import storeService from './store'
import activationService from './activation'
import logService from './logger'

export const services = [
  lockControlService,
  rfidService,
  fingerService,
  sysService,
  cabinetService,
  carrierService,
  networkService,
  updateService,
  storeService,
  activationService,
  logService,
]

export type ServiceType = typeof services

/**
 * Initializes the services.
 */
export function initIPCHandle() {
  registerIPCHandle(services)
}

/**
 * Generates an IPC invoke function.
 *
 * @return {any} The result of invoking the IPC function.
 */
export function genetateIPCInvoke() {
  return generateIPCInvoke(services)
}
