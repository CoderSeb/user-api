import express from 'express'
import ApiController from '../../controllers/apiController.js'
import { userRouter } from './userRouter.js'

const router = express.Router()

const controller = new ApiController()

router.use('/user', userRouter)

router.get('/', controller.index)


export { router as apiRouter }

