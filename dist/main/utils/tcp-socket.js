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
const _net = /*#__PURE__*/ _interop_require_default(require("net"));
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
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
class TcpSocket {
    // 定义一个发送数据的方法
    send(data) {
        // 调用 socket 的 write 方法，发送数据
        this.socket.write(data);
    }
    // 定义一个关闭连接的方法
    close() {
        // 调用 socket 的 destroy 方法，关闭连接
        this.socket.destroy();
    }
    // 定义构造函数，传入 address 和 port 参数
    constructor(address, port){
        // 声明一个私有的 net.Socket 属性
        _define_property(this, "socket", void 0);
        // 创建一个新的 net.Socket 实例
        this.socket = new _net.default.Socket();
        // 连接到指定的地址和端口
        this.socket.connect(port, address, ()=>{
            // 连接成功后的回调函数
            console.log('Connected to ' + address + ':' + port);
        });
        // 监听 socket 的 data 事件，接收数据
        this.socket.on('data', (data)=>{
            // 处理接收到的数据
            console.log('Received: ' + data);
        });
        // 监听 socket 的 close 事件，断开连接
        this.socket.on('close', ()=>{
            // 处理断开连接的情况
            console.log('Connection closed');
        });
    }
}

//# sourceMappingURL=tcp-socket.js.map