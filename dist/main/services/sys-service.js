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
const _user = require("../database/methods/user");
const _database = /*#__PURE__*/ _interop_require_default(require("../database"));
const _utils = require("../utils");
const _path = require("path");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const getUserData = async (userId)=>{
    const user = await (0, _user.queryUserByUserId)(userId);
    return user;
};
/**
 * @description: 获取所有用户
 * @return {*}
 */ const getAllUsers = async ()=>{
    return await _database.default.sys_user.findMany({
        include: {
            sys_user_role: {
                include: {
                    sys_role: true
                }
            }
        }
    });
};
/**
 * @description: 获取用户列表
 * @param {UserQueryProps} { userName, departmentId, roleId }
 * @return {*}
 */ const getUsersByCondition = async ({ userName , departmentId , roleId  })=>{
    const where = {
        user_name: {
            contains: userName
        },
        dept_id: departmentId ? Number(departmentId) : undefined
    };
    const users = await _database.default.sys_user.findMany({
        where,
        include: {
            sys_user_role: {
                include: {
                    sys_role: true
                }
            }
        }
    });
    return users.reduce((acc, cur)=>{
        const roles = cur.sys_user_role.map((userRole)=>userRole.sys_role);
        if (roleId !== undefined) {
            const role = roles.find((role)=>{
                return (role === null || role === void 0 ? void 0 : role.id) === roleId;
            });
            if (role !== undefined) {
                acc.push({
                    ...cur,
                    role
                });
            }
        } else {
            acc.push({
                ...cur,
                role: roles[0]
            });
        }
        return acc;
    }, []);
};
/**
 * @description: 获取部门列表
 * @return {*}
 */ const getDepartmentData = async ()=>{
    const departments = await _database.default.sys_dept.findMany();
    return departments;
};
/**
 * @description: 获取部门列表
 * @param {DepartmentQueryProps} { departmentName }
 * @return {*}
 */ const getDepartmentsByCondition = async ({ departmentName  })=>{
    return await _database.default.sys_dept.findMany({
        where: {
            dept_name: {
                contains: departmentName
            }
        }
    });
};
const updatePassword = async (userId, password)=>{
    const user = await (0, _user.queryUserByUserId)(userId);
    const encryptedPassword = (0, _utils.genMd5EncryptedPassword)(user.login_name, password, user.salt);
    const result = await (0, _user.updatePasswordByUserId)(userId, encryptedPassword);
    const success = result !== null;
    return success;
};
/**
 * @description: 校验密码
 * @param {sys_user} user
 * @param {string} password
 * @return {*}
 */ const verifyPassword = async (userString, password)=>{
    const user = JSON.parse(userString);
    const encryptedPassword = (0, _utils.genMd5EncryptedPassword)(user.login_name, password, user.salt);
    const success = user.password === encryptedPassword;
    return success;
};
/**
 * @description: 校验卡号
 * @param {sys_user} user
 * @param {string} cardNumber
 * @return {*}
 */ const verifyCard = async (userString, cardNumber)=>{
    const user = JSON.parse(userString);
    const result = await _database.default.rfid_card_user.findFirst({
        where: {
            user_id: user.id
        },
        select: {
            card_data: true
        }
    });
    const success = result.card_data === cardNumber;
    return success;
};
const getProductionBgImagePath = async ()=>{
    const path = (0, _path.join)(process.resourcesPath, '/public/background/index.png');
    return path;
};
/**
 * @description: 获取角色列表
 * @return {*}
 */ const getRoleData = async ()=>{
    const roles = await _database.default.sys_role.findMany();
    return roles;
};
/**
 * @description: 获取权限列表
 * @return {*}
 */ const getPermissionData = async ()=>{
    const permissions = await _database.default.sys_permission.findMany();
    return permissions;
};
/**
 * @description: 获取角色权限列表
 * @return {*}
 */ const getRolePermissionData = async ()=>{
    const rolePermissions = await _database.default.sys_role_permission.findMany();
    return rolePermissions;
};
const sysService = {
    name: 'sys',
    fns: {
        getUserData,
        getAllUsers,
        getUsersByCondition,
        getDepartmentData,
        getDepartmentsByCondition,
        updatePassword,
        verifyPassword,
        verifyCard,
        getProductionBgImagePath,
        getRoleData,
        getPermissionData,
        getRolePermissionData
    }
};
const _default = sysService;

//# sourceMappingURL=sys-service.js.map