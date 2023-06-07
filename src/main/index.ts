import { BrowserWindow, app, globalShortcut } from 'electron'
import dotenv from 'dotenv'
import { handleExitUpdateService } from './services/update-service'
import { installService } from '@/services'
import { createWindow } from '@/base/window'
import { EVN_FILE_PATH } from '@/config'

// 加载环境变量
dotenv.config({
  path: EVN_FILE_PATH,
})

// Linux 系统禁用 GPU 加速
app.disableHardwareAcceleration()

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

let win: BrowserWindow | null = null

/**
 * @description: 禁用快捷键
 * @return {*}
 */
function disableShortcuts() {
  // 禁用 Control+Shift+I 打开开发者面板
  // 禁用 Control+R 刷新页面
  // ['CommandOrControl+Shift+I', 'CommandOrControl+R', 'F11']
  globalShortcut.registerAll(['CommandOrControl+R'], () => {
    return false
  })
}

app.whenReady().then(async () => {
  win = await createWindow()
  installService()
  if (app.isPackaged)
    disableShortcuts()
})

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin')
    app.quit()
})

app.on('second-instance', () => {
  if (win) {
    if (win.isMinimized())
      win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()

  if (allWindows.length)
    allWindows[0].focus()
  else
    createWindow()
})

app.on('before-quit', () => {
  handleExitUpdateService()
})
