import { type CustomerApiKey } from '../models/customerApiKey'
import { UpdateItemCommand, type UpdateItemCommandInput, type DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { UpdateApiKeyCommand, type UpdateApiKeyCommandInput, type APIGatewayClient } from '@aws-sdk/client-api-gateway'

class UpdateCustomerApiKey {
  constructor (
    private readonly dynamodbClient: DynamoDBClient,
    private readonly apigatewayClient: APIGatewayClient
  ) {}

  async call (customerApiKey: CustomerApiKey): Promise<CustomerApiKey> {
    await this.updateDynamoDb(customerApiKey)
    await this.updateApiGateway(customerApiKey)

    return customerApiKey
  }

  private async updateDynamoDb (apiKey: CustomerApiKey): Promise<void> {
    const input: UpdateItemCommandInput = {
      TableName: 'CustomerApiKeys',
      Key: {
        FpoId: { S: apiKey.FpoId },
        CustomerApiKeyId: { S: apiKey.CustomerApiKeyId }
      },
      UpdateExpression: 'SET Description = :description',
      // Only description is allowed to be updated
      ExpressionAttributeValues: {
        ':description': { S: apiKey.Description }
      }
    }

    const command = new UpdateItemCommand(input)

    await this.dynamodbClient.send(command)
  }

  private async updateApiGateway (apiKey: CustomerApiKey): Promise<void> {
    const input: UpdateApiKeyCommandInput = {
      apiKey: apiKey.ApiGatewayId,
      patchOperations: [
        {
          op: 'replace',
          path: '/description',
          value: apiKey.Description
        }
      ]
    }

    const command = new UpdateApiKeyCommand(input)

    await this.apigatewayClient.send(command)
  }
}

export { UpdateCustomerApiKey }
