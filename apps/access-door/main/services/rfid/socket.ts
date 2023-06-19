import { Socket } from "net";
import type { MessageQueue } from "./message";
import { error, info, warn } from "@/services/log";
import { parseData, validateReceivedData } from "@/services/rfid/data";

export default class RfidSocket {
  instance: Socket | null = null;
  message: MessageQueue | null = null;
  private address = "";
  private port = 8160;
  connected = false;
  heartbeatCount = 0;

  constructor(option: {
    address: string;
    port: number;
    message: MessageQueue;
  }) {
    this.address = option.address;
    this.port = option?.port;
    this.message = option.message;
  }

  async connect() {
    if (this.instance) throw new Error("Instance already exists");

    this.instance = new Socket();

    await new Promise<void>((resolve, reject) => {
      this.instance!.on("connect", () => {
        info("socket 连接成功");
        this.connected = true;
        resolve();
        clearTimeout(timer);
      });

      this.instance?.on("close", () => {
        info("关闭 socket 连接");
        this.connected = false;
        reject(new Error("socket 连接关闭"));
      });

      this.instance?.on("error", (err) => {
        error(`socket 出错：${err.message} | ${err.stack} | ${err.name}`);
        this.instance?.destroy();
      });

      this.instance?.on("data", (data) => {
        const toHexData = data.toString("hex");

        const { name, content, time } = parseData(toHexData);

        // 心跳包不做处理
        if (name === "HeartBeat") return;

        // 是验证有效的
        const isValid = validateReceivedData(toHexData);

        if (!isValid)
          warn(`validate failed - name:${name} content:${toHexData}`);

        this.message?.push({ name, content, time, isValid });

        info(`receive - name: ${name} content:${content}`);
      });

      const MAX_CONNECT_DURATION = 3000;
      const timer = setTimeout(() => {
        this.instance?.destroy();
      }, MAX_CONNECT_DURATION);

      this.instance?.connect(this.port, this.address);
    });
  }

  destroy() {
    if (!this.instance) return;

    this.instance.destroy();
  }

  write(data: Buffer) {
    if (!this.instance) return;

    const { name, content } = parseData(data.toString("hex"));

    // 心跳包不打印
    if (name !== "HeartBeat") info(`send - name: ${name} content:${content}`);

    this.instance.write(data);
  }
}
