import { type Request, type Response, type NextFunction, type RequestHandler } from 'express'
import { type JwtHeader, decode, verify } from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'

const jwksUri = process.env.COGNITO_PUBLIC_KEYS_URL ?? ''
const excludedPaths = [
  '/api/healthcheck',
  '/api/healthcheckz'
]

const client = jwksClient({ jwksUri })

const getKey = async (tokenHeader: JwtHeader): Promise<string | undefined> => {
  const key = await client.getSigningKey(tokenHeader.kid)
  const publicKey = key.getPublicKey()
  return publicKey
}

export const verifyToken: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  if (excludedPaths.includes(req.path)) {
    next()
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
              authorised = false
            } else {
              verify(token, key, (_, payload) => {
                if (payload !== undefined) {
                  authorised = true
                }
              })
            }
          })
          .catch(() => {
            authorised = false
          })
      }
    }
  }

  if (!authorised) {
    res.status(401).contentType('application/json').json({
      message: 'Unauthorised'
    })
  } else {
    next()
  }
}
