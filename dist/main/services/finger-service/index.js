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
const _devicefunc = require("./device-func");
const _algorithmfunc = require("./algorithm-func");
const _types = require("./types");
const _config = require("../../config");
const _utils = require("../../utils");
const _finger = require("../../database/methods/finger");
const _database = /*#__PURE__*/ _interop_require_default(require("../../database"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
// 指纹仪设备数组
const deviceList = new _types.DeviceArrayType(_config.MAX_DEVICE_NUM);
// 当前指纹仪在线状态
let connected = false;
// 当前指纹仪开启状态
let isOpen = false;
// 当前接入的指纹仪设备句柄
let deviceHandle = null;
// 指纹图像数据
let imageBuffer = null;
// 指纹设备宽高
let deviceWidth = 0;
let deviceHeight = 0;
// 算法句柄
let algorithmHandler = null;
// 注册时，采集指纹数据数组
let registerTemplates = [];
// 注册时，当前按压指纹次数索引
let registerCurrentIndex = 0;
// 指纹对应的用户数据
let userFingerData = [];
const initSDK = ()=>{
    (0, _algorithmfunc.checkFileExist)();
    (0, _devicefunc.initDeviceSDK)();
    (0, _algorithmfunc.initAlgorithmSDK)();
};
const destroySDK = ()=>{
    (0, _devicefunc.destroyDeviceSDK)();
    (0, _algorithmfunc.destroyAlgorithmSDK)();
};
/**
 * @description: 查询当前设备在线情况
 * @return {*}
 */ const queryConnectState = ()=>{
    const count = (0, _devicefunc.getDeviceCount)(deviceList, _config.MAX_DEVICE_NUM);
    console.log("指纹仪连接数量：", count);
    connected = count > 0;
    return connected;
};
/**
 * @description: 打开指纹仪设备
 * @return {*}
 */ const openDevice = ()=>{
    if (!connected) return false;
    if (isOpen) return true;
    // 开启设备
    deviceHandle = (0, _devicefunc.openDeviceByHandle)(deviceList[0].ref());
    // 获取设备参数
    getParameter();
    // 初始化算法
    algorithmHandler = (0, _algorithmfunc.initAlgorithm)(deviceWidth, deviceHeight);
    const success = deviceHandle.deref() !== null && algorithmHandler.deref() !== null;
    isOpen = success;
    loadAllTemplate();
    return success;
};
/**
 * @description: 关闭指纹仪设备
 * @return {*}
 */ const closeDevice = ()=>{
    if (!connected || !isOpen) return false;
    //关闭设备
    const deviceCloseResult = (0, _devicefunc.closeDeviceByHandle)(deviceHandle);
    // 关闭算法
    const algorithmCloseResult = (0, _algorithmfunc.closeAlgorithm)(algorithmHandler);
    const success = deviceCloseResult === 0 && algorithmCloseResult === 1;
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
};
/**
 * @description: 获取指纹仪宽高
 * @return {*}
 */ const getParameter = ()=>{
    deviceWidth = (0, _devicefunc.getParameterByHandle)(deviceHandle, 1);
    deviceHeight = (0, _devicefunc.getParameterByHandle)(deviceHandle, 2);
    imageBuffer = new _types.UcharType(deviceWidth * deviceHeight);
};
/**
 * @description: 开始采集指纹
 * @return {*}
 */ const startFingerCapture = ()=>{
    if (!connected || !isOpen) return false;
    // 获取指纹仪捕获到的图像
    const result = (0, _devicefunc.captureFingerImage)(deviceHandle, imageBuffer, deviceWidth * deviceHeight);
    if (result <= 0) return false;
    const templateData = new _types.UcharType(2048);
    // 提取图像
    const templateDataLen = (0, _algorithmfunc.extractTemplate)(algorithmHandler, imageBuffer, deviceWidth, deviceHeight, templateData, 2048);
    if (templateDataLen <= 0) return false;
    return templateData;
};
const handleRegister = async (userId, order)=>{
    let result = null;
    const templateData = startFingerCapture();
    if (templateData) {
        result = await onRegister(templateData, userId, order);
    }
    return result;
};
/**
 * @description: 注册指纹
 * @return {*}
 */ const onRegister = async (templateData, userId, order)=>{
    const resetRegisterData = ()=>{
        registerCurrentIndex = 0;
        registerTemplates = [];
    };
    const { success: isRegistered  } = onIdentify(templateData);
    if (isRegistered) {
        resetRegisterData();
        return (0, _utils.genResponseData)(false, '登记失败，当前手指已登记', {
            alert: true
        });
    }
    if (registerCurrentIndex >= _config.MAX_REGISTRATION_COUNT) {
        resetRegisterData();
        return (0, _utils.genResponseData)(false);
    }
    if (registerCurrentIndex > 0) {
        // 对比前后两次采集的指纹
        const success = (0, _algorithmfunc.verifyTemplate)(algorithmHandler, registerTemplates[registerCurrentIndex - 1], templateData);
        if (!success) {
            resetRegisterData();
            return (0, _utils.genResponseData)(false, '登记失败，请按压同一个手指', {
                alert: true
            });
        }
    }
    registerTemplates[registerCurrentIndex] = templateData;
    registerCurrentIndex++;
    if (registerCurrentIndex !== _config.MAX_REGISTRATION_COUNT) {
        return (0, _utils.genResponseData)(true, `您还需要按压${_config.MAX_REGISTRATION_COUNT - registerCurrentIndex}次手指`);
    }
    const regTemplates = new _types.TemplateType(registerTemplates);
    const registerTemplateData = new _types.UcharType(_config.TEMPLATE_BYTE_LENGTH);
    const { success: genTempSuccess , result: genTempResult  } = (0, _algorithmfunc.generateTemplate)(algorithmHandler, regTemplates, _config.MAX_REGISTRATION_COUNT, registerTemplateData);
    if (!genTempSuccess) {
        resetRegisterData();
        return (0, _utils.genResponseData)(false, `生成登记模板失败，错误代码 = ${genTempResult}`, {
            alert: true
        });
    }
    const { success: addDbSuccess , result  } = (0, _algorithmfunc.addTemplateToDb)(algorithmHandler, 9999, genTempResult, registerTemplateData);
    if (!addDbSuccess) {
        resetRegisterData();
        return (0, _utils.genResponseData)(true, `添加指纹失败，错误代码 = ${result}`, {
            alert: true
        });
    }
    const fingerData = await (0, _finger.queryFingerByUserIdAndOrder)(userId, order);
    const data = registerTemplateData.buffer.toString('base64');
    const orderText = order === 1 ? '一' : '二';
    if (fingerData !== null) {
        try {
            await (0, _finger.updateFingerByUserIdAndOrder)(userId, order, data);
            resetRegisterData();
            return (0, _utils.genResponseData)(true, `指纹${orderText}更新成功`, {
                registerSuccess: true,
                alert: true
            });
        } catch (e) {
            resetRegisterData();
            return (0, _utils.genResponseData)(false, `指纹${orderText}更新失败`, {
                alert: true
            });
        }
    } else {
        try {
            await (0, _finger.addFinger)(userId, order, data);
            resetRegisterData();
            return (0, _utils.genResponseData)(true, `指纹${orderText}添加成功`, {
                registerSuccess: true,
                alert: true
            });
        } catch (e) {
            resetRegisterData();
            return (0, _utils.genResponseData)(false, `指纹${orderText}添加失败`, {
                alert: true
            });
        }
    }
};
/**
     * @description: 识别指纹
     * @return {*}
     */ const onIdentify = (templateData)=>{
    var _userFingerData_fingerIndex;
    const score = new _types.IntType(1);
    const fingerId = new _types.IntType(1);
    const result = (0, _algorithmfunc.identifyTemplate)(algorithmHandler, templateData, fingerId, score);
    const success = result === 1;
    const msg = success ? '识别成功!' : '识别失败';
    const fingerIndex = fingerId[0] - 1;
    const userId = (_userFingerData_fingerIndex = userFingerData[fingerIndex]) === null || _userFingerData_fingerIndex === void 0 ? void 0 : _userFingerData_fingerIndex.user_id;
    return (0, _utils.genResponseData)(success, msg, userId);
};
const handleIdentify = ()=>{
    let result = null;
    const templateData = startFingerCapture();
    if (templateData) {
        result = onIdentify(templateData);
    }
    return result;
};
/**
    * @description: 加载数据库指纹模板到内存
    * @return {*}
    */ const loadAllTemplate = async ()=>{
    userFingerData = await _database.default.rfid_finger_user.findMany({
        select: {
            data: true,
            user_id: true
        }
    });
    if (userFingerData.length === 0) return;
    userFingerData.forEach((item, index)=>{
        if (item.data) {
            const buf = Buffer.from(item.data, 'base64');
            (0, _algorithmfunc.addTemplateToDb)(algorithmHandler, index + 1, _config.TEMPLATE_BYTE_LENGTH, buf);
        }
    });
};
const fingerService = {
    name: 'finger',
    fns: {
        initSDK,
        destroySDK,
        queryConnectState,
        openDevice,
        closeDevice,
        getParameter,
        startFingerCapture,
        handleRegister,
        onRegister,
        onIdentify,
        handleIdentify,
        loadAllTemplate
    }
};
const _default = fingerService;

//# sourceMappingURL=index.js.map