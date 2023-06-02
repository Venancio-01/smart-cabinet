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
var _child_process = require("child_process");
var _serialport = require("serialport");
var _utils = require("../utils");
var _serialport1 = /*#__PURE__*/ _interop_require_default(require("../utils/serial-port"));
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
// 串口实例
var instance = null;
var connected = false;
function getConnectState(path) {
    return _getConnectState.apply(this, arguments);
}
function _getConnectState() {
    _getConnectState = _async_to_generator(function(path) {
        var list;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        _serialport.SerialPort.list()
                    ];
                case 1:
                    list = _state.sent();
                    connected = Boolean(list.find(function(item) {
                        return item.path === path;
                    }));
                    return [
                        2,
                        connected
                    ];
            }
        });
    });
    return _getConnectState.apply(this, arguments);
}
function setPermissions() {
    return _setPermissions.apply(this, arguments);
}
function _setPermissions() {
    _setPermissions = // 设置串口权限
    _async_to_generator(function() {
        var error;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _state.trys.push([
                        0,
                        2,
                        ,
                        3
                    ]);
                    return [
                        4,
                        (0, _child_process.execSync)("sudo chmod 777 /dev/ttyUSB0")
                    ];
                case 1:
                    _state.sent();
                    console.log("设置串口权限成功");
                    return [
                        3,
                        3
                    ];
                case 2:
                    error = _state.sent();
                    console.log("设置串口权限失败");
                    return [
                        3,
                        3
                    ];
                case 3:
                    return [
                        2
                    ];
            }
        });
    });
    return _setPermissions.apply(this, arguments);
}
function init(path, baudRate) {
    return _init.apply(this, arguments);
}
function _init() {
    _init = _async_to_generator(function(path, baudRate) {
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    if (instance) return [
                        2
                    ];
                    return [
                        4,
                        setPermissions()
                    ];
                case 1:
                    _state.sent();
                    if (!connected) {
                        console.log("未连接锁控板，初始化失败");
                        return [
                            2
                        ];
                    }
                    instance = new _serialport1.default({
                        path: path,
                        baudRate: baudRate
                    });
                    return [
                        4,
                        instance.open()
                    ];
                case 2:
                    _state.sent();
                    return [
                        4,
                        instance.close()
                    ];
                case 3:
                    _state.sent();
                    return [
                        4,
                        instance.open()
                    ];
                case 4:
                    _state.sent();
                    return [
                        2
                    ];
            }
        });
    });
    return _init.apply(this, arguments);
}
function close() {
    return _close.apply(this, arguments);
}
function _close() {
    _close = _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            if (!instance) return [
                2
            ];
            instance.close();
            return [
                2
            ];
        });
    });
    return _close.apply(this, arguments);
}
/**
 * @description: 查询锁状态
 * @return {*}
 */ function queryAllState() {
    if (!instance) return false;
    var command = (0, _utils.generateLockCommand)("80010033");
    instance.write(command);
}
/**
 * @description: 开锁
 * @param {string} boardAddress 板地址，格式 01、02
 * @param {string} lockAddress 锁地址，格式 01、02
 * @return {*}
 */ function open() {
    var boardAddress = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "01", lockAddress = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "01";
    if (!instance) return false;
    var command = (0, _utils.generateLockCommand)("8a".concat(boardAddress).concat(lockAddress, "11"));
    instance.write(command);
}
/**
 * @description: 开启全部锁
 * @return {*}
 */ function openAll() {
    if (!instance) return false;
    var command = (0, _utils.generateLockCommand)("8a010011");
    instance.write(command);
}
/**
 * @description: 获取门锁开启状态
 * @return {*}
 */ function getOpenStatus() {
    if (!instance) {
        console.log("实例未初始化");
        return null;
    }
    var COMMAND_HEADER = "8001";
    var MAX_LOCK_COUNT = 24;
    var data = instance.getData();
    // 找出命令的返回结果
    var commandHeaderIndex = data.indexOf(COMMAND_HEADER);
    var commandBody = data.slice(commandHeaderIndex + COMMAND_HEADER.length, commandHeaderIndex + COMMAND_HEADER.length + 10);
    // 锁控板命令未接收完整
    if (commandBody.length < 10) return null;
    // 最多一次查询 24 个锁的状态，分三组，每组 8 个锁，转化为 2 进制后格式为 00000001 ，0 代表开启，1 代表关闭
    // 17 - 24 锁控状态
    var lockGroup_3 = (0, _utils.convertDecimalToBinary)(Number(commandBody.slice(0, 2)));
    // 9 - 16 锁控状态
    var lockGroup_2 = (0, _utils.convertDecimalToBinary)(Number(commandBody.slice(2, 4)));
    // 1 - 8 锁控状态
    var lockGroup_1 = (0, _utils.convertDecimalToBinary)(Number(commandBody.slice(4, 6)));
    var result = new Array(MAX_LOCK_COUNT).fill(0).reduce(function(acc, cur, index) {
        var group = index < 8 ? lockGroup_1 : index < 16 ? lockGroup_2 : lockGroup_3;
        var lockIndex = index < 8 ? index : index < 16 ? index - 8 : index - 16;
        acc[index + 1] = group[lockIndex] === "0";
        return acc;
    }, {});
    instance.setData("");
    return result;
}
var lockControlService = {
    name: "lockControl",
    fns: {
        getConnectState: getConnectState,
        init: init,
        close: close,
        queryAllState: queryAllState,
        open: open,
        openAll: openAll,
        getOpenStatus: getOpenStatus
    }
};
var _default = lockControlService;

//# sourceMappingURL=lock-control-service.js.map