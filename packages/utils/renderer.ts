export * from './mitt'
export * from './common'

export function rendererInvoke(name: string, data?: any) {
  return window.electron.ipcRenderer.invoke(name, data)
}

export function rendererSend(name: string, ...data: any) {
  return window.electron.ipcRenderer.send(name, ...data)
}

export function rendererSendSync(name: string, data?: any) {
  return window.electron.ipcRenderer.sendSync(name, data)
}

export function rendererOn(name: string, listener: (...args: any[]) => void) {
  window.electron.ipcRenderer.on(name, listener)
}
