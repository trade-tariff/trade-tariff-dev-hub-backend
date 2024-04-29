import 'jasmine'
import { type DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { type APIGatewayClient } from '@aws-sdk/client-api-gateway'
import { UpdateCustomerApiKey } from '../../src/operations/updateCustomerApiKey'
import { CustomerApiKey } from '../../src/models/customerApiKey'

describe('UpdateCustomerApiKey', () => {
  let dynamodbClient: jasmine.SpyObj<DynamoDBClient>
  let apigatewayClient: jasmine.SpyObj<APIGatewayClient>
  let createCustomerApiKey: UpdateCustomerApiKey

  beforeEach(() => {
    dynamodbClient = jasmine.createSpyObj('DynamoDBClient', { send: Promise.resolve() })
    apigatewayClient = jasmine.createSpyObj('APIGatewayClient', { send: Promise.resolve() })

    createCustomerApiKey = new UpdateCustomerApiKey(dynamodbClient, apigatewayClient)
  })

  it('disables the api key', async () => {
    const key = new CustomerApiKey()
    key.FpoId = 'fpoId'
    key.Enabled = false
    key.ApiGatewayId = 'apiGatewayId'
    key.CustomerApiKeyId = 'customerId'

    const updated = await createCustomerApiKey.call(key)

    expect(updated.FpoId).toEqual('fpoId')
    expect(updated.Enabled).toEqual(false)
    expect(dynamodbClient.send).toHaveBeenCalledTimes(1)
    expect(apigatewayClient.send).toHaveBeenCalledTimes(1)

    expect(apigatewayClient.send.calls.first().args[0].input).toEqual(jasmine.objectContaining({
      apiKey: 'apiGatewayId',
      patchOperations: [
        {
          op: 'replace',
          path: '/enabled',
          value: String(false)
        }
      ]
    }))

    expect(dynamodbClient.send.calls.first().args[0].input).toEqual(jasmine.objectContaining({
      TableName: 'CustomerApiKeys',
      Key: {
        FpoId: { S: 'fpoId' },
        CustomerApiKeyId: { S: 'customerId' }
      },
      UpdateExpression: 'SET Enabled = :enabled',
      ExpressionAttributeValues: {
        ':enabled': { BOOL: false }
      }
    }))
  })

  it('enables the api key', async () => {
    const key = new CustomerApiKey()
    key.FpoId = 'fpoId'
    key.Enabled = true
    key.ApiGatewayId = 'apiGatewayId'
    key.CustomerApiKeyId = 'customerId'

    const updated = await createCustomerApiKey.call(key)

    expect(updated.FpoId).toEqual('fpoId')
    expect(updated.Enabled).toEqual(true)
    expect(dynamodbClient.send).toHaveBeenCalledTimes(1)
    expect(apigatewayClient.send).toHaveBeenCalledTimes(1)

    expect(apigatewayClient.send.calls.first().args[0].input).toEqual(jasmine.objectContaining({
      apiKey: 'apiGatewayId',
      patchOperations: [
        {
          op: 'replace',
          path: '/enabled',
          value: String(true)
        }
      ]
    }))

    expect(dynamodbClient.send.calls.first().args[0].input).toEqual(jasmine.objectContaining({
      TableName: 'CustomerApiKeys',
      Key: {
        FpoId: { S: 'fpoId' },
        CustomerApiKeyId: { S: 'customerId' }
      },
      UpdateExpression: 'SET Enabled = :enabled',
      ExpressionAttributeValues: {
        ':enabled': { BOOL: true }
      }
    }))
  })
})
