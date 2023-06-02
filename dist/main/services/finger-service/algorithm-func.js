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
    checkFileExist: function() {
        return checkFileExist;
    },
    initAlgorithmSDK: function() {
        return initAlgorithmSDK;
    },
    destroyAlgorithmSDK: function() {
        return destroyAlgorithmSDK;
    },
    initAlgorithm: function() {
        return initAlgorithm;
    },
    closeAlgorithm: function() {
        return closeAlgorithm;
    },
    generateTemplate: function() {
        return generateTemplate;
    },
    verifyTemplate: function() {
        return verifyTemplate;
    },
    identifyTemplate: function() {
        return identifyTemplate;
    },
    extractTemplate: function() {
        return extractTemplate;
    },
    addTemplateToDb: function() {
        return addTemplateToDb;
    }
});
var _fs = require("fs");
var _child_process = require("child_process");
var _ffinapi = require("ffi-napi");
var _types = require("./types");
var _config = require("../../config");
var algorithmSDK = null;
var zkfingerLibPath = "/usr/lib/libzkfinger10.so";
function checkFileExist() {
    if (!(0, _fs.existsSync)(zkfingerLibPath)) {
        // 文件不存在，复制文件
        try {
            (0, _child_process.execSync)("sudo cp ".concat(_config.LIBZKFINGER10_PATH, " ").concat(zkfingerLibPath));
            console.log("libzkfinger10.so 文件复制成功");
        } catch (err) {
            console.error(err);
        }
    } else {
        console.log("libzkfinger10.so 文件已存在");
    }
}
function initAlgorithmSDK() {
    algorithmSDK = (0, _ffinapi.Library)(_config.ALGORITHM_SDK_PATH, {
        BIOKEY_INIT_SIMPLE: [
            _types.HandleType,
            [
                "int",
                "int",
                "int",
                "int"
            ]
        ],
        BIOKEY_CLOSE: [
            "int",
            [
                _types.HandleType
            ]
        ],
        BIOKEY_EXTRACT_GRAYSCALEDATA: [
            "int",
            [
                _types.HandleType,
                _types.UcharType,
                "int",
                "int",
                _types.UcharType,
                "int",
                "int"
            ]
        ],
        BIOKEY_IDENTIFYTEMP: [
            "int",
            [
                _types.HandleType,
                _types.UcharType,
                _types.IntType,
                _types.IntType
            ]
        ],
        BIOKEY_GENTEMPLATE: [
            "int",
            [
                _types.HandleType,
                _types.TemplateType,
                "int",
                _types.UcharType
            ]
        ],
        BIOKEY_VERIFY: [
            "int",
            [
                _types.HandleType,
                _types.UcharType,
                _types.UcharType
            ]
        ],
        BIOKEY_DB_ADD: [
            "int",
            [
                _types.HandleType,
                "int",
                "int",
                _types.UcharType
            ]
        ]
    });
}
function destroyAlgorithmSDK() {
    algorithmSDK = null;
}
function initAlgorithm(width, height) {
    return algorithmSDK.BIOKEY_INIT_SIMPLE(0, width, height, 0);
}
function closeAlgorithm(handle) {
    return algorithmSDK.BIOKEY_CLOSE(handle);
}
function generateTemplate(handle, templates, num, gTemplate) {
    var result = algorithmSDK.BIOKEY_GENTEMPLATE(handle, templates, num, gTemplate);
    var success = result > 0;
    return {
        success: success,
        result: result
    };
}
function verifyTemplate(handle, template1, template2) {
    // 返回分数(0~1000), 推荐阈值50
    var result = algorithmSDK.BIOKEY_VERIFY(handle, template1, template2);
    var success = result >= _config.VERIFY_SCORE_THRESHOLD;
    return success;
}
function identifyTemplate(handle, templateDate, tid, score) {
    return algorithmSDK.BIOKEY_IDENTIFYTEMP(handle, templateDate, tid, score);
}
function extractTemplate(handle, imageBuffer, width, height, template, len) {
    return algorithmSDK.BIOKEY_EXTRACT_GRAYSCALEDATA(handle, imageBuffer, width, height, template, len, 0);
}
function addTemplateToDb(handle, tid, templateLength, templateData) {
    var result = algorithmSDK.BIOKEY_DB_ADD(handle, tid, templateLength, templateData);
    var success = result === 1;
    return {
        success: success,
        result: result
    };
}

//# sourceMappingURL=algorithm-func.js.map