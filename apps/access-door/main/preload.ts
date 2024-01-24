import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { genetateIPCInvoke } from '@/services'
import './base/loading'

contextBridge.exposeInMainWorld('JSBridge', genetateIPCInvoke())
contextBridge.exposeInMainWorld('electron', electronAPI)
