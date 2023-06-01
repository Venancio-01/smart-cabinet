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
    genResponseData: function() {
        return genResponseData;
    },
    genMd5EncryptedPassword: function() {
        return genMd5EncryptedPassword;
    },
    parseRFIDReportData: function() {
        return parseRFIDReportData;
    },
    getTIDByReportData: function() {
        return getTIDByReportData;
    },
    generateCurrentTime: function() {
        return generateCurrentTime;
    },
    convertDecimalToBinary: function() {
        return convertDecimalToBinary;
    },
    generateBinaryString: function() {
        return generateBinaryString;
    },
    binaryToHex: function() {
        return binaryToHex;
    },
    generateLockCommand: function() {
        return generateLockCommand;
    },
    generateCRC16Code: function() {
        return generateCRC16Code;
    },
    getAppVersion: function() {
        return getAppVersion;
    }
});
const _cryptojs = require("crypto-js");
const _dayjs = /*#__PURE__*/ _interop_require_default(require("dayjs"));
const _ffinapi = require("ffi-napi");
const _types = require("../services/finger-service/types");
const _config = require("../config");
const _packagejson = /*#__PURE__*/ _interop_require_default(require("../../package.json"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const genResponseData = (success, msg, data)=>{
    return {
        success,
        msg,
        data
    };
};
const genMd5EncryptedPassword = (username, password, salt)=>{
    return (0, _cryptojs.MD5)(username + password + salt).toString();
};
const parseRFIDReportData = (data)=>{
    const PREFIX = '5a00011200';
    const arr = data.split(PREFIX);
    const parseArr = arr.reduce((acc, cur)=>{
        if (cur.startsWith('00')) {
            const length = parseInt('0x' + cur.substring(0, 4), 16) * 2;
            acc.push(`${PREFIX}${cur.substring(0, 4 + length)}`);
        }
        return acc;
    }, []);
    return parseArr;
};
const getTIDByReportData = (data)=>{
    let str = data;
    const PREFIX = '5a00011200';
    const TIDLengthCommandLength = 4;
    const MidCommandLength = 16;
    str = str.replace(PREFIX, '');
    const EPCLength = parseInt('0x' + str.substring(4, 8), 16) * 2;
    const TIDLength = parseInt('0x' + str.substring(8 + EPCLength + MidCommandLength, 8 + EPCLength + MidCommandLength + TIDLengthCommandLength), 16) * 2;
    const TID = str.substring(8 + EPCLength + MidCommandLength + TIDLengthCommandLength, 8 + EPCLength + MidCommandLength + TIDLengthCommandLength + TIDLength);
    return TID;
};
const generateCurrentTime = ()=>{
    return (0, _dayjs.default)().format('YYYY-MM-DD HH:mm:ss');
};
const convertDecimalToBinary = (number)=>{
    const binary = number.toString(2);
    const binaryLength = binary.length;
    const MAX_LENGTH = 8;
    const binaryString = new Array(MAX_LENGTH - binaryLength).fill('0').join('') + binary;
    const result = binaryString.split('').reverse().join('');
    return result;
};
const generateBinaryString = (numbers)=>{
    const binaryArray = Array.from({
        length: 32
    }, ()=>'0');
    for (const num of numbers){
        binaryArray[num - 1] = '1';
    }
    return binaryArray.reverse().join('');
};
const binaryToHex = (binary)=>{
    const hex = parseInt(binary, 2).toString(16).toUpperCase();
    return hex.padStart(8, '0');
};
const generateLockCommand = (source)=>{
    const arr = [];
    for(let index = 0; index < source.length; index++){
        if (index % 2 === 0) {
            arr.push('0x' + source.slice(index, index + 2));
        }
    }
    const result = arr.reduce((acc, cur, index)=>{
        if (index === 0) acc = cur;
        else {
            acc = '0x' + (acc ^ cur).toString(16);
        }
        return acc;
    }, '');
    const command = [
        ...arr,
        result
    ].map((item)=>item.slice(2, 4)).join('').toLocaleUpperCase();
    return Buffer.from(command, 'hex');
};
const generateCRC16Code = (str)=>{
    const crcSDK = (0, _ffinapi.Library)(_config.CRC_SDK_PATH, {
        CRC16_CCITT: [
            'int',
            [
                _types.UcharType,
                'int'
            ]
        ]
    });
    const buffer = Buffer.from(str, 'hex');
    return crcSDK.CRC16_CCITT(buffer, buffer.length).toString(16);
};
const getAppVersion = ()=>{
    return _packagejson.default.version;
};

//# sourceMappingURL=index.js.map