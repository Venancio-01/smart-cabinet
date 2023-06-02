// 导入 net 模块
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return TcpSocket;
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
var TcpSocket = /*#__PURE__*/ function() {
    "use strict";
    function TcpSocket(address, port) {
        _class_call_check(this, TcpSocket);
        // 声明一个私有的 Socket 属性
        _define_property(this, "socket", void 0);
        // 创建一个新的 Socket 实例
        this.socket = new _net.Socket();
        // 连接到指定的地址和端口
        this.socket.connect(port, address, function() {
            // 连接成功后的回调函数
            console.log("Connected to ".concat(address, ":").concat(port));
        });
        // 监听 socket 的 data 事件，接收数据
        this.socket.on("data", function(data) {
            // 处理接收到的数据
            console.log("Received: ".concat(data));
        });
        // 监听 socket 的 close 事件，断开连接
        this.socket.on("close", function() {
            // 处理断开连接的情况
            console.log("Connection closed");
        });
    }
    _create_class(TcpSocket, [
        {
            // 定义一个发送数据的方法
            key: "send",
            value: function send(data) {
                // 调用 socket 的 write 方法，发送数据
                this.socket.write(data);
            }
        },
        {
            // 定义一个关闭连接的方法
            key: "close",
            value: function close() {
                // 调用 socket 的 destroy 方法，关闭连接
                this.socket.destroy();
            }
        }
    ]);
    return TcpSocket;
}();

//# sourceMappingURL=tcp-socket.js.map