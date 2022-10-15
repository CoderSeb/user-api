import express from 'express'
import rateLimit from 'express-rate-limit'
import UserController from '../../controllers/userController.js'
import { getAndCheckAuthToken, getAndCheckResetToken } from '../../middlewares/authMiddleware.js'

const router = express.Router()

const controller = new UserController()

const limiterStrict = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false
})

router.get('/', controller.index)
router.post('/signup', limiterStrict, controller.signUp)
router.post('/signin', limiterStrict, controller.signIn)
router.post('/forgot-pass', limiterStrict, controller.passResetLink)
router.put('/reset-pass/:resetToken', limiterStrict, getAndCheckResetToken, controller.passReset)
router.put('/', getAndCheckAuthToken, controller.change)
router.delete('/', getAndCheckAuthToken, controller.delete)
router.get('/search', getAndCheckAuthToken, controller.find)

export { router as userRouter }

