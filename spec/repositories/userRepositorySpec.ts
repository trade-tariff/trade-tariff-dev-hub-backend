import 'jasmine'

import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { UserRepository } from '../../src/repositories/userRepository'

import { type CreateUser } from '../../src/operations/createUser'
import { type GetUser } from '../../src/operations/getUser'

import { User } from '../../src/models/user'

describe('UserRepository', () => {
  const dynamodbClient: DynamoDBClient = new DynamoDBClient({ region: 'us-west-2' })
  const mockCreateOperation: jasmine.SpyObj<CreateUser> = jasmine.createSpyObj('CreateUser', ['call'])
  const mockGetOperation: jasmine.SpyObj<GetUser> = jasmine.createSpyObj('GetUser', ['call'])
  const repository: UserRepository = new UserRepository(
    dynamodbClient,
    mockCreateOperation,
    mockGetOperation
  )

  describe('createUser', () => {
    beforeEach(() => {
      const result: User = new User()

      result.UserId = 'id'
      result.OrganisationId = 'groupId'

      mockCreateOperation.call.and.returnValue(Promise.resolve(result))
    })

    it('returns a User', async () => {
      const actual = await repository.createUser('id', 'groupId')

      expect(actual).toEqual(jasmine.any(User))
      expect(actual.UserId).toEqual('id')
      expect(actual.OrganisationId).toEqual('groupId')
      expect(mockCreateOperation.call).toHaveBeenCalledWith('id', 'groupId')
    })
  })

  describe('getUser', () => {
    beforeEach(() => {
      const result: User = new User()

      result.UserId = 'id'
      result.OrganisationId = 'groupId'

      mockGetOperation.call.and.returnValue(Promise.resolve(result))
    })

    it('returns a User', async () => {
      const actual = await repository.getUser('id')

      expect(actual).toEqual(jasmine.any(User))
      expect(actual?.UserId).toEqual('id')
      expect(actual?.OrganisationId).toEqual('groupId')
      expect(mockGetOperation.call).toHaveBeenCalledWith('id')
    })
  })
})
