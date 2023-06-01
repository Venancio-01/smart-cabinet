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
const _utils = require("../utils");
const _user = require("../database/methods/user");
const _database = /*#__PURE__*/ _interop_require_default(require("../database"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const onPasswordLogin = async ({ username , password  })=>{
    const user = await (0, _user.queryUserByLoginName)(username);
    if (user === null) return (0, _utils.genResponseData)(false, '用户不存在');
    const encryptedPassword = (0, _utils.genMd5EncryptedPassword)(username, password, user.salt);
    if (user.password !== encryptedPassword) return (0, _utils.genResponseData)(false, '密码错误');
    return (0, _utils.genResponseData)(true, '登录成功', user);
};
const onCardLogin = async (cardNumber)=>{
    const result = await _database.default.rfid_card_user.findFirst({
        where: {
            card_data: cardNumber
        },
        select: {
            user_id: true
        }
    });
    if (result === null) return (0, _utils.genResponseData)(false, '用户ID查找失败');
    const userId = result === null || result === void 0 ? void 0 : result.user_id;
    const user = await (0, _user.queryUserByUserId)(userId);
    if (user === null) return (0, _utils.genResponseData)(false, '用户查找失败');
    return (0, _utils.genResponseData)(true, '登录成功', user);
};
const loginService = {
    name: 'login',
    fns: {
        onPasswordLogin,
        onCardLogin
    }
};
const _default = loginService;

//# sourceMappingURL=login-service.js.map