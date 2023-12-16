import { BrowserWindow, app } from 'electron'
import { disableShortcuts } from '@smart-cabinet/utils'
import { createWindow } from '@/base/window'
import { connectAllRfid, disconnectAllRfid } from '@/services/rfid'
import { initIPCHandle } from '@/services'
import { initEquipment, isControlEquipment } from '@/services/access-door'
import { info } from '@/services/log'
import { initDatabase } from '@/services/database'

export async function onAppBeforeQuit() {
  // 断开所有设备的 RFID 连接
  disconnectAllRfid()
}

export async function onAppWindowAllClosed() {
  app.quit()
}

/**
 * Activates the application.
 *
 * @return {Promise<void>} - A promise that resolves when the application is activated.
 */
export async function onAppActivate() {
  const allWindows = BrowserWindow.getAllWindows()

  if (allWindows.length) allWindows[0].focus()
  else createWindow()
}

/**
 * Initializes the application when it is ready.
 *
 * @return {Promise<void>} A promise that resolves when the initialization is complete.
 */
export async function onAppReady() {
  // 初始化数据库
  initDatabase()

  // 获取当前连接设备
  await initEquipment()

  isControlEquipment ? info('是控制设备') : info('非控制设备')

  // 连接 RFID
  connectAllRfid()

  // 初始化 IPC handle
  initIPCHandle()

  // 创建窗口
  createWindow()

  // 打包后下禁用快捷键
  if (app.isPackaged) disableShortcuts()
}
