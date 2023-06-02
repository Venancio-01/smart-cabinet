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
    services: function() {
        return services;
    },
    makeChannelName: function() {
        return makeChannelName;
    }
});
var _loginservice = /*#__PURE__*/ _interop_require_default(require("./login-service"));
var _lockcontrolservice = /*#__PURE__*/ _interop_require_default(require("./lock-control-service"));
var _rfidservice = /*#__PURE__*/ _interop_require_default(require("./rfid-service"));
var _fingerservice = /*#__PURE__*/ _interop_require_default(require("./finger-service/index"));
var _sysservice = /*#__PURE__*/ _interop_require_default(require("./sys-service"));
var _cabinetservice = /*#__PURE__*/ _interop_require_default(require("./cabinet-service"));
var _carrierservice = /*#__PURE__*/ _interop_require_default(require("./carrier-service"));
var _cardservice = /*#__PURE__*/ _interop_require_default(require("./card-service"));
var _networkstatus = /*#__PURE__*/ _interop_require_default(require("./network-status"));
var _updateservice = /*#__PURE__*/ _interop_require_default(require("./update-service"));
var _storeservice = /*#__PURE__*/ _interop_require_default(require("./store-service"));
var _encryptionservice = /*#__PURE__*/ _interop_require_default(require("./encryption-service"));
var _logservice = /*#__PURE__*/ _interop_require_default(require("./log-service"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var services = [
    _loginservice.default,
    _lockcontrolservice.default,
    _rfidservice.default,
    _fingerservice.default,
    _sysservice.default,
    _cabinetservice.default,
    _carrierservice.default,
    _cardservice.default,
    _networkstatus.default,
    _updateservice.default,
    _storeservice.default,
    _encryptionservice.default,
    _logservice.default
];
function makeChannelName(name, fnName) {
    return "".concat(name, ".").concat(fnName);
}

//# sourceMappingURL=index.js.map