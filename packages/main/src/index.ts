import { app, BrowserWindow, globalShortcut } from 'electron'
import { services, makeChannelName } from '@/services'
import { createWindow } from '@/base/window'
import { ipcMain } from 'electron'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
import lockControlService from './services/lock-control-service'
import { exec } from 'child_process'

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
  globalShortcut.registerAll(['CommandOrControl+Shift+I', 'CommandOrControl+R', 'F11'], () => {
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

/**
 * @description: 设置串口权限
 * @return {*}
 */
const setSerialPortPermissions = () => {
  exec('sudo chmod 777 /dev/ttyUSB0', error => {
    if (error) console.log(error, 'error')
  })
}

app.whenReady().then(async () => {
  win = await createWindow()
  setSerialPortPermissions()
  installService()
  if (app.isPackaged) {
    disableShortcuts()
  } else {
    // const options = {
    //   loadExtensionOptions: { allowFileAccess: true }
    // }
    // await installExtension([VUEJS3_DEVTOOLS], options)
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
  lockControlService.fns.destroy()
})
