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
        FpoId: { S: 'fpoId' },
        CreatedAt: { S: new Date().toISOString() },
        UpdatedAt: { S: new Date().toISOString() }
      },
      $metadata: {
        httpStatusCode: 200
      }
    }

    dynamodbClient = jasmine.createSpyObj('DynamoDBClient', { send: Promise.resolve(dynamodbResult) })

    const key = await new GetCustomerApiKey(dynamodbClient).call('fpoId', 'customerApiKeyId')

    expect(key?.FpoId).toEqual('fpoId')
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

    const key = await new GetCustomerApiKey(dynamodbClient).call('fpoId', 'customerApiKeyId')

    expect(key).toBeNull()
    expect(dynamodbClient.send).toHaveBeenCalledTimes(1)
  })
})
