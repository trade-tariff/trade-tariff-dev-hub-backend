import 'jasmine'
import { type NextFunction, type Request, type Response } from 'express'

import { verifyToken } from '../../src/utils/jwtVerify'

describe('JWT verification', () => {
  const next: NextFunction = jasmine.createSpy()

  describe('on unprotected paths', () => {
    let req = {
      headers: {
        authorization: ''
      },
      path: '/api/healthcheck'
    } as any
    let res = {
      status: jasmine.createSpy().and.returnValue({ json: jasmine.createSpy() })
    } as unknown as any

    it('is skipped', () => {
      verifyToken(req, res, next)
      expect(next).toHaveBeenCalled()
    })
  })

  describe('on protected paths', () => {
    let req = {
      headers: {
        authorization: ''
      },
      path: '/api/keys/1'
    } as any

    let res = {
      status: jasmine.createSpy().and.returnValue({ json: jasmine.createSpy() })
    } as any

    const next: NextFunction = jasmine.createSpy()

    it('responds with 401 if Authorization header is missing', () => {
      verifyToken(req, res, next)
      expect(res.status).toHaveBeenCalledWith(401)
      expect(next).not.toHaveBeenCalled()
    })
  })
})
