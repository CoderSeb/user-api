import express from 'express'
import createError from 'http-errors'
import { apiRouter } from './api/apiRouter.js'

const router = express.Router()

router.use('/api', apiRouter)

router.get('/', (req: express.Request, res: express.Response) => {
  res.redirect('/api')
})

router.use('*', (req, res, next) => {
  next(createError(404))
})

export { router as indexRouter }

