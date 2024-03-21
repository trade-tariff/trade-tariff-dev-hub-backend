import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { CustomerApiKeyRepository } from '../../src/repositories/customerApiKeyRepository'
import { type ListCustomerApiKeysService } from '../../src/services/listCustomerApiKeysService'
import { CustomerApiKey } from '../../src/models/customerApiKey'

describe('CustomerApiKeyRepository', () => {
  let client: DynamoDBClient
  let repository: CustomerApiKeyRepository
  let mockService: jasmine.SpyObj<ListCustomerApiKeysService>
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
    client = new DynamoDBClient({ region: 'us-west-2' })
    mockService = jasmine.createSpyObj('ListCustomerApiKeysService', { call: Promise.resolve(result) })
    repository = new CustomerApiKeyRepository(client, mockService)
  })

  it('should return CustomerApiKeys', async () => {
    const actual = await repository.listCustomerApiKeys('customer-id')
    const apiKey = actual[0]

    expect(apiKey).toEqual(jasmine.any(CustomerApiKey))
    expect(apiKey.CustomerApiKeyId).toEqual('customer-api-key-id')
  })
})
