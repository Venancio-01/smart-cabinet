const net = require('net')
const { exec } = require('child_process')
const socketPath = '/tmp/hjrich-update-service.sock'

const SERVICE_PATH = '/home/js/Project/go/src/hjrich-update-service/hjrich-update-service'
const handleOpenUpdateService = () => {
  return new Promise((resolve, reject) => {
    exec(`sudo ${SERVICE_PATH}`, error => {
      if (error) reject(error)
      setTimeout(() => {
        resolve()
      }, 1000)
    })
  })
}

const main = () => {
  const client = net.createConnection({ path: socketPath })

  client.on('connect', () => {
    console.log('Connected to Go server via Unix socket')
  })

  client.on('data', data => {
    console.log(`Received data from server: ${data}`)
  })

  client.on('error', err => {
    console.error(`Error occurred: ${err}`)
  })

  client.on('end', () => {
    console.log('Disconnected from Go server via Unix socket')
  })

  // Send data to server
  const message = {
    type: 'version',
    content: '1.0.0',
    path: 'https://service.qingshan.ltd/version.json'
  }

  const data = JSON.stringify(message)
  client.write(data)

  // setTimeout(() => {
  //   const message2 = {
  //     type: 'download'
  //   }

  //   const data2 = JSON.stringify(message2)
  //   client.write(data2)
  // }, 2000)

  setTimeout(() => {
    const message2 = {
      type: 'exit'
    }

    const data2 = JSON.stringify(message2)
    client.write(data2)
  }, 3000)
}

const init = async () => {
  await handleOpenUpdateService()
  main()
}

init()
