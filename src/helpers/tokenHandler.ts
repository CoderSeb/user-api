import jwt from 'jsonwebtoken'

export interface TokenUserPayload {
  id: string,
  email: string
}

export class TokenHandler {
  private privKey: string

  constructor() {
    this.privKey = Buffer.from(`${process.env.JWT_PRIVATE}`, 'base64').toString('ascii')
  }

  public async getAccessToken(data: TokenUserPayload) {
    const signOptions: jwt.SignOptions = {
      issuer: 'Newsflash User API',
      algorithm: 'RS256',
      expiresIn: '1h'
    }
    const token = jwt.sign(data, this.privKey, signOptions)
    return token
  }
}