import express from 'express'

class ApiController {
  async index(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      res.json({ message: 'Newsflash User API' })
    } catch (err) {
      next(err)
    }
  }
}

export default ApiController
