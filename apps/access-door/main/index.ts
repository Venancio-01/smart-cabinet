import { app } from 'electron'
import dotenv from 'dotenv'
import { EVN_FILE_PATH } from '@smart-cabinet/utils/config'
import { onAppActivate, onAppBeforeQuit, onAppReady, onAppWindowAllClosed } from '@/base/hooks'

// 加载环境变量
dotenv.config({
  path: EVN_FILE_PATH,
})

// 禁用 Linux 的 GPU 加速。
app.disableHardwareAcceleration()

// 如果不是单例，则退出应用程序。
if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

app.whenReady().then(onAppReady)
app.on('before-quit', onAppBeforeQuit)
app.on('activate', onAppActivate)
app.on('window-all-closed', onAppWindowAllClosed)
