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
const updateCardNumber = async (userId, cardNumber)=>{
    const result = await _database.default.rfid_card_user.updateMany({
        where: {
            user_id: userId
        },
        data: {
            card_data: cardNumber
        }
    });
    return result;
};
const cardService = {
    name: 'card',
    fns: {
        updateCardNumber
    }
};
const _default = cardService;

//# sourceMappingURL=card-service.js.map