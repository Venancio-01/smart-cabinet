import { join, resolve } from "path";

interface Process extends NodeJS.Process {
  resourcesPath: string;
}

const _process = process as Process;

const isDev = import.meta.env.DEV;

// 程序主窗口尺寸
export const WINDOW_SIZE = { width: 1024, height: 768 };

// 红外检测的间隔阈值，单位，毫秒
export const INTERVAL_THRESHOLD = 2500;

// 红外检测时间最大阈值，单位，毫秒
export const DETECTION_DURATION = 1500;

// 离开方向, 1to2: GPI1 到 GPI2, 2to1: GPI2 到 GPI1
export const DIRECTION_LEAVE = "1to2";

export const SERVICE_PATH =
  "/home/js/Project/go/apps/cabinet/hjrich-update-service/hjrich-update-service";
export const UPDATE_SERVICE_SOCKET_PATH = "/tmp/hjrich-update-service.sock";

// 开发者工具路径
export const DEVTOOLS_PATH = join(
  __dirname,
  "../../../../resources/devtools/6.5.0_0"
);

// 设备最大连接数
export const MAX_DEVICE_NUM = 16;
// 指纹登记次数
export const MAX_REGISTRATION_COUNT = 3;
// 指纹模板字节数
export const TEMPLATE_BYTE_LENGTH = 2048;
// 对比两个指纹后打分的阈值，低于 50 说明两个指纹不相同
export const VERIFY_SCORE_THRESHOLD = 50;

// 指纹设备 SDK 路径
export const DEVICE_SDK_PATH = isDev
  ? resolve(__dirname, "../../../../libs/finger-lib/libzkfpcap.so")
  : join(_process.resourcesPath, "/public/libs/finger-lib/libzkfpcap.so");

// 指纹算法 SDK 路径
export const ALGORITHM_SDK_PATH = isDev
  ? resolve(__dirname, "../../../../libs/finger-lib/libzkfp.so")
  : join(_process.resourcesPath, "/public/libs/finger-lib/libzkfp.so");

// 指纹 SDK 的 libzkfinger10 文件路径
export const LIBZKFINGER10_PATH = isDev
  ? resolve(__dirname, "../../../../libs/finger-lib/libzkfinger10.so")
  : join(_process.resourcesPath, "/public/libs/finger-lib/libzkfinger10.so");

// CRC SDK 路径
export const CRC_SDK_PATH = isDev
  ? resolve(__dirname, "../../../../libs/crc-lib/libCRC16_CCITT.so")
  : join(_process.resourcesPath, "/public/libs/crc-lib/libCRC16_CCITT.so");

// 图标文件路径
export const ICON_PATH = isDev
  ? "public/favicon.ico"
  : join(_process.resourcesPath, "/public/favicon.ico");
