import express from 'express'
import UserController from '../../controllers/userController.js'
import { getAndCheckToken } from '../../middlewares/authMiddleware.js'

const router = express.Router()

const controller = new UserController()

router.get('/', controller.index)
router.post('/signup', controller.signUp)
router.post('/signin', controller.signIn)
router.put('/', getAndCheckToken, controller.changeUser)

export { router as userRouter }

