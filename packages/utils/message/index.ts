export interface Message {
  name: string
  content: string
  time: number
}

interface Listener<T extends any[]> {
  eventName: string
  callback: (...args: T) => void
}

export class MessageQueue {
  private messages: Message[] = [] // 存储消息队列
  private maxLength = 800 // 消息队列上限
  private listeners: Listener<any>[] = [] // 事件监听器列表

  // 添加消息到队列中
  push(message: Message): void {
    if (this.messages.length >= this.maxLength) {
      // 消息队列已满，删除最早的一些消息
      this.messages.splice(0, 100)
    }

    this.messages.push(message)

    // 触发 push 事件，调用所有相关的事件监听器
    this.emit('push', message, this.messages)
  }

  // 根据名称获取队列中的消息
  getMessages(name: string): Message[] {
    return this.messages.filter(item => item.name === name)
  }

  // 获取队列中的所有消息
  getAllMessages(): Message[] {
    return this.messages
  }

  clear(): void {
    this.messages = []
  }

  // 添加事件监听器
  on<T extends any[]>(eventName: string, callback: (...args: T) => void): void {
    this.listeners.push({ eventName, callback })
  }

  // 触发事件
  emit<T extends any[]>(eventName: string, ...args: T): void {
    for (const listener of this.listeners) {
      if (listener.eventName === eventName) listener.callback(...args)
    }
  }
}
