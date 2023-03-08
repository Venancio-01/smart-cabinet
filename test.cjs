const net = require('net')
const client = new net.Socket()

// 连接到 Go 服务端的 Unix 域套接字
client.connect('/tmp/test.sock', () => {
  console.log('Connected to Go server')
  // 向 Go 服务端发送数据
  client.write('Hello from Node.js')
})

// 监听服务端响应数据
client.on('data', data => {
  console.log('Received data from Go server:', data.toString())
})

// 处理连接错误
client.on('error', err => {
  console.error('Connection error:', err)
})
