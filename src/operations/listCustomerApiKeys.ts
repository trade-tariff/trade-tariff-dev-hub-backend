import { CustomerApiKey } from '../models/customerApiKey'
import { type DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { ScanCommand } from '@aws-sdk/lib-dynamodb'

const TableName = process.env.CUSTOMER_API_KEYS_TABLE_NAME ?? ''

class ListCustomerApiKeys {
  private readonly client: DynamoDBClient

  constructor (client: DynamoDBClient) {
    this.client = client
  }

  async call (organisationId: string): Promise<CustomerApiKey[]> {
    const command = new ScanCommand({
      TableName,
      FilterExpression: 'OrganisationId = :OrganisationId',
      ExpressionAttributeValues: {
        ':OrganisationId': organisationId
      }
    })

    const response = await this.client.send(command)
    const customerApiKeys = response.Items?.map((item) => CustomerApiKey.fromItem(item)) ?? []

    return customerApiKeys.sort((a, b) => a.UpdatedAt.localeCompare(b.UpdatedAt)).reverse()
  }
}

export { ListCustomerApiKeys }
