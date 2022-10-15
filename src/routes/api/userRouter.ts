import express from 'express'
import UserController from '../../controllers/userController.js'
import { getAndCheckAuthToken, getAndCheckResetToken } from '../../middlewares/authMiddleware.js'

const router = express.Router()

const controller = new UserController()

router.get('/', controller.index)
router.post('/signup', controller.signUp)
router.post('/signin', controller.signIn)
router.post('/forgot-pass', controller.passResetLink)
router.put('/reset-pass/:resetToken', getAndCheckResetToken, controller.passReset)
router.put('/', getAndCheckAuthToken, controller.change)
router.delete('/', getAndCheckAuthToken, controller.delete)
router.get('/search', getAndCheckAuthToken, controller.find)

export { router as userRouter }

