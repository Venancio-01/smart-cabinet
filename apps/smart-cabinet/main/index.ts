import { BrowserWindow, app } from 'electron'
import dotenv from 'dotenv'
import { connectDatabase } from 'database'
import { disableShortcuts } from 'utils/electron'
import { EVN_FILE_PATH } from 'utils/config'
import { handleExitUpdateService } from './services/update'
import { installService } from '@/services'
import { createWindow } from '@/base/window'

// 加载环境变量
dotenv.config({
  path: EVN_FILE_PATH,
})

// 连接数据库
connectDatabase().then((isConnected) => {
  if (isConnected) console.log('数据库连接成功')
  else console.log('数据库连接失败')

  globalThis.databaseIsConnected = isConnected
})

// Linux 系统禁用 GPU 加速
app.disableHardwareAcceleration()

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

let win: BrowserWindow | null = null

app.whenReady().then(async () => {
  win = await createWindow()
  installService()
  if (app.isPackaged) disableShortcuts()
})

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()

  if (allWindows.length) allWindows[0].focus()
  else createWindow()
})

app.on('before-quit', () => {
  handleExitUpdateService()
})
