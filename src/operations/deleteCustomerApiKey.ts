import { type CustomerApiKey } from '../models/customerApiKey'
import { DeleteItemCommand, type DeleteItemCommandInput, type DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DeleteApiKeyCommand, type DeleteApiKeyCommandInput, type APIGatewayClient } from '@aws-sdk/client-api-gateway'

const TableName = process.env.CUSTOMER_API_KEYS_TABLE_NAME ?? ''

class DeleteCustomerApiKey {
  constructor (
    private readonly dynamodbClient: DynamoDBClient,
    private readonly apigatewayClient: APIGatewayClient
  ) {}

  async call (customerApiKey: CustomerApiKey): Promise<void> {
    await this.deleteInApiGateway(customerApiKey)
    await this.deleteInDynamoDb(customerApiKey)
  }

  private async deleteInApiGateway (apiKey: CustomerApiKey): Promise<void> {
    const input: DeleteApiKeyCommandInput = {
      apiKey: apiKey.ApiGatewayId
    }

    const command = new DeleteApiKeyCommand(input)

    await this.apigatewayClient.send(command)
  }

  private async deleteInDynamoDb (apiKey: CustomerApiKey): Promise<void> {
    const input: DeleteItemCommandInput = {
      TableName,
      Key: {
        OrganisationId: { S: apiKey.OrganisationId },
        CustomerApiKeyId: { S: apiKey.CustomerApiKeyId }
      }
    }

    const command = new DeleteItemCommand(input)

    await this.dynamodbClient.send(command)
  }
}

export { DeleteCustomerApiKey }
