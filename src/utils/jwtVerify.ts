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
  const client = jwksClient({ jwksUri })
  const key = await client.getSigningKey(tokenHeader.kid)
  const publicKey = key.getPublicKey()
  return publicKey
}

export const verifyToken: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  if (excludedPaths.includes(req.path)) {
    next(); return
  }

  const bearer = req.headers.authorization
  let authorised: boolean = false

  if (bearer !== undefined) {
    // Authorisation: Bearer <token>
    const token = bearer.split(' ')[1]
    const decodedToken = decode(token, { complete: true })

    if (decodedToken !== null) {
      if (decodedToken.header.kid !== null) {
        getKey(decodedToken.header)
          .then(key => {
            if (key === undefined) {
              logger.error('Key is undefined')
              authorised = false
            } else {
              verify(token, key, (_err, payload) => {
                if (payload !== undefined) {
                  logger.info('*****************************************Authorised*****************************************')
                  authorised = true
                  logger.info('*****************************************Authorised*****************************************')
                }
              })
            }
          })
          .catch((error) => {
            logger.error(`Caught Error: ${error}`)
            authorised = false
          })
      }
    }
  }
  if (!authorised) {
    logger.error('Unauthorised')
    res.status(401).json({
      message: 'Unauthorised'
    })
  } else {
    next()
  }
}
