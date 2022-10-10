import express from 'express'
import createError from 'http-errors'
import { IUser, UserModel } from '../models/userModel.js'
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

  async signIn(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const { email, pass } = req.body

      UserModel.findOne({ email }, (err: Error, user: IUser) => {
        if (err) return next(err)
        if (!user) return next(createError(401, 'Invalid credentials!'))
        user.comparePassword(pass, (err: Error, isMatch: boolean) => {
          if (err) return next(err)
          if (!isMatch) return next(createError(401, 'Invalid credentials!'))
          res.json({ message: 'User authenticated!' })
        })
      })
    } catch (err) {
      next(err)
    }
  }
}

export default UserController
