import { registerLockControlModule } from './lock-control'
import { registerRfidModule } from './rfid'
import { registerSysModule } from './system'
import { registerCabinetModule } from './cabinet'
import { registerCarrierModule } from './carrier'
import { registerNetworkModule } from './network'
import { registerStoreModule } from './store'
import { registerActivationModule } from './activation'
import { registerLogModule } from './logger'
import { registerFaceModule } from './face'

export function registerModules() {
  registerActivationModule()
  registerLockControlModule()
  registerRfidModule()
  registerCabinetModule()
  registerLogModule()
  registerStoreModule()
  registerNetworkModule()
  registerCarrierModule()
  registerSysModule()
  registerFaceModule()
}
