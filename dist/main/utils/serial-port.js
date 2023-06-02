"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return SerialPort;
    }
});
var _serialport = require("serialport");
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
function _class_call_check(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _create_class(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
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
var SerialPort = /*#__PURE__*/ function() {
    "use strict";
    function SerialPort(param) {
        var path = param.path, _param_baudRate = param.baudRate, baudRate = _param_baudRate === void 0 ? 115200 : _param_baudRate;
        _class_call_check(this, SerialPort);
        _define_property(this, "portInstance", null);
        _define_property(this, "data", "");
        this.init({
            path: path,
            baudRate: baudRate
        });
        this.addDataListener();
    }
    _create_class(SerialPort, [
        {
            key: "init",
            value: function init(param) {
                var path = param.path, _param_baudRate = param.baudRate, baudRate = _param_baudRate === void 0 ? 115200 : _param_baudRate;
                if (this.portInstance) return;
                this.portInstance = new _serialport.SerialPort({
                    path: path,
                    baudRate: baudRate,
                    autoOpen: false,
                    dataBits: 8,
                    stopBits: 1,
                    parity: "none"
                });
            }
        },
        {
            key: "open",
            value: function open() {
                var _this = this;
                return _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        return [
                            2,
                            new Promise(function(resolve, reject) {
                                _this.portInstance.open(function(error) {
                                    if (error) reject(error);
                                    else resolve();
                                });
                            })
                        ];
                    });
                })();
            }
        },
        {
            // 关闭串口
            key: "close",
            value: function close() {
                if (!this.portInstance) return;
                this.portInstance.close();
                this.data = "";
            }
        },
        {
            // 写入数据
            key: "write",
            value: function write(data) {
                if (!this.portInstance) return;
                this.portInstance.write(data);
            }
        },
        {
            key: "getData",
            value: function getData() {
                if (!this.portInstance) return;
                return this.data;
            }
        },
        {
            key: "setData",
            value: function setData(source) {
                if (!this.portInstance) return;
                this.data = source;
            }
        },
        {
            // 添加数据返回的监听器
            key: "addDataListener",
            value: function addDataListener() {
                var _this = this;
                if (!this.portInstance) return;
                this.portInstance.on("open", function() {
                    console.log("串口打开成功");
                });
                this.portInstance.on("close", function() {
                    console.log("串口关闭");
                });
                this.portInstance.on("error", function(error) {
                    console.log("串口出错：", error);
                });
                this.portInstance.on("data", function(data) {
                    _this.data += data.toString("hex");
                });
            }
        }
    ]);
    return SerialPort;
}();

//# sourceMappingURL=serial-port.js.map