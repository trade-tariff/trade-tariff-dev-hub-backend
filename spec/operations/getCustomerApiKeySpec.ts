import 'jasmine'
import { type DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { GetCustomerApiKey } from '../../src/operations/getCustomerApiKey'

describe('GetCustomerApiKey', () => {
  let dynamodbClient: jasmine.SpyObj<DynamoDBClient>

  it('returns an api key', async () => {
    const dynamodbResult = {
      Item: {
        CustomerApiKeyId: { S: 'customerApiKeyId' },
        Secret: { S: 'secret' },
        Enabled: { BOOL: true },
        Description: { S: 'description' },
        OrganisationId: { S: 'organisationId' },
        CreatedAt: { S: new Date().toISOString() },
        UpdatedAt: { S: new Date().toISOString() }
      },
      $metadata: {
        httpStatusCode: 200
      }
    }

    dynamodbClient = jasmine.createSpyObj('DynamoDBClient', { send: Promise.resolve(dynamodbResult) })

    const key = await new GetCustomerApiKey(dynamodbClient).call('organisationId', 'customerApiKeyId')

    expect(key?.OrganisationId).toEqual('organisationId')
    expect(key?.CustomerApiKeyId).toEqual('customerApiKeyId')
    expect(dynamodbClient.send).toHaveBeenCalledTimes(1)
  })

  it('returns null if the key is not found', async () => {
    const dynamodbResult = {
      $metadata: {
        httpStatusCode: 404
      }
    }

    dynamodbClient = jasmine.createSpyObj('DynamoDBClient', { send: Promise.resolve(dynamodbResult) })

    const key = await new GetCustomerApiKey(dynamodbClient).call('organisationId', 'customerApiKeyId')

    expect(key).toBeNull()
    expect(dynamodbClient.send).toHaveBeenCalledTimes(1)
  })
})
