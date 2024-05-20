import 'jasmine'
import { DeleteItemCommand, type DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DeleteApiKeyCommand, type APIGatewayClient } from '@aws-sdk/client-api-gateway'
import { DeleteCustomerApiKey } from '../../src/operations/deleteCustomerApiKey'
import { CustomerApiKey } from '../../src/models/customerApiKey'

describe('DeleteCustomerApiKey', () => {
  let dynamodbClient: jasmine.SpyObj<DynamoDBClient>
  let apigatewayClient: jasmine.SpyObj<APIGatewayClient>
  let deleteCustomerApiKey: DeleteCustomerApiKey
  let apiKey: CustomerApiKey

  beforeEach(() => {
    dynamodbClient = jasmine.createSpyObj('DynamoDBClient', { send: Promise.resolve() })
    apigatewayClient = jasmine.createSpyObj('APIGatewayClient', { send: Promise.resolve() })
    deleteCustomerApiKey = new DeleteCustomerApiKey(dynamodbClient, apigatewayClient)

    apiKey = new CustomerApiKey()
    apiKey.CustomerApiKeyId = 'customerApiKeyId'
    apiKey.OrganisationId = 'organisationId'
    apiKey.ApiGatewayId = 'apiGatewayId'
  })

  it('deletes the api key in api gateway', async () => {
    await deleteCustomerApiKey.call(apiKey)

    const actualCommand = apigatewayClient.send.calls.first().args[0]
    expect(actualCommand.input).toEqual(jasmine.objectContaining({
      apiKey: 'apiGatewayId'
    }))
    expect(actualCommand).toBeInstanceOf(DeleteApiKeyCommand)
  })

  it('deletes the api key in dynamodb', async () => {
    await deleteCustomerApiKey.call(apiKey)

    const actualCommand = dynamodbClient.send.calls.first().args[0]
    expect(actualCommand.input).toEqual(jasmine.objectContaining({
      TableName: 'CustomerApiKeys',
      Key: {
        OrganisationId: { S: 'organisationId' },
        CustomerApiKeyId: { S: 'customerApiKeyId' }
      }
    }))
    expect(actualCommand).toBeInstanceOf(DeleteItemCommand)
  })
})
