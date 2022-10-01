import express from 'express';

class UserController {
  async index(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
      res.json({ message: 'User route reached..' });
    } catch (err) {
      next(err);
    }
  }
}

export default UserController