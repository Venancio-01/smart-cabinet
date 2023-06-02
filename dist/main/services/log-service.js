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
var _electronlog = /*#__PURE__*/ _interop_require_default(require("electron-log"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
// 初始化 electron-log 模块
_electronlog.default.transports.file.level = "info";
_electronlog.default.transports.console.level = "debug";
_electronlog.default.transports.file.format = "{d}/{m}/{y} {h}:{i}:{s}:{ms} {text}";
function info(message) {
    _electronlog.default.info(message);
}
function warn(message) {
    _electronlog.default.warn(message);
}
function error(message) {
    _electronlog.default.error(message);
}
function debug(message) {
    _electronlog.default.debug(message);
}
var logServices = {
    name: "log",
    fns: {
        info: info,
        warn: warn,
        error: error,
        debug: debug
    }
};
var _default = logServices;

//# sourceMappingURL=log-service.js.map