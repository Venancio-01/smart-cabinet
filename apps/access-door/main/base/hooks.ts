import { BrowserWindow, app } from 'electron'
import { createWindow } from '@/base/window'
import { handleDisConnect } from '@/services/rfid'

export async function onAppBeforeQuit() {
  // 断开 RFID Socket 连接
  handleDisConnect()
}

export function registerAppHooks(win: BrowserWindow | null) {
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

  app.on('before-quit', async () => {
    await onAppBeforeQuit()
  })
}
