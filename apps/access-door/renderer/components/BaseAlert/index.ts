import { Modal } from "ant-design-vue";

function createDialog(text: string) {
  Modal.info({
    content: text,
    okText: "确定",
  });
}

export default createDialog;
