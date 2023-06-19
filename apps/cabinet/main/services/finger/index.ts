import {
  closeDevice,
  destroySDK,
  getParameter,
  handleIdentify,
  handleRegister,
  initSDK,
  loadAllTemplate,
  onIdentify,
  onRegister,
  openDevice,
  queryConnectState,
  startFingerCapture,
} from "./main";

const fingerService = {
  name: "finger" as const,
  fns: {
    initSDK,
    destroySDK,
    queryConnectState,
    openDevice,
    closeDevice,
    getParameter,
    startFingerCapture,
    handleRegister,
    onRegister,
    onIdentify,
    handleIdentify,
    loadAllTemplate,
  },
};

export default fingerService;
