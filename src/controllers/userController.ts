import express from 'express'
import { UserModel } from '../models/userModel.js'
class UserController {
  async index(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      res.json({ message: 'User route reached..' })
    } catch (err) {
      next(err)
    }
  }

  async signUp(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const { firstName, lastName, email, pass } = req.body

      const newUser = new UserModel({
        fName: firstName,
        lName: lastName,
        email,
        password: pass
      })

      await newUser.save()

      res.status(201).json({ message: 'User created successfully!' })
    } catch (err) {
      next(err)
    }
  }
}

export default UserController
