import express from 'express'
import createError from 'http-errors'
import { ITokenInfo, TokenHandler } from '../helpers/tokenHandler.js'


export const getAndCheckToken = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) return next(createError(403, 'Forbidden!'))
    const token = authHeader.split(' ')[1]
    if (!token) return next(createError(403, 'Forbidden!'))
    const tokenHandler = new TokenHandler()
    const data: ITokenInfo = await tokenHandler.verifyAccessToken(token)
    res.locals.user = {
      id: data.id,
      email: data.email
    }
    next()
  } catch (err) {
    next(err)
  }
}
