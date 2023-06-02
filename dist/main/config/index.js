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
    WINDOW_SIZE: function() {
        return WINDOW_SIZE;
    },
    RFID_ADDRESS: function() {
        return RFID_ADDRESS;
    },
    RFID_PORT: function() {
        return RFID_PORT;
    },
    SERVICE_PATH: function() {
        return SERVICE_PATH;
    },
    UPDATE_SERVICE_SOCKET_PATH: function() {
        return UPDATE_SERVICE_SOCKET_PATH;
    },
    EVN_FILE_PATH: function() {
        return EVN_FILE_PATH;
    },
    DEVTOOLS_PATH: function() {
        return DEVTOOLS_PATH;
    },
    MAX_DEVICE_NUM: function() {
        return MAX_DEVICE_NUM;
    },
    MAX_REGISTRATION_COUNT: function() {
        return MAX_REGISTRATION_COUNT;
    },
    TEMPLATE_BYTE_LENGTH: function() {
        return TEMPLATE_BYTE_LENGTH;
    },
    VERIFY_SCORE_THRESHOLD: function() {
        return VERIFY_SCORE_THRESHOLD;
    },
    DEVICE_SDK_PATH: function() {
        return DEVICE_SDK_PATH;
    },
    ALGORITHM_SDK_PATH: function() {
        return ALGORITHM_SDK_PATH;
    },
    LIBZKFINGER10_PATH: function() {
        return LIBZKFINGER10_PATH;
    },
    CRC_SDK_PATH: function() {
        return CRC_SDK_PATH;
    }
});
var _path = require("path");
var isDev = true;
var WINDOW_SIZE = {
    width: 1024,
    height: 768
};
var RFID_ADDRESS = "192.168.1.181";
var RFID_PORT = 8899;
var SERVICE_PATH = "/home/js/Project/go/src/hjrich-update-service/hjrich-update-service";
var UPDATE_SERVICE_SOCKET_PATH = "/tmp/hjrich-update-service.sock";
var EVN_FILE_PATH = isDev ? "src/main/database/.env" : (0, _path.join)(process.resourcesPath, ".env");
var DEVTOOLS_PATH = (0, _path.join)(__dirname, "../../../devtools/6.5.0_0");
var MAX_DEVICE_NUM = 16;
var MAX_REGISTRATION_COUNT = 3;
var TEMPLATE_BYTE_LENGTH = 2048;
var VERIFY_SCORE_THRESHOLD = 50;
var DEVICE_SDK_PATH = isDev ? "src/main/public/finger-lib/libzkfpcap.so" : (0, _path.join)(process.resourcesPath, "/public/finger-lib/libzkfpcap.so");
var ALGORITHM_SDK_PATH = isDev ? "src/main/public/finger-lib/libzkfp.so" : (0, _path.join)(process.resourcesPath, "/public/finger-lib/libzkfp.so");
var LIBZKFINGER10_PATH = isDev ? "src/main/public/finger-lib/libzkfinger10.so" : (0, _path.join)(process.resourcesPath, "/public/finger-lib/libzkfinger10.so");
var CRC_SDK_PATH = isDev ? "src/main/public/crc-lib/libCRC16_CCITT.so" : (0, _path.join)(process.resourcesPath, "/public/crc-lib/libCRC16_CCITT.so");

//# sourceMappingURL=index.js.map