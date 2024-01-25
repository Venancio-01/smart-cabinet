import { BrowserWindow, app } from 'electron'
import { disableShortcuts } from '@smart-cabinet/utils/electron'
import { emitter } from '@smart-cabinet/utils'
import { connectToDatabase } from '@smart-cabinet/database'
import { info, initLogger } from '@smart-cabinet/common'
import { createWindow } from '@/base/window'
import { connectAllRfid, disconnectAllRfid } from '@/services/rfid'
import { registerModules } from '@/services'
import { initEquipment, isControlEquipment } from '@/services/access-door'

export async function onAppBeforeQuit() {
  // 断开所有设备的 RFID 连接
  disconnectAllRfid()
}

export async function onAppWindowAllClosed() {
  app.quit()
}

export async function onAppActivate() {
  const allWindows = BrowserWindow.getAllWindows()

  if (allWindows.length) allWindows[0].focus()
  else createWindow()
}

export async function onAppReady() {
  try {
    // 连接数据库
    await connectToDatabase()
    console.log('数据库连接成功')
    emitter.emit('database-connected')
  }
  catch (error) {
    console.log(`数据库连接失败: ${error}`)
  }

  initLogger()

  // 获取当前连接设备
  await initEquipment()
  isControlEquipment ? info('是控制设备') : info('非控制设备')

  // 连接 RFID
  connectAllRfid()
  // 注册模块
  registerModules()
  // 创建窗口
  createWindow()
  // 打包后下禁用快捷键
  if (app.isPackaged) disableShortcuts()
}
