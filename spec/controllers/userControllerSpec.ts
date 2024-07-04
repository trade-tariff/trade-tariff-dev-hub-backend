import 'jasmine'
import { type Response } from 'express'

import { UserController } from '../../src/controllers/usersController'
import { type UserRepository } from '../../src/repositories/userRepository'
import { type OrganisationRepository } from '../../src/repositories/organisationRepository'
import { User } from '../../src/models/user'
import { Organisation } from '../../src/models/organisation'
import { type FrontendRequest } from '../../src/utils/audit'
import * as audit from '../../src/utils/audit'

beforeAll(() => {
  spyOn(audit, 'createAuditLogEntry').and.returnValue(Promise.resolve())
})

describe('UserController', () => {
  let userRepository: jasmine.SpyObj<UserRepository>
  let organisationRepository: jasmine.SpyObj<OrganisationRepository>
  let controller: UserController
  let getUserResult: Promise<User | null>
  let updateUserResult: Promise<User | null>
  let getOrganisationResult: Promise<Organisation | null>
  let createOrganisationResult: Promise<Organisation | null>
  let updateOrganisationResult: Promise<Organisation | null>
  let req: FrontendRequest
  let res: Response
  let user: User
  let organisation: Organisation

  describe('show', () => {
    it('returns the user', async () => {
      user = new User()
      user.OrganisationId = 'organisationId'
      user.EmailAddress = 'abc@test.com'
      organisation = new Organisation()
      getUserResult = Promise.resolve(user)
      getOrganisationResult = Promise.resolve(null)
      createOrganisationResult = Promise.resolve(organisation)
      updateOrganisationResult = Promise.resolve(organisation)
      userRepository = jasmine.createSpyObj('UserRepository', {
        getUser: getUserResult
      })
      organisationRepository = jasmine.createSpyObj('OrganisationRepository', {
        getOrganisation: getOrganisationResult,
        createOrganisation: createOrganisationResult
      })
      userRepository.getUser.bind(userRepository)
      organisationRepository.getOrganisation.bind(organisationRepository)
      organisationRepository.createOrganisation.bind(organisationRepository)
      controller = new UserController(userRepository, organisationRepository)
      req = { params: { id: 'id' } } as any
      res = { json: jasmine.createSpy() } as unknown as any

      await controller.show(req, res)

      expect(userRepository.getUser).toHaveBeenCalledWith('id')
      expect(organisationRepository.getOrganisation).toHaveBeenCalledWith('organisationId')
      expect(organisationRepository.createOrganisation).toHaveBeenCalledWith('organisationId')
      expect(res.json).toHaveBeenCalledWith({ ...user.toJson(), Status: organisation.Status })
    })

    it('returns 404 if the user is not found', async () => {
      getUserResult = Promise.resolve(null)
      userRepository = jasmine.createSpyObj('UserRepository', {
        getUser: getUserResult
      })
      organisationRepository = jasmine.createSpyObj('OrganisationRepository', {
        getOrganisation: Promise.resolve(null)
      })
      userRepository.getUser.bind(userRepository)
      controller = new UserController(userRepository, organisationRepository)
      req = { params: { id: 'id' } } as any
      res = {
        status: jasmine
          .createSpy()
          .and.returnValue({ json: jasmine.createSpy() })
      } as unknown as any

      await controller.show(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
    })
  })

  describe('create', () => {
    it('returns a created a user', async () => {
      user = new User()
      user.OrganisationId = 'organisationId'
      organisation = new Organisation()
      organisation.OrganisationId = 'organisationId'
      getUserResult = Promise.resolve(user)
      getOrganisationResult = Promise.resolve(null)
      createOrganisationResult = Promise.resolve(organisation)
      userRepository = jasmine.createSpyObj('UserRepository', {
        createUser: Promise.resolve(user)
      })
      organisationRepository = jasmine.createSpyObj('OrganisationRepository', {
        getOrganisation: getOrganisationResult,
        createOrganisation: createOrganisationResult
      })
      userRepository.createUser.bind(userRepository)
      organisationRepository.getOrganisation.bind(organisationRepository)
      organisationRepository.createOrganisation.bind(organisationRepository)
      controller = new UserController(userRepository, organisationRepository)
      req = {
        params: { id: 'id' },
        body: { organisationId: 'organisationId' }
      } as any
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

      expect(userRepository.createUser).toHaveBeenCalledWith('id', 'organisationId')
      expect(res.statusCode).toBe(201)
      expect(res.data).toEqual({ ...user.toJson(), Status: organisation.Status })
    })
  })

  describe('updateUser', () => {
    it('returns updated user', async () => {
      user = new User()
      user.UserId = 'userId'
      user.OrganisationId = 'organisationId'
      getUserResult = Promise.resolve(user)
      updateUserResult = Promise.resolve(user)
      getOrganisationResult = Promise.resolve(null)
      createOrganisationResult = Promise.resolve(organisation)
      updateOrganisationResult = Promise.resolve(organisation)
      userRepository = jasmine.createSpyObj('UserRepository', {
        createUser: Promise.resolve(user),
        GetUser: getUserResult,
        updateUser: updateUserResult
      })

      organisationRepository = jasmine.createSpyObj('OrganisationRepository', {
        getOrganisation: getOrganisationResult,
        createOrganisation: createOrganisationResult,
        updateOrganisation: updateOrganisationResult
      })
      userRepository.updateUser.bind(userRepository)
      userRepository.createUser.bind(userRepository)
      organisationRepository.getOrganisation.bind(organisationRepository)
      organisationRepository.createOrganisation.bind(organisationRepository)
      organisationRepository.updateOrganisation.bind(organisationRepository)
      controller = new UserController(userRepository, organisationRepository)
      req = {
        params: { id: 'userId' },
        body: { emailAddress: 'emailAddress' }
      } as any
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
      await controller.update(req, res)
      expect(userRepository.updateUser).toHaveBeenCalledWith('userId', 'emailAddress')
      expect(res.statusCode).toBe(200)
      expect(res.data).toEqual({ userId: 'userId' })
    })
  })

  describe('updateOrganisation', () => {
    it('returns updated organisation', async () => {
      user = new User()
      user.OrganisationId = 'organisationId'
      organisation = new Organisation()
      organisation.OrganisationId = 'organisationId'
      getOrganisationResult = Promise.resolve(null)
      createOrganisationResult = Promise.resolve(organisation)
      updateOrganisationResult = Promise.resolve(organisation)
      userRepository = jasmine.createSpyObj('UserRepository', {
        createUser: Promise.resolve(user)
      })
      organisationRepository = jasmine.createSpyObj('OrganisationRepository', {
        getOrganisation: getOrganisationResult,
        createOrganisation: createOrganisationResult,
        updateOrganisation: updateOrganisationResult
      })
      userRepository.createUser.bind(userRepository)
      organisationRepository.getOrganisation.bind(organisationRepository)
      organisationRepository.createOrganisation.bind(organisationRepository)
      organisationRepository.updateOrganisation.bind(organisationRepository)
      controller = new UserController(userRepository, organisationRepository)
      req = {
        params: { organisationId: 'organisationId' },
        body: { applicationReference: 'reference', status: 'status', organisationName: 'organisationName', eoriNumber: 'eoriNumber', ukAcsReference: 'ukAcsReference' }
      } as any
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
      await controller.updateOrganisation(req, res)
      expect(organisationRepository.updateOrganisation).toHaveBeenCalledWith('organisationId', 'reference', 'status', 'organisationName', 'eoriNumber', 'ukAcsReference')
      expect(res.statusCode).toBe(200)
      expect(res.data).toEqual({ organisationId: 'organisationId' })
    })
  })
})
