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
const _database = /*#__PURE__*/ _interop_require_default(require(".."));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const queryDepartNameByDeptId = async (deptId)=>{
    const result = await _database.default.sys_dept.findFirst({
        where: {
            id: deptId
        },
        select: {
            dept_name: true
        }
    });
    return result === null || result === void 0 ? void 0 : result.dept_name;
};
const queryRoleIdByUserId = async (userId)=>{
    const result = await _database.default.sys_user_role.findFirst({
        where: {
            user_id: userId
        },
        select: {
            role_id: true
        }
    });
    return result === null || result === void 0 ? void 0 : result.role_id;
};
const queryRoleNameByRoleId = async (roleId)=>{
    const result = await _database.default.sys_role.findFirst({
        where: {
            id: roleId
        },
        select: {
            role_name: true
        }
    });
    return result === null || result === void 0 ? void 0 : result.role_name;
};
const queryUsers = async ()=>{
    return await _database.default.sys_user.findMany();
};
const queryUserByUserId = async (userId)=>{
    const result = await _database.default.sys_user.findUnique({
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
    });
    return result;
};
const queryUserByLoginName = async (loginName)=>{
    const result = await _database.default.sys_user.findFirst({
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
    });
    return result;
};
const updatePasswordByUserId = async (userId, password)=>{
    const result = await _database.default.sys_user.update({
        where: {
            id: userId
        },
        data: {
            password: password
        }
    });
    return result;
};

//# sourceMappingURL=user.js.map