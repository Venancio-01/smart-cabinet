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
    handleExitUpdateService: function() {
        return handleExitUpdateService;
    },
    default: function() {
        return _default;
    }
});
var _socket = /*#__PURE__*/ _interop_require_default(require("../utils/socket"));
var _config = require("../config");
var _utils = require("../utils");
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
var instance = null;
var isConnected = false;
function handleExitUpdateService() {
    if (!isConnected) return;
    var message = {
        type: "exit"
    };
    handleSendData(message);
}
function handleSendData(data) {
    var stringifyData = JSON.stringify(data);
    instance.write(stringifyData);
}
function handleReceiveData() {
    if (!isConnected) return;
    var data = instance.getData();
    if (data === "") return null;
    instance.setData("");
    try {
        var parseData = JSON.parse(data);
        return parseData;
    } catch (e) {
        console.log(e);
        return null;
    }
}
function handleSendCheckVersionMessage() {
    if (!isConnected) return;
    var data = {
        type: "version",
        content: (0, _utils.getAppVersion)(),
        path: "https://service.qingshan.ltd/version.json"
    };
    handleSendData(data);
}
function handleSendDownloadMessage() {
    if (!isConnected) return;
    var data = {
        type: "download"
    };
    handleSendData(data);
}
var updateService = {
    name: "update",
    fns: {
        init: /*#__PURE__*/ _async_to_generator(function() {
            var e;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        instance = new _socket.default({
                            address: _config.UPDATE_SERVICE_SOCKET_PATH,
                            format: "utf-8"
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
                            instance.init()
                        ];
                    case 2:
                        _state.sent();
                        return [
                            2,
                            isConnected = true
                        ];
                    case 3:
                        e = _state.sent();
                        console.log(e, "update service socket 连接失败");
                        return [
                            2,
                            isConnected
                        ];
                    case 4:
                        return [
                            2
                        ];
                }
            });
        }),
        handleReceiveData: handleReceiveData,
        handleSendCheckVersionMessage: handleSendCheckVersionMessage,
        handleSendDownloadMessage: handleSendDownloadMessage,
        handleExitUpdateService: handleExitUpdateService
    }
};
var _default = updateService;

//# sourceMappingURL=update-service.js.map