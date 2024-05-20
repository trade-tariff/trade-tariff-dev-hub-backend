import 'jasmine'

import { type DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { type ScanCommandOutput } from '@aws-sdk/lib-dynamodb'
import { ListCustomerApiKeys } from '../../src/operations/listCustomerApiKeys'
import { CustomerApiKey } from '../../src/models/customerApiKey'

describe('ListCustomerApiKeys', () => {
  let operation: ListCustomerApiKeys
  let mockClient: jasmine.SpyObj<DynamoDBClient>
  let mockResponse: ScanCommandOutput

  beforeEach(() => {
    mockResponse = {
      Items: [
        {
          CustomerApiKeyId: 'customer-api-key-id',
          Secret: 'secret',
          Enabled: true,
          Description: 'description',
          OrganisationId: 'fpo-id',
          CreatedAt: new Date().toISOString(),
          UpdatedAt: new Date().toISOString()
        }
      ],
      $metadata: {}
    }
    mockClient = jasmine.createSpyObj('DynamoDBClient', { send: mockResponse })
    operation = new ListCustomerApiKeys(mockClient)
  })

  it('should return CustomerApiKeys', async () => {
    const apiKeys = await operation.call('customer-id')
    const apiKey = apiKeys[0]

    expect(apiKey).toEqual(jasmine.any(CustomerApiKey))
    expect(apiKey.CustomerApiKeyId).toEqual('customer-api-key-id')
  })
})
