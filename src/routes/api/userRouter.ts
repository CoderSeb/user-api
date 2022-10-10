import express from 'express'
import UserController from '../../controllers/userController.js'

const router = express.Router()

const controller = new UserController()

router.get('/', controller.index)
router.post('/signup', controller.signUp)
router.post('/signin', controller.signIn)

export { router as userRouter }

