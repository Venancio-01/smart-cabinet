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
const _net = require("net");
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
class _class {
    init() {
        return new Promise((resolve, reject)=>{
            // 如果已经有实例，直接抛出错误
            if (this.instance) throw new Error('Instance already exists');
            // 创建新的实例
            this.instance = new _net.Socket();
            // 监听各种事件
            this.instance.on('connect', ()=>{
                console.log('socket 连接成功');
                resolve();
                clearTimeout(timer);
            });
            this.instance.on('close', ()=>{
                console.log('关闭 socket 连接');
                reject(new Error('socket 连接关闭'));
            });
            this.instance.on('error', (err)=>{
                console.log('socket 出错', err);
                this.instance.destroy();
            });
            this.instance.on('data', (data)=>{
                this.data += data.toString(this.format);
            });
            const MAX_CONNECT_DURATION = 3000;
            const timer = setTimeout(()=>{
                this.instance.destroy();
            }, MAX_CONNECT_DURATION);
            this.connect();
        });
    }
    connect() {
        if (!this.instance) return;
        if (this.port) {
            this.instance.connect(this.port, this.address);
        } else this.instance.connect(this.address);
    }
    destroy() {
        if (!this.instance) return;
        this.instance.destroy();
    }
    write(data) {
        if (!this.instance) return;
        console.log('写入数据', data);
        this.instance.write(data);
    }
    getData() {
        if (!this.instance) return;
        return this.data;
    }
    setData(source) {
        if (!this.instance) return;
        this.data = source;
        return this.data;
    }
    constructor(option){
        _define_property(this, "instance", null);
        _define_property(this, "data", '');
        _define_property(this, "address", '');
        _define_property(this, "port", null);
        _define_property(this, "format", 'hex');
        this.address = option.address;
        this.port = option === null || option === void 0 ? void 0 : option.port;
        this.format = (option === null || option === void 0 ? void 0 : option.format) || 'hex';
    }
}

//# sourceMappingURL=socket.js.map