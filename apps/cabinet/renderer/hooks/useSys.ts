import { useStore } from "@/store";
import BgImg from "@/public/background/index.png";

export default function () {
  const store = useStore();
  const {
    setDepartmentList,
    setUserList,
    setRoleList,
    setUserRoleList,
    setBackgroundUrl,
  } = store;

  const getUserData = async (userId: number) => {
    const data = await window.JSBridge.sys.getUserData(userId);
    return data;
  };

  const getUserList = async () => {
    const list = await window.JSBridge.sys.getUsers();
    setUserList(list);
    return list;
  };

  const getUsersByCondition = async (params: UserQueryProps) => {
    const list = await window.JSBridge.sys.getUsersByCondition({ ...params });
    return list;
  };

  const getDepartmentList = async () => {
    const departments = await window.JSBridge.sys.getDepartments();
    setDepartmentList(departments);
    return departments;
  };

  const getDepartmentsByCondition = async (params: UserQueryProps) => {
    const list = await window.JSBridge.sys.getDepartments({
      ...params,
    });
    return list;
  };

  const getRoleList = async () => {
    const roleList = await window.JSBridge.sys.getRoleList();
    setRoleList(roleList);
  };

  const getUserRoleList = async () => {
    const roleList = await window.JSBridge.sys.getUserRoleList();
    setUserRoleList(roleList);
  };

  const getBackgroundImage = async () => {
    const path = import.meta.env.DEV
      ? BgImg
      : await window.JSBridge.sys.getProductionBgImagePath();
    setBackgroundUrl(path);
  };

  const init = async () => {
    getUserList();
    getDepartmentList();
    getRoleList();
    getUserRoleList();
  };

  return {
    init,
    getUserData,
    getUserList,
    getUsersByCondition,
    getDepartmentList,
    getDepartmentsByCondition,
    getBackgroundImage,
  };
}
