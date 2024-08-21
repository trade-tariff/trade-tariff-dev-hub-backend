import 'jasmine'
import { type Response } from 'express'

import { OrganisationsController } from '../../src/controllers/organisationsController'
import { type OrganisationRepository } from '../../src/repositories/organisationRepository'
import { Organisation } from '../../src/models/organisation'
import { type FrontendRequest } from '../../src/utils/audit'
import * as audit from '../../src/utils/audit'

beforeAll(() => {
  spyOn(audit, 'createAuditLogEntry').and.returnValue(Promise.resolve())
})

describe('OrganisationsController', () => {
  let organisationRepository: jasmine.SpyObj<OrganisationRepository>
  let controller: OrganisationsController
  let getOrganisationResult: Promise<Organisation | null>
  let createOrganisationResult: Promise<Organisation | null>
  let updateOrganisationResult: Promise<Organisation | null>
  let req: FrontendRequest
  let res: Response
  let organisation: Organisation

  describe('get', () => {
    it('returns the organisation', async () => {
      organisation = new Organisation()
      organisation.OrganisationId = 'organisationId'
      getOrganisationResult = Promise.resolve(organisation)
      organisationRepository = jasmine.createSpyObj('OrganisationRepository', {
        getOrganisation: getOrganisationResult
      })
      organisationRepository.getOrganisation.bind(organisationRepository)
      controller = new OrganisationsController(organisationRepository)
      req = { params: { organisationId: 'organisationId' } } as any
      res = { json: jasmine.createSpy() } as unknown as any

      await controller.getOrganisation(req, res, (e): void => { fail(e) })

      expect(organisationRepository.getOrganisation).toHaveBeenCalledWith('organisationId')
      expect(res.json).toHaveBeenCalledWith({ ...organisation.toJson() })
    })

    it('returns 404 if the organisation is not found', async () => {
      organisationRepository = jasmine.createSpyObj('OrganisationRepository', {
        getOrganisation: Promise.resolve(null)
      })
      organisationRepository.getOrganisation.bind(organisationRepository)
      controller = new OrganisationsController(organisationRepository)
      req = { params: { id: 'id' } } as any
      res = {
        status: jasmine
          .createSpy()
          .and.returnValue({ json: jasmine.createSpy() })
      } as unknown as any

      await controller.getOrganisation(req, res, (e): void => { fail(e) })

      expect(res.status).toHaveBeenCalledWith(404)
    })
  })

  describe('create', () => {
    it('returns a created organisation', async () => {
      organisation = new Organisation()
      organisation.OrganisationId = 'organisationId'
      getOrganisationResult = Promise.resolve(organisation)
      createOrganisationResult = Promise.resolve(organisation)
      organisationRepository = jasmine.createSpyObj('OrganisationRepository', {
        getOrganisation: getOrganisationResult,
        createOrganisation: createOrganisationResult
      })
      organisationRepository.getOrganisation.bind(organisationRepository)
      organisationRepository.createOrganisation.bind(organisationRepository)
      controller = new OrganisationsController(organisationRepository)
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
      await controller.create(req, res, (e): void => { fail(e) })

      expect(res.statusCode).toBe(201)
      expect(res.data).toEqual({ ...organisation.toJson(), Status: organisation.Status })
    })
  })

  describe('updateOrganisation', () => {
    it('returns updated organisation', async () => {
      organisationRepository = jasmine.createSpyObj('OrganisationRepository', {
        updateOrganisation: updateOrganisationResult
      })
      organisationRepository.updateOrganisation.bind(organisationRepository)
      controller = new OrganisationsController(organisationRepository)
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
      await controller.updateOrganisation(req, res, (e): void => { fail(e) })
      expect(organisationRepository.updateOrganisation).toHaveBeenCalledWith('organisationId', 'reference', 'status', 'organisationName', 'eoriNumber', 'ukAcsReference')
      expect(res.statusCode).toBe(200)
      expect(res.data).toEqual({ organisationId: 'organisationId' })
    })
  })
})
