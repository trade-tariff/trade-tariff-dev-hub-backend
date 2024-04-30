import 'jasmine'
import { type NextFunction } from 'express'

import { verifyToken } from '../../src/utils/jwtVerify'

describe('JWT verification', () => {
  const next: NextFunction = jasmine.createSpy()

  describe('on unprotected paths', () => {
    const req = {
      headers: {
        authorization: ''
      },
      path: '/api/healthcheck'
    } as any
    const res = {
      status: jasmine.createSpy().and.returnValue({ json: jasmine.createSpy() })
    } as unknown as any

    it('is skipped', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      verifyToken(req, res, next)
      expect(next).toHaveBeenCalled()
    })
  })

  describe('on protected paths', () => {
    const req = {
      headers: {
        authorization: ''
      },
      path: '/api/keys/1'
    } as any

    const res = {
      status: jasmine.createSpy().and.returnValue({ json: jasmine.createSpy() })
    } as any

    const next: NextFunction = jasmine.createSpy()

    it('responds with 401 if Authorization header is missing', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      verifyToken(req, res, next)
      expect(res.status).toHaveBeenCalledWith(401)
      expect(next).not.toHaveBeenCalled()
    })
  })
})
