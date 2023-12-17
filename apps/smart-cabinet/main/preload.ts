import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import './base/loading'

contextBridge.exposeInMainWorld('electronApi', electronAPI)
