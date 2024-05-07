import 'jasmine'

import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { UserRepository } from '../../src/repositories/userRepository'

import { type CreateUser } from '../../src/operations/createUser'
import { type GetUser } from '../../src/operations/getUser'
import { type UpdateUser } from '../../src/operations/updateUser'

import { User } from '../../src/models/user'

describe('UserRepository', () => {
  const dynamodbClient: DynamoDBClient = new DynamoDBClient({ region: 'us-west-2' })
  const mockUpdateOperation: jasmine.SpyObj<UpdateUser> = jasmine.createSpyObj('UpdateUser', ['call'])
  const mockCreateOperation: jasmine.SpyObj<CreateUser> = jasmine.createSpyObj('CreateUser', ['call'])
  const mockGetOperation: jasmine.SpyObj<GetUser> = jasmine.createSpyObj('GetUser', ['call'])
  const repository: UserRepository = new UserRepository(
    dynamodbClient,
    mockCreateOperation,
    mockGetOperation,
    mockUpdateOperation
  )

  describe('createKey', () => {
    beforeEach(() => {
      const result: User = new User()

      result.UserId = 'id'

      mockCreateOperation.call.and.returnValue(Promise.resolve(result))
    })

    it('returns a User', async () => {
      const actual = await repository.createUser('id')

      expect(actual).toEqual(jasmine.any(User))
      expect(actual.UserId).toEqual('id')
      expect(mockCreateOperation.call).toHaveBeenCalledWith('id')
    })
  })

  describe('getKey', () => {
    beforeEach(() => {
      const result: User = new User()

      result.UserId = 'id'

      mockGetOperation.call.and.returnValue(Promise.resolve(result))
    })

    it('returns a User', async () => {
      const actual = await repository.getUser('id')

      expect(actual).toEqual(jasmine.any(User))
      expect(actual?.UserId).toEqual('id')
      expect(mockGetOperation.call).toHaveBeenCalledWith('id')
    })
  })

  describe('updateUser', () => {
    it('returns a user', async () => {
      const key: User = new User()
      key.UserId = 'id'

      mockUpdateOperation.call.and.returnValue(Promise.resolve(key))

      const actual = await repository.updateUser(key)

      expect(actual).toEqual(jasmine.any(User))
      expect(actual?.UserId).toEqual('id')
      expect(mockUpdateOperation.call).toHaveBeenCalledWith(key)
    })
  })
})
