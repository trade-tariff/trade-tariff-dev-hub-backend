import { Organisation } from '../models/organisation'
import { type DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { GetItemCommand } from '@aws-sdk/client-dynamodb'

const TableName = process.env.ORGANISATIONS_TABLE_NAME ?? ''

class GetOrganisation {
  private readonly client: DynamoDBClient

  constructor (client: DynamoDBClient) {
    this.client = client
  }

  async call (id: string): Promise<Organisation | null> {
    const command = new GetItemCommand(
      {
        TableName,
        Key: {
          OrganisationId: { S: id }
        }
      }
    )

    const response = await this.client.send(command)

    if (response.Item === null || response.Item === undefined) {
      return null
    }

    return Organisation.fromNestedItem(response.Item)
  }
}

export { GetOrganisation }
