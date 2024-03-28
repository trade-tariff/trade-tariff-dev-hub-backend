import 'jasmine'

import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { APIGatewayClient } from '@aws-sdk/client-api-gateway'
import { CustomerApiKeyRepository } from '../../src/repositories/customerApiKeyRepository'
import { type ListCustomerApiKeysOperation } from '../../src/operations/listCustomerApiKeysOperation'
import { type CreateCustomerApiKeyOperation } from '../../src/operations/createCustomerApiKeyOperation'
import { CustomerApiKey } from '../../src/models/customerApiKey'

describe('CustomerApiKeyRepository', () => {
  let apiGatewayClient: APIGatewayClient
  let dynamodbClient: DynamoDBClient
  let mockListOperation: jasmine.SpyObj<ListCustomerApiKeysOperation>
  let mockCreateOperation: jasmine.SpyObj<CreateCustomerApiKeyOperation>
  let repository: CustomerApiKeyRepository
  let result: CustomerApiKey[]

  beforeEach(() => {
    result = [
      CustomerApiKey.fromItem(
        {
          CustomerApiKeyId: 'customer-api-key-id',
          Secret: 'secret',
          Enabled: true,
          Description: 'description',
          FpoId: 'fpo-id',
          CreatedAt: new Date().toISOString(),
          UpdatedAt: new Date().toISOString()
        }
      )
    ]
    dynamodbClient = new DynamoDBClient({ region: 'us-west-2' })
    mockListOperation = jasmine.createSpyObj('ListCustomerApiKeysOperation', { call: Promise.resolve(result) })
    repository = new CustomerApiKeyRepository(
      dynamodbClient,
      apiGatewayClient,
      mockListOperation,
      mockCreateOperation
    )
  })

  it('should return CustomerApiKeys', async () => {
    const actual = await repository.listKeys('customer-id')
    const apiKey = actual[0]

    expect(apiKey).toEqual(jasmine.any(CustomerApiKey))
    expect(apiKey.CustomerApiKeyId).toEqual('customer-api-key-id')
  })
})
