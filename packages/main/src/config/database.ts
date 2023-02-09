import { resolve } from 'path'

const entityPath = resolve(__dirname, '../../dist-electron/database/entities/*.js')

export const CONFIG = {
  host: 'localhost',
  port: 3306,
  username: 'sa',
  password: 'js123456',
  database: 'double_door',
  synchronize: false,
  logging: false,
  subscribers: [],
  migrations: [],
  entities: [entityPath]
}
