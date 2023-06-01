import { BrowserWindow } from 'electron'

export function sendIpcToRenderer(channel, ...args) {
  BrowserWindow.getAllWindows().forEach((wnd) => {
    if (wnd.webContents && !wnd.webContents.isDestroyed())
      wnd.webContents.send(channel, ...args)
  })
}
