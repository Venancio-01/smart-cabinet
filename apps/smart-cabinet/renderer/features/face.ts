import { FACE_EVENT_NAME } from '#/ipcNames'

export function initFaceSDK() {
  window.electronApi.ipcRenderer.send(FACE_EVENT_NAME.initSDK)
}

export function onlineActivation() {
  window.electronApi.ipcRenderer.send(FACE_EVENT_NAME.onlineActivation)
}

export function initFaceEngine() {
  window.electronApi.ipcRenderer.send(FACE_EVENT_NAME.initEngine)
}
