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
const _serialport = require("serialport");
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
class SerialPort {
    init({ path , baudRate =115200  }) {
        if (this.portInstance) return;
        this.portInstance = new _serialport.SerialPort({
            path,
            baudRate,
            autoOpen: false,
            dataBits: 8,
            stopBits: 1,
            parity: 'none'
        });
    }
    async open() {
        return new Promise((resolve, reject)=>{
            this.portInstance.open((error)=>{
                if (error) reject(error);
                else resolve();
            });
        });
    }
    // 关闭串口
    close() {
        if (!this.portInstance) return;
        this.portInstance.close();
        this.data = '';
    }
    // 写入数据
    write(data) {
        if (!this.portInstance) return;
        this.portInstance.write(data);
    }
    getData() {
        if (!this.portInstance) return;
        return this.data;
    }
    setData(source) {
        if (!this.portInstance) return;
        this.data = source;
    }
    // 添加数据返回的监听器
    addDataListener() {
        if (!this.portInstance) return;
        this.portInstance.on('open', ()=>{
            console.log('串口打开成功');
        });
        this.portInstance.on('close', ()=>{
            console.log('串口关闭');
        });
        this.portInstance.on('error', (error)=>{
            console.log('串口出错：', error);
        });
        this.portInstance.on('data', (data)=>{
            this.data += data.toString('hex');
        });
    }
    constructor({ path , baudRate =115200  }){
        _define_property(this, "portInstance", null);
        _define_property(this, "data", '');
        this.init({
            path,
            baudRate
        });
        this.addDataListener();
    }
}

//# sourceMappingURL=serial-port.js.map