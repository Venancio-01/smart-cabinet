// 导入 net 模块
import net from 'net';

// 定义 tcpSocket 类
export default class TcpSocket {
  // 声明一个私有的 net.Socket 属性
  private socket: net.Socket;

  // 定义构造函数，传入 address 和 port 参数
  constructor(address: string, port: number) {
    // 创建一个新的 net.Socket 实例
    this.socket = new net.Socket();

    // 连接到指定的地址和端口
    this.socket.connect(port, address, () => {
      // 连接成功后的回调函数
      console.log('Connected to ' + address + ':' + port);
    });

    // 监听 socket 的 data 事件，接收数据
    this.socket.on('data', (data) => {
      // 处理接收到的数据
      console.log('Received: ' + data);
    });

    // 监听 socket 的 close 事件，断开连接
    this.socket.on('close', () => {
      // 处理断开连接的情况
      console.log('Connection closed');
    });
  }

  // 定义一个发送数据的方法
  send(data: any) {
    // 调用 socket 的 write 方法，发送数据
    this.socket.write(data);
  }

  // 定义一个关闭连接的方法
  close() {
    // 调用 socket 的 destroy 方法，关闭连接
    this.socket.destroy();
  }
}
