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
var _ffinapi = require("ffi-napi");
var _types = require("./types");
var _config = require("../../config");
// 通过 ffi 解析 C++ SDK 方法
var deviceSDK = null;
function initDeviceSDK() {
    deviceSDK = (0, _ffinapi.Library)(_config.DEVICE_SDK_PATH, {
        sensorEnumDevices: [
            "int",
            [
                _types.DeviceArrayType,
                "int"
            ]
        ],
        sensorOpen: [
            _types.HandleType,
            [
                _types.DeviceTypePointerType
            ]
        ],
        sensorClose: [
            "int",
            [
                _types.HandleType
            ]
        ],
        sensorCapture: [
            "int",
            [
                _types.HandleType,
                _types.UcharType,
                "int"
            ]
        ],
        sensorGetParameter: [
            "int",
            [
                _types.HandleType,
                "int"
            ]
        ]
    });
}
function destroyDeviceSDK() {
    deviceSDK = null;
}
function getDeviceCount(deviceList, max) {
    return deviceSDK.sensorEnumDevices(deviceList, max);
}
function openDeviceByHandle(handle) {
    return deviceSDK.sensorOpen(handle);
}
function closeDeviceByHandle(handle) {
    return deviceSDK.sensorClose(handle);
}
function getParameterByHandle(handle, type) {
    return deviceSDK.sensorGetParameter(handle, type);
}
function captureFingerImage(handle, imageBuffer, size) {
    return deviceSDK.sensorCapture(handle, imageBuffer, size);
}

//# sourceMappingURL=device-func.js.map