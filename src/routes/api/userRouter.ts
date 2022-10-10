import express from 'express'
import UserController from '../../controllers/userController.js'
import { getAndCheckToken } from '../../middlewares/authMiddleware.js'

const router = express.Router()

const controller = new UserController()

router.get('/', controller.index)
router.post('/signup', controller.signUp)
router.post('/signin', controller.signIn)
router.put('/', getAndCheckToken, controller.change)
router.delete('/', getAndCheckToken, controller.delete)
router.get('/search', getAndCheckToken, controller.find)

export { router as userRouter }

