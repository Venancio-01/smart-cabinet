import { Socket } from 'net';

export default class TcpSocket {
  private instance: Socket | null = null;
  private data = '';
  private address = '';
  private port: number | null = null;

  constructor(address: string, port: number) {
    this.address = address;
    this.port = port;
  }

  init() {
    return new Promise<void>(async (resolve, reject) => {
      if (this.instance) reject();

      this.instance = new Socket();

      this.instance.on('connect', () => {
        console.log('socket 连接成功');
        resolve();
      });

      this.instance.on('close', () => {
        console.log('关闭 socket 连接');
        reject();
      });

      this.instance.on('error', (err) => {
        console.log('socket 出错', err);
        this.instance.destroy();
      });

      this.instance.on('data', (data) => {
        this.data += data.toString('hex');
        // console.log('收到数据', data.toString('hex'))
      });

      try {
        await this.connect();
      } catch (err) {
        this.instance.destroy();
      }
    });
  }

  connect() {
    return new Promise<void>((resolve, reject) => {
      let timeout = 1;

      this.instance.connect(this.port, this.address, () => {
        resolve();
      });

      setInterval(() => {
        timeout--;

        if (timeout === 0) {
          reject();
        }
      }, 1000);
    });
  }

  destroy() {
    if (!this.instance) return;
    this.instance.destroy();
  }

  write(data) {
    if (!this.instance) return;
    console.log('写入数据', data);
    this.instance.write(data);
  }

  getData() {
    if (!this.instance) return;
    return this.data;
  }

  setData(source: string) {
    if (!this.instance) return;
    this.data = source;
    return this.data;
  }
}
