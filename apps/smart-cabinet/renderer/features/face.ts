import { FACE_EVENT_NAME } from '#/ipcNames'

export function initFace() {
  window.electronApi.ipcRenderer.send(FACE_EVENT_NAME.init)
}
