import os from "os";
import type { SysDept } from "database";
import prisma from "@/database";

/**
 * @description: 获取用户列表
 * @param {UserQueryProps} { userName, departmentId, roleId }
 * @return {*}
 */
async function getUsersByCondition({
  userName,
  departmentId,
  roleId,
}: UserQueryProps): Promise<UserWithRoleProps[]> {
  const where = {
    userName: {
      contains: userName,
    },
    deptId: departmentId ? Number(departmentId) : undefined,
  };

  return prisma.sysUser.findMany({
    where,
  });
}
/**
 * @description: 获取部门列表
 * @return {*}
 */
async function getDepartmentData(): Promise<SysDept[]> {
  const departments = await prisma.sysDept.findMany();
  return departments;
}

/**
 * @description: 根据 ID 获取部门
 * @param {number} id
 * @return {*}
 */
export async function getDepartmentById(id: number): Promise<SysDept | null> {
  const department = await prisma.sysDept.findFirst({
    where: {
      deptId: id,
    },
  });

  return department;
}

/**
 * @description: 获取部门列表
 * @param {DepartmentQueryProps} { departmentName }
 * @return {*}
 */
async function getDepartmentsByCondition({
  departmentName,
}: DepartmentQueryProps): Promise<SysDept[]> {
  return await prisma.sysDept.findMany({
    where: {
      deptName: {
        contains: departmentName,
      },
    },
  });
}

/**
 * @description: 获取生产环境下的背景图片路径
 * @return {*}
 */
async function getProductionBgImagePath() {
  // const path = resolve(process.resourcesPath, './public/background/index.png')
  const path = "../../public/background/index.png";
  return path;
}

getProductionBgImagePath();

// 获取本机 ip 地址
export function getLocalIpAddress(): string[] {
  const interfaces = os.networkInterfaces();
  const addresses: string[] = [];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] ?? []) {
      if (iface.family === "IPv4" && !iface.internal)
        addresses.push(iface.address);
    }
  }
  return addresses;
}

const sysService = {
  name: "sys" as const,
  fns: {
    getUsersByCondition,
    getDepartmentData,
    getDepartmentsByCondition,
    getProductionBgImagePath,
    getLocalIpAddress,
  },
};

export default sysService;
