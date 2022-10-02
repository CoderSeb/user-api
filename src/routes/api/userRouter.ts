import express from 'express'
import UserController from '../../controllers/userController.js'

const router = express.Router()

const controller = new UserController()

router.get('/', controller.index)
router.post('/signup', controller.signUp)

export { router as userRouter }

