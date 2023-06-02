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
    getReportData: function() {
        return getReportData;
    },
    default: function() {
        return _default;
    }
});
var _buffer = require("buffer");
var _utils = require("../utils");
var _socket = /*#__PURE__*/ _interop_require_default(require("../utils/socket"));
function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_without_holes(arr) {
    if (Array.isArray(arr)) return _array_like_to_array(arr);
}
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
var instanceMap = {};
function generateAntennaCommand(antennaIds) {
    var binary = (0, _utils.generateBinaryString)(antennaIds);
    var command = (0, _utils.binaryToHex)(binary);
    return command;
}
function init(address, port) {
    return _init.apply(this, arguments);
}
function _init() {
    _init = _async_to_generator(function(address, port) {
        var e;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    if (instanceMap[address]) return [
                        2,
                        true
                    ];
                    instanceMap[address] = new _socket.default({
                        address: address,
                        port: port
                    });
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        3,
                        ,
                        4
                    ]);
                    return [
                        4,
                        instanceMap[address].init()
                    ];
                case 2:
                    _state.sent();
                    return [
                        2,
                        true
                    ];
                case 3:
                    e = _state.sent();
                    console.log(e, "rfid socket 连接失败");
                    return [
                        2,
                        false
                    ];
                case 4:
                    return [
                        2
                    ];
            }
        });
    });
    return _init.apply(this, arguments);
}
function destroy(address) {
    if (!instanceMap[address]) return;
    instanceMap[address].destroy();
    instanceMap[address] = null;
}
function sendCloseCommand(address) {
    if (!instanceMap[address]) return;
    instanceMap[address].write(_buffer.Buffer.from("5A000102FF0000885A", "hex"));
}
function sendOpenCommand(address, antennaIds) {
    if (!instanceMap[address]) return;
    var COMMAND_HEADER = "5A";
    var commandBody = "000102100008".concat(generateAntennaCommand(antennaIds), "01020006");
    var checkCode = (0, _utils.generateCRC16Code)(commandBody);
    var command = COMMAND_HEADER + commandBody + checkCode;
    instanceMap[address].write(_buffer.Buffer.from(command, "hex"));
}
function getReportData(address) {
    if (!instanceMap[address]) {
        console.log("socket 连接不存在");
        return [];
    }
    var data = instanceMap[address].getData();
    var reportData = (0, _utils.parseRFIDReportData)(data);
    var TIDList = _to_consumable_array(new Set(reportData.map(function(item) {
        return (0, _utils.getTIDByReportData)(item);
    })));
    return TIDList;
}
var rfidService = {
    name: "rfid",
    fns: {
        init: init,
        destroy: destroy,
        sendCloseCommand: sendCloseCommand,
        sendOpenCommand: sendOpenCommand,
        getReportData: getReportData
    }
};
var _default = rfidService;

//# sourceMappingURL=rfid-service.js.map