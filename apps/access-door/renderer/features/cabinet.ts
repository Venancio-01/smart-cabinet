import { useStore } from "@/store";

/**
 * @description: 获取柜门信息
 * @return {*}
 */
export async function getCabinetDoorInfo() {
  const store = useStore();
  const result = await window.JSBridge.cabinet.getCabinetDoorList();

  store.setCabinetDoorList(result);
}

export function initCabinetData() {
  return getCabinetDoorInfo;
}
