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
    CArray: function() {
        return CArray;
    },
    CStruct: function() {
        return CStruct;
    },
    DeviceType: function() {
        return DeviceType;
    },
    HandleType: function() {
        return HandleType;
    },
    UcharType: function() {
        return UcharType;
    },
    IntType: function() {
        return IntType;
    },
    DeviceArrayType: function() {
        return DeviceArrayType;
    },
    DeviceTypePointerType: function() {
        return DeviceTypePointerType;
    },
    UcharArrayType: function() {
        return UcharArrayType;
    },
    TemplateType: function() {
        return TemplateType;
    }
});
const _refnapi = /*#__PURE__*/ _interop_require_default(require("ref-napi"));
const _refarraydi = /*#__PURE__*/ _interop_require_default(require("ref-array-di"));
const _refstructdi = /*#__PURE__*/ _interop_require_default(require("ref-struct-di"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const CArray = (0, _refarraydi.default)(_refnapi.default);
const CStruct = (0, _refstructdi.default)(_refnapi.default);
const DeviceType = CStruct({
    vid: _refnapi.default.types.ushort,
    pid: _refnapi.default.types.ushort,
    szSerialNumber: CArray(_refnapi.default.types.uchar, 64),
    bus_number: _refnapi.default.types.uint32,
    device_address: _refnapi.default.types.uint32,
    extraPtr: _refnapi.default.types.uint
});
const HandleType = _refnapi.default.refType(_refnapi.default.types.uint);
const UcharType = CArray(_refnapi.default.types.uchar);
const IntType = CArray(_refnapi.default.types.int);
const DeviceArrayType = CArray(DeviceType);
const DeviceTypePointerType = _refnapi.default.refType(DeviceType);
const UcharArrayType = CArray(CArray(_refnapi.default.types.uchar));
const TemplateType = CArray(UcharType);

//# sourceMappingURL=types.js.map