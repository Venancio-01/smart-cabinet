const modules = {
  carrier: {
    selectDocDocumentList: 'carrier:select-doc-document-list',
    selectDocDocumentListWithPage: 'carrier:select-doc-document-list-with-page',
  },
  face: {
    // 初始化 SDK
    initSDK: 'face:init-sdk',
    // 初始化引擎
    initEngine: 'face:init-engine',
    // 在线激活
    onlineActivation: 'face:online-activation',
    // 人脸识别
    faceRecognition: 'face:face-recognition',
    // 人脸注册
    faceRegistration: 'face:face-registration',
    // 人脸删除
    faceDelete: 'face:face-delete',
    // 人脸更新
    faceUpdate: 'face:face-update',
    // 人脸查询
    faceQuery: 'face:face-query',
  },
}

export const CARRIER_EVENT_NAME = modules.carrier
export const FACE_EVENT_NAME = modules.face
