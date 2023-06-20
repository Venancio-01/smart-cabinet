import type { DoorAccessRecords, DoorEquipment } from "database";
import { sendIpcToRenderer } from "utils";
import { INTERVAL_THRESHOLD } from "utils/config/main";
import {
  addAccessRecord,
  fetchRegistrationRecords,
  getCurrentAccessDoorDevice,
  updateAccessRecord,
} from "../access-door";
import { generateAntennaCommand } from "./utils";
import {
  generateCheckConnectionStatusCommand,
  generateSetGPOCommand,
  generteSetGPITriggerCommand,
} from "./command";
import type { Message } from "./message";
import { MessageQueue } from "./message";
import { getInDatabaseCarrier, handleAddReadRecords } from "./data";
import Socket from "@/services/rfid/socket";

type InstanceType = {
  socket: Socket;
  messageQueue: MessageQueue;
} | null;

let instance: InstanceType = null;

/**
 * @description: 连接 RFID Socket
 * @return {*}
 */
export async function handleConnect() {
  if (instance !== null) return;

  const device = await getCurrentAccessDoorDevice();
  if (device === null) return;

  const {
    equipment_addr: address,
    equipment_port: port,
    equipment_txid: txid,
  } = device;
  if (address === null || port === null || txid === null) return;

  const messageQueue = new MessageQueue();
  const socket = new Socket({
    address,
    port: Number(port),
    message: messageQueue,
  });

  instance = {
    messageQueue,
    socket,
  };

  // 连接 RFID Socket
  await socket.connect();
  // 注册心跳检测
  registerHeartbeatCheck();
  // 设置 GPI1 触发
  handleSetGPITrigger(0, txid);
  // 设置 GPI2 触发
  handleSetGPITrigger(1, txid);
  // 注册消息监听器
  registerMessageListerner(device, messageQueue);
}

/**
 * 断开 RFID Socket 连接
 * @return {*}
 */
export async function handleDisConnect() {
  if (instance === null) return;

  instance.socket.destroy();
  instance = null;
}

/**
 * @description: 注册心跳检测
 * @param {string} address
 * @param {number} count
 * @return {*}
 */
function registerHeartbeatCheck() {
  setInterval(() => {
    if (instance === null) return;

    const count = instance.socket.heartbeatCount || 0;
    const command = generateCheckConnectionStatusCommand(count);
    instance.socket.write(command);

    instance.socket.heartbeatCount++;
  }, 5 * 1000);
}

/**
 * @description: 配置 GPO 状态
 * @param {string} address
 * @param {boolean} status
 * @return {*}
 */
export function handleSetGPO(GPOIndex: GPOIndexType, status: boolean) {
  if (!instance) return;

  const command = generateSetGPOCommand(GPOIndex, status);

  instance.socket.write(command);
}

/**
 * @description: 配置 GPI 触发
 * @param {string} address
 * @param {number} antennaIds
 * @return {*}
 */
function handleSetGPITrigger(GPIIndex: GPIIndexType, antennaIds: string) {
  if (!instance) return;

  const antennaIdList = antennaIds.split(",").map((item) => Number(item));
  const triggerCommand = `000102100008${generateAntennaCommand(
    antennaIdList
  )}01020006`;
  const command = generteSetGPITriggerCommand(GPIIndex, triggerCommand);

  instance.socket.write(command);
}

/**
 * @description: 注册消息监听器
 * @param {string} address
 * @param {MessageQueue} message
 * @return {*}
 */

let GPI1Start: Message | null = null;
let GPI2Start: Message | null = null;
let GPIEnd: Message | null = null;
let isEntry = false;
let isExit = false;
let currentAccessRecord: DoorAccessRecords | null = null;

