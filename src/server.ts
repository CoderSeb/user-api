import 'dotenv/config'
import express, { Express, Request, Response } from 'express'

const run = () => {
  const server: Express = express()

  const PORT: number = Number(process.env.PORT) || 5050

  server.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Yolo' })
  })

  server.listen(PORT, () => {
    console.log(`Server is running @ http://localhost:${PORT}`)
  })
}

try {
  run()
} catch (err: unknown) {
  console.error(err)
  process.exit(1)
}