"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
var _buffer = /*#__PURE__*/ _interop_require_default(require("buffer"));
var _devicefunc = require("./device-func");
var _algorithmfunc = require("./algorithm-func");
var _types = require("./types");
var _config = require("../../config");
var _utils = require("../../utils");
var _finger = require("../../database/methods/finger");
var _database = /*#__PURE__*/ _interop_require_default(require("../../database"));
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _ts_generator(thisArg, body) {
    var f, y, t, g, _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    };
    return g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(_)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
}
// 指纹仪设备数组
var deviceList = new _types.DeviceArrayType(_config.MAX_DEVICE_NUM);
// 当前指纹仪在线状态
var connected = false;
// 当前指纹仪开启状态
var isOpen = false;
// 当前接入的指纹仪设备句柄
var deviceHandle = null;
// 指纹图像数据
var imageBuffer = null;
// 指纹设备宽高
var deviceWidth = 0;
var deviceHeight = 0;
// 算法句柄
var algorithmHandler = null;
// 注册时，采集指纹数据数组
var registerTemplates = [];
// 注册时，当前按压指纹次数索引
var registerCurrentIndex = 0;
// 指纹对应的用户数据
var userFingerData = [];
function initSDK() {
    (0, _algorithmfunc.checkFileExist)();
    (0, _devicefunc.initDeviceSDK)();
    (0, _algorithmfunc.initAlgorithmSDK)();
}
function destroySDK() {
    (0, _devicefunc.destroyDeviceSDK)();
    (0, _algorithmfunc.destroyAlgorithmSDK)();
}
/**
 * @description: 查询当前设备在线情况
 * @return {*}
 */ function queryConnectState() {
    var count = (0, _devicefunc.getDeviceCount)(deviceList, _config.MAX_DEVICE_NUM);
    console.log("指纹仪连接数量：", count);
    connected = count > 0;
    return connected;
}
/**
 * @description: 打开指纹仪设备
 * @return {*}
 */ function openDevice() {
    if (!connected) return false;
    if (isOpen) return true;
    // 开启设备
    deviceHandle = (0, _devicefunc.openDeviceByHandle)(deviceList[0].ref());
    // 获取设备参数
    getParameter();
    // 初始化算法
    algorithmHandler = (0, _algorithmfunc.initAlgorithm)(deviceWidth, deviceHeight);
    var success = deviceHandle.deref() !== null && algorithmHandler.deref() !== null;
    isOpen = success;
    loadAllTemplate();
    return success;
}
/**
 * @description: 关闭指纹仪设备
 * @return {*}
 */ function closeDevice() {
    if (!connected || !isOpen) return false;
    // 关闭设备
    var deviceCloseResult = (0, _devicefunc.closeDeviceByHandle)(deviceHandle);
    // 关闭算法
    var algorithmCloseResult = (0, _algorithmfunc.closeAlgorithm)(algorithmHandler);
    var success = deviceCloseResult === 0 && algorithmCloseResult === 1;
    // 重置指纹仪相关变量
    if (success) {
        isOpen = false;
        deviceHandle = null;
        imageBuffer = null;
        deviceWidth = 0;
        deviceHeight = 0;
        algorithmHandler = null;
        registerTemplates = [];
        registerCurrentIndex = 0;
    }
    return success;
}
/**
 * @description: 获取指纹仪宽高
 * @return {*}
 */ function getParameter() {
    deviceWidth = (0, _devicefunc.getParameterByHandle)(deviceHandle, 1);
    deviceHeight = (0, _devicefunc.getParameterByHandle)(deviceHandle, 2);
    imageBuffer = new _types.UcharType(deviceWidth * deviceHeight);
}
/**
 * @description: 开始采集指纹
 * @return {*}
 */ function startFingerCapture() {
    if (!connected || !isOpen) return false;
    // 获取指纹仪捕获到的图像
    var result = (0, _devicefunc.captureFingerImage)(deviceHandle, imageBuffer, deviceWidth * deviceHeight);
    if (result <= 0) return false;
    var templateData = new _types.UcharType(2048);
    // 提取图像
    var templateDataLen = (0, _algorithmfunc.extractTemplate)(algorithmHandler, imageBuffer, deviceWidth, deviceHeight, templateData, 2048);
    if (templateDataLen <= 0) return false;
    return templateData;
}
function handleRegister(userId, order) {
    return _handleRegister.apply(this, arguments);
}
function _handleRegister() {
    _handleRegister = _async_to_generator(function(userId, order) {
        var result, templateData;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    result = null;
                    templateData = startFingerCapture();
                    if (!templateData) return [
                        3,
                        2
                    ];
                    return [
                        4,
                        onRegister(templateData, userId, order)
                    ];
                case 1:
                    result = _state.sent();
                    _state.label = 2;
                case 2:
                    return [
                        2,
                        result
                    ];
            }
        });
    });
    return _handleRegister.apply(this, arguments);
}
function onRegister(templateData, userId, order) {
    return _onRegister.apply(this, arguments);
}
function _onRegister() {
    _onRegister = /**
 * @description: 注册指纹
 * @return {*}
 */ _async_to_generator(function(templateData, userId, order) {
        var resetRegisterData, _onIdentify, isRegistered, success, regTemplates, registerTemplateData, _generateTemplate, genTempSuccess, genTempResult, _addTemplateToDb, addDbSuccess, result, fingerData, data, orderText, e, e1;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    resetRegisterData = function() {
                        registerCurrentIndex = 0;
                        registerTemplates = [];
                    };
                    _onIdentify = onIdentify(templateData), isRegistered = _onIdentify.success;
                    if (isRegistered) {
                        resetRegisterData();
                        return [
                            2,
                            (0, _utils.genResponseData)(false, "登记失败，当前手指已登记", {
                                alert: true
                            })
                        ];
                    }
                    if (registerCurrentIndex >= _config.MAX_REGISTRATION_COUNT) {
                        resetRegisterData();
                        return [
                            2,
                            (0, _utils.genResponseData)(false)
                        ];
                    }
                    if (registerCurrentIndex > 0) {
                        success = (0, _algorithmfunc.verifyTemplate)(algorithmHandler, registerTemplates[registerCurrentIndex - 1], templateData);
                        if (!success) {
                            resetRegisterData();
                            return [
                                2,
                                (0, _utils.genResponseData)(false, "登记失败，请按压同一个手指", {
                                    alert: true
                                })
                            ];
                        }
                    }
                    registerTemplates[registerCurrentIndex] = templateData;
                    registerCurrentIndex++;
                    if (registerCurrentIndex !== _config.MAX_REGISTRATION_COUNT) return [
                        2,
                        (0, _utils.genResponseData)(true, "您还需要按压".concat(_config.MAX_REGISTRATION_COUNT - registerCurrentIndex, "次手指"))
                    ];
                    regTemplates = new _types.TemplateType(registerTemplates);
                    registerTemplateData = new _types.UcharType(_config.TEMPLATE_BYTE_LENGTH);
                    _generateTemplate = (0, _algorithmfunc.generateTemplate)(algorithmHandler, regTemplates, _config.MAX_REGISTRATION_COUNT, registerTemplateData), genTempSuccess = _generateTemplate.success, genTempResult = _generateTemplate.result;
                    if (!genTempSuccess) {
                        resetRegisterData();
                        return [
                            2,
                            (0, _utils.genResponseData)(false, "生成登记模板失败，错误代码 = ".concat(genTempResult), {
                                alert: true
                            })
                        ];
                    }
                    _addTemplateToDb = (0, _algorithmfunc.addTemplateToDb)(algorithmHandler, 9999, genTempResult, registerTemplateData), addDbSuccess = _addTemplateToDb.success, result = _addTemplateToDb.result;
                    if (!addDbSuccess) {
                        resetRegisterData();
                        return [
                            2,
                            (0, _utils.genResponseData)(true, "添加指纹失败，错误代码 = ".concat(result), {
                                alert: true
                            })
                        ];
                    }
                    return [
                        4,
                        (0, _finger.queryFingerByUserIdAndOrder)(userId, order)
                    ];
                case 1:
                    fingerData = _state.sent();
                    data = registerTemplateData.buffer.toString("base64");
                    orderText = order === 1 ? "一" : "二";
                    if (!(fingerData !== null)) return [
                        3,
                        6
                    ];
                    _state.label = 2;
                case 2:
                    _state.trys.push([
                        2,
                        4,
                        ,
                        5
                    ]);
                    return [
                        4,
                        (0, _finger.updateFingerByUserIdAndOrder)(userId, order, data)
                    ];
                case 3:
                    _state.sent();
                    resetRegisterData();
                    return [
                        2,
                        (0, _utils.genResponseData)(true, "指纹".concat(orderText, "更新成功"), {
                            registerSuccess: true,
                            alert: true
                        })
                    ];
                case 4:
                    e = _state.sent();
                    resetRegisterData();
                    return [
                        2,
                        (0, _utils.genResponseData)(false, "指纹".concat(orderText, "更新失败"), {
                            alert: true
                        })
                    ];
                case 5:
                    return [
                        3,
                        9
                    ];
                case 6:
                    _state.trys.push([
                        6,
                        8,
                        ,
                        9
                    ]);
                    return [
                        4,
                        (0, _finger.addFinger)(userId, order, data)
                    ];
                case 7:
                    _state.sent();
                    resetRegisterData();
                    return [
                        2,
                        (0, _utils.genResponseData)(true, "指纹".concat(orderText, "添加成功"), {
                            registerSuccess: true,
                            alert: true
                        })
                    ];
                case 8:
                    e1 = _state.sent();
                    resetRegisterData();
                    return [
                        2,
                        (0, _utils.genResponseData)(false, "指纹".concat(orderText, "添加失败"), {
                            alert: true
                        })
                    ];
                case 9:
                    return [
                        2
                    ];
            }
        });
    });
    return _onRegister.apply(this, arguments);
}
/**
     * @description: 识别指纹
     * @return {*}
     */ function onIdentify(templateData) {
    var _userFingerData_fingerIndex;
    var score = new _types.IntType(1);
    var fingerId = new _types.IntType(1);
    var result = (0, _algorithmfunc.identifyTemplate)(algorithmHandler, templateData, fingerId, score);
    var success = result === 1;
    var msg = success ? "识别成功!" : "识别失败";
    var fingerIndex = fingerId[0] - 1;
    var userId = (_userFingerData_fingerIndex = userFingerData[fingerIndex]) === null || _userFingerData_fingerIndex === void 0 ? void 0 : _userFingerData_fingerIndex.user_id;
    return (0, _utils.genResponseData)(success, msg, userId);
}
function handleIdentify() {
    var result = null;
    var templateData = startFingerCapture();
    if (templateData) result = onIdentify(templateData);
    return result;
}
function loadAllTemplate() {
    return _loadAllTemplate.apply(this, arguments);
}
function _loadAllTemplate() {
    _loadAllTemplate = /**
    * @description: 加载数据库指纹模板到内存
    * @return {*}
    */ _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        _database.default.rfid_finger_user.findMany({
                            select: {
                                data: true,
                                user_id: true
                            }
                        })
                    ];
                case 1:
                    userFingerData = _state.sent();
                    if (userFingerData.length === 0) return [
                        2
                    ];
                    userFingerData.forEach(function(item, index) {
                        if (item.data) {
                            var buf = _buffer.default.from(item.data, "base64");
                            (0, _algorithmfunc.addTemplateToDb)(algorithmHandler, index + 1, _config.TEMPLATE_BYTE_LENGTH, buf);
                        }
                    });
                    return [
                        2
                    ];
            }
        });
    });
    return _loadAllTemplate.apply(this, arguments);
}
var fingerService = {
    name: "finger",
    fns: {
        initSDK: initSDK,
        destroySDK: destroySDK,
        queryConnectState: queryConnectState,
        openDevice: openDevice,
        closeDevice: closeDevice,
        getParameter: getParameter,
        startFingerCapture: startFingerCapture,
        handleRegister: handleRegister,
        onRegister: onRegister,
        onIdentify: onIdentify,
        handleIdentify: handleIdentify,
        loadAllTemplate: loadAllTemplate
    }
};
var _default = fingerService;

//# sourceMappingURL=index.js.map