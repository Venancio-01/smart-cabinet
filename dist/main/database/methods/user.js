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
    queryDepartNameByDeptId: function() {
        return queryDepartNameByDeptId;
    },
    queryRoleIdByUserId: function() {
        return queryRoleIdByUserId;
    },
    queryRoleNameByRoleId: function() {
        return queryRoleNameByRoleId;
    },
    queryUsers: function() {
        return queryUsers;
    },
    queryUserByUserId: function() {
        return queryUserByUserId;
    },
    queryUserByLoginName: function() {
        return queryUserByLoginName;
    },
    updatePasswordByUserId: function() {
        return updatePasswordByUserId;
    }
});
var _database = /*#__PURE__*/ _interop_require_default(require(".."));
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
function queryDepartNameByDeptId(deptId) {
    return _queryDepartNameByDeptId.apply(this, arguments);
}
function _queryDepartNameByDeptId() {
    _queryDepartNameByDeptId = _async_to_generator(function(deptId) {
        var result;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        _database.default.sys_dept.findFirst({
                            where: {
                                id: deptId
                            },
                            select: {
                                dept_name: true
                            }
                        })
                    ];
                case 1:
                    result = _state.sent();
                    return [
                        2,
                        result === null || result === void 0 ? void 0 : result.dept_name
                    ];
            }
        });
    });
    return _queryDepartNameByDeptId.apply(this, arguments);
}
function queryRoleIdByUserId(userId) {
    return _queryRoleIdByUserId.apply(this, arguments);
}
function _queryRoleIdByUserId() {
    _queryRoleIdByUserId = _async_to_generator(function(userId) {
        var result;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        _database.default.sys_user_role.findFirst({
                            where: {
                                user_id: userId
                            },
                            select: {
                                role_id: true
                            }
                        })
                    ];
                case 1:
                    result = _state.sent();
                    return [
                        2,
                        result === null || result === void 0 ? void 0 : result.role_id
                    ];
            }
        });
    });
    return _queryRoleIdByUserId.apply(this, arguments);
}
function queryRoleNameByRoleId(roleId) {
    return _queryRoleNameByRoleId.apply(this, arguments);
}
function _queryRoleNameByRoleId() {
    _queryRoleNameByRoleId = _async_to_generator(function(roleId) {
        var result;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        _database.default.sys_role.findFirst({
                            where: {
                                id: roleId
                            },
                            select: {
                                role_name: true
                            }
                        })
                    ];
                case 1:
                    result = _state.sent();
                    return [
                        2,
                        result === null || result === void 0 ? void 0 : result.role_name
                    ];
            }
        });
    });
    return _queryRoleNameByRoleId.apply(this, arguments);
}
function queryUsers() {
    return _queryUsers.apply(this, arguments);
}
function _queryUsers() {
    _queryUsers = _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        _database.default.sys_user.findMany()
                    ];
                case 1:
                    return [
                        2,
                        _state.sent()
                    ];
            }
        });
    });
    return _queryUsers.apply(this, arguments);
}
function queryUserByUserId(userId) {
    return _queryUserByUserId.apply(this, arguments);
}
function _queryUserByUserId() {
    _queryUserByUserId = _async_to_generator(function(userId) {
        var result;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        _database.default.sys_user.findUnique({
                            where: {
                                id: userId
                            },
                            include: {
                                sys_dept: true,
                                sys_user_role: {
                                    include: {
                                        sys_role: {
                                            include: {
                                                sys_role_permission: {
                                                    include: {
                                                        sys_permission: true
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        })
                    ];
                case 1:
                    result = _state.sent();
                    return [
                        2,
                        result
                    ];
            }
        });
    });
    return _queryUserByUserId.apply(this, arguments);
}
function queryUserByLoginName(loginName) {
    return _queryUserByLoginName.apply(this, arguments);
}
function _queryUserByLoginName() {
    _queryUserByLoginName = _async_to_generator(function(loginName) {
        var result;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        _database.default.sys_user.findFirst({
                            where: {
                                login_name: loginName
                            },
                            include: {
                                sys_dept: true,
                                sys_user_role: {
                                    include: {
                                        sys_role: {
                                            include: {
                                                sys_role_permission: {
                                                    include: {
                                                        sys_permission: true
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        })
                    ];
                case 1:
                    result = _state.sent();
                    return [
                        2,
                        result
                    ];
            }
        });
    });
    return _queryUserByLoginName.apply(this, arguments);
}
function updatePasswordByUserId(userId, password) {
    return _updatePasswordByUserId.apply(this, arguments);
}
function _updatePasswordByUserId() {
    _updatePasswordByUserId = _async_to_generator(function(userId, password) {
        var result;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        _database.default.sys_user.update({
                            where: {
                                id: userId
                            },
                            data: {
                                password: password
                            }
                        })
                    ];
                case 1:
                    result = _state.sent();
                    return [
                        2,
                        result
                    ];
            }
        });
    });
    return _updatePasswordByUserId.apply(this, arguments);
}

//# sourceMappingURL=user.js.map