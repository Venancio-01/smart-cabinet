export {};

declare global {
  type MessageType = {
    type: "exit" | "version" | "download";
    content?: string;
    path?: string;
  };

  type ReceiveData = {
    type: "version" | "download" | "error";
    content?: unknown;
  };
}
