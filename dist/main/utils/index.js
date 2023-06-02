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
var _buffer = require("buffer");
var _cryptojs = require("crypto-js");
var _dayjs = /*#__PURE__*/ _interop_require_default(require("dayjs"));
var _ffinapi = require("ffi-napi");
var _packagejson = /*#__PURE__*/ _interop_require_default(require("../../../package.json"));
var _types = require("../services/finger-service/types");
var _config = require("../config");
function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_without_holes(arr) {
    if (Array.isArray(arr)) return _array_like_to_array(arr);
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _iterable_to_array(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _non_iterable_spread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _to_consumable_array(arr) {
    return _array_without_holes(arr) || _iterable_to_array(arr) || _unsupported_iterable_to_array(arr) || _non_iterable_spread();
}
function _unsupported_iterable_to_array(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
}
function genResponseData(success, msg, data) {
    return {
        success: success,
        msg: msg,
        data: data
    };
}
function genMd5EncryptedPassword(username, password, salt) {
    return (0, _cryptojs.MD5)(username + password + salt).toString();
}
function parseRFIDReportData(data) {
    var PREFIX = "5a00011200";
    var arr = data.split(PREFIX);
    var parseArr = arr.reduce(function(acc, cur) {
        if (cur.startsWith("00")) {
            var length = parseInt("0x".concat(cur.substring(0, 4)), 16) * 2;
            acc.push("".concat(PREFIX).concat(cur.substring(0, 4 + length)));
        }
        return acc;
    }, []);
    return parseArr;
}
function getTIDByReportData(data) {
    var str = data;
    var PREFIX = "5a00011200";
    var TIDLengthCommandLength = 4;
    var MidCommandLength = 16;
    str = str.replace(PREFIX, "");
    var EPCLength = parseInt("0x".concat(str.substring(4, 8)), 16) * 2;
    var TIDLength = parseInt("0x".concat(str.substring(8 + EPCLength + MidCommandLength, 8 + EPCLength + MidCommandLength + TIDLengthCommandLength)), 16) * 2;
    var TID = str.substring(8 + EPCLength + MidCommandLength + TIDLengthCommandLength, 8 + EPCLength + MidCommandLength + TIDLengthCommandLength + TIDLength);
    return TID;
}
function generateCurrentTime() {
    return (0, _dayjs.default)().format("YYYY-MM-DD HH:mm:ss");
}
function convertDecimalToBinary(number) {
    var binary = number.toString(2);
    var binaryLength = binary.length;
    var MAX_LENGTH = 8;
    var binaryString = new Array(MAX_LENGTH - binaryLength).fill("0").join("") + binary;
    var result = binaryString.split("").reverse().join("");
    return result;
}
function generateBinaryString(numbers) {
    var binaryArray = Array.from({
        length: 32
    }, function() {
        return "0";
    });
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = numbers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var num = _step.value;
            binaryArray[num - 1] = "1";
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
            }
        } finally{
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
    return binaryArray.reverse().join("");
}
function binaryToHex(binary) {
    var hex = parseInt(binary, 2).toString(16).toUpperCase();
    return hex.padStart(8, "0");
}
function generateLockCommand(source) {
    var arr = [];
    for(var index = 0; index < source.length; index++){
        if (index % 2 === 0) arr.push("0x".concat(source.slice(index, index + 2)));
    }
    var result = arr.reduce(function(acc, cur, index) {
        if (index === 0) acc = cur;
        else acc = "0x".concat((acc ^ cur).toString(16));
        return acc;
    }, "");
    var command = _to_consumable_array(arr).concat([
        result
    ]).map(function(item) {
        return item.slice(2, 4);
    }).join("").toLocaleUpperCase();
    return _buffer.Buffer.from(command, "hex");
}
function generateCRC16Code(str) {
    var crcSDK = (0, _ffinapi.Library)(_config.CRC_SDK_PATH, {
        CRC16_CCITT: [
            "int",
            [
                _types.UcharType,
                "int"
            ]
        ]
    });
    var buffer = _buffer.Buffer.from(str, "hex");
    return crcSDK.CRC16_CCITT(buffer, buffer.length).toString(16);
}
function getAppVersion() {
    return _packagejson.default.version;
}

//# sourceMappingURL=index.js.map