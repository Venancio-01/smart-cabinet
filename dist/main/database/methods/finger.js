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
    queryFingerByUserIdAndOrder: function() {
        return queryFingerByUserIdAndOrder;
    },
    updateFingerByUserIdAndOrder: function() {
        return updateFingerByUserIdAndOrder;
    },
    addFinger: function() {
        return addFinger;
    }
});
const _utils = require("../../utils");
const _database = /*#__PURE__*/ _interop_require_default(require(".."));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const queryFingerByUserIdAndOrder = async (userId, order)=>{
    const result = await _database.default.rfid_finger_user.findFirst({
        where: {
            user_id: userId,
            order: order
        }
    });
    return result;
};
const updateFingerByUserIdAndOrder = async (userId, order, data)=>{
    const result = await _database.default.rfid_finger_user.updateMany({
        where: {
            user_id: userId,
            order: order
        },
        data: {
            data: data
        }
    });
    return result;
};
const addFinger = async (userId, order, data)=>{
    const result = await _database.default.rfid_finger_user.create({
        data: {
            data: data,
            order: order,
            user_id: userId,
            createdate: (0, _utils.generateCurrentTime)()
        }
    });
    return result;
};

//# sourceMappingURL=finger.js.map