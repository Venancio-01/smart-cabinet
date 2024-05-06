import { selectSysDeptList } from '@smart-cabinet/database'
import { getProductionBgImagePath } from '@smart-cabinet/common/system'
import { compareActivationCode, generateActivationCode, generateRegistrationCode } from '@smart-cabinet/common/activation'
import { ipcMain } from 'electron'
import ipcNames from '#/ipcNames'


export function registerSysModule() {
  ipcMain.handle(ipcNames.sys.selectSysDeptList, async (_, args) => {
    return selectSysDeptList(args)
  })

  ipcMain.handle(ipcNames.sys.getProductionBgImagePath, async () => {
    return getProductionBgImagePath()
  })

  ipcMain.handle(ipcNames.sys.generateRegistrationCode, async () => {
    return generateRegistrationCode()
  })

  ipcMain.handle(ipcNames.sys.generateActivationCode, async () => {
    return generateActivationCode()
  })

  ipcMain.handle(ipcNames.sys.compareActivationCode, async (_, args) => {
    const result = await compareActivationCode(args)
    return result
  })
}
