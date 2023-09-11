import { BrowserWindow, app } from 'electron'
import dotenv from 'dotenv'
import { connectDatabase } from 'database'
import { disableShortcuts } from 'utils/electron'
import { EVN_FILE_PATH } from 'utils/config'
import { handleExitUpdateService } from './services/update'
import { initIPCHandle } from '@/services'
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

app.whenReady().then(async () => {
  // 创建窗口
  await createWindow()
  //  初始化 IPCHandle
  initIPCHandle()
  //  正式打包后禁用快捷键
  if (app.isPackaged) disableShortcuts()
})

// 应用激活时
app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()

  if (allWindows.length) allWindows[0].focus()
  else createWindow()
})

// 应用退出前
app.on('before-quit', () => {
  handleExitUpdateService()
})

// 应用窗口全部关闭时
app.on('window-all-closed', () => {
  app.quit()
})
