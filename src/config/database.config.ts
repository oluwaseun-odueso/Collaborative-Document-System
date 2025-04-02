import { registerAs } from "@nestjs/config"

export default registerAs('database', () => ({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: [parseInt(process.env.DB_PORT!, 10) || 5432],
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  autoLoadModels: true,
  synchronize: true
}))