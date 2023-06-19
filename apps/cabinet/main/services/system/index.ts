import {
  getUserData,
  getUsers,
  getUsersByCondition,
  onCardLogin,
  onPasswordLogin,
  updateCardNumber,
  updatePassword,
  verifyCard,
  verifyPassword,
} from "./user";
import { getDepartments } from "./department";
import { getRoleList, getUserRoleList } from "./role";
import { getProductionBgImagePath } from "./system";

const sysService = {
  name: "sys" as const,
  fns: {
    getUserData,
    getUsers,
    getUsersByCondition,
    getDepartments,
    getProductionBgImagePath,
    onPasswordLogin,
    onCardLogin,
    updatePassword,
    verifyPassword,
    verifyCard,
    updateCardNumber,
    getRoleList,
    getUserRoleList,
  },
};

export default sysService;