export async function registerMessageListerner(
  equipment: DoorEquipment,
  message: MessageQueue
) {
  message.on<[Message]>("push", async (msg) => {
    // 开始触发红外
    if (msg.name === "ReceiveGPITriggerStartReport") {
      // 如果已经触发过 GPI1 或 GPI2，则跳过
      if (isEntry || isExit) return;

      const command = msg.content;
      const isGPI1 = command.slice(14, 16) === "00";
      const isGPI2 = command.slice(14, 16) === "01";

      if (isGPI1) {
        GPI1Start = msg;
        isExit = true;
        setTimeout(() => {
          isExit = false;
          currentAccessRecord = null;
        }, INTERVAL_THRESHOLD);
      }

      if (isGPI2) {
        GPI2Start = msg;
        isEntry = true;
        setTimeout(() => {
          isEntry = false;
          currentAccessRecord = null;
        }, INTERVAL_THRESHOLD);
      }

      const data: Partial<DoorAccessRecords> = {
        accessDirection: isEntry ? 1 : isExit ? 2 : null,
        directionCreateTime: new Date(),
        equipmentId: equipment.equipmentid,
        equipmentName: equipment.equipmentName,
        carrier_count: 0,
        has_alarm: 0,
        is_viewed: 0,
      };

      currentAccessRecord = await addAccessRecord(data);

      sendIpcToRenderer("go-check-page", isEntry ? 1 : isExit ? 2 : null);
    }
    // 触发红外结束
    else if (msg.name === "ReceiveGPITriggerStopReport") {
      if (!isEntry && !isExit) return;

      GPIEnd = msg;

      const recentMessages = isExit
        ? message
            .getMessages("ReceiveEPCReport")
            .filter(
              (item) => item.time > GPI1Start!.time && item.time < GPIEnd!.time
            )
        : message
            .getMessages("ReceiveEPCReport")
            .filter(
              (item) => item.time > GPI2Start!.time && item.time < GPIEnd!.time
            );

      const carriers = await getInDatabaseCarrier(recentMessages);

      // 如果没有读到在库载体的 EPC 标签，则跳过
      if (carriers.length === 0) {
        sendIpcToRenderer("get-read-data", []);
        return;
      }

      // 如果没有出入记录数据，则跳过
      if (currentAccessRecord === null) return;

      const registrationRecords = await fetchRegistrationRecords();

      // 如果是外出状态
      if (isExit) {
        const dataList = await handleAddReadRecords(
          carriers,
          registrationRecords,
          currentAccessRecord,
          1
        );
        sendIpcToRenderer("get-read-data", dataList);

        const registerRFIDList = registrationRecords.map(
          (item) => item.docRfid
        );
        const hasUnregistered = carriers.some(
          (carrier) => !registerRFIDList.includes(carrier.docRfid)
        );

        const updateData = {
          ...currentAccessRecord,
          carrier_count: carriers.length,
          has_alarm: hasUnregistered ? 1 : 0,
        };

        updateAccessRecord(currentAccessRecord.accessId, updateData);
      }

      // 如果是进入状态
      if (isEntry) {
        const dataList = await handleAddReadRecords(
          carriers,
          registrationRecords,
          currentAccessRecord,
          2
        );
        sendIpcToRenderer("get-read-data", dataList);

        const updateData = {
          ...currentAccessRecord,
          carrier_count: carriers.length,
        };
        updateAccessRecord(currentAccessRecord.accessId, updateData);
      }
    }
    // 读到 EPC 标签
    else if (msg.name === "ReceiveEPCReport") {
      if (!isExit) return;

      const [carriers, registrationRecords] = await Promise.all([
        await getInDatabaseCarrier([msg]),
        await fetchRegistrationRecords(),
      ]);
      if (carriers.length === 0 || registrationRecords.length === 0) return;

      const registerRFIDList = registrationRecords.map((item) => item.docRfid);
      const hasUnregistered = carriers.some(
        (carrier) => !registerRFIDList.includes(carrier.docRfid)
      );

      if (hasUnregistered) sendIpcToRenderer("go-alarm-page");
    }
  });
}

const rfidService = {
  name: "rfid" as const,
  fns: {
    handleConnect,
    handleDisConnect,
    handleSetGPO,
  },
};

export default rfidService;
