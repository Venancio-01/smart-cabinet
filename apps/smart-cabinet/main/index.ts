import process from 'process'
import { BrowserWindow, app } from 'electron'
import dotenv from 'dotenv'
import { connectToDatabase } from '@smart-cabinet/database'
import { disableShortcuts, emitter } from '@smart-cabinet/utils'
import { EVN_FILE_PATH } from '@smart-cabinet/utils/config'
import { installVueDevTools } from '@smart-cabinet/common'
import { handleExitUpdateService } from './services/update'
import { initIPCHandle } from '@/services'
import { createWindow } from '@/base/window'

// 加载环境变量
dotenv.config({
  path: EVN_FILE_PATH,
})

// Linux 系统禁用 GPU 加速
app.disableHardwareAcceleration()

// 禁用多开
if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

app.whenReady().then(async () => {
  try {
    // 连接数据库
    await connectToDatabase()
    console.log('数据库连接成功')
    emitter.emit('database-connected')
  }
  catch (error) {
    console.log(`数据库连接失败: ${error}`)
  }
  // 创建窗口
  await createWindow()
  //  初始化 IPCHandle
  initIPCHandle()
  //  正式打包
  if (app.isPackaged) disableShortcuts()
  else installVueDevTools()
})

// 应用激活时
app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()

  if (allWindows.length) allWindows[0].focus()
  else createWindow()
})

// 应用退出前
app.on('before-quit', () => {
  emitter.all.clear()
  handleExitUpdateService()
})

// 应用窗口全部关闭时
app.on('window-all-closed', () => {
  app.quit()
})
