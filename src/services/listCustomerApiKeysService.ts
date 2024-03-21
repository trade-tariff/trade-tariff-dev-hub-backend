import { CustomerApiKey } from '../models/customerApiKey'
import { type DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { ScanCommand } from '@aws-sdk/lib-dynamodb'

class ListCustomerApiKeysService {
  private readonly client: DynamoDBClient

  constructor(client: DynamoDBClient) {
    this.client = client
  }

  async call(customerId: string): Promise<CustomerApiKey[]> {
    const command = new ScanCommand({
      TableName: 'CustomerApiKeys',
      FilterExpression: 'CustomerId = :CustomerId',
      ExpressionAttributeValues: {
        ':CustomerId': customerId
      }
    })

    const response = await this.client.send(command)

    return response.Items?.map((item) => CustomerApiKey.fromItem(item)) ?? []
  }
}

export { ListCustomerApiKeysService }
