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
          CustomerApiKeyId: 'customer-api-key-id-1',
          Secret: 'secret',
          Enabled: true,
          Description: 'description',
          OrganisationId: 'fpo-id',
          CreatedAt: '2024-05-24T14:05:45Z',
          UpdatedAt: '2024-05-24T14:11:00Z'
        },
        {
          CustomerApiKeyId: 'customer-api-key-id-2',
          Secret: 'secret',
          Enabled: true,
          Description: 'description',
          OrganisationId: 'fpo-id',
          CreatedAt: '2024-05-24T14:05:45Z',
          UpdatedAt: '2024-05-24T14:10:00Z'
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
    expect(apiKey.CustomerApiKeyId).toEqual('customer-api-key-id-1')
  })

  it('should sort the keys by UpdatedAt', async () => {
    const apiKeys = await operation.call('customer-id')
    const firstKey = apiKeys[0]
    const secondKey = apiKeys[1]

    const firstKeyUpdatedAt = Date.parse(firstKey.UpdatedAt)
    const secondKeyUpdatedAt = Date.parse(secondKey.UpdatedAt)

    expect(firstKeyUpdatedAt).toBeGreaterThan(secondKeyUpdatedAt)
  })
})
