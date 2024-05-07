import 'jasmine'

import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { APIGatewayClient } from '@aws-sdk/client-api-gateway'
import { CustomerApiKeyRepository } from '../../src/repositories/customerApiKeyRepository'

import { type ListCustomerApiKeys } from '../../src/operations/listCustomerApiKeys'
import { type CreateCustomerApiKey } from '../../src/operations/createCustomerApiKey'
import { type GetCustomerApiKey } from '../../src/operations/getCustomerApiKey'
import { type UpdateCustomerApiKey } from '../../src/operations/updateCustomerApiKey'
import { type DeleteCustomerApiKey } from '../../src/operations/deleteCustomerApiKey'

import { CustomerApiKey } from '../../src/models/customerApiKey'

describe('CustomerApiKeyRepository', () => {
  const apiGatewayClient: APIGatewayClient = new APIGatewayClient({ region: 'us-west-2' })
  const dynamodbClient: DynamoDBClient = new DynamoDBClient({ region: 'us-west-2' })
  const mockUpdateOperation: jasmine.SpyObj<UpdateCustomerApiKey> = jasmine.createSpyObj('UpdateCustomerApiKey', ['call'])
  const mockListOperation: jasmine.SpyObj<ListCustomerApiKeys> = jasmine.createSpyObj('ListCustomerApiKeys', ['call'])
  const mockCreateOperation: jasmine.SpyObj<CreateCustomerApiKey> = jasmine.createSpyObj('CreateCustomerApiKey', ['call'])
  const mockGetOperation: jasmine.SpyObj<GetCustomerApiKey> = jasmine.createSpyObj('GetCustomerApiKey', ['call'])
  const mockDeleteOperation: jasmine.SpyObj<DeleteCustomerApiKey> = jasmine.createSpyObj('DeleteCustomerApiKey', ['call'])
  const repository: CustomerApiKeyRepository = new CustomerApiKeyRepository(
    dynamodbClient,
    apiGatewayClient,
    mockListOperation,
    mockCreateOperation,
    mockGetOperation,
    mockUpdateOperation,
    mockDeleteOperation
  )

  describe('listKeys', () => {
    beforeEach(() => {
      const key = new CustomerApiKey()
      const result: CustomerApiKey[] = [key]
      key.CustomerApiKeyId = 'customer-api-key-id'

      mockListOperation.call.and.returnValue(Promise.resolve(result))
    })

    it('returns CustomerApiKeys', async () => {
      const actual = await repository.listKeys('customer-id')
      const apiKey = actual[0]

      expect(apiKey).toEqual(jasmine.any(CustomerApiKey))
      expect(apiKey.CustomerApiKeyId).toEqual('customer-api-key-id')
      expect(mockListOperation.call).toHaveBeenCalledWith('customer-id')
    })
  })

  describe('createKey', () => {
    beforeEach(() => {
      const result: CustomerApiKey = new CustomerApiKey()

      result.CustomerApiKeyId = 'customer-api-key-id'

      mockCreateOperation.call.and.returnValue(Promise.resolve(result))
    })

    it('returns a CustomerApiKey', async () => {
      const actual = await repository.createKey('customer-id', 'description')

      expect(actual).toEqual(jasmine.any(CustomerApiKey))
      expect(actual.CustomerApiKeyId).toEqual('customer-api-key-id')
      expect(mockCreateOperation.call).toHaveBeenCalledWith('customer-id', 'description')
    })
  })

  describe('getKey', () => {
    beforeEach(() => {
      const result: CustomerApiKey = new CustomerApiKey()

      result.CustomerApiKeyId = 'customer-api-key-id'

      mockGetOperation.call.and.returnValue(Promise.resolve(result))
    })

    it('returns a CustomerApiKey', async () => {
      const actual = await repository.getKey('customer-id-1', 'customer-id-2')

      expect(actual).toEqual(jasmine.any(CustomerApiKey))
      expect(actual?.CustomerApiKeyId).toEqual('customer-api-key-id')
      expect(mockGetOperation.call).toHaveBeenCalledWith('customer-id-1', 'customer-id-2')
    })
  })

  describe('updateKey', () => {
    it('returns a CustomerApiKey', async () => {
      const key: CustomerApiKey = new CustomerApiKey()

      key.CustomerApiKeyId = 'customer-api-key-id'

      mockUpdateOperation.call.and.returnValue(Promise.resolve(key))

      const actual = await repository.updateKey(key)

      expect(actual).toEqual(jasmine.any(CustomerApiKey))
      expect(actual?.CustomerApiKeyId).toEqual('customer-api-key-id')
      expect(mockUpdateOperation.call).toHaveBeenCalledWith(key)
    })
  })

  describe('deleteKey', () => {
    it('calls deleteOperation', async () => {
      const key: CustomerApiKey = new CustomerApiKey()

      key.CustomerApiKeyId = 'customer-api-key-id'

      await repository.deleteKey(key)

      expect(mockDeleteOperation.call).toHaveBeenCalledWith(key)
    })
  })
})
