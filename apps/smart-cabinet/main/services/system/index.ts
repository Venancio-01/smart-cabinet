import { getProductionBgImagePath } from "common/system";
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

const sysService = {
  name: "sys" as const,
  fns: {
    getUserData,
    getUsers,
    getUsersByCondition,
    getDepartments,
    onPasswordLogin,
    onCardLogin,
    updatePassword,
    verifyPassword,
    verifyCard,
    updateCardNumber,
    getRoleList,
    getUserRoleList,
    getProductionBgImagePath,
  },
};

export default sysService;
