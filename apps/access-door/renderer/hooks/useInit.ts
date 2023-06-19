import { initSysData } from "@/features/system";
import { checkActivationCode } from "@/features/encryption";
import { getNetworkStatus } from "@/features/network";
import { init as initAccessDoor } from "@/features/door";
import { handleConnect, regsterAlarmsListener } from "@/features/rfid";
import {
  startGenerateCurrentTime,
  stopGenerateCurrentTime,
} from "@/features/time";
import { initCabinetData } from "@/features/cabinet";
import { setAntdConfig } from "@/design/antd";

export default function () {
  // 配置 Antd 主题
  setAntdConfig();

  onMounted(async () => {
    getNetworkStatus();
    checkActivationCode();
    // 生成当前时间
    startGenerateCurrentTime();
    // 初始化系统数据
    initSysData();
    await Promise.all([initCabinetData(), initAccessDoor()]);
    // 连接 rfid 读取器
    handleConnect();
    regsterAlarmsListener();
  });

  onBeforeUnmount(() => {
    stopGenerateCurrentTime();
  });
}
