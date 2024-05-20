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
    key.OrganisationId = 'organisationId'
    key.Enabled = false
    key.ApiGatewayId = 'apiGatewayId'
    key.CustomerApiKeyId = 'customerId'

    const updated = await createCustomerApiKey.call(key)

    expect(updated.OrganisationId).toEqual('organisationId')
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
        OrganisationId: { S: 'organisationId' },
        CustomerApiKeyId: { S: 'customerId' }
      },
      UpdateExpression: 'SET Enabled = :enabled, UpdatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':enabled': { BOOL: false },
        ':updatedAt': { S: jasmine.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/) }
      }
    }))
  })

  it('enables the api key', async () => {
    const key = new CustomerApiKey()
    key.OrganisationId = 'organisationId'
    key.Enabled = true
    key.ApiGatewayId = 'apiGatewayId'
    key.CustomerApiKeyId = 'customerId'

    const updated = await createCustomerApiKey.call(key)

    expect(updated.OrganisationId).toEqual('organisationId')
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
        OrganisationId: { S: 'organisationId' },
        CustomerApiKeyId: { S: 'customerId' }
      },
      UpdateExpression: 'SET Enabled = :enabled, UpdatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':enabled': { BOOL: true },
        ':updatedAt': { S: jasmine.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/) }
      }
    }))
  })
})
