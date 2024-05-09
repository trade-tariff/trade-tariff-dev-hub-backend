import { type Request, type Response, type NextFunction, type RequestHandler } from 'express'
import { type JwtHeader, decode, verify } from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'
import { logger } from '../config/logging'

const jwksUri = process.env.COGNITO_PUBLIC_KEYS_URL ?? ''
const excludedPaths = [
  '/api/healthcheck',
  '/api/healthcheckz'
]

const getKey = async (tokenHeader: JwtHeader): Promise<string | undefined> => {
  try {
    const client = jwksClient({ jwksUri })
    const key = await client.getSigningKey(tokenHeader.kid)
    const publicKey = key.getPublicKey()
    return publicKey
  } catch (error) {
    logger.error('Error getting public key', error)
    return undefined
  }
}

const unauthorized = (res: Response, message: string): void => {
  console.error(`Unauthorized access attempt: ${message}`)
  res.status(401).json({ message: 'Unauthorized' })
}

export const verifyToken: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const bearer = req.headers.authorization ?? ''

  if (excludedPaths.includes(req.path)) { next(); return }
  if (bearer === '') { unauthorized(res, 'Missing Authorization header'); return }

  const token = bearer.split(' ')[1] // Authorisation: Bearer <token>
  const decodedToken = decode(token, { complete: true }) ?? null

  if (decodedToken?.header?.kid === null || decodedToken?.header?.kid === undefined) {
    unauthorized(res, 'Invalid token or missing "kid" in header')
    return
  }

  getKey(decodedToken.header)
    .then(key => {
      if (key === undefined) { unauthorized(res, 'Unable to retrieve signing key'); return }

      verify(token, key, (_, payload) => {
        if (payload === undefined) { unauthorized(res, 'Invalid token signature or payload') }

        next()
      })
    })
    .catch((err) => {
      logger.error(`Error in key retrieval or verification: ${err}`)
      unauthorized(res, 'Key retrieval error')
    })
}
