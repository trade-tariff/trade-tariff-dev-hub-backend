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
  logger.info(`Token Header: ${JSON.stringify(tokenHeader)}`)
  const key = await client.getSigningKey(tokenHeader.kid)
  logger.info(`Key from JWKS: ${JSON.stringify(key)}`)
  const publicKey = key.getPublicKey()
  logger.info(`Public Key: ${publicKey}`)
  return publicKey
}

export const verifyToken: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  if (excludedPaths.includes(req.path)) {
    next(); return
  }

  const bearer = req.headers.authorization
  let authorised: boolean = false

  if (bearer !== undefined) {
    logger.info(`Authorisation: ${bearer}`)
    // Authorisation: Bearer <token>
    const token = bearer.split(' ')[1]
    logger.info(`Token: ${token}`)
    const decodedToken = decode(token, { complete: true })
    logger.info(`Decoded Token: ${JSON.stringify(decodedToken)}`)

    if (decodedToken !== null) {
      if (decodedToken.header.kid !== null) {
        getKey(decodedToken.header)
          .then(key => {
            if (key === undefined) {
              logger.info('Key is undefined')
              authorised = false
            } else {
              verify(token, key, (err, payload) => {
                logger.info(`Payload: ${JSON.stringify(payload)}`)
                logger.info(`Error: ${JSON.stringify(err)}`)

                if (payload !== undefined) {
                  logger.info('*****************************************Authorised*****************************************')
                  authorised = true
                  logger.info('*****************************************Authorised*****************************************')
                }
              })
            }
          })
          .catch((error) => {
            logger.info(`Caught Error: ${error}`)
            authorised = false
          })
      }
    }
  }
  if (!authorised) {
    logger.info('Unauthorised')
    res.status(401).json({
      message: 'Unauthorised'
    })
  } else {
    next()
  }
}
