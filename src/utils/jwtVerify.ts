import { type Request, type Response, type NextFunction, type RequestHandler } from 'express'
import { type JwtHeader, decode, verify } from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'

const jwksUri = process.env.COGNITO_PUBLIC_KEYS_URL ?? ''
const excludedPaths = [
  '/api/healthcheck',
  '/api/healthcheckz'
]

const getKey = async (tokenHeader: JwtHeader): Promise<string | undefined> => {
  const client = jwksClient({ jwksUri })
  const key = await client.getSigningKey(tokenHeader.kid)
  const publicKey = key.getPublicKey()
  return publicKey
}

const unauthorised = (res: Response): void => { res.status(401).json({ message: 'Unauthorised' }) }

export const verifyToken: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const bearer = req.headers.authorization ?? ''

  if (excludedPaths.includes(req.path)) { next(); return }
  if (bearer === '') { unauthorised(res); return }

  const token = bearer.split(' ')[1] // Authorisation: Bearer <token>
  const decodedToken = decode(token, { complete: true }) ?? null

  if (decodedToken === null) { unauthorised(res); return }
  if (decodedToken.header.kid === null) { unauthorised(res); return }

  getKey(decodedToken.header)
    .then(key => {
      if (key === undefined) { unauthorised(res); return }

      verify(token, key, (_, payload) => {
        if (payload === undefined) { unauthorised(res) }

        next()
      })
    })
    .catch(() => { unauthorised(res) })
}
