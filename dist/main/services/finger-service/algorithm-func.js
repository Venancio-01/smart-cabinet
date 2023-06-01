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
const _config = require("../../config");
const _types = require("./types");
const _ffinapi = require("ffi-napi");
const _fs = /*#__PURE__*/ _interop_require_default(require("fs"));
const _child_process = require("child_process");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
let algorithmSDK = null;
const zkfingerLibPath = '/usr/lib/libzkfinger10.so';
const checkFileExist = ()=>{
    if (!_fs.default.existsSync(zkfingerLibPath)) {
        // 文件不存在，复制文件
        try {
            (0, _child_process.execSync)(`sudo cp ${_config.LIBZKFINGER10_PATH} ${zkfingerLibPath}`);
            console.log('libzkfinger10.so 文件复制成功');
        } catch (err) {
            console.error(err);
        }
    } else {
        console.log('libzkfinger10.so 文件已存在');
    }
};
const initAlgorithmSDK = ()=>{
    algorithmSDK = (0, _ffinapi.Library)(_config.ALGORITHM_SDK_PATH, {
        BIOKEY_INIT_SIMPLE: [
            _types.HandleType,
            [
                'int',
                'int',
                'int',
                'int'
            ]
        ],
        BIOKEY_CLOSE: [
            'int',
            [
                _types.HandleType
            ]
        ],
        BIOKEY_EXTRACT_GRAYSCALEDATA: [
            'int',
            [
                _types.HandleType,
                _types.UcharType,
                'int',
                'int',
                _types.UcharType,
                'int',
                'int'
            ]
        ],
        BIOKEY_IDENTIFYTEMP: [
            'int',
            [
                _types.HandleType,
                _types.UcharType,
                _types.IntType,
                _types.IntType
            ]
        ],
        BIOKEY_GENTEMPLATE: [
            'int',
            [
                _types.HandleType,
                _types.TemplateType,
                'int',
                _types.UcharType
            ]
        ],
        BIOKEY_VERIFY: [
            'int',
            [
                _types.HandleType,
                _types.UcharType,
                _types.UcharType
            ]
        ],
        BIOKEY_DB_ADD: [
            'int',
            [
                _types.HandleType,
                'int',
                'int',
                _types.UcharType
            ]
        ] // 添加模板到1:N内存中
    });
};
const destroyAlgorithmSDK = ()=>{
    algorithmSDK = null;
};
const initAlgorithm = (width, height)=>{
    return algorithmSDK.BIOKEY_INIT_SIMPLE(0, width, height, 0);
};
const closeAlgorithm = (handle)=>{
    return algorithmSDK.BIOKEY_CLOSE(handle);
};
const generateTemplate = (handle, templates, num, gTemplate)=>{
    const result = algorithmSDK.BIOKEY_GENTEMPLATE(handle, templates, num, gTemplate);
    const success = result > 0;
    return {
        success,
        result
    };
};
const verifyTemplate = (handle, template1, template2)=>{
    // 返回分数(0~1000), 推荐阈值50
    const result = algorithmSDK.BIOKEY_VERIFY(handle, template1, template2);
    const success = result >= _config.VERIFY_SCORE_THRESHOLD;
    return success;
};
const identifyTemplate = (handle, templateDate, tid, score)=>{
    return algorithmSDK.BIOKEY_IDENTIFYTEMP(handle, templateDate, tid, score);
};
const extractTemplate = (handle, imageBuffer, width, height, template, len)=>{
    return algorithmSDK.BIOKEY_EXTRACT_GRAYSCALEDATA(handle, imageBuffer, width, height, template, len, 0);
};
const addTemplateToDb = (handle, tid, templateLength, templateData)=>{
    const result = algorithmSDK.BIOKEY_DB_ADD(handle, tid, templateLength, templateData);
    const success = result === 1;
    return {
        success,
        result
    };
};

//# sourceMappingURL=algorithm-func.js.map