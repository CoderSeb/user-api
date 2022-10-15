import express from 'express'
import createError from 'http-errors'
import { IEmailOptions, sendEmail } from '../helpers/emailHandler.js'
import { TokenHandler } from '../helpers/tokenHandler.js'
import { IUser, UserModel } from '../models/userModel.js'

class UserController {
  async index(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const userDocs = {
        message: 'Newsflash User API'
      }
      res.json(userDocs)
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
        user.comparePassword(pass, async (err: Error, isMatch: boolean) => {
          if (err) return next(err)
          if (!isMatch) return next(createError(401, 'Invalid credentials!'))
          const tokenHandler = new TokenHandler()
          const token = await tokenHandler.getToken({
            id: user._id,
            email: user.email
          }, '1h')

          res.json({
            message: 'User authenticated!',
            accessToken: token
          })
        })
      })
    } catch (err) {
      next(err)
    }
  }

  async change(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const { fName, lName, email, newPass, currentPass } = req.body
      const { id } = res.locals.user
      if (!currentPass) return next(createError(400, 'Bad request!'))
      const user = await UserModel.findOne({ id: id })
      if (!user) return next(createError(404, 'User not found!'))
      user.comparePassword(
        currentPass,
        async (err: Error, isMatch: boolean) => {
          if (err) return next(err)
          if (!isMatch) return next(createError(401, 'Invalid credentials!'))
          if (fName) {
            user.fName = fName
          }
          if (lName) {
            user.lName = lName
          }
          if (email) {
            user.email = email
          }
          if (newPass) {
            user.password = newPass
          }
          await user.save()
          res.json({ message: 'User updated successfully!' })
        }
      )
    } catch (err) {
      next(err)
    }
  }

  async delete(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const { id } = res.locals.user
      const { pass } = req.body
      const user = await UserModel.findOne({ id: id })
      if (!user) return next(createError(404, 'User not found!'))
      user.comparePassword(pass, async (err: Error, isMatch: boolean) => {
        if (err) return next(err)
        console.log(pass)
        if (!isMatch) return next(createError(401, 'Invalid credentials!'))
        await user.delete()
        res.sendStatus(204)
      })
    } catch (err) {
      next(err)
    }
  }

  async find(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const { id } = res.locals.user
      const user = await UserModel.findOne({ id: id })
      if (!user) return next(createError(401, 'Unauthorized!'))
      const { email } = req.query
      if (!email) {
        await UserModel.find({})
          .lean()
          .exec((err, users) => {
            if (err) return next(err)
            const jsonPackage = users.map((user) => {
              return {
                fName: user.fName,
                lName: user.lName,
                email: user.email
              }
            })
            res.json(jsonPackage)
          })
      } else if (email) {
        await UserModel.findOne({ email })
          .lean()
          .exec((err, user) => {
            if (err) return next(err)
            if (!user) {
              res.json({})
            } else {
              const jsonPackage = {
                fName: user.fName,
                lName: user.lName,
                email: user.email
              }
              res.json(jsonPackage)
            }
          })
      }
    } catch (err) {
      next(err)
    }
  }

  async passResetLink(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const { email } = req.body

      UserModel.findOne({ email }, async (err: Error, user: IUser) => {
        if (err) return next(err)
        if (!user) return next(createError(404, 'User not found!'))
        user.generateReset()
        user.save()
        const tokenHandler = new TokenHandler()
        const token = await tokenHandler.getToken({
          id: user._id,
          email: user.email
        }, '20m')
        const mailOpt: IEmailOptions = {
          to: email,
          subject: 'Newsflash - Password Reset Link',
          html: `<p>Reset code: ${user.resetCode}</p><p>Click <a href="${process.env.FRONTEND_URL}/auth/reset-password/${token}">here</a> to reset your password.</p><p>If you did not request a password reset, please ignore this email.</p>`
        }
        await sendEmail(mailOpt)
        res.send({ message: `Password reset link sent to ${email}!` })
      })
    } catch (err) {
      next(err)
    }
  }

  async passReset(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const { email } = res.locals.user
      const { resetCode, newPass } = req.body
      if (resetCode.toString().length !== 9) {
        return next(createError(401, 'Invalid code!'))
      }
      UserModel.findOne({ email }, async (err: Error, user: IUser) => {
        if (err) return next(err)
        if (!user) return next(createError(404, 'User not found!'))
        if (user.resetCode !== resetCode) {
          return next(createError(401, 'Invalid code!'))
        }
        user.password = newPass
        user.resetCode = 0
        user.save()
        res.send({ message: 'Password reset successfully!' })
      })
    } catch (err) {
      next(err)
    }
  }
}

export default UserController
