import { selectSysDeptList } from '@smart-cabinet/database'
import { getProductionBgImagePath } from '@smart-cabinet/common/system'
import { compareActivationCode, generateActivationCode, generateRegistrationCode } from '@smart-cabinet/common/activation'
import { ipcMain } from 'electron'

export function registerSysModule() {
  ipcMain.handle('sys:select-sys-deptList', async (_, args) => {
    return selectSysDeptList(args)
  })

  ipcMain.handle('sys:get-production-bg-image-path', async () => {
    return getProductionBgImagePath()
  })

  ipcMain.handle('sys:generate-registration-code', async () => {
    return generateRegistrationCode()
  })

  ipcMain.handle('sys:generate-activation-code', async () => {
    return generateActivationCode()
  })

  ipcMain.handle('sys:compare-activation-code', async (_, args) => {
    return compareActivationCode(args)
  })
}
