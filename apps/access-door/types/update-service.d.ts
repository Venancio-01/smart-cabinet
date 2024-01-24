export {}

declare global {
  interface MessageType {
    type: 'exit' | 'version' | 'download'
    content?: string
    path?: string
  }

  interface ReceiveData {
    type: 'version' | 'download' | 'error'
    content?: unknown
  }
}
