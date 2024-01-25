import { registerRfidService } from './rfid'
import { registerLogModule } from './logger'
import { registerAccessDoorService } from './access-door'
import { registerStoreModule } from './store'
import { registerNetworkModule } from './network'
import { registerSysModule } from './sys'

export function registerModules() {
  registerStoreModule()
  registerLogModule()
  registerNetworkModule()
  registerSysModule()
  registerAccessDoorService()
  registerRfidService()
}
