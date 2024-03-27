import 'jasmine'

import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { APIGatewayClient } from '@aws-sdk/client-api-gateway'
import { CustomerApiKeyRepository } from '../../src/repositories/customerApiKeyRepository'
import { type ListCustomerApiKeysService } from '../../src/services/listCustomerApiKeysService'
import { type CreateCustomerApiKeyService } from '../../src/services/createCustomerApiKeyService'
import { CustomerApiKey } from '../../src/models/customerApiKey'

describe('CustomerApiKeyRepository', () => {
  let apiGatewayClient: APIGatewayClient
  let dynamodbClient: DynamoDBClient
  let mockListService: jasmine.SpyObj<ListCustomerApiKeysService>
  let mockCreateService: jasmine.SpyObj<CreateCustomerApiKeyService>
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
    mockListService = jasmine.createSpyObj('ListCustomerApiKeysService', { call: Promise.resolve(result) })
    repository = new CustomerApiKeyRepository(
      dynamodbClient,
      apiGatewayClient,
      mockListService,
      mockCreateService
    )
  })

  it('should return CustomerApiKeys', async () => {
    const actual = await repository.listKeys('customer-id')
    const apiKey = actual[0]

    expect(apiKey).toEqual(jasmine.any(CustomerApiKey))
    expect(apiKey.CustomerApiKeyId).toEqual('customer-api-key-id')
  })
})
