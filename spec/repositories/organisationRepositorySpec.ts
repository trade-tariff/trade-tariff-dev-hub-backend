import 'jasmine'

import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { OrganisationRepository } from '../../src/repositories/organisationRepository'

import { type CreateOrganisation } from '../../src/operations/createOrganisation'
import { type GetOrganisation } from '../../src/operations/getOrganisation'
import { type UpdateOrganisation } from '../../src/operations/updateOrganisation'

import { Organisation } from '../../src/models/organisation'

describe('OrganisationRepository', () => {
  const dynamodbClient: DynamoDBClient = new DynamoDBClient({ region: 'us-west-2' })
  const mockCreateOperation: jasmine.SpyObj<CreateOrganisation> = jasmine.createSpyObj('CreateOrganisation', ['call'])
  const mockGetOperation: jasmine.SpyObj<GetOrganisation> = jasmine.createSpyObj('GetOrganisation', ['call'])
  const mockUpdateOperation: jasmine.SpyObj<UpdateOrganisation> = jasmine.createSpyObj('UpdateOrganisation', ['call'])
  const repository: OrganisationRepository = new OrganisationRepository(
    dynamodbClient,
    mockCreateOperation,
    mockGetOperation,
    mockUpdateOperation
  )

  describe('createOrganisation', () => {
    beforeEach(() => {
      const result: Organisation = new Organisation()

      result.OrganisationId = 'id'

      mockCreateOperation.call.and.returnValue(Promise.resolve(result))
    })

    it('returns a Organisation', async () => {
      const actual = await repository.createOrganisation('id')

      expect(actual).toEqual(jasmine.any(Organisation))
      expect(actual.OrganisationId).toEqual('id')
      expect(mockCreateOperation.call).toHaveBeenCalledWith('id')
    })
  })

  describe('getOrganisation', () => {
    beforeEach(() => {
      const result: Organisation = new Organisation()

      result.OrganisationId = 'id'

      mockGetOperation.call.and.returnValue(Promise.resolve(result))
    })

    it('returns a Organisation', async () => {
      const actual = await repository.getOrganisation('id')

      expect(actual).toEqual(jasmine.any(Organisation))
      expect(actual?.OrganisationId).toEqual('id')
      expect(mockGetOperation.call).toHaveBeenCalledWith('id')
    })
  })

  describe('updateOrganisation', () => {
    beforeEach(() => {
      const result: Organisation = new Organisation()

      result.OrganisationId = 'id'

      mockCreateOperation.call.and.returnValue(Promise.resolve(result))
    })

    it('calls updateOperation', async () => {
      const organisation: Organisation = new Organisation()

      await mockUpdateOperation.call(organisation.OrganisationId, organisation.ApplicationReference, organisation.Status)
      await repository.updateOrganisation(organisation.OrganisationId, organisation.ApplicationReference, organisation.Status)
      expect(mockUpdateOperation.call).toHaveBeenCalledWith(organisation.OrganisationId, organisation.ApplicationReference, organisation.Status)
    })
  })
})
