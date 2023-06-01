"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MessageQueue", {
    enumerable: true,
    get: function() {
        return MessageQueue;
    }
});
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
class MessageQueue {
    // 添加消息到队列中
    push(message) {
        if (this.messages.length >= this.maxLength) {
            // 消息队列已满，删除最早的一些消息
            this.messages.splice(0, 100);
        }
        this.messages.push(message);
        // 触发 push 事件，调用所有相关的事件监听器
        this.emit('push', message, this.messages);
    }
    // 根据名称获取队列中的消息
    getMessages(name) {
        return this.messages.filter((item)=>item.name === name);
    }
    // 获取队列中的所有消息
    getAllMessages() {
        return this.messages;
    }
    clear() {
        this.messages = [];
    }
    // 添加事件监听器
    on(eventName, callback) {
        this.listeners.push({
            eventName,
            callback
        });
    }
    // 触发事件
    emit(eventName, ...args) {
        for (const listener of this.listeners){
            if (listener.eventName === eventName) listener.callback(...args);
        }
    }
    constructor(){
        _define_property(this, "messages", [] // 存储消息队列
        );
        _define_property(this, "maxLength", 800 // 消息队列上限
        );
        _define_property(this, "listeners", [] // 事件监听器列表
        );
    }
}

//# sourceMappingURL=message.js.map