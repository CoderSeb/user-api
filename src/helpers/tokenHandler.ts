import createError from 'http-errors'
import jwt from 'jsonwebtoken'
export interface ITokenUserPayload {
  id: string,
  email: string
}

export interface ITokenInfo {
  id: string,
  email: string,
  iat: number,
  exp: number,
  iss: string
}

export class TokenHandler {
  private privKey: string

  constructor() {
    this.privKey = Buffer.from(`${process.env.JWT_PRIVATE}`, 'base64').toString('ascii')
  }

  public async getAccessToken(data: ITokenUserPayload) {
    const signOptions: jwt.SignOptions = {
      issuer: 'Newsflash User API',
      algorithm: 'RS512',
      expiresIn: '1h'
    }
    const token = jwt.sign(data, this.privKey, signOptions)
    return token
  }

  public async verifyAccessToken(token: string): Promise<ITokenInfo> {
    try {
      const verifyOptions: jwt.VerifyOptions = {
        issuer: 'Newsflash User API',
        algorithms: ['RS512']
      }
      const data = jwt.verify(token, this.privKey, verifyOptions)
      return data as ITokenInfo
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        throw createError(401, 'Token expired!')
      }
      if (err instanceof jwt.JsonWebTokenError) {
        throw createError(401, 'Invalid token!')
      }
      throw err
    }
  }
}