import { CustomerApiKey } from '../models/customerApiKey'
import { type DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { GetItemCommand } from '@aws-sdk/client-dynamodb'

class GetCustomerApiKeyOperation {
  private readonly client: DynamoDBClient

  constructor (client: DynamoDBClient) {
    this.client = client
  }

  async call (fpoId: string, id: string): Promise<CustomerApiKey | null> {
    const command = new GetItemCommand(
      {
        TableName: 'CustomerApiKeys',
        Key: {
          FpoId: { S: fpoId },
          CustomerApiKeyId: { S: id }
        }
      }
    )

    const response = await this.client.send(command)

    if (response.Item === null || response.Item === undefined) {
      return null
    }

    return CustomerApiKey.fromNestedItem(response.Item)
  }
}

export { GetCustomerApiKeyOperation }
