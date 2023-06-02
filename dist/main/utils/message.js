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
function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_without_holes(arr) {
    if (Array.isArray(arr)) return _array_like_to_array(arr);
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
var MessageQueue = /*#__PURE__*/ function() {
    "use strict";
    function MessageQueue() {
        _class_call_check(this, MessageQueue);
        _define_property(this, "messages", [] // 存储消息队列
        );
        _define_property(this, "maxLength", 800 // 消息队列上限
        );
        _define_property(this, "listeners", [] // 事件监听器列表
        );
    }
    _create_class(MessageQueue, [
        {
            // 添加消息到队列中
            key: "push",
            value: function push(message) {
                if (this.messages.length >= this.maxLength) {
                    // 消息队列已满，删除最早的一些消息
                    this.messages.splice(0, 100);
                }
                this.messages.push(message);
                // 触发 push 事件，调用所有相关的事件监听器
                this.emit("push", message, this.messages);
            }
        },
        {
            // 根据名称获取队列中的消息
            key: "getMessages",
            value: function getMessages(name) {
                return this.messages.filter(function(item) {
                    return item.name === name;
                });
            }
        },
        {
            // 获取队列中的所有消息
            key: "getAllMessages",
            value: function getAllMessages() {
                return this.messages;
            }
        },
        {
            key: "clear",
            value: function clear() {
                this.messages = [];
            }
        },
        {
            // 添加事件监听器
            key: "on",
            value: function on(eventName, callback) {
                this.listeners.push({
                    eventName: eventName,
                    callback: callback
                });
            }
        },
        {
            // 触发事件
            key: "emit",
            value: function emit(eventName) {
                for(var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
                    args[_key - 1] = arguments[_key];
                }
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(var _iterator = this.listeners[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var listener = _step.value;
                        var _listener;
                        if (listener.eventName === eventName) (_listener = listener).callback.apply(_listener, _to_consumable_array(args));
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            }
        }
    ]);
    return MessageQueue;
}();

//# sourceMappingURL=message.js.map