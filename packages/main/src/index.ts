import { app, BrowserWindow, globalShortcut, ipcMain, session } from 'electron'
import { services, makeChannelName } from '@/services'
import { createWindow } from '@/base/window'
import updateService from './services/update-service'
import { EVN_FILE_PATH } from '@/config'
import dotenv from 'dotenv'
import { resolve } from 'path'


// 加载环境变量
dotenv.config({
  path: EVN_FILE_PATH
})

// Disable GPU Acceleration for Linux.
app.disableHardwareAcceleration()

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null

/**
 * @description: 禁用快捷键
 * @return {*}
 */
const disableShortcuts = () => {
  // 禁用 Control+Shift+I 打开开发者面板
  // 禁用 Control+R 刷新页面
  // 禁用 F11 全屏
  // ['CommandOrControl+Shift+I', 'CommandOrControl+R', 'F11']
  globalShortcut.registerAll(['CommandOrControl+R', 'F11'], () => {
    return false
  })
}

/**
 * @description: 注册服务
 * @return {*}
 */
const installService = () => {
  services.forEach(service => {
    Object.entries(service.fns).forEach(([apiName, apiFn]) => {
      ipcMain.handle(makeChannelName(service.name, apiName), (ev, ...args) => apiFn(...args))
    })
  })
}


app.whenReady().then(async () => {
  win = await createWindow()
  installService()
  if (app.isPackaged) {
    disableShortcuts()
  }
})

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()

  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

app.on('before-quit', () => {
  updateService.fns.handleExitUpdateService()
})
