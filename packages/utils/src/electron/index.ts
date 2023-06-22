import { BrowserWindow, globalShortcut } from 'electron'

/**
 * @description: 发送 ipc 通信到渲染进程
 * @param {string} channel
 * @param {array} args
 * @return {*}
 */
export function sendIpcToRenderer(channel: string, ...args: any[]) {
  BrowserWindow.getAllWindows().forEach((wnd) => {
    if (wnd.webContents && !wnd.webContents.isDestroyed()) wnd.webContents.send(channel, ...args)
  })
}

/**
 * @description: 禁用快捷键
 * @return {*}
 */
export function disableShortcuts() {
  globalShortcut.registerAll(['CommandOrControl+R', 'F11'], () => {
    return false
  })
}
