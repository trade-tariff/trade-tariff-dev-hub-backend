import { type CustomerApiKey } from '../models/customerApiKey'
import { DeleteItemCommand, type DeleteItemCommandInput, type DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DeleteApiKeyCommand, type DeleteApiKeyCommandInput, type APIGatewayClient } from '@aws-sdk/client-api-gateway'

class DeleteCustomerApiKey {
  constructor (
    private readonly dynamodbClient: DynamoDBClient,
    private readonly apigatewayClient: APIGatewayClient
  ) {}

  async call (customerApiKey: CustomerApiKey): Promise<CustomerApiKey> {
    await this.updateApiGateway(customerApiKey)
    await this.updateDynamoDb(customerApiKey)

    return customerApiKey
  }

  private async updateApiGateway (apiKey: CustomerApiKey): Promise<void> {
    const input: DeleteApiKeyCommandInput = {
      apiKey: apiKey.ApiGatewayId
    }

    const command = new DeleteApiKeyCommand(input)

    await this.apigatewayClient.send(command)
  }

  private async updateDynamoDb (apiKey: CustomerApiKey): Promise<void> {
    const input: DeleteItemCommandInput = {
      Key: {
        FpoId: { S: apiKey.FpoId },
        CustomerApiKeyId: { S: apiKey.CustomerApiKeyId }
      },
      TableName: process.env.API_KEY_TABLE_NAME
    }

    const command = new DeleteItemCommand(input)

    await this.dynamodbClient.send(command)
  }
}

export { DeleteCustomerApiKey }
