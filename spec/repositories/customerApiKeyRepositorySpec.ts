// import { type DynamoDBClient } from '@aws-sdk/client-dynamodb'
// import { type APIGatewayClient } from '@aws-sdk/client-api-gateway'
// import { type CustomerApiKey } from '../models/customerApiKey'
// import { ListCustomerApiKeys } from '../operations/listCustomerApiKeys'
// import { CreateCustomerApiKey } from '../operations/createCustomerApiKey'
// import { GetCustomerApiKey } from '../operations/getCustomerApiKey'
// import { UpdateCustomerApiKey } from '../operations/updateCustomerApiKey'
// import { DeleteCustomerApiKey } from '../operations/deleteCustomerApiKey'

// export class CustomerApiKeyRepository {
//   constructor (
//     private readonly dynamodbClient: DynamoDBClient,
//     private readonly apiGatewayClient: APIGatewayClient,
//     private readonly listOperation: ListCustomerApiKeys = new ListCustomerApiKeys(dynamodbClient),
//     private readonly createOperation: CreateCustomerApiKey = new CreateCustomerApiKey(dynamodbClient, apiGatewayClient),
//     private readonly getOperation: GetCustomerApiKey = new GetCustomerApiKey(dynamodbClient),
//     private readonly updateOperation: UpdateCustomerApiKey = new UpdateCustomerApiKey(dynamodbClient, apiGatewayClient),
//     private readonly deleteOperation: DeleteCustomerApiKey = new DeleteCustomerApiKey(dynamodbClient, apiGatewayClient)
//   ) {}

//   async updateKey (customerApiKey: CustomerApiKey): Promise<CustomerApiKey> {
//     return await this.updateOperation.call(customerApiKey)
//   }

//   async listKeys (fpoId: string): Promise<CustomerApiKey[]> {
//     return await this.listOperation.call(fpoId)
//   }

//   async createKey (fpoId: string): Promise<CustomerApiKey> {
//     return await this.createOperation.call(fpoId)
//   }

//   async getKey (fpoId: string, id: string): Promise<CustomerApiKey | null> {
//     return await this.getOperation.call(fpoId, id)
//   }

//   async deleteKey (customerApiKey: CustomerApiKey): Promise<void> {
//     await this.deleteOperation.call(customerApiKey)
//   }
// }
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
      const actual = await repository.createKey('customer-id')

      expect(actual).toEqual(jasmine.any(CustomerApiKey))
      expect(actual.CustomerApiKeyId).toEqual('customer-api-key-id')
      expect(mockCreateOperation.call).toHaveBeenCalledWith('customer-id')
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
