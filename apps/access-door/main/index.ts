import type { BrowserWindow } from 'electron'
import { app, globalShortcut } from 'electron'
import dotenv from 'dotenv'
import { registerServices } from '@/services'
import { createWindow } from '@/base/window'
import { EVN_FILE_PATH } from '@/config'
import { registerAppHooks } from '@/base/hooks'

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

// 移除 electron 安全警告
// 这个警告只在开发模式下显示
// 了解更多：https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
let win: BrowserWindow | null = null

/**
 * @description: 禁用快捷键
 * @return {*}
 */
function disableShortcuts() {
  // 禁用 Control+Shift+I 打开开发者面板
  // 禁用 Control+R 刷新页面
  // 禁用 F11 全屏
  // ['CommandOrControl+Shift+I', 'CommandOrControl+R', 'F11']
  globalShortcut.registerAll(['CommandOrControl+R', 'F11'], () => {
    return false
  })
}

// 当 Electron 完成初始化并且准备创建浏览器窗口时，此方法将被调用。
app.whenReady().then(async () => {
  win = await createWindow()
  registerServices()
  if (app.isPackaged)
    disableShortcuts()
})

registerAppHooks(win)
