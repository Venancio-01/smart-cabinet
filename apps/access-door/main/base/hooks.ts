import { BrowserWindow, app } from 'electron'
import { disableShortcuts } from 'utils/electron'
import { connectDatabase } from 'database'
import { createWindow } from '@/base/window'
import { connectRfid, disconnectRfid } from '@/services/rfid'
import { registerServices } from '@/services'
import { equipmentList, initEquipment, isControlEquipment } from '@/services/access-door'
import { error, info } from '@/services/log'

let win: BrowserWindow | null = null

export async function onAppBeforeQuit() {
  // 断开 RFID 连接
  equipmentList.forEach((equipment) => {
    disconnectRfid(equipment)
  })
}

export async function onAppReady() {
  // 连接数据库
  try {
    const isConnected = await connectDatabase()
    globalThis.databaseIsConnected = isConnected
    info('数据库连接成功')
  } catch (e) {
    error(`数据库连接失败${e}`)
  }

  // 获取当前连接设备
  await initEquipment()

  if (isControlEquipment) {
    info('是控制设备')
  } else {
    info('非控制设备')
  }

  // 连接 RFID
  equipmentList.forEach((item) => {
    connectRfid(item)
  })

  // 注册服务
  registerServices()

  // 创建窗口
  win = createWindow()

  // 开发环境下禁用快捷键
  if (app.isPackaged) disableShortcuts()
}

export function registerAppHooks() {
  // 当 Electron 完成初始化并且准备创建浏览器窗口
  app.whenReady().then(onAppReady)

  // 当所有窗口都被关闭时退出。
  app.on('window-all-closed', () => {
    win = null
    if (process.platform !== 'darwin') app.quit()
  })

  // 当应用程序被激活时，即点击应用程序的 Dock 图标时，此方法将被调用。
  app.on('second-instance', () => {
    if (win) {
      // 如果用户尝试打开另一个窗口，则聚焦于主窗口。
      if (win.isMinimized()) win.restore()
      win.focus()
    }
  })

  // 当应用程序被激活时，即点击应用程序的 Dock 图标时，此方法将被调用。
  app.on('activate', () => {
    const allWindows = BrowserWindow.getAllWindows()

    if (allWindows.length) allWindows[0].focus()
    else createWindow()
  })

  app.on('before-quit', onAppBeforeQuit)
}
