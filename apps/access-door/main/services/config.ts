import { ipcMain } from 'electron'
import { get, set } from './store'
import ipcNames from '#/ipcNames'

// 是否开启报警铃声
export let alarmSound = true

export function registerConfigModule() {
  ipcMain.handle(ipcNames.config.getAlarmSound, async () => {
    alarmSound = await get('alarmSound') as boolean
    console.log('🚀 - ipcMain.handle - alarmSound:', alarmSound)
    return alarmSound
  })

  ipcMain.handle(ipcNames.config.setAlarmSound, async (_, value: boolean) => {
    alarmSound = value
    set('alarmSound', value)
  })
}
