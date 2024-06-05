import process from 'process'
import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'

const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: 'user',
  database: 'database',
})

export default drizzle(connection)
