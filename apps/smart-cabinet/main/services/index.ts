import { registerLockControlModule } from './lock-control'
import { registerRfidModule } from './rfid'
import { registerFingerprintModule } from './finger'
import { registerSysModule } from './system'
import { registerCabinetModule } from './cabinet'
import { registerCarrierModule } from './carrier'
import { registerNetworkModule } from './network'
import { registerStoreModule } from './store'
import { registerActivationModule } from './activation'
import { registerLogModule } from './logger'

export function registerModules() {
  registerActivationModule()
  registerLockControlModule()
  registerRfidModule()
  registerFingerprintModule()
  registerCabinetModule()
  registerLogModule()
  registerStoreModule()
  registerNetworkModule()
  registerCarrierModule()
  registerSysModule()
}
