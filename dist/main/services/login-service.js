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
var _utils = require("../utils");
var _user = require("../database/methods/user");
var _database = /*#__PURE__*/ _interop_require_default(require("../database"));
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _ts_generator(thisArg, body) {
    var f, y, t, g, _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    };
    return g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(_)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
}
function onPasswordLogin(_) {
    return _onPasswordLogin.apply(this, arguments);
}
function _onPasswordLogin() {
    _onPasswordLogin = _async_to_generator(function(param) {
        var username, password, user, encryptedPassword;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    username = param.username, password = param.password;
                    return [
                        4,
                        (0, _user.queryUserByLoginName)(username)
                    ];
                case 1:
                    user = _state.sent();
                    if (user === null) return [
                        2,
                        (0, _utils.genResponseData)(false, "用户不存在")
                    ];
                    encryptedPassword = (0, _utils.genMd5EncryptedPassword)(username, password, user.salt);
                    if (user.password !== encryptedPassword) return [
                        2,
                        (0, _utils.genResponseData)(false, "密码错误")
                    ];
                    return [
                        2,
                        (0, _utils.genResponseData)(true, "登录成功", user)
                    ];
            }
        });
    });
    return _onPasswordLogin.apply(this, arguments);
}
function onCardLogin(cardNumber) {
    return _onCardLogin.apply(this, arguments);
}
function _onCardLogin() {
    _onCardLogin = _async_to_generator(function(cardNumber) {
        var result, userId, user;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        _database.default.rfid_card_user.findFirst({
                            where: {
                                card_data: cardNumber
                            },
                            select: {
                                user_id: true
                            }
                        })
                    ];
                case 1:
                    result = _state.sent();
                    if (result === null) return [
                        2,
                        (0, _utils.genResponseData)(false, "用户ID查找失败")
                    ];
                    userId = result === null || result === void 0 ? void 0 : result.user_id;
                    return [
                        4,
                        (0, _user.queryUserByUserId)(userId)
                    ];
                case 2:
                    user = _state.sent();
                    if (user === null) return [
                        2,
                        (0, _utils.genResponseData)(false, "用户查找失败")
                    ];
                    return [
                        2,
                        (0, _utils.genResponseData)(true, "登录成功", user)
                    ];
            }
        });
    });
    return _onCardLogin.apply(this, arguments);
}
var loginService = {
    name: "login",
    fns: {
        onPasswordLogin: onPasswordLogin,
        onCardLogin: onCardLogin
    }
};
var _default = loginService;

//# sourceMappingURL=login-service.js.map