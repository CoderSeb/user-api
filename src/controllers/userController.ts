import express from 'express'
import createError from 'http-errors'
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
        message: 'Newsflash User API',
        endpoints: [
          {
            name: 'signUp',
            method: 'POST',
            path: '/signup',
            body: {
              firstName: 'string',
              lastName: 'string',
              email: 'string',
              pass: 'string'
            },
            response: {
              code: 201,
              message: 'string'
            }
          },
          {
            name: 'signIn',
            method: 'POST',
            path: '/signin',
            body: {
              email: 'string',
              pass: 'string'
            },
            response: {
              code: 200,
              message: 'string',
              accessToken: 'string'
            }
          }
        ]
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
          const token = await tokenHandler.getAccessToken({
            id: user._id,
            email: user.email
          })
          const endpoints = [
            {
              name: 'change',
              method: 'PUT',
              path: '/',
              header: {
                Authorization: 'Bearer <accessToken>'
              },
              body: {
                fName: 'string<optional>',
                lName: 'string<optional>',
                email: 'string<optional>',
                newPass: 'string<optional>',
                currentPass: 'string<mandatory>'
              },
              response: {
                code: 200,
                message: 'string'
              }
            },
            {
              name: 'delete',
              method: 'DELETE',
              path: '/',
              header: {
                Authorization: 'Bearer <accessToken>'
              },
              body: {
                pass: 'string'
              },
              response: {
                code: 204
              }
            },
            {
              name: 'search',
              method: 'GET',
              path: '/search',
              header: {
                Authorization: 'Bearer <accessToken>'
              },
              query: {
                email: 'string<optional>'
              },
              response: {
                code: 200,
                body: [] || {}
              }
            }
          ]
          res.json({
            message: 'User authenticated!',
            accessToken: token,
            endpoints
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
}

export default UserController
