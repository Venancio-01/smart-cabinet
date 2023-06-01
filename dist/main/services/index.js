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
const _loginservice = /*#__PURE__*/ _interop_require_default(require("./login-service"));
const _lockcontrolservice = /*#__PURE__*/ _interop_require_default(require("./lock-control-service"));
const _rfidservice = /*#__PURE__*/ _interop_require_default(require("./rfid-service"));
const _fingerservice = /*#__PURE__*/ _interop_require_default(require("./finger-service/index"));
const _sysservice = /*#__PURE__*/ _interop_require_default(require("./sys-service"));
const _cabinetservice = /*#__PURE__*/ _interop_require_default(require("./cabinet-service"));
const _carrierservice = /*#__PURE__*/ _interop_require_default(require("./carrier-service"));
const _cardservice = /*#__PURE__*/ _interop_require_default(require("./card-service"));
const _networkstatus = /*#__PURE__*/ _interop_require_default(require("./network-status"));
const _updateservice = /*#__PURE__*/ _interop_require_default(require("./update-service"));
const _storeservice = /*#__PURE__*/ _interop_require_default(require("./store-service"));
const _encryptionservice = /*#__PURE__*/ _interop_require_default(require("./encryption-service"));
const _logservice = /*#__PURE__*/ _interop_require_default(require("./log-service"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const services = [
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
    return `${name}.${fnName}`;
}

//# sourceMappingURL=index.js.map