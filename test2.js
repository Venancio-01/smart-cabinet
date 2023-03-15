const { exec } = require('child_process')

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

async function main() {
  try {
    await handleOpenUpdateService()
  } catch (e) {
    console.log(e)
  }
}

main()
