import { BrowserWindow, globalShortcut, ipcMain, ipcRenderer } from 'electron'

/**
 * Generates a channel name by concatenating the given `name` and `fnName` with a dot in between.
 *
 * @param {string} name - The name to be used in the channel name.
 * @param {string} fnName - The function name to be used in the channel name.
 * @return {string} The generated channel name.
 */
export function makeChannelName(name: string, fnName: string) {
  return `${name}.${fnName}`
}

type ServiceType = Array<{ name: string; fns: Record<string, any> }>
/**
 * Registers IPC handles for the given services.
 *
 * @param {ServiceType[]} services - An array of services.
 * @return {void} This function does not return anything.
 */
export function registerIPCHandle(services: ServiceType) {
  services.forEach((service) => {
    Object.entries(service.fns).forEach(([apiName, apiFn]) => {
      ipcMain.handle(makeChannelName(service.name, apiName), (_, ...args) => apiFn(...args))
    })
  })
}

/**
 * Generates an IPC invoke object based on the given services.
 *
 * @param {ServiceType[]} services - An array of service types.
 * @return {Object} - The IPC invoke object.
 */
export function generateIPCInvoke(services: ServiceType) {
  return services.reduce((acc, cur) => {
    acc[cur.name] = {}
    Object.keys(cur.fns).forEach((fnName) => {
      acc[cur.name][fnName] = (...args: any[]) => ipcRenderer.invoke(makeChannelName(cur.name, fnName), ...args)
    })

    return acc
  }, {} as any)
}

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
