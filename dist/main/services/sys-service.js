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
var _path = require("path");
var _user = require("../database/methods/user");
var _database = /*#__PURE__*/ _interop_require_default(require("../database"));
var _utils = require("../utils");
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
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
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
function getUserData(userId) {
    return _getUserData.apply(this, arguments);
}
function _getUserData() {
    _getUserData = _async_to_generator(function(userId) {
        var user;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        (0, _user.queryUserByUserId)(userId)
                    ];
                case 1:
                    user = _state.sent();
                    return [
                        2,
                        user
                    ];
            }
        });
    });
    return _getUserData.apply(this, arguments);
}
function getAllUsers() {
    return _getAllUsers.apply(this, arguments);
}
function _getAllUsers() {
    _getAllUsers = /**
 * @description: 获取所有用户
 * @return {*}
 */ _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        _database.default.sys_user.findMany({
                            include: {
                                sys_user_role: {
                                    include: {
                                        sys_role: true
                                    }
                                }
                            }
                        })
                    ];
                case 1:
                    return [
                        2,
                        _state.sent()
                    ];
            }
        });
    });
    return _getAllUsers.apply(this, arguments);
}
function getUsersByCondition(_) {
    return _getUsersByCondition.apply(this, arguments);
}
function _getUsersByCondition() {
    _getUsersByCondition = /**
 * @description: 获取用户列表
 * @param {UserQueryProps} { userName, departmentId, roleId }
 * @return {*}
 */ _async_to_generator(function(param) {
        var userName, departmentId, roleId, where, users;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    userName = param.userName, departmentId = param.departmentId, roleId = param.roleId;
                    where = {
                        user_name: {
                            contains: userName
                        },
                        dept_id: departmentId ? Number(departmentId) : undefined
                    };
                    return [
                        4,
                        _database.default.sys_user.findMany({
                            where: where,
                            include: {
                                sys_user_role: {
                                    include: {
                                        sys_role: true
                                    }
                                }
                            }
                        })
                    ];
                case 1:
                    users = _state.sent();
                    return [
                        2,
                        users.reduce(function(acc, cur) {
                            var roles = cur.sys_user_role.map(function(userRole) {
                                return userRole.sys_role;
                            });
                            if (roleId !== undefined) {
                                var role = roles.find(function(role) {
                                    return (role === null || role === void 0 ? void 0 : role.id) === roleId;
                                });
                                if (role !== undefined) {
                                    acc.push(_object_spread_props(_object_spread({}, cur), {
                                        role: role
                                    }));
                                }
                            } else {
                                acc.push(_object_spread_props(_object_spread({}, cur), {
                                    role: roles[0]
                                }));
                            }
                            return acc;
                        }, [])
                    ];
            }
        });
    });
    return _getUsersByCondition.apply(this, arguments);
}
function getDepartmentData() {
    return _getDepartmentData.apply(this, arguments);
}
function _getDepartmentData() {
    _getDepartmentData = /**
 * @description: 获取部门列表
 * @return {*}
 */ _async_to_generator(function() {
        var departments;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        _database.default.sys_dept.findMany()
                    ];
                case 1:
                    departments = _state.sent();
                    return [
                        2,
                        departments
                    ];
            }
        });
    });
    return _getDepartmentData.apply(this, arguments);
}
function getDepartmentsByCondition(_) {
    return _getDepartmentsByCondition.apply(this, arguments);
}
function _getDepartmentsByCondition() {
    _getDepartmentsByCondition = /**
 * @description: 获取部门列表
 * @param {DepartmentQueryProps} { departmentName }
 * @return {*}
 */ _async_to_generator(function(param) {
        var departmentName;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    departmentName = param.departmentName;
                    return [
                        4,
                        _database.default.sys_dept.findMany({
                            where: {
                                dept_name: {
                                    contains: departmentName
                                }
                            }
                        })
                    ];
                case 1:
                    return [
                        2,
                        _state.sent()
                    ];
            }
        });
    });
    return _getDepartmentsByCondition.apply(this, arguments);
}
function updatePassword(userId, password) {
    return _updatePassword.apply(this, arguments);
}
function _updatePassword() {
    _updatePassword = _async_to_generator(function(userId, password) {
        var user, encryptedPassword, result, success;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        (0, _user.queryUserByUserId)(userId)
                    ];
                case 1:
                    user = _state.sent();
                    encryptedPassword = (0, _utils.genMd5EncryptedPassword)(user.login_name, password, user.salt);
                    return [
                        4,
                        (0, _user.updatePasswordByUserId)(userId, encryptedPassword)
                    ];
                case 2:
                    result = _state.sent();
                    success = result !== null;
                    return [
                        2,
                        success
                    ];
            }
        });
    });
    return _updatePassword.apply(this, arguments);
}
function verifyPassword(userString, password) {
    return _verifyPassword.apply(this, arguments);
}
function _verifyPassword() {
    _verifyPassword = /**
 * @description: 校验密码
 * @param {sys_user} user
 * @param {string} password
 * @return {*}
 */ _async_to_generator(function(userString, password) {
        var user, encryptedPassword, success;
        return _ts_generator(this, function(_state) {
            user = JSON.parse(userString);
            encryptedPassword = (0, _utils.genMd5EncryptedPassword)(user.login_name, password, user.salt);
            success = user.password === encryptedPassword;
            return [
                2,
                success
            ];
        });
    });
    return _verifyPassword.apply(this, arguments);
}
function verifyCard(userString, cardNumber) {
    return _verifyCard.apply(this, arguments);
}
function _verifyCard() {
    _verifyCard = /**
 * @description: 校验卡号
 * @param {sys_user} user
 * @param {string} cardNumber
 * @return {*}
 */ _async_to_generator(function(userString, cardNumber) {
        var user, result, success;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    user = JSON.parse(userString);
                    return [
                        4,
                        _database.default.rfid_card_user.findFirst({
                            where: {
                                user_id: user.id
                            },
                            select: {
                                card_data: true
                            }
                        })
                    ];
                case 1:
                    result = _state.sent();
                    success = result.card_data === cardNumber;
                    return [
                        2,
                        success
                    ];
            }
        });
    });
    return _verifyCard.apply(this, arguments);
}
function getProductionBgImagePath() {
    return _getProductionBgImagePath.apply(this, arguments);
}
function _getProductionBgImagePath() {
    _getProductionBgImagePath = _async_to_generator(function() {
        var path;
        return _ts_generator(this, function(_state) {
            path = (0, _path.join)(process.resourcesPath, "/public/background/index.png");
            return [
                2,
                path
            ];
        });
    });
    return _getProductionBgImagePath.apply(this, arguments);
}
function getRoleData() {
    return _getRoleData.apply(this, arguments);
}
function _getRoleData() {
    _getRoleData = /**
 * @description: 获取角色列表
 * @return {*}
 */ _async_to_generator(function() {
        var roles;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        _database.default.sys_role.findMany()
                    ];
                case 1:
                    roles = _state.sent();
                    return [
                        2,
                        roles
                    ];
            }
        });
    });
    return _getRoleData.apply(this, arguments);
}
function getPermissionData() {
    return _getPermissionData.apply(this, arguments);
}
function _getPermissionData() {
    _getPermissionData = /**
 * @description: 获取权限列表
 * @return {*}
 */ _async_to_generator(function() {
        var permissions;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        _database.default.sys_permission.findMany()
                    ];
                case 1:
                    permissions = _state.sent();
                    return [
                        2,
                        permissions
                    ];
            }
        });
    });
    return _getPermissionData.apply(this, arguments);
}
function getRolePermissionData() {
    return _getRolePermissionData.apply(this, arguments);
}
function _getRolePermissionData() {
    _getRolePermissionData = /**
 * @description: 获取角色权限列表
 * @return {*}
 */ _async_to_generator(function() {
        var rolePermissions;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        _database.default.sys_role_permission.findMany()
                    ];
                case 1:
                    rolePermissions = _state.sent();
                    return [
                        2,
                        rolePermissions
                    ];
            }
        });
    });
    return _getRolePermissionData.apply(this, arguments);
}
var sysService = {
    name: "sys",
    fns: {
        getUserData: getUserData,
        getAllUsers: getAllUsers,
        getUsersByCondition: getUsersByCondition,
        getDepartmentData: getDepartmentData,
        getDepartmentsByCondition: getDepartmentsByCondition,
        updatePassword: updatePassword,
        verifyPassword: verifyPassword,
        verifyCard: verifyCard,
        getProductionBgImagePath: getProductionBgImagePath,
        getRoleData: getRoleData,
        getPermissionData: getPermissionData,
        getRolePermissionData: getRolePermissionData
    }
};
var _default = sysService;

//# sourceMappingURL=sys-service.js.map