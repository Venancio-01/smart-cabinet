"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _class;
    }
});
var _net = require("net");
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
var _class = /*#__PURE__*/ function() {
    "use strict";
    function _class(option) {
        _class_call_check(this, _class);
        _define_property(this, "instance", null);
        _define_property(this, "data", "");
        _define_property(this, "address", "");
        _define_property(this, "port", null);
        _define_property(this, "format", "hex");
        _define_property(this, "timer", null);
        this.address = option.address;
        this.port = option === null || option === void 0 ? void 0 : option.port;
        this.format = (option === null || option === void 0 ? void 0 : option.format) || "hex";
    }
    _create_class(_class, [
        {
            key: "init",
            value: function init() {
                var _this = this;
                return new Promise(function(resolve, reject) {
                    // 如果已经有实例，直接抛出错误
                    if (_this.instance) throw new Error("Instance already exists");
                    // 创建新的实例
                    _this.instance = new _net.Socket();
                    // 监听各种事件
                    _this.instance.on("connect", function() {
                        console.log("socket 连接成功");
                        resolve();
                        clearTimeout(_this.timer);
                    });
                    _this.instance.on("close", function() {
                        console.log("关闭 socket 连接");
                        reject(new Error("socket 连接关闭"));
                    });
                    _this.instance.on("error", function(err) {
                        console.log("socket 出错", err);
                        _this.instance.destroy();
                    });
                    _this.instance.on("data", function(data) {
                        _this.data += data.toString(_this.format);
                    });
                    var MAX_CONNECT_DURATION = 3000;
                    _this.timer = setTimeout(function() {
                        _this.instance.destroy();
                    }, MAX_CONNECT_DURATION);
                    _this.connect();
                });
            }
        },
        {
            key: "connect",
            value: function connect() {
                if (!this.instance) return;
                if (this.port) this.instance.connect(this.port, this.address);
                else this.instance.connect(this.address);
            }
        },
        {
            key: "destroy",
            value: function destroy() {
                if (!this.instance) return;
                this.instance.destroy();
            }
        },
        {
            key: "write",
            value: function write(data) {
                if (!this.instance) return;
                console.log("写入数据", data);
                this.instance.write(data);
            }
        },
        {
            key: "getData",
            value: function getData() {
                if (!this.instance) return;
                return this.data;
            }
        },
        {
            key: "setData",
            value: function setData(source) {
                if (!this.instance) return;
                this.data = source;
                return this.data;
            }
        }
    ]);
    return _class;
}();

//# sourceMappingURL=socket.js.map