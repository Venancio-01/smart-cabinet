import { compareActivationCode, generateActivationCode, generateRegistrationCode } from '@smart-cabinet/common'
import { ipcMain } from 'electron'

export function registerActivationModule() {
  ipcMain.handle('activation:generate-registration-code', () => {
    return generateRegistrationCode()
  })

  ipcMain.handle('activation:generate-activation-code', () => {
    return generateActivationCode()
  })

  ipcMain.handle('activation:compare-activation-code', (_event, activationCode: string) => {
    return compareActivationCode(activationCode)
  })
}
