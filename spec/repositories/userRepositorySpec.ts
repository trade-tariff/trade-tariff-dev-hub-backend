import 'jasmine'

import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { UserRepository } from '../../src/repositories/userRepository'

import { type CreateUser } from '../../src/operations/createUser'
import { type GetUser } from '../../src/operations/getUser'
import { type UpdateUser } from '../../src/operations/updateUser'

import { User } from '../../src/models/user'

describe('UserRepository', () => {
  const dynamodbClient: DynamoDBClient = new DynamoDBClient({ region: 'us-west-2' })
  const mockCreateOperation: jasmine.SpyObj<CreateUser> = jasmine.createSpyObj('CreateUser', ['call'])
  const mockGetOperation: jasmine.SpyObj<GetUser> = jasmine.createSpyObj('GetUser', ['call'])
  const mockUpdateOperation: jasmine.SpyObj<UpdateUser> = jasmine.createSpyObj('UpdateUser', ['call'])
  const repository: UserRepository = new UserRepository(
    dynamodbClient,
    mockCreateOperation,
    mockGetOperation,
    mockUpdateOperation
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
      result.EmailAddress = 'abc@hmrc.gov.uk'

      mockGetOperation.call.and.returnValue(Promise.resolve(result))
    })

    it('returns a User', async () => {
      const actual = await repository.getUser('id')

      expect(actual).toEqual(jasmine.any(User))
      expect(actual?.UserId).toEqual('id')
      expect(actual?.OrganisationId).toEqual('groupId')
      expect(actual?.EmailAddress).toEqual('abc@hmrc.gov.uk')
      expect(mockGetOperation.call).toHaveBeenCalledWith('id')
    })
  })

  describe('updateUser', () => {
    beforeEach(() => {
      const result: User = new User()

      result.UserId = 'id'
      result.EmailAddress = 'abc@hmrc.gov.uk'

      mockUpdateOperation.call.and.returnValue(Promise.resolve())
    })

    it('calls updateUser', async () => {
      const user: User = new User()
      user.EmailAddress = 'abc@hmrc.gov.uk'
      await mockUpdateOperation.call(user.UserId, user.EmailAddress)
      await repository.updateUser(user.UserId, user.EmailAddress)
      expect(mockUpdateOperation.call).toHaveBeenCalledWith(user.UserId, user.EmailAddress)
    })
  })
})
