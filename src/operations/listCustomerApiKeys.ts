import { CustomerApiKey } from '../models/customerApiKey'
import { type DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { ScanCommand } from '@aws-sdk/lib-dynamodb'

const TableName = process.env.CUSTOMER_API_KEYS_TABLE_NAME ?? ''

class ListCustomerApiKeys {
  private readonly client: DynamoDBClient

  constructor (client: DynamoDBClient) {
    this.client = client
  }

  async call (fpoId: string): Promise<CustomerApiKey[]> {
    const command = new ScanCommand({
      TableName,
      FilterExpression: 'FpoId = :FpoId',
      ExpressionAttributeValues: {
        ':FpoId': fpoId
      }
    })

    const response = await this.client.send(command)

    return response.Items?.map((item) => CustomerApiKey.fromItem(item)) ?? []
  }
}

export { ListCustomerApiKeys }
