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
const _nodemachineid = require("node-machine-id");
const _cryptojs = /*#__PURE__*/ _interop_require_default(require("crypto-js"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const key = 'liqingshan_hjrich';
/**
 * 获取机器ID
 * @returns Promise<string>
 */ const getDeskId = async ()=>{
    const id = await (0, _nodemachineid.machineId)();
    return id;
};
/**
 * 加密
 * @param data 待加密数据
 * @returns string
 */ const encrypt = (data)=>{
    const encrypted = _cryptojs.default.HmacMD5(data, key).toString();
    return encrypted;
};
/**
 * 加密服务
 */ const encryptionService = {
    name: 'encryption',
    fns: {
        getDeskId,
        encrypt
    }
};
const _default = encryptionService;

//# sourceMappingURL=encryption-service.js.map