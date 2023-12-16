import { generateIPCInvoke, registerIPCHandle } from '@smart-cabinet/utils'
import rfidService from './rfid'
import sysService from './sys'
import networkService from './network'
import storeService from './store'
import activationService from './activation'
import logService from './log'
import accessDoorService from './access-door'

export const services = [rfidService, sysService, networkService, storeService, activationService, logService, accessDoorService]

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
