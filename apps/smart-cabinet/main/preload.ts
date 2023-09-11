import { contextBridge } from 'electron'
import { genetateIPCInvoke } from '@/services'
import './base/loading'

contextBridge.exposeInMainWorld('JSBridge', genetateIPCInvoke())
