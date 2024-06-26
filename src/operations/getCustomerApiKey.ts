import { CustomerApiKey } from '../models/customerApiKey'
import { type DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { GetItemCommand } from '@aws-sdk/client-dynamodb'

const TableName = process.env.CUSTOMER_API_KEYS_TABLE_NAME ?? ''

class GetCustomerApiKey {
  private readonly client: DynamoDBClient

  constructor (client: DynamoDBClient) {
    this.client = client
  }

  async call (organisationId: string, id: string): Promise<CustomerApiKey | null> {
    const command = new GetItemCommand(
      {
        TableName,
        Key: {
          OrganisationId: { S: organisationId },
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

export { GetCustomerApiKey }
