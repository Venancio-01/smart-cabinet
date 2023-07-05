import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { makeChannelName, services } from '@/services'
import './base/loading'

function createJsBridge() {
  return services.reduce((acc, cur) => {
    acc[cur.name] = {}
    Object.keys(cur.fns).forEach((fnName) => {
      acc[cur.name][fnName] = (...args: any[]) => ipcRenderer.invoke(makeChannelName(cur.name, fnName), ...args)
    })

    return acc
  }, {} as any)
}

// Custom APIs for renderer
contextBridge.exposeInMainWorld('JSBridge', createJsBridge())
contextBridge.exposeInMainWorld('electron', electronAPI)
