import express, { Express } from 'express'
import { indexRouter } from './routes/router.js'

const run = () => {
  const server: Express = express()

  const PORT: number = Number(process.env.PORT) || 5050

  server.use(indexRouter)

  server.use((
    err: { status: number; message: string; stack: string },
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    interface ErrorResponse {
      status: number
      message: string
      stack?: string
    }
    const errorResponse: ErrorResponse = {
      status: err.status || 500,
      message: err.message || 'Internal Server Error',
      stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
    }
    res.status(errorResponse.status).json(errorResponse)
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