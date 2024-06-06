import 'jasmine'
import { type Response } from 'express'

import { UserController } from '../../src/controllers/usersController'
import { type UserRepository } from '../../src/repositories/userRepository'
import { User } from '../../src/models/user'
import { type FrontendRequest } from '../../src/utils/audit'

describe('UserController', () => {
  let repository: jasmine.SpyObj<UserRepository>
  let controller: UserController
  let getUserResult: Promise<User | null>
  let req: FrontendRequest
  let res: Response
  let user: User

  describe('show', () => {
    it('returns the user', async () => {
      user = new User()
      getUserResult = Promise.resolve(user)
      repository = jasmine.createSpyObj('UserRepository', { getUser: getUserResult })
      repository.getUser.bind(repository)
      controller = new UserController(repository)
      req = { params: { id: 'id' } } as any
      res = { json: jasmine.createSpy() } as unknown as any

      await controller.show(req, res)

      expect(repository.getUser).toHaveBeenCalledWith('id')
      expect(res.json).toHaveBeenCalledWith(user)
    })

    it('returns 404 if the user is not found', async () => {
      getUserResult = Promise.resolve(null)
      repository = jasmine.createSpyObj('UserRepository', { getUser: getUserResult })
      repository.getUser.bind(repository)
      controller = new UserController(repository)
      req = { params: { id: 'id' } } as any
      res = { status: jasmine.createSpy().and.returnValue({ json: jasmine.createSpy() }) } as unknown as any

      await controller.show(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
    })
  })

  describe('index', () => {
    it('returns an empty list if there are no users', async () => {
      const listUsersResult = Promise.resolve([])
      repository = jasmine.createSpyObj('UserRepository', { getUser: listUsersResult })
      repository.getUser.bind(repository)
      controller = new UserController(repository)
      req = { params: { id: 'userId' } } as any
      res = { json: jasmine.createSpy() } as unknown as any

      await controller.show(req, res)

      expect(repository.getUser).toHaveBeenCalledWith('userId')
      expect(res.json).toHaveBeenCalledWith([])
    })
  })

  describe('update', () => {
    const res = {
      status: function (code: number) {
        this.statusCode = code
        return this
      },
      json: function (data: any) {
        this.data = data
        return this
      }
    } as any
    it('updates a user organisationId', async () => {
      user = new User()
      const getUserResult = Promise.resolve(user)
      const updateUserResult = Promise.resolve(user)

      repository = jasmine.createSpyObj(
        'UserRepository',
        {
          updateUser: updateUserResult,
          getUser: getUserResult
        }
      )
      repository.updateUser.bind(repository)
      controller = new UserController(repository)
      req = { headers: {'X-User-Id': 'secret-value'}, params: { id: 'id' }, body: { organisationId: 'organisationId' } } as any

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await controller.update(req, res)

      expect(repository.getUser).toHaveBeenCalledWith('id')
      expect(repository.updateUser).toHaveBeenCalledWith(user)
      expect(res.statusCode).toBe(200)
      expect(res.data).toEqual({
        UserId: '',
        OrganisationId: 'organisationId',
        CreatedAt: user.CreatedAt,
        UpdatedAt: user.UpdatedAt
      })
    })
  })

  describe('create', () => {
    it('creates a new user', async () => {
      user = new User()

      const createUserResult = Promise.resolve(user)
      repository = jasmine.createSpyObj('UserRepository', { createUser: createUserResult })
      repository.createUser.bind(repository)
      controller = new UserController(repository)
      req = { params: { id: 'id' } } as any
      const res = {
        status: function (code: number) {
          this.statusCode = code
          return this
        },
        json: function (data: any) {
          this.data = data
          return this
        }
      } as any

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await controller.create(req, res)

      expect(repository.createUser).toHaveBeenCalledWith('id')
      expect(res.statusCode).toBe(201)
      expect(res.data).toEqual({
        UserId: '',
        OrganisationId: '',
        CreatedAt: user.CreatedAt,
        UpdatedAt: user.UpdatedAt
      })
    })
  })
})
