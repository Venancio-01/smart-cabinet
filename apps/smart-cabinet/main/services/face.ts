import { initFace, initFaceEngine, onlineActivation } from '@smart-cabinet/features'
import { ipcMain } from 'electron'
import { FACE_EVENT_NAME } from '#/ipcNames'

export function registerFaceModule() {
  ipcMain.on(FACE_EVENT_NAME.initSDK, () => {
    initFace()
  })

  ipcMain.on(FACE_EVENT_NAME.onlineActivation, () => {
    onlineActivation()
  })

  ipcMain.on(FACE_EVENT_NAME.initEngine, () => {
    initFaceEngine()
  })
}
