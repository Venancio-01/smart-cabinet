import { app } from "electron";
import { UPDATE_SERVICE_SOCKET_PATH } from "utils/config";
import Socket from "utils/socket";

let instance: Socket | null = null;
let isConnected = false;

export function handleExitUpdateService() {
  if (!isConnected) return;

  const message = {
    type: "exit" as const,
  };

  handleSendData(message);
}

function handleSendData(data: MessageType) {
  const stringifyData = JSON.stringify(data);
  instance?.write(stringifyData);
}

function handleReceiveData() {
  if (!isConnected) return;

  const data = instance?.getData() || "";
  if (data === "") return null;

  instance?.setData("");
  try {
    const parseData = JSON.parse(data) as ReceiveData;
    return parseData;
  } catch (e) {
    console.log(e);
    return null;
  }
}

function handleSendCheckVersionMessage() {
  if (!isConnected) return;

  const data = {
    type: "version" as const,
    content: app.getVersion(),
    path: "https://service.qingshan.ltd/version.json",
  };
  handleSendData(data);
}

function handleSendDownloadMessage() {
  if (!isConnected) return;

  const data = {
    type: "download" as const,
  };
  handleSendData(data);
}

const updateService = {
  name: "update" as const,
  fns: {
    init: async () => {
      instance = new Socket({
        address: UPDATE_SERVICE_SOCKET_PATH,
        port: 4396,
        format: "utf-8",
      });

      try {
        await instance.init();
        return (isConnected = true);
      } catch (e) {
        console.log(e, "update service socket 连接失败");
        return isConnected;
      }
    },
    handleReceiveData,
    handleSendCheckVersionMessage,
    handleSendDownloadMessage,
    handleExitUpdateService,
  },
};

export default updateService;
