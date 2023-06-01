"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _database = /*#__PURE__*/ _interop_require_default(require("../database"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const getCabinetData = async ()=>{
    const result = await _database.default.rfid_cabinet.findFirst();
    return result;
};
const getCabinetDoorList = async ()=>{
    const result = await _database.default.rfid_cabinet_door.findMany();
    return result;
};
const cabinetService = {
    name: 'cabinet',
    fns: {
        getCabinetData,
        getCabinetDoorList
    }
};
const _default = cabinetService;

//# sourceMappingURL=cabinet-service.js.map