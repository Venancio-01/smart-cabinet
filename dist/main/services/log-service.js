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
    info: function() {
        return info;
    },
    warn: function() {
        return warn;
    },
    error: function() {
        return error;
    },
    debug: function() {
        return debug;
    },
    default: function() {
        return _default;
    }
});
const _electronlog = /*#__PURE__*/ _interop_require_default(require("electron-log"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
// 初始化 electron-log 模块
_electronlog.default.transports.file.level = 'info';
_electronlog.default.transports.console.level = 'debug';
_electronlog.default.transports.file.format = '{d}/{m}/{y} {h}:{i}:{s}:{ms} {text}';
const info = (message)=>{
    _electronlog.default.info(message);
};
const warn = (message)=>{
    _electronlog.default.warn(message);
};
const error = (message)=>{
    _electronlog.default.error(message);
};
const debug = (message)=>{
    _electronlog.default.debug(message);
};
const logServices = {
    name: 'log',
    fns: {
        info,
        warn,
        error,
        debug
    }
};
const _default = logServices;

//# sourceMappingURL=log-service.js.map