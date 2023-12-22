import { initFaceEngine, initFaceSDK, onlineActivation } from '@smart-cabinet/features'
import { ipcMain } from 'electron'

// import cv from '@u4/opencv4nodejs'
import { FACE_EVENT_NAME } from '#/ipcNames'

const cv = require('@u4/opencv4nodejs')

let camera = null

function openCamera() {
  camera = new cv.VideoCapture(0)
  setInterval(() => {
    const frame = camera.read()
    if (!frame.empty) {
      const frameData = frame.getData()
      console.log('🚀 ~ file: face.ts:14 ~ setInterval ~ frameData:', frameData)
    }
  }, 1000 / 30) // 每秒30帧
}

export function closeCamera() {
  camera.release()
}

function initFace() {
  initFaceSDK()
  onlineActivation()
  initFaceEngine()
}

export function registerFaceModule() {
  openCamera()
  ipcMain.on(FACE_EVENT_NAME.init, () => {
    initFace()
  })
}
