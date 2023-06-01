"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    initDeviceSDK: function() {
        return initDeviceSDK;
    },
    destroyDeviceSDK: function() {
        return destroyDeviceSDK;
    },
    getDeviceCount: function() {
        return getDeviceCount;
    },
    openDeviceByHandle: function() {
        return openDeviceByHandle;
    },
    closeDeviceByHandle: function() {
        return closeDeviceByHandle;
    },
    getParameterByHandle: function() {
        return getParameterByHandle;
    },
    captureFingerImage: function() {
        return captureFingerImage;
    }
});
const _config = require("../../config");
const _types = require("./types");
const _ffinapi = require("ffi-napi");
// 通过 ffi 解析 C++ SDK 方法
let deviceSDK = null;
const initDeviceSDK = ()=>{
    deviceSDK = (0, _ffinapi.Library)(_config.DEVICE_SDK_PATH, {
        sensorEnumDevices: [
            'int',
            [
                _types.DeviceArrayType,
                'int'
            ]
        ],
        sensorOpen: [
            _types.HandleType,
            [
                _types.DeviceTypePointerType
            ]
        ],
        sensorClose: [
            'int',
            [
                _types.HandleType
            ]
        ],
        sensorCapture: [
            'int',
            [
                _types.HandleType,
                _types.UcharType,
                'int'
            ]
        ],
        sensorGetParameter: [
            'int',
            [
                _types.HandleType,
                'int'
            ]
        ] // 获取指纹仪简单参数
    });
};
const destroyDeviceSDK = ()=>{
    deviceSDK = null;
};
const getDeviceCount = (deviceList, max)=>{
    return deviceSDK.sensorEnumDevices(deviceList, max);
};
const openDeviceByHandle = (handle)=>{
    return deviceSDK.sensorOpen(handle);
};
const closeDeviceByHandle = (handle)=>{
    return deviceSDK.sensorClose(handle);
};
const getParameterByHandle = (handle, type)=>{
    return deviceSDK.sensorGetParameter(handle, type);
};
const captureFingerImage = (handle, imageBuffer, size)=>{
    return deviceSDK.sensorCapture(handle, imageBuffer, size);
};

//# sourceMappingURL=device-func.js.map